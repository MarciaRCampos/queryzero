/**
 * Operação QueryZero - Validador Determinístico de Conjuntos Relacionais
 */

class RelationalValidator {
    constructor(engineInstance) {
        this.engine = engineInstance;
        this.floatTolerance = 0.0001;
    }

    evaluate(userQuery, level) {
        if (!userQuery || !userQuery.trim()) {
            return {
                passed: false,
                code: "EMPTY_QUERY",
                message: "Nenhuma instrução SQL foi enviada para o terminal analítico.",
                diagnostics: null
            };
        }

        // Boa prática: toda instrução termina com ";" (é o que separa instruções no SQLite e nas ferramentas reais).
        const semComentarios = userQuery.replace(/--[^\n]*/g, "").trim();
        if (!semComentarios.endsWith(";")) {
            return {
                passed: false,
                code: "MISSING_TERMINATOR",
                message: "Falta o ';' no fim da instrução. Em SQL o ponto e vírgula encerra a consulta, e ferramentas reais como o SQLite exigem isso.",
                diagnostics: null
            };
        }

        // Boa prática: UPDATE/DELETE sem WHERE afetam todas as linhas. Bloqueado.
        const instrucoes = semComentarios.split(";").map(s => s.trim()).filter(Boolean);
        const semWhere = instrucoes.some(s => /\b(UPDATE|DELETE)\b/i.test(s) && !/\bWHERE\b/i.test(s));
        if (semWhere) {
            return {
                passed: false,
                code: "DANGEROUS_WITHOUT_WHERE",
                message: "UPDATE e DELETE sem WHERE afetam todas as linhas da tabela. Restrinja a condição antes de executar.",
                diagnostics: null
            };
        }

        // Boa prática: evitar SELECT *. Nas primeiras fases básicas é exigido; nas demais, vira dica.
        const usaAsterisco = /\bSELECT\s+(DISTINCT\s+)?\*/i.test(semComentarios);
        if (usaAsterisco && level.tier === "basico" && level.id <= 5) {
            return {
                passed: false,
                code: "WILDCARD_NOT_ALLOWED",
                message: "Nesta fase, liste as colunas que você precisa em vez de usar '*'. Projetar só o necessário é a primeira boa prática de uma consulta.",
                diagnostics: null
            };
        }
        const dicaEstilo = usaAsterisco ? " Dica de estilo: evite SELECT *; liste só as colunas de que você precisa." : "";

        // Fases de alteração de dados (UPDATE/DELETE): comparamos o estado final da tabela.
        if (level.mode === "dml") {
            return this._evaluateDml(userQuery, level, dicaEstilo);
        }

        let userResult;
        let expectedResult;

        try {
            expectedResult = this.engine.executeSafely(level.expectedQuery);
        } catch (err) {
            console.error("[Validator Critical] Falha no gabarito canônico:", err);
            return {
                passed: false,
                code: "SYSTEM_GROUND_TRUTH_ERROR",
                message: "Falha de execução no oráculo do desafio. Verifique a sintaxe da expectedQuery.",
                diagnostics: { error: err.message }
            };
        }

        try {
            userResult = this.engine.executeSafely(userQuery);
        } catch (err) {
            return {
                passed: false,
                code: "SQL_SYNTAX_OR_EXECUTION_ERROR",
                message: `Erro de sintaxe/execução SQLite: ${err.message}`,
                diagnostics: { error: err.message }
            };
        }

        const columnComparison = this._compareColumns(userResult.columns, expectedResult.columns);
        if (!columnComparison.identical) {
            return {
                passed: false,
                code: "COLUMN_SCHEMA_MISMATCH",
                message: columnComparison.message,
                diagnostics: {
                    received: userResult.columns,
                    expected: expectedResult.columns
                },
                userResult
            };
        }

        if (userResult.values.length !== expectedResult.values.length) {
            return {
                passed: false,
                code: "CARDINALITY_MISMATCH",
                message: `Volume de tuplas incorreto: sua consulta retornou ${userResult.values.length} tupla(s), mas o critério exigia exatamente ${expectedResult.values.length}.`,
                diagnostics: {
                    rowCountReceived: userResult.values.length,
                    rowCountExpected: expectedResult.values.length
                },
                userResult
            };
        }

        const tupleComparison = this._compareTuples(userResult.values, expectedResult.values);
        if (!tupleComparison.identical) {
            return {
                passed: false,
                code: "TUPLE_VALUE_OR_ORDER_MISMATCH",
                message: tupleComparison.message,
                diagnostics: tupleComparison.details,
                userResult
            };
        }

        return {
            passed: true,
            code: "CHALLENGE_RESOLVED",
            message: "Consistência de dados validada com sucesso. Integridade de estado restabelecida." + dicaEstilo,
            diagnostics: {
                rowCount: userResult.values.length,
                columns: userResult.columns
            },
            userResult
        };
    }

