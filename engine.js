/**
 * Operação QueryZero - Motor de Execução Relacional WebAssembly
 * Dependência global: window.initSqlJs
 */

class RelationalEngine {
    constructor() {
        this.SQL = null;
        this.db = null;
        this.currentLevel = null;
        this.isInitialized = false;
        this.wasmCdnUrl = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm";
    }

    async initialize() {
        if (this.isInitialized) return;

        try {
            this.SQL = await window.initSqlJs({
                locateFile: () => this.wasmCdnUrl
            });
            this.isInitialized = true;
            console.info("[RelationalEngine] Binário SQLite WASM carregado com sucesso.");
        } catch (error) {
            console.error("[RelationalEngine] Falha crítica ao instanciar WebAssembly:", error);
            throw new Error(`Falha no subsistema WebAssembly: ${error.message}`);
        }
    }

    loadLevel(level) {
        if (!this.isInitialized) {
            throw new Error("O motor relacional deve ser inicializado antes de carregar uma fase.");
        }

        this.currentLevel = level;

        if (this.db) {
            this.db.close();
        }

        this.db = new this.SQL.Database();

        try {
            this.db.run("BEGIN TRANSACTION;");
            this.db.run(level.schemaDDL);
            this.db.run(level.seedData);
            const vault = typeof TREASURE_VAULTS !== "undefined" ? TREASURE_VAULTS[level.id] : null;
            if (vault) {
                this.db.run(vault.ddl);
                this.db.run(vault.seed);
            }
            this.db.run("COMMIT;");
            console.info(`[RelationalEngine] Nível ${level.id} provisionado com sucesso.`);
        } catch (error) {
            this.db.run("ROLLBACK;");
            console.error(`[RelationalEngine] Falha na DDL/Seed do Nível ${level.id}:`, error);
            throw new Error(`Falha ao preparar ambiente relacional: ${error.message}`);
        }
    }

    createSnapshotDatabase() {
        if (!this.db) throw new Error("Banco de dados não alocado.");
        const binarySnapshot = this.db.export();
        return new this.SQL.Database(binarySnapshot);
    }

    getSchemaMetadata() {
        if (!this.db) return [];

        const schemaQuery = `
            SELECT name, sql 
            FROM sqlite_master 
            WHERE type='table' AND name NOT LIKE 'sqlite_%';
        `;

        const tablesResult = this.db.exec(schemaQuery);
        if (!tablesResult.length) return [];

        const tables = [];
        const rows = tablesResult[0].values;

        for (const [tableName, ddl] of rows) {
            // Tabelas "cofre_*" são tesouros escondidos: só aparecem para quem consulta o catálogo.
            if (tableName.startsWith("cofre_")) continue;
            const columnsResult = this.db.exec(`PRAGMA table_info("${tableName}");`);
            const columns = columnsResult.length 
                ? columnsResult[0].values.map(col => ({
                    cid: col[0],
                    name: col[1],
                    type: col[2],
                    notnull: col[3] === 1,
                    pk: col[5] === 1
                })) 
                : [];

            tables.push({
                tableName,
                rawDDL: ddl,
                columns
            });
        }

        return tables;
    }

    // Executa instruções que alteram dados (UPDATE/DELETE) numa cópia e depois consulta o estado final.
    executeOnSnapshot(statements, checkQuery) {
        const sandboxDb = this.createSnapshotDatabase();
        try {
            sandboxDb.exec(statements);
            const result = sandboxDb.exec(checkQuery);
            sandboxDb.close();
            if (!result || result.length === 0) {
                return { columns: [], values: [] };
            }
            return { columns: result[0].columns, values: result[0].values };
        } catch (error) {
            sandboxDb.close();
            throw error;
        }
    }

    executeSafely(sqlQuery) {
        const sandboxDb = this.createSnapshotDatabase();
        try {
            const result = sandboxDb.exec(sqlQuery);
            sandboxDb.close();

            if (!result || result.length === 0) {
                return { columns: [], values: [] };
            }

            return {
                columns: result[0].columns,
                values: result[0].values
            };
        } catch (error) {
            sandboxDb.close();
            throw error;
        }
    }
}

if (typeof window !== "undefined") {
    window.engine = new RelationalEngine();
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = RelationalEngine;
}
