/**
 * Operação QueryZero - Controlador Principal da Aplicação
 */

const PLAYER_NAME_STORAGE_KEY = "queryzero_player_name";

let currentLevelIndex = 0;
let completedLevels = new Set();
let completedTiers = new Set();
let lastPassedLevelIndex = null;
let gameStarted = false;
let resetArmed = false;

window.getGameMood = () => {
    const lvl = LEVELS[currentLevelIndex];
    return lvl ? "play_" + lvl.tier : "play_basico";
};

window.addEventListener("DOMContentLoaded", async () => {
    const statusElem = document.getElementById("engine-status");
    Save.load();
    const s = Save.get().settings;
    GameAudio.setMusic(s.music);
    GameAudio.setSfx(s.sfx);
    GameAudio.setVoice(s.voice);
    if ("speechSynthesis" in window) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => GameAudio.resetCastVoices();
    }
    refreshSoundButtons();
    // Se existirem falas dubladas, a voz já vem ligada na primeira vez (o jogador pode desligar).
    GameAudio.loadVoiceFiles().then(count => {
        const st = Save.get().settings;
        if (count > 0 && !st.voice && !st.voiceTouched) {
            GameAudio.setVoice(true);
            Save.setSetting("voice", true);
            refreshSoundButtons();
        }
    });
    renderStartScreen();
    Treasures.updateHud();
    setupGlobalClickSound();

    try {
        await window.engine.initialize();
        statusElem.innerText = "ONLINE (SQLITE WASM 3.x)";
        statusElem.style.color = "#10b981";

        setupPlayerNameField();
        restoreProgress();
        renderProgressSteps();
        setupKeyboardShortcuts();
        setStartReady(true);
    } catch (err) {
        statusElem.innerText = "ERRO WASM";
        statusElem.style.color = "#f43f5e";
        const st = document.getElementById("start-status");
        if (st) st.textContent = "Falha ao carregar o motor SQL: " + err.message;
    }
});

/* ---------------------------------------------------------------
   TELA INICIAL E FLUXO DE JOGO
   --------------------------------------------------------------- */
function renderStartScreen() {
    document.getElementById("start-bg").innerHTML = Art.background("city_night");
    const moods = { maya: "serious", kenji: "smile", luna: "smile", rafa: "smile", ivy: "smile" };
    document.getElementById("start-cast").innerHTML = ["maya", "rafa", "luna", "kenji", "ivy"].map(id => `
        <figure class="start-fig">
            <div class="start-fig-art">${Art.character(id, moods[id])}</div>
            <figcaption><b>${CAST[id].name}</b><small>${CAST[id].role}</small></figcaption>
        </figure>`).join("");
    document.getElementById("start-screen").hidden = false;
}

function firstIncompleteIndex() {
    for (let i = 0; i < LEVELS.length; i++) {
        if (!completedLevels.has(i)) return i;
    }
    return 0;
}

function setStartReady(ready) {
    const st = document.getElementById("start-status");
    const hasProgress = Save.hasProgress();
    const newBtn = document.getElementById("btn-start-new");
    const contBtn = document.getElementById("btn-start-continue");
    const resetBtn = document.getElementById("btn-start-reset");
    newBtn.disabled = !ready;
    contBtn.disabled = !ready;
    newBtn.hidden = hasProgress;
    contBtn.hidden = !hasProgress;
    resetBtn.hidden = !hasProgress;
    if (hasProgress) {
        contBtn.textContent = `▶ CONTINUAR — FASE ${firstIncompleteIndex() + 1} DE ${LEVELS.length}`;
        st.textContent = `${completedLevels.size} fases concluídas · ${Save.get().treasures.length}/${TREASURES.length} tesouros`;
    } else {
        st.textContent = ready ? "Motor SQL pronto. Use fones de ouvido para a melhor experiência." : "Carregando o motor SQL…";
    }
}

function hideStartScreen() {
    document.getElementById("start-screen").hidden = true;
}

async function startNewGame() {
    GameAudio.init();
    hideStartScreen();
    gameStarted = true;
    loadLevel(0, { silent: true });
    if (!Save.sceneSeen("intro")) await playScene("intro");
    focusEditor();
}

