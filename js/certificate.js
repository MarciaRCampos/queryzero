/**
 * Operação QueryZero - Emissor Vetorial de Certificados Forenses em PDF
 * Renderização via jsPDF com validação de hash criptográfico SHA-256
 *
 * Três tipos de certificado são emitidos:
 *  - Nível:  liberado a cada fase concluída.
 *  - Trilha: liberado ao concluir todas as fases de uma trilha (BÁSICO / INTERMEDIÁRIO / AVANÇADO).
 *  - Mestre: liberado ao concluir todas as fases do jogo.
 */

async function sha256Hex(rawString) {
    const msgBuffer = new TextEncoder().encode(rawString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase();
}

function drawCertificateFrame(doc) {
    doc.setFillColor(11, 15, 25);
    doc.rect(0, 0, 297, 210, 'F');

    doc.setDrawColor(36, 48, 70);
    doc.setLineWidth(1.2);
    doc.rect(10, 10, 277, 190);

    doc.setDrawColor(56, 189, 248);
    doc.setLineWidth(0.4);
    doc.rect(13, 13, 271, 184);

    const corners = [[13, 13], [284, 13], [13, 197], [284, 197]];
    doc.setFillColor(56, 189, 248);
    corners.forEach(([cx, cy]) => {
        doc.rect(cx - 2, cy - 2, 4, 4, 'F');
    });
}

function drawSignatures(doc) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(10);
    doc.text("__________________________________________", 75, 175, { align: "center" });
    doc.text("Dra. Maya Vance", 75, 180, { align: "center" });
    doc.setFontSize(8);
    doc.text("Engenheira Forense Chefe de SRE", 75, 184, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("__________________________________________", 222, 175, { align: "center" });
    doc.text("Aethelgard Dynamics Relational Board", 222, 180, { align: "center" });
    doc.setFontSize(8);
    doc.text("Security & Architecture Division", 222, 184, { align: "center" });
}

function drawCryptoFooter(doc, hashHex, completionDate, engineTag) {
    doc.setFont("courier", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`DATA DE CONCLUSÃO: ${completionDate}`, 20, 192);
    doc.text(`HASH SHA-256: ${hashHex}`, 148.5, 192, { align: "center" });
    doc.text(`ENGINE: ${engineTag}`, 277, 192, { align: "right" });
}

/**
 * Certificado emitido a cada NÍVEL individual concluído.
 */
async function generateLevelCertificate(userName, level) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    const completionDate = new Date().toISOString().split('T')[0];
    const rawSignature = `${userName.trim()}-LEVEL-${level.id}-${Date.now()}-AETHELGARD-QUERYZERO`;
    const hashHex = (await sha256Hex(rawSignature)).substring(0, 32);

    drawCertificateFrame(doc);

    doc.setFont("courier", "bold");
    doc.setTextColor(56, 189, 248);
    doc.setFontSize(11);
    doc.text("[ OPERAÇÃO QUERYZERO // CLUSTER INCIDENT RESPONSE ]", 148.5, 26, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("CERTIFICADO DE MÓDULO CONCLUÍDO", 148.5, 42, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(12);
    doc.text("Certifica-se formalmente que, para os devidos fins de Engenharia de Dados e Análise Forense:", 148.5, 56, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setTextColor(251, 191, 36);
    doc.setFontSize(24);
    doc.text(userName.trim().toUpperCase(), 148.5, 74, { align: "center" });

    doc.setDrawColor(56, 189, 248);
    doc.setLineWidth(0.5);
    doc.line(60, 80, 237, 80);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(226, 232, 240);
    doc.setFontSize(11);
    doc.text(
        [
            `concluiu com êxito a fase de treinamento forense abaixo, referente à trilha ${TIER_LABELS[level.tier]},`,
            "demonstrando proficiência comprovada e assertiva na competência técnica avaliada:"
        ],
        148.5, 96, { align: "center", lineHeightFactor: 1.6 }
    );

    doc.setFillColor(17, 24, 39);
    doc.setDrawColor(251, 191, 36);
    doc.roundedRect(40, 118, 217, 34, 3, 3, 'FD');

    doc.setFont("courier", "bold");
    doc.setFontSize(10);
    doc.setTextColor(251, 191, 36);
    doc.text(level.title.toUpperCase(), 148.5, 130, { align: "center" });

    doc.setFont("courier", "normal");
    doc.setFontSize(9);
    doc.setTextColor(16, 185, 129);
    doc.text(`COMPETÊNCIA: ${level.certModule.toUpperCase()}`, 148.5, 138, { align: "center" });

    doc.setFont("courier", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`TRILHA: ${TIER_LABELS[level.tier]}   //   FASE ${String(level.id).padStart(2, '0')} DE ${LEVELS.length}`, 148.5, 146, { align: "center" });

    drawSignatures(doc);
    drawCryptoFooter(doc, hashHex, completionDate, "SQLITE-WASM-V1");

    const cleanFileName = `Certificado_Nivel${String(level.id).padStart(2, '0')}_QueryZero_${userName.trim().replace(/\s+/g, '_')}.pdf`;
    await saveFile(cleanFileName, doc.output("blob"));
}

/**
 * Certificado emitido ao concluir todas as fases de uma TRILHA (básico/intermediário/avançado).
 */
async function generateTierCertificate(userName, tierKey, tierLevels) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    const tierLabel = TIER_LABELS[tierKey];
    const completionDate = new Date().toISOString().split('T')[0];
    const rawSignature = `${userName.trim()}-TIER-${tierKey}-${Date.now()}-AETHELGARD-QUERYZERO`;
    const hashHex = (await sha256Hex(rawSignature)).substring(0, 32);

    drawCertificateFrame(doc);

    doc.setFont("courier", "bold");
    doc.setTextColor(56, 189, 248);
    doc.setFontSize(11);
    doc.text("[ OPERAÇÃO QUERYZERO // CLUSTER INCIDENT RESPONSE ]", 148.5, 25, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(21);
    doc.text(`CERTIFICADO DE TRILHA: ${tierLabel}`, 148.5, 41, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(12);
    doc.text("Certifica-se formalmente que, para os devidos fins de Engenharia de Dados e Análise Forense:", 148.5, 54, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setTextColor(251, 191, 36);
    doc.setFontSize(23);
    doc.text(userName.trim().toUpperCase(), 148.5, 71, { align: "center" });

    doc.setDrawColor(56, 189, 248);
    doc.setLineWidth(0.5);
    doc.line(60, 77, 237, 77);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(226, 232, 240);
    doc.setFontSize(11);
    doc.text(
        `concluiu com êxito as ${tierLevels.length} fases da trilha ${tierLabel} da Operação QueryZero, dominando os seguintes módulos:`,
        148.5, 88, { align: "center" }
    );

    // Agrupa as fases por competência (certModule) para o certificado permanecer legível
    // mesmo em trilhas com dezenas de fases — uma linha por módulo, não por fase.
    const moduleCounts = [];
    const moduleIndex = new Map();
    tierLevels.forEach(lvl => {
        if (!moduleIndex.has(lvl.certModule)) {
            moduleIndex.set(lvl.certModule, moduleCounts.length);
            moduleCounts.push({ name: lvl.certModule, count: 0 });
        }
        moduleCounts[moduleIndex.get(lvl.certModule)].count++;
    });

    doc.setFillColor(17, 24, 39);
    doc.setDrawColor(56, 189, 248);
    const boxHeight = 14 + moduleCounts.length * 7;
    doc.roundedRect(50, 96, 197, boxHeight, 3, 3, 'FD');

    doc.setFont("courier", "bold");
    doc.setFontSize(9);
    doc.setTextColor(56, 189, 248);
    doc.text("MÓDULOS VALIDADOS COM 100% DE ASSERÇÃO DETERMINÍSTICA:", 148.5, 104, { align: "center" });

    doc.setFont("courier", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(16, 185, 129);
    moduleCounts.forEach((mod, idx) => {
        const label = mod.count > 1 ? `${mod.name.toUpperCase()} (${mod.count} FASES)` : mod.name.toUpperCase();
        doc.text(`[✓] ${label}`, 148.5, 112 + idx * 7, { align: "center" });
    });

    drawSignatures(doc);
    drawCryptoFooter(doc, hashHex, completionDate, "SQLITE-WASM-V1");

    const cleanFileName = `Certificado_Trilha_${tierKey}_QueryZero_${userName.trim().replace(/\s+/g, '_')}.pdf`;
    await saveFile(cleanFileName, doc.output("blob"));
}

/**
 * Certificado MESTRE emitido ao concluir todas as fases do jogo.
 */
async function generateMasterCertificate(userName, completedLevelIndexes) {
    if (!userName || !userName.trim()) {
        alert("Por favor, informe seu nome completo para a emissão do certificado.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    const completionDate = new Date().toISOString().split('T')[0];
    const rawSignature = `${userName.trim()}-MASTER-${completedLevelIndexes.length}-${Date.now()}-AETHELGARD-QUERYZERO`;
    const hashHex = (await sha256Hex(rawSignature)).substring(0, 32);

    drawCertificateFrame(doc);

    doc.setFont("courier", "bold");
    doc.setTextColor(56, 189, 248);
    doc.setFontSize(11);
    doc.text("[ OPERAÇÃO QUERYZERO // CLUSTER INCIDENT RESPONSE ]", 148.5, 26, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("CERTIFICADO DE CONFIABILIDADE RELACIONAL", 148.5, 42, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(12);
    doc.text("Certifica-se formalmente que, para os devidos fins de Engenharia de Dados e Análise Forense:", 148.5, 56, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setTextColor(251, 191, 36);
    doc.setFontSize(24);
    doc.text(userName.trim().toUpperCase(), 148.5, 74, { align: "center" });

    doc.setDrawColor(56, 189, 248);
    doc.setLineWidth(0.5);
    doc.line(60, 80, 237, 80);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(226, 232, 240);
    doc.setFontSize(11);
    const bodyLines = [
        "concluiu com êxito todos os protocolos de contenção, restauração estrutural e otimização de banco de dados",
        `durante o incidente crítico da Aethelgard Dynamics, dominando as ${LEVELS.length} fases das 3 trilhas de proficiência:`,
        "do SELECT e WHERE fundamentais à Agregação, JOINs e Sub-consultas, até Window Functions, CTEs Recursivas",
        "e Análise Forense de Dados Avançada, com 100% de assertividade determinística em ambiente SQLite."
    ];
    doc.text(bodyLines, 148.5, 96, { align: "center", lineHeightFactor: 1.6 });

    doc.setFillColor(17, 24, 39);
    doc.setDrawColor(56, 189, 248);
    doc.roundedRect(40, 132, 217, 28, 3, 3, 'FD');

    doc.setFont("courier", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(56, 189, 248);
    doc.text("TRILHAS CONCLUÍDAS COM 100% DE ASSERÇÃO DETERMINÍSTICA:", 148.5, 139, { align: "center" });

    doc.setFont("courier", "normal");
    doc.setTextColor(16, 185, 129);
    doc.setFontSize(8.5);
    doc.text("[✓] BÁSICO: SELECT, WHERE, ORDER BY, LIKE & IN", 148.5, 146, { align: "center" });
    doc.text("[✓] INTERMEDIÁRIO: AGREGAÇÃO, HAVING, INNER/LEFT JOIN & SUBQUERIES", 148.5, 152, { align: "center" });
    doc.text("[✓] AVANÇADO: WINDOW FUNCTIONS, CTE RECURSIVA & CONSULTAS COMBINADAS", 148.5, 158, { align: "center" });

    drawSignatures(doc);
    drawCryptoFooter(doc, hashHex, completionDate, "SQLITE-WASM-V1");

    const cleanFileName = `Certificado_Master_QueryZero_${userName.trim().replace(/\s+/g, '_')}.pdf`;
    await saveFile(cleanFileName, doc.output("blob"));
}

window.generateLevelCertificate = generateLevelCertificate;
window.generateTierCertificate = generateTierCertificate;
window.generateMasterCertificate = generateMasterCertificate;