    _evaluateDml(userQuery, level, dicaEstilo = "") {
        let expectedResult;
        let userResult;

        try {
            expectedResult = this.engine.executeOnSnapshot(level.expectedDml, level.checkQuery);
        } catch (err) {
            console.error("[Validator Critical] Falha no gabarito DML:", err);
            return {
                passed: false,
                code: "SYSTEM_GROUND_TRUTH_ERROR",
                message: "Falha de execução no oráculo do desafio. Verifique o expectedDml.",
                diagnostics: { error: err.message }
            };
        }

        try {
            userResult = this.engine.executeOnSnapshot(userQuery, level.checkQuery);
        } catch (err) {
            return {
                passed: false,
                code: "SQL_SYNTAX_OR_EXECUTION_ERROR",
                message: `Erro de sintaxe/execução SQLite: ${err.message}`,
                diagnostics: { error: err.message }
            };
        }

        const columnComparison = this._compareColumns(userResult.columns, expectedResult.columns);
        if (!columnComparison.identical) {
            return { passed: false, code: "COLUMN_SCHEMA_MISMATCH", message: columnComparison.message, diagnostics: null, userResult };
        }

        const tupleComparison = this._compareTuples(userResult.values, expectedResult.values);
        if (!tupleComparison.identical) {
            return {
                passed: false,
                code: "STATE_MISMATCH",
                message: `O estado final da tabela não confere com o pedido. ${tupleComparison.message}`,
                diagnostics: tupleComparison.details,
                userResult
            };
        }

        return {
            passed: true,
            code: "CHALLENGE_RESOLVED",
            message: "Alteração aplicada com sucesso. O estado final da tabela confere com o pedido de Maya." + dicaEstilo,
            diagnostics: { rowCount: userResult.values.length, columns: userResult.columns },
            userResult
        };
    }

    _compareColumns(actualCols, expectedCols) {
        if (actualCols.length !== expectedCols.length) {
            return {
                identical: false,
                message: `Projeção estrutural inválida: esperavam-se ${expectedCols.length} coluna(s) [${expectedCols.join(", ")}], mas foram recebidas ${actualCols.length} [${actualCols.join(", ")}].`
            };
        }

        for (let i = 0; i < expectedCols.length; i++) {
            if (actualCols[i].toLowerCase() !== expectedCols[i].toLowerCase()) {
                return {
                    identical: false,
                    message: `Incompatibilidade na coluna [${i + 1}]: esperado '${expectedCols[i]}', obtido '${actualCols[i]}'. Verifique os aliases (AS).`
                };
            }
        }

        return { identical: true };
    }

    _compareTuples(actualRows, expectedRows) {
        for (let r = 0; r < expectedRows.length; r++) {
            const actualRow = actualRows[r];
            const expectedRow = expectedRows[r];

            for (let c = 0; c < expectedRow.length; c++) {
                const actualVal = actualRow[c];
                const expectedVal = expectedRow[c];

                if (!this._areValuesEquivalent(actualVal, expectedVal)) {
                    return {
                        identical: false,
                        message: `Discrepância forense na linha ${r + 1}, coluna ${c + 1}: valor esperado '${expectedVal}', recebido '${actualVal}'.`,
                        details: {
                            rowIndex: r + 1,
                            columnIndex: c + 1,
                            expectedValue: expectedVal,
                            actualValue: actualVal
                        }
                    };
                }
            }
        }

        return { identical: true };
    }

    _areValuesEquivalent(valA, valB) {
        if (valA === null && valB === null) return true;
        if (valA === null || valB === null) return false;

        if (typeof valA === "number" && typeof valB === "number") {
            return Math.abs(valA - valB) <= this.floatTolerance;
        }

        return String(valA).trim() === String(valB).trim();
    }
}

if (typeof window !== "undefined") {
    window.validator = new RelationalValidator(window.engine);
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = RelationalValidator;
}