function continueGame() {
    GameAudio.init();
    hideStartScreen();
    gameStarted = true;
    loadLevel(firstIncompleteIndex(), { silent: true });
    Platform.toast("Progresso restaurado. Boa investigação!", "ok");
}

function resetProgress() {
    const btn = document.getElementById("btn-start-reset");
    if (!resetArmed) {
        resetArmed = true;
        btn.textContent = "Tem certeza? Clique de novo para apagar tudo";
        setTimeout(() => {
            resetArmed = false;
            btn.textContent = "Apagar progresso e recomeçar";
        }, 4000);
        return;
    }
    Save.reset();
    completedLevels = new Set();
    completedTiers = new Set();
    Treasures.updateHud();
    resetArmed = false;
    btn.textContent = "Apagar progresso e recomeçar";
    setStartReady(true);
    renderProgressSteps();
    Platform.toast("Progresso apagado.", "info");
}

function restoreProgress() {
    completedLevels = new Set(Save.get().completed.map(id => id - 1).filter(i => i >= 0 && i < LEVELS.length));
    completedTiers = new Set();
    [...new Set(LEVELS.map(l => l.tier))].forEach(t => {
        if (isTierFullyCompleted(t)) completedTiers.add(t);
    });
}

function focusEditor() {
    const el = document.getElementById("sql-input");
    if (el && !Cutscene.isActive()) el.focus();
}

async function playScene(id, opts = {}) {
    if (Cutscene.isActive()) return;
    await Cutscene.play(id, opts);
    if (gameStarted) focusEditor();
}

/* ---------------------------------------------------------------
   SOM, VOZ E CENAS
   --------------------------------------------------------------- */
function refreshSoundButtons() {
    const f = GameAudio.flags();
    const on = f.music || f.sfx;
    const soundLabel = on ? "🔊" : "🔇";
    const hud = document.getElementById("btn-sound");
    if (hud) hud.textContent = soundLabel;
    const st = document.getElementById("start-sound");
    if (st) st.textContent = `${soundLabel} Música e efeitos: ${on ? "ligados" : "desligados"}`;
    const hv = document.getElementById("btn-voice");
    if (hv) hv.classList.toggle("active", f.voice);
    const sv = document.getElementById("start-voice");
    if (sv) sv.textContent = `🗣 Voz dos personagens: ${f.voice ? "ligada" : "desligada"}`;
}

function toggleSound() {
    const f = GameAudio.flags();
    const turnOn = !(f.music || f.sfx);
    GameAudio.init();
    GameAudio.setMusic(turnOn);
    GameAudio.setSfx(turnOn);
    Save.setSetting("music", turnOn);
    Save.setSetting("sfx", turnOn);
    refreshSoundButtons();
    if (turnOn && gameStarted && !Cutscene.isActive()) GameAudio.setMood(getGameMood());
}

function toggleVoice() {
    const turnOn = !GameAudio.flags().voice;
    GameAudio.setVoice(turnOn);
    Save.setSetting("voice", turnOn);
    Save.setSetting("voiceTouched", true);
    refreshSoundButtons();
    if (turnOn) {
        const tip = GameAudio.hasVoiceFiles() || GameAudio.hasNaturalVoice() || !GameAudio.ptVoices().length
            ? "Voz dos personagens ligada."
            : "Voz ligada. Dica: no Microsoft Edge as vozes em português são bem mais naturais.";
        Platform.toast(tip, "info", 6000);
    }
}

function setupGlobalClickSound() {
    document.addEventListener("click", e => {
        if (e.target.closest(".btn, .tool-btn, .step-chip")) GameAudio.sfx("click");
    });
}

function openScenes() {
    const list = document.getElementById("scenes-list");
    list.innerHTML = STORY.scenes.map(sc => {
        const seen = Save.sceneSeen(sc.id);
        return `<div class="scene-row ${seen ? "" : "locked"}">
            <div><b>${seen ? sc.title : "🔒 Cena bloqueada"}</b><small>${seen ? "Disponível para rever" : "Aparece mais adiante na história"}</small></div>
            ${seen ? `<button class="btn btn-secondary" onclick="replayScene('${sc.id}')">▶ Rever</button>` : ""}
        </div>`;
    }).join("");
    document.getElementById("scenes-modal").style.display = "flex";
}

function closeScenes() {
    document.getElementById("scenes-modal").style.display = "none";
}

function replayScene(id) {
    closeScenes();
    playScene(id, { replay: true });
}

/* ---------------------------------------------------------------
   JOGADOR
   --------------------------------------------------------------- */
function setupPlayerNameField() {
    const field = document.getElementById("player-name-field");
    let stored = null;
    try { stored = localStorage.getItem(PLAYER_NAME_STORAGE_KEY); } catch (e) { /* sem armazenamento */ }
    if (stored) field.value = stored;

    field.addEventListener("input", () => {
        try { localStorage.setItem(PLAYER_NAME_STORAGE_KEY, field.value.trim()); } catch (e) { /* sem armazenamento */ }
    });
}

function getPlayerName() {
    const field = document.getElementById("player-name-field");
    return field ? field.value.trim() : "";
}

function ensurePlayerName() {
    const name = getPlayerName();
    if (!name) {
        Platform.toast("Preencha seu nome completo no campo ESPECIALISTA, no topo da tela, antes de gerar um certificado.", "error", 5500);
        const field = document.getElementById("player-name-field");
        if (field) field.focus();
        return null;
    }
    return name;
}

/* ---------------------------------------------------------------
   TRILHAS E PROGRESSO
   --------------------------------------------------------------- */
function getTierLevels(tierKey) {
    return LEVELS.filter(lvl => lvl.tier === tierKey);
}

function getTierIndexes(tierKey) {
    const indexes = [];
    LEVELS.forEach((lvl, idx) => {
        if (lvl.tier === tierKey) indexes.push(idx);
    });
    return indexes;
}

function isTierFullyCompleted(tierKey) {
    return getTierIndexes(tierKey).every(idx => completedLevels.has(idx));
}

function renderProgressSteps() {
    const container = document.getElementById("progress-steps");
    container.innerHTML = "";

    const tierOrder = [...new Set(LEVELS.map(l => l.tier))];

    tierOrder.forEach(tierKey => {
        const tierIndexes = getTierIndexes(tierKey);
        const completedInTier = tierIndexes.filter(idx => completedLevels.has(idx)).length;

        const group = document.createElement("div");
        group.className = `tier-group tier-${tierKey}`;

        const label = document.createElement("div");
        label.className = "tier-group-label";
        label.innerHTML = `<span>${TIER_LABELS[tierKey]}</span><span class="tier-group-count">${completedInTier}/${tierIndexes.length}</span>`;
        if (isTierFullyCompleted(tierKey)) {
            const certBtn = document.createElement("button");
            certBtn.type = "button";
            certBtn.className = "btn btn-gold tier-cert-btn";
            certBtn.textContent = "🎖 Certificado";
            certBtn.title = `Baixar o certificado da trilha ${TIER_LABELS[tierKey]}`;
            certBtn.onclick = () => handleDownloadTierCertificate(tierKey);
            label.appendChild(certBtn);
        }
        group.appendChild(label);

        const chipsRow = document.createElement("div");
        chipsRow.className = "tier-group-chips";

        LEVELS.forEach((lvl, idx) => {
            if (lvl.tier !== tierKey) return;
            const chip = document.createElement("div");
            chip.className = `step-chip ${idx === currentLevelIndex ? 'active' : ''} ${completedLevels.has(idx) ? 'completed' : ''}`;
            chip.title = `Fase ${idx + 1}: ${lvl.title}`;
            chip.onclick = () => { if (gameStarted) loadLevel(idx); };
            chip.innerText = completedLevels.has(idx) ? '✓' : (idx + 1);
            chipsRow.appendChild(chip);
        });

        group.appendChild(chipsRow);
        container.appendChild(group);
    });
}

function loadLevel(index, opts = {}) {
    currentLevelIndex = index;
    const level = LEVELS[index];

    window.engine.loadLevel(level);

    document.getElementById("level-badge").innerText = `Fase ${index + 1} / ${LEVELS.length}`;
    document.getElementById("tier-badge").innerText = `TRILHA: ${TIER_LABELS[level.tier]}`;
    document.getElementById("tier-badge").className = `tier-indicator tier-${level.tier}`;
    document.getElementById("mission-title").innerText = level.title;
    document.getElementById("mission-briefing").innerText = level.briefing;
    document.getElementById("mission-objective").innerText = level.objective;

    // Hint
    const hintElem = document.getElementById("mission-hint");
    hintElem.innerText = level.hint;
    hintElem.style.display = "none";
    document.getElementById("btn-toggle-hint").innerText = "Exibir Dica Técnica";

    // Theory / Concept
    document.getElementById("theory-title-preview").innerText = `Ver Conceito: ${level.theory.title}`;
    document.getElementById("theory-explanation").innerText = level.theory.explanation;
    document.getElementById("theory-syntax").innerText = level.theory.syntax;
    document.getElementById("theory-example").innerText = level.theory.example;
    document.getElementById("theory-content").style.display = "none";

    // Schemas e radar de tesouros
    renderSchemaInspector();
    Treasures.setRadar(level);

    // Editor (mostra a solução salva, se a fase já foi resolvida)
    const saved = Save.solutionFor(level.id);
    document.getElementById("sql-input").value = saved || "";

    hideFeedback();
    clearResultsTable();

    if (completedLevels.has(index)) {
        lastPassedLevelIndex = index;
        showFeedback({
            isSuccess: true,
            title: "FASE JÁ CONCLUÍDA",
            msg: "Você já resolveu esta fase. Baixe o certificado ou refaça a consulta à vontade.",
            showNextBtn: index + 1 < LEVELS.length,
            showLevelCertBtn: true,
            showTierCertBtn: isTierFullyCompleted(level.tier)
        });
    }

    renderProgressSteps();

    if (gameStarted && !Cutscene.isActive()) {
        GameAudio.setMood(getGameMood());
        if (!opts.silent) {
            const intro = STORY.scenes.find(s => s.trigger.tierStart === level.tier);
            if (intro && index === getTierIndexes(level.tier)[0] && !Save.sceneSeen(intro.id)) {
                setTimeout(() => playScene(intro.id), 500);
                return;
            }
        }
        focusEditor();
    }
}

function renderSchemaInspector() {
    const tree = document.getElementById("schema-tree");
    tree.innerHTML = "";

    const tables = window.engine.getSchemaMetadata();
    tables.forEach(tbl => {
        const box = document.createElement("div");
        box.className = "schema-table-box";

        const nameBar = document.createElement("div");
        nameBar.className = "schema-table-name";
        nameBar.innerHTML = `<span>TABLE: ${tbl.tableName}</span><span>${tbl.columns.length} colunas</span>`;
        box.appendChild(nameBar);

        const colList = document.createElement("div");
        colList.className = "schema-columns-list";
        tbl.columns.forEach(col => {
            const row = document.createElement("div");
            row.className = "schema-column-row";
            row.innerHTML = `
                <span>${col.name} ${col.pk ? '<span class="schema-col-pk">[PK]</span>' : ''}</span>
                <span class="schema-col-type">${col.type}</span>
            `;
            colList.appendChild(row);
        });
        box.appendChild(colList);
        tree.appendChild(box);
    });
}

function toggleHint() {
    const hint = document.getElementById("mission-hint");
    const btn = document.getElementById("btn-toggle-hint");
    if (hint.style.display === "none") {
        hint.style.display = "block";
        btn.innerText = "Ocultar Dica";
    } else {
        hint.style.display = "none";
        btn.innerText = "Exibir Dica Técnica";
    }
}

function toggleTheory() {
    const content = document.getElementById("theory-content");
    const level = LEVELS[currentLevelIndex];
    const previewLabel = document.getElementById("theory-title-preview");
    if (content.style.display === "none") {
        content.style.display = "block";
        previewLabel.innerText = `Ocultar Conceito: ${level.theory.title}`;
    } else {
        content.style.display = "none";
        previewLabel.innerText = `Ver Conceito: ${level.theory.title}`;
    }
}

function toggleDataPreview() {
    const tables = window.engine.getSchemaMetadata();
    if (!tables.length) return;

    const firstTable = tables[0].tableName;
    try {
        const previewResult = window.engine.executeSafely(`SELECT * FROM ${firstTable} LIMIT 5;`);
        renderTable(previewResult.columns, previewResult.values);
        document.getElementById("row-count").innerText = `${previewResult.values.length} (amostra)`;
        showFeedback({ isSuccess: true, title: "AMOSTRA DE DADOS", msg: `Exibindo primeiros registros da tabela '${firstTable}'.` });
    } catch (e) {
        showFeedback({ isSuccess: false, title: "FALHA NA INSPEÇÃO", msg: e.message });
    }
}

/* ---------------------------------------------------------------
   EXECUÇÃO DE CONSULTAS
   --------------------------------------------------------------- */
function handleRunQuery() {
    const input = document.getElementById("sql-input").value;
    const level = LEVELS[currentLevelIndex];

    const startTime = performance.now();
    const evaluation = window.validator.evaluate(input, level);
    const endTime = performance.now();
    const execDuration = (endTime - startTime).toFixed(2);

    document.getElementById("execution-time").innerText = `${execDuration} ms`;

    if (evaluation.userResult) {
        renderTable(evaluation.userResult.columns, evaluation.userResult.values);
        document.getElementById("row-count").innerText = evaluation.userResult.values.length;
    } else {
        clearResultsTable();
    }

    Treasures.checkVaultAttempt(level, input, evaluation.userResult);

    if (evaluation.passed) {
        const firstTime = !completedLevels.has(currentLevelIndex);
        completedLevels.add(currentLevelIndex);
        lastPassedLevelIndex = currentLevelIndex;
        Save.markCompleted(level.id, input.trim());
        GameAudio.sfx("success");
        renderProgressSteps();

        const tierKey = level.tier;
        const tierJustCompleted = isTierFullyCompleted(tierKey) && !completedTiers.has(tierKey);
        if (isTierFullyCompleted(tierKey)) completedTiers.add(tierKey);

        const isLastLevel = currentLevelIndex + 1 >= LEVELS.length;

        showFeedback({
            isSuccess: true,
            title: "INTEGRIDADE CONFIRMADA",
            msg: evaluation.message,
            showNextBtn: !isLastLevel,
            showLevelCertBtn: true,
            showTierCertBtn: tierJustCompleted
        });

        const finishedAll = firstTime && completedLevels.size === LEVELS.length;
        const queue = [];
        const milestone = STORY.scenes.find(s => s.trigger.afterLevel === level.id);
        if (milestone && !Save.sceneSeen(milestone.id)) queue.push(milestone.id);
        const finale = STORY.scenes.find(s => s.trigger.allComplete);
        if (finishedAll && finale && !Save.sceneSeen(finale.id)) queue.push(finale.id);

        if (queue.length || finishedAll) {
            setTimeout(async () => {
                for (const id of queue) await playScene(id);
                if (finishedAll) openCertificateModal();
            }, 900);
        }
    } else {
        GameAudio.sfx("error");
        showFeedback({
            isSuccess: false,
            title: "FALHA DE VALIDAÇÃO",
            msg: evaluation.message
        });
    }
}

function handleResetDatabase() {
    const level = LEVELS[currentLevelIndex];
    window.engine.loadLevel(level);
    showFeedback({ isSuccess: true, title: "BANCO REINICIADO", msg: "O banco de dados em memória foi restaurado ao estado inicial da fase." });
}

function handleNextLevel() {
    if (currentLevelIndex + 1 < LEVELS.length) {
        loadLevel(currentLevelIndex + 1);
    } else {
        openCertificateModal();
    }
}

function showFeedback({ isSuccess, title, msg, showNextBtn = false, showLevelCertBtn = false, showTierCertBtn = false }) {
    const banner = document.getElementById("feedback-banner");
    const titleEl = document.getElementById("feedback-title");
    const msgEl = document.getElementById("feedback-msg");
    const iconEl = document.getElementById("feedback-icon");
    const nextBtn = document.getElementById("btn-next-level");
    const levelCertBtn = document.getElementById("btn-cert-level");
    const tierCertBtn = document.getElementById("btn-cert-tier");

    banner.className = `feedback-banner ${isSuccess ? 'success' : 'error'}`;
    iconEl.innerText = isSuccess ? '✔' : '✖';
    titleEl.innerText = title;
    msgEl.innerText = msg;
    nextBtn.style.display = showNextBtn ? 'inline-flex' : 'none';
    levelCertBtn.style.display = showLevelCertBtn ? 'inline-flex' : 'none';

    if (showTierCertBtn) {
        const tierLabel = TIER_LABELS[LEVELS[currentLevelIndex].tier];
        tierCertBtn.innerText = `🎖 CERTIFICADO DA TRILHA ${tierLabel}`;
        tierCertBtn.style.display = 'inline-flex';
    } else {
        tierCertBtn.style.display = 'none';
    }

    banner.style.display = 'flex';
}

function hideFeedback() {
    document.getElementById("feedback-banner").style.display = 'none';
}

function renderTable(columns, rows) {
    const wrapper = document.getElementById("results-table-wrapper");
    if (!columns || columns.length === 0) {
        wrapper.innerHTML = `<div class="empty-state">A consulta não retornou colunas ou registros.</div>`;
        return;
    }

    let html = `<table class="sql-table"><thead><tr>`;
    columns.forEach(c => {
        html += `<th>${escapeHtml(c)}</th>`;
    });
    html += `</tr></thead><tbody>`;

    rows.forEach(row => {
        html += `<tr>`;
        row.forEach(val => {
            if (val === null) {
                html += `<td><span class="null-badge">NULL</span></td>`;
            } else {
                html += `<td>${escapeHtml(String(val))}</td>`;
            }
        });
        html += `</tr>`;
    });

    html += `</tbody></table>`;
    wrapper.innerHTML = html;
}

function clearResultsTable() {
    const wrapper = document.getElementById("results-table-wrapper");
    wrapper.innerHTML = `<div class="empty-state">Nenhuma consulta executada ainda. Digite seu SQL e clique em Executar.</div>`;
    document.getElementById("row-count").innerText = "0";
}

function setupKeyboardShortcuts() {
    document.getElementById("sql-input").addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            handleRunQuery();
        }
    });
}

/* ---------------------------------------------------------------
   CERTIFICADOS E MODAL FINAL
   --------------------------------------------------------------- */
function openCertificateModal() {
    document.getElementById("certificate-modal").style.display = "flex";
    document.getElementById("modal-total-levels").innerText = `as ${LEVELS.length} fases`;
    const name = getPlayerName();
    if (name) document.getElementById("player-name-input").value = name;
}

function closeModal() {
    document.getElementById("certificate-modal").style.display = "none";
}

function openPortfolioFromModal() {
    closeModal();
    Portfolio.open();
}

async function handleDownloadLevelCertificate() {
    const name = ensurePlayerName();
    if (!name) return;
    if (lastPassedLevelIndex === null) return;

    const btn = document.getElementById("btn-cert-level");
    btn.disabled = true;
    btn.innerText = "GERANDO...";
    try {
        await window.generateLevelCertificate(name, LEVELS[lastPassedLevelIndex]);
    } finally {
        btn.disabled = false;
        btn.innerText = "🏅 CERTIFICADO DO NÍVEL";
    }
}

async function handleDownloadTierCertificate(tierKey = LEVELS[currentLevelIndex].tier) {
    const name = ensurePlayerName();
    if (!name) return;
    if (!isTierFullyCompleted(tierKey)) return;

    const tierLevels = getTierLevels(tierKey);

    const btn = document.getElementById("btn-cert-tier");
    const originalLabel = btn.innerText;
    btn.disabled = true;
    btn.innerText = "GERANDO...";
    try {
        await window.generateTierCertificate(name, tierKey, tierLevels);
    } finally {
        btn.disabled = false;
        btn.innerText = originalLabel;
    }
}

async function handleGenerateCertificate() {
    const nameInput = document.getElementById("player-name-input");
    const name = nameInput.value.trim();
    if (!name) {
        Platform.toast("Digite seu nome completo para assinar o certificado.", "error", 5000);
        nameInput.focus();
        return;
    }
    try { localStorage.setItem(PLAYER_NAME_STORAGE_KEY, name); } catch (e) { /* sem armazenamento */ }
    const field = document.getElementById("player-name-field");
    if (field) field.value = name;

    await window.generateMasterCertificate(name, Array.from(completedLevels));
}

function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
