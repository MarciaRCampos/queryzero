/**
 * Operação QueryZero - Camada Kora EduTech
 * Site (paywall, nome, ranking), navegação (Voltar/Esc), pontuação e efeitos,
 * prova rápida, conquistas, desafio entre amigos, projetos de portfólio,
 * entrevista final e certificado padrão Kora.
 */

const KORA = {
    game: "operacao-queryzero",
    course: "Operação QueryZero — SQL do básico ao avançado",
    sede: "Florianópolis (SC)",
    // Carga horária estimada (com folga). A Márcia aprova estes números.
    hours: { basico: 8, intermediario: 18, avancado: 30, portfolio: 36 },
    skills: {
        basico: ["Consultas com SELECT, WHERE e ORDER BY", "Filtros com LIKE, IN e BETWEEN", "Top N com ORDER BY e LIMIT"],
        intermediario: ["Consultas e filtros em SQL", "Agregações com GROUP BY e HAVING", "INNER JOIN e LEFT JOIN", "Subconsultas com IN e NOT IN"],
        avancado: ["Consultas, filtros, agregações e JOINs", "Funções de janela (ROW_NUMBER, RANK, LAG, SUM OVER)", "CTEs e WITH RECURSIVE", "Investigação de dados com SQL", "Projetos publicados no GitHub"]
    },
    points: { basico: 100, intermediario: 150, avancado: 200 },
    relampagoSeconds: 180
};

const kesc = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };

/* ---------------------------------------------------------------
   SITE (Kora EduTech no Lovable)
   --------------------------------------------------------------- */
const Site = {
    info() { return window.__MESTRES_GRIOTS__; },
    // Sem o objeto do site (teste local), tudo fica liberado.
    hasFullAccess() {
        const mg = Site.info();
        if (!mg) return true;
        return !!mg.completo;
    },
    loginName() {
        const mg = Site.info();
        if (!mg) return "";
        return (mg.nome || (mg.usuario && mg.usuario.nome) || "").trim();
    },
    verifyBase() {
        const mg = Site.info();
        if (mg && mg.verificacaoUrl) return mg.verificacaoUrl;
        if (location.protocol.startsWith("http")) return location.origin + "/verificar";
        return "";
    },
    verifyUrl(code) {
        const base = Site.verifyBase();
        if (!base) return "";
        return base + (base.includes("?") ? "&" : "?") + "codigo=" + encodeURIComponent(code);
    },
    post(tipo, dados = {}) {
        const msg = { origem: "kora-edutech", jogo: KORA.game, tipo, ...dados };
        try { if (window.parent && window.parent !== window) window.parent.postMessage(msg, "*"); } catch (e) { /* sem site */ }
    },
    sendScore() {
        const s = Save.get();
        Site.post("pontuacao", { pontos: s.points, fases: s.completed.length, nome: getPlayerName() || Site.loginName() || "" });
    }
};

/* ---------------------------------------------------------------
   NAVEGAÇÃO: botão Voltar em todas as janelas e tecla Esc
   --------------------------------------------------------------- */
const Nav = (() => {
    let seq = 0;
    function visibleModals() {
        return [...document.querySelectorAll(".modal-backdrop")]
            .filter(m => m.style.display === "flex")
            .sort((a, b) => (+a.dataset.seq || 0) - (+b.dataset.seq || 0));
    }
    function watch() {
        const obs = new MutationObserver(list => {
            list.forEach(m => {
                const el = m.target;
                if (el.style.display === "flex" && !el.dataset.open) { el.dataset.open = "1"; el.dataset.seq = ++seq; }
                if (el.style.display !== "flex") delete el.dataset.open;
            });
        });
        document.querySelectorAll(".modal-backdrop").forEach(m => obs.observe(m, { attributes: true, attributeFilter: ["style"] }));
    }
    function addBackButtons() {
        document.querySelectorAll(".modal-backdrop .modal-card").forEach(card => {
            if (card.querySelector(":scope > .back-btn")) return;
            const b = document.createElement("button");
            b.type = "button";
            b.className = "back-btn";
            b.innerHTML = "← Voltar";
            b.setAttribute("aria-label", "Voltar");
            b.onclick = () => back();
            card.prepend(b);
        });
    }
    function closeModalEl(m) {
        const id = m.id;
        if (id === "projects-modal" && Projects.back()) return;
        if (id === "interview-modal" && Interview.back()) return;
        m.style.display = "none";
    }
    function back() {
        if (typeof Cutscene !== "undefined" && Cutscene.isActive()) return;
        const open = visibleModals();
        if (open.length) { closeModalEl(open[open.length - 1]); return; }
        if (QuickTest.active()) { QuickTest.exit(); return; }
        const start = document.getElementById("start-screen");
        if (gameStarted && start && start.hidden) { showMenu(); return; }
        if (start && !start.hidden && gameStarted) { hideStartScreen(); }
    }
    function init() {
        watch();
        addBackButtons();
        document.addEventListener("keydown", e => {
            if (e.key !== "Escape") return;
            if (typeof Cutscene !== "undefined" && Cutscene.isActive()) return;
            e.preventDefault();
            back();
        });
    }
    return { init, back, addBackButtons, visibleModals };
})();

function showMenu() {
    const start = document.getElementById("start-screen");
    start.hidden = false;
    setStartReady(true);
    GameAudio.stopSpeech && GameAudio.stopSpeech();
}

/* ---------------------------------------------------------------
   EFEITOS: tela treme, partículas, pontos subindo, vibração, confete
   --------------------------------------------------------------- */
const FX = {
    vibrate(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) { /* sem vibração */ } },
    shake(el) {
        if (!el) return;
        el.classList.remove("fx-shake");
        void el.offsetWidth;
        el.classList.add("fx-shake");
    },
    float(text, anchor, kind = "ok") {
        const r = (anchor || document.body).getBoundingClientRect();
        const d = document.createElement("div");
        d.className = `fx-float fx-float-${kind}`;
        d.textContent = text;
        d.style.left = (r.left + r.width / 2) + "px";
        d.style.top = (r.top + 4) + "px";
        document.body.appendChild(d);
        setTimeout(() => d.remove(), 1300);
    },
    burst(anchor, color = "#38bdf8") {
        const r = (anchor || document.body).getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        for (let i = 0; i < 14; i++) {
            const p = document.createElement("i");
            p.className = "fx-particle";
            const a = (Math.PI * 2 * i) / 14, dist = 40 + Math.random() * 50;
            p.style.left = cx + "px";
            p.style.top = cy + "px";
            p.style.background = i % 3 ? color : "#fbbf24";
            p.style.setProperty("--dx", Math.cos(a) * dist + "px");
            p.style.setProperty("--dy", Math.sin(a) * dist + "px");
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 800);
        }
    },
    confetti(big = false) {
        if (typeof confetti !== "function") return;
        try {
            confetti({ particleCount: big ? 180 : 90, spread: big ? 100 : 70, origin: { y: 0.7 }, colors: ["#38bdf8", "#7c4dff", "#ff6fa5", "#ffb703", "#06a77d"] });
        } catch (e) { /* sem confete */ }
    }
};

/* ---------------------------------------------------------------
   PONTOS, COMBO, SEQUÊNCIA DE DIAS, MEDALHAS E MODO RELÂMPAGO
   --------------------------------------------------------------- */
const Score = (() => {
    let attempts = 0;
    let timerStart = 0, timerId = null, timerLeft = 0;

    function chapterOf(idx) { return Math.floor(idx / 5); }
    function chapterName(ch) { return LEVELS[ch * 5].certModule; }

    function hud() {
        const s = Save.get();
        const el = document.getElementById("score-hud");
        if (!el) return;
        el.innerHTML = `<span title="Pontos">⭐ <b>${s.points}</b></span><span title="Acertos seguidos de primeira" class="${s.combo >= 3 ? "hot" : ""}">🔥 x${s.combo}</span><span title="Dias seguidos estudando">📅 ${s.streak.count}d</span>`;
    }

    function touchStreak() {
        const s = Save.get();
        const today = todayISO();
        if (s.streak.last === today) return;
        const y = new Date(); y.setDate(y.getDate() - 1);
        const yISO = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, "0")}-${String(y.getDate()).padStart(2, "0")}`;
        s.streak.count = s.streak.last === yISO ? s.streak.count + 1 : 1;
        s.streak.best = Math.max(s.streak.best, s.streak.count);
        s.streak.last = today;
        if (s.streak.count > 1) Platform.toast(`📅 ${s.streak.count} dias seguidos investigando!`, "ok");
    }

    function onLevelLoaded() {
        attempts = 0;
        stopTimer();
        if (Save.get().relampago && gameStarted) startTimer();
    }

    function onMiss() {
        attempts++;
        const s = Save.get();
        if (s.combo) { s.combo = 0; Save.persist(); hud(); }
        FX.shake(document.querySelector(".terminal-panel"));
        FX.vibrate([60, 40, 60]);
    }

    // Chamado só na primeira vez que a fase é resolvida.
    function onPass(level, idx, { quick = false } = {}) {
        const s = Save.get();
        const firstTry = attempts === 0;
        let pts = KORA.points[level.tier] || 100;
        const notes = [];
        if (firstTry) { s.combo++; pts += 50; notes.push("de primeira +50"); } else s.combo = 0;
        s.bestCombo = Math.max(s.bestCombo, s.combo);
        if (s.combo >= 3) { pts += 10 * s.combo; notes.push(`combo x${s.combo}`); }
        if (timerId && timerLeft > 0) { pts += 100; notes.push("relâmpago +100"); }
        if (quick) { pts += 200; notes.push("prova rápida +200"); }
        stopTimer();
        s.points += pts;
        touchStreak();
        Save.persist();
        hud();
        const anchor = document.getElementById("btn-run");
        FX.float(`+${pts}`, anchor);
        FX.burst(anchor, "#10b981");
        FX.vibrate(30);
        Platform.toast(`🏅 Medalha da fase ${idx + 1}: ${level.certModule}${notes.length ? " · " + notes.join(" · ") : ""}`, "ok", 3800);
        checkChapter(idx);
        Site.sendScore();
    }

    function onRepeatPass() {
        stopTimer();
        FX.burst(document.getElementById("btn-run"), "#38bdf8");
        FX.vibrate(20);
    }

    function checkChapter(idx) {
        const ch = chapterOf(idx);
        const s = Save.get();
        if (s.chapterMedals.includes(ch)) return;
        const all = [0, 1, 2, 3, 4].every(k => completedLevels.has(ch * 5 + k));
        if (!all) return;
        s.chapterMedals.push(ch);
        s.points += 250;
        Save.persist();
        hud();
        FX.confetti(ch % 6 === 5);
        setTimeout(() => Platform.toast(`🎖 Capítulo concluído: ${chapterName(ch)} · +250`, "ok", 4500), 600);
    }

    function startTimer() {
        timerStart = Date.now();
        timerLeft = KORA.relampagoSeconds;
        const el = document.getElementById("relampago-timer");
        if (el) el.hidden = false;
        tick();
        timerId = setInterval(tick, 1000);
    }
    function tick() {
        timerLeft = Math.max(0, KORA.relampagoSeconds - Math.floor((Date.now() - timerStart) / 1000));
        const el = document.getElementById("relampago-timer");
        if (el) {
            el.textContent = `⚡ ${Math.floor(timerLeft / 60)}:${String(timerLeft % 60).padStart(2, "0")}`;
            el.classList.toggle("low", timerLeft <= 30);
        }
        if (timerLeft <= 0) {
            stopTimer();
            Platform.toast("⚡ Tempo do relâmpago esgotado. Siga sem pressa: a fase continua valendo.", "info", 5000);
        }
    }
    function stopTimer() {
        if (timerId) clearInterval(timerId);
        timerId = null;
        const el = document.getElementById("relampago-timer");
        if (el) el.hidden = true;
    }
    function toggleRelampago() {
        const s = Save.get();
        s.relampago = !s.relampago;
        Save.persist();
        const b = document.getElementById("btn-relampago");
        if (b) b.classList.toggle("active", s.relampago);
        Platform.toast(s.relampago ? "⚡ Modo relâmpago ligado: 3 minutos por fase, +100 pontos se resolver no tempo." : "Modo relâmpago desligado.", "info");
        if (s.relampago && gameStarted) startTimer(); else stopTimer();
    }

    return { hud, onLevelLoaded, onMiss, onPass, onRepeatPass, toggleRelampago, chapterOf, chapterName };
})();

/* ---------------------------------------------------------------
   PROVA RÁPIDA (início de cada capítulo de 5 fases)
   Quem resolve o desafio final do capítulo pula as outras 4 fases.
   --------------------------------------------------------------- */
const QuickTest = (() => {
    let state = null; // { chapter, returnIdx }
    const active = () => !!state;

    function chapterComplete(ch) { return [0, 1, 2, 3, 4].every(k => completedLevels.has(ch * 5 + k)); }

    function offerFor(idx) {
        const box = document.getElementById("quick-offer");
        if (!box) return;
        const ch = Score.chapterOf(idx);
        const show = !state && idx % 5 === 0 && !chapterComplete(ch) && !completedLevels.has(idx);
        box.hidden = !show;
        if (show) {
            box.innerHTML = `<div><b>⚡ Já domina ${kesc(Score.chapterName(ch))}?</b><small>Faça a prova rápida: resolva o desafio final do capítulo e pule as fases ${idx + 1} a ${idx + 4}.</small></div>
                <button type="button" class="btn btn-gold" onclick="QuickTest.start(${ch})">PROVA RÁPIDA</button>`;
        }
    }

    function start(ch) {
        const target = ch * 5 + 4;
        if (isLevelPaywalled(target)) { Paywall.open(); return; }
        state = { chapter: ch, returnIdx: ch * 5 };
        loadLevel(target, { quick: true });
        const bar = document.getElementById("quick-banner");
        bar.hidden = false;
        bar.innerHTML = `<button type="button" class="back-btn inline" onclick="QuickTest.exit()">← Voltar</button>
            <span>⚡ <b>PROVA RÁPIDA</b> · ${kesc(Score.chapterName(ch))}: resolva este desafio para pular o capítulo. Errar não tira pontos.</span>`;
        Platform.toast("Prova rápida: este é o desafio mais difícil do capítulo. Boa!", "info");
    }

    function exit() {
        if (!state) return;
        const back = state.returnIdx;
        state = null;
        document.getElementById("quick-banner").hidden = true;
        loadLevel(back);
    }

    // Retorna true se a prova foi concluída agora.
    function onPass(level) {
        if (!state) return false;
        const ch = state.chapter;
        for (let k = 0; k < 4; k++) {
            const idx = ch * 5 + k;
            if (!completedLevels.has(idx)) {
                completedLevels.add(idx);
                Save.markCompleted(LEVELS[idx].id);
            }
        }
        const s = Save.get();
        if (!s.quick.includes(ch)) s.quick.push(ch);
        Save.persist();
        state = null;
        document.getElementById("quick-banner").hidden = true;
        setTimeout(() => Platform.toast(`✅ Prova rápida aprovada! Capítulo "${Score.chapterName(ch)}" destravado.`, "ok", 5000), 300);
        return true;
    }

    function clearIfLeaving(opts) {
        if (state && !opts.quick) { state = null; const b = document.getElementById("quick-banner"); if (b) b.hidden = true; }
    }

    return { active, offerFor, start, exit, onPass, clearIfLeaving };
})();

/* ---------------------------------------------------------------
   PAYWALL (trilha Avançado)
   --------------------------------------------------------------- */
const Paywall = {
    open() {
        document.getElementById("paywall-modal").style.display = "flex";
        Site.post("paywall", { trilha: "avancado" });
    },
    close() { document.getElementById("paywall-modal").style.display = "none"; },
    unlockRequest() {
        Site.post("abrir-compra", { trilha: "avancado" });
        Platform.toast("Abrindo a liberação do curso completo no site…", "info");
    }
};

/* ---------------------------------------------------------------
   CONQUISTAS E DESAFIO ENTRE AMIGOS
   --------------------------------------------------------------- */
const Achievements = {
    open() {
        const s = Save.get();
        const chapters = Array.from({ length: LEVELS.length / 5 }, (_, ch) => {
            const got = s.chapterMedals.includes(ch);
            const tier = LEVELS[ch * 5].tier;
            return `<div class="medal ${got ? "got" : ""} tier-${tier}" title="${kesc(Score.chapterName(ch))}"><span>${got ? "🎖" : "🔒"}</span><small>${kesc(Score.chapterName(ch))}</small></div>`;
        }).join("");
        document.getElementById("achievements-body").innerHTML = `
            <div class="ach-stats">
                <div><b>${s.points}</b><small>pontos</small></div>
                <div><b>${s.completed.length}/${LEVELS.length}</b><small>medalhas de fase</small></div>
                <div><b>${s.bestCombo}</b><small>maior combo</small></div>
                <div><b>${s.streak.best}</b><small>dias seguidos (recorde)</small></div>
                <div><b>${s.treasures.length}/${TREASURES.length}</b><small>tesouros</small></div>
            </div>
            <h3 class="ach-h">Medalhas de capítulo</h3>
            <div class="medal-grid">${chapters}</div>`;
        document.getElementById("achievements-modal").style.display = "flex";
    }
};

const Challenge = (() => {
    function myCode() {
        const s = Save.get();
        const raw = `${s.points}.${s.completed.length}`;
        let h = 0; for (const c of raw) h = (h * 31 + c.charCodeAt(0)) % 1296;
        return `QZ-${s.points.toString(36).toUpperCase()}-${s.completed.length.toString(36).toUpperCase()}-${h.toString(36).toUpperCase().padStart(2, "0")}`;
    }
    function parse(code) {
        const m = String(code).trim().toUpperCase().match(/^QZ-([0-9A-Z]+)-([0-9A-Z]+)-([0-9A-Z]{2})$/);
        if (!m) return null;
        const points = parseInt(m[1], 36), fases = parseInt(m[2], 36);
        let h = 0; for (const c of `${points}.${fases}`) h = (h * 31 + c.charCodeAt(0)) % 1296;
        if (h.toString(36).toUpperCase().padStart(2, "0") !== m[3]) return null;
        return { points, fases };
    }
    function text() {
        const s = Save.get();
        return `Desafio na Operação QueryZero (Kora EduTech): fiz ${s.points} pontos e concluí ${s.completed.length} fases de SQL. Meu código: ${myCode()}. Consegue me superar?`;
    }
    function open() {
        document.getElementById("challenge-body").innerHTML = `
            <p class="modal-desc">Mande seu código para um amigo. Quando ele jogar, compare os resultados colando o código dele aqui.</p>
            <div class="challenge-code" id="my-challenge-code">${myCode()}</div>
            <div class="pf-actions">
                <button class="btn btn-primary" onclick="Challenge.copy()">COPIAR CONVITE</button>
                <button class="btn btn-secondary" onclick="Challenge.share()">COMPARTILHAR</button>
            </div>
            <div class="form-group">
                <label for="friend-code">CÓDIGO DO SEU AMIGO:</label>
                <input type="text" id="friend-code" placeholder="QZ-..." autocomplete="off">
            </div>
            <button class="btn btn-secondary" onclick="Challenge.compare()">COMPARAR</button>
            <div id="challenge-result" class="challenge-result"></div>`;
        document.getElementById("challenge-modal").style.display = "flex";
    }
    async function copy() {
        try { await navigator.clipboard.writeText(text()); Platform.toast("Convite copiado!", "ok"); }
        catch (e) { Platform.toast("Não deu para copiar aqui. Código: " + myCode(), "info", 7000); }
    }
    async function share() {
        if (navigator.share) { try { await navigator.share({ title: "Desafio QueryZero", text: text() }); } catch (e) { /* cancelado */ } }
        else copy();
    }
    function compare() {
        const f = parse(document.getElementById("friend-code").value);
        const out = document.getElementById("challenge-result");
        if (!f) { out.innerHTML = `<p class="pf-warn">Código inválido. Confira se copiou inteiro (ex.: QZ-2S0-A-1B).</p>`; return; }
        const s = Save.get();
        const diff = s.points - f.points;
        out.innerHTML = `<div class="vs"><div><b>${s.points}</b><small>você · ${s.completed.length} fases</small></div><span>VS</span><div><b>${f.points}</b><small>amigo · ${f.fases} fases</small></div></div>
            <p>${diff > 0 ? `Você está ${diff} pontos à frente. 🏆` : diff < 0 ? `Faltam ${-diff} pontos para passar seu amigo. Bora?` : "Empate técnico!"}</p>`;
    }
    return { open, copy, share, compare, myCode };
})();

/* ---------------------------------------------------------------
   PROJETOS DE PORTFÓLIO
   --------------------------------------------------------------- */
const Projects = (() => {
    let view = { mode: "list", pid: null, task: null };
    let pEngine = null, pValidator = null;

    const proj = id => PROJECTS.find(p => p.id === id);
    const state = () => Save.get().projects;
    const sol = (pid, i) => (state().solutions[pid] || {})[i] || null;
    const tierDone = t => isTierFullyCompleted(t);

    function taskStatus(p, i) {
        const t = p.tasks[i];
        if (sol(p.id, i)) return "done";
        if (t.tier === "avancado" && !Site.hasFullAccess()) return "paid";
        if (!tierDone(t.tier)) return "locked";
        if (i > 0 && !sol(p.id, i - 1)) return "locked";
        return "open";
    }
    const doneCount = p => p.tasks.filter((_, i) => sol(p.id, i)).length;
    const isDone = p => doneCount(p) === p.tasks.length;
    const hasPendingAvailable = p => p.tasks.some((_, i) => taskStatus(p, i) === "open");
    const completedProjects = () => PROJECTS.filter(isDone);

    function engine() {
        if (!pEngine) {
            pEngine = new RelationalEngine();
            pEngine.SQL = window.engine.SQL;
            pEngine.isInitialized = true;
            pValidator = new RelationalValidator(pEngine);
        }
        return pEngine;
    }
    function asLevel(p, i) {
        return { id: 1000 + i, tier: p.tasks[i].tier, schemaDDL: p.schemaDDL, seedData: p.seedData, expectedQuery: p.tasks[i].expectedQuery };
    }

    function open() { view = { mode: Save.get().projects.active ? "project" : "list", pid: Save.get().projects.active, task: null }; render(); document.getElementById("projects-modal").style.display = "flex"; }
    function close() { document.getElementById("projects-modal").style.display = "none"; }
    // Voltar dentro da janela: tarefa → projeto → lista. Retorna true se tratou.
    function back() {
        if (view.mode === "task") { view = { mode: "project", pid: view.pid, task: null }; render(); return true; }
        if (view.mode === "project") { view = { mode: "list", pid: null, task: null }; render(); return true; }
        return false;
    }

    function render() {
        const host = document.getElementById("projects-body");
        if (view.mode === "task") return renderTask(host);
        if (view.mode === "project") return renderProject(host);
        renderList(host);
    }

    function renderList(host) {
        const st = state();
        const activeP = st.active ? proj(st.active) : null;
        const blocked = activeP && !isDone(activeP) && hasPendingAvailable(activeP);
        host.innerHTML = `
            <p class="modal-desc">Escolha 1, 2 ou os 3 projetos, um de cada vez. Cada projeto cresce junto com o curso: 2 entregas no Básico, 2 no Intermediário e 2 no Avançado. No fim você baixa um repositório pronto para o GitHub.</p>
            <div class="proj-grid">${PROJECTS.map(p => {
                const n = doneCount(p), isAct = st.active === p.id;
                const canStart = !isAct && !blocked;
                return `<div class="proj-card ${isAct ? "active" : ""} ${isDone(p) ? "done" : ""}">
                    <div class="proj-emoji">${p.emoji}</div>
                    <h3>${kesc(p.name)}</h3>
                    <p>${kesc(p.pitch)}</p>
                    <div class="pf-bar"><i style="width:${Math.round(n / 6 * 100)}%"></i></div>
                    <small>${n}/6 entregas${isDone(p) ? " · concluído ✓" : isAct ? " · em andamento" : ""}</small>
                    ${isAct || n ? `<button class="btn btn-primary" onclick="Projects.openProject('${p.id}')">${isAct ? "CONTINUAR" : "ABRIR"}</button>`
                        : canStart ? `<button class="btn btn-secondary" onclick="Projects.start('${p.id}')">COMEÇAR ESTE</button>`
                        : `<button class="btn btn-secondary" disabled title="Termine as entregas disponíveis do projeto atual">🔒 UM DE CADA VEZ</button>`}
                </div>`;
            }).join("")}</div>
            ${blocked ? `<p class="pf-warn">Para começar outro projeto, termine as entregas já liberadas de "${kesc(activeP.name)}".</p>` : ""}
            <details class="pf-how"><summary>Extra: pacote com todas as consultas das fases</summary>
                <p>Além dos projetos, você pode baixar um pacote com as suas soluções de cada fase.</p>
                <button class="btn btn-secondary" onclick="Projects.close(); Portfolio.open();">ABRIR PACOTE DAS FASES</button>
            </details>`;
    }

    function start(pid) {
        state().active = pid;
        Save.persist();
        openProject(pid);
        Platform.toast(`Projeto "${proj(pid).name}" iniciado. Bom trabalho!`, "ok");
    }
    function openProject(pid) {
        if (!state().active || isDone(proj(state().active)) || !hasPendingAvailable(proj(state().active))) {
            if (!isDone(proj(pid))) { state().active = pid; Save.persist(); }
        }
        view = { mode: "project", pid, task: null };
        render();
    }

    function renderProject(host) {
        const p = proj(view.pid);
        const tierLabel = { basico: "Básico", intermediario: "Intermediário", avancado: "Avançado" };
        const repoUrl = state().repos[p.id] || "";
        host.innerHTML = `
            <div class="proj-head"><span class="proj-emoji">${p.emoji}</span><div><h3>${kesc(p.name)}</h3><small>Cliente: ${kesc(p.client)}</small></div></div>
            <div class="dossier-card"><div class="dossier-label">POR QUE ISSO IMPORTA</div><p class="briefing-text">${kesc(p.why)}</p></div>
            <div class="proj-tasks">${p.tasks.map((t, i) => {
                const s = taskStatus(p, i);
                const icon = { done: "✅", open: "▶", locked: "🔒", paid: "💳" }[s];
                const why = s === "locked" ? (tierDone(t.tier) ? "Faça a entrega anterior" : `Libera ao concluir a trilha ${tierLabel[t.tier]}`) : s === "paid" ? "Parte do curso completo" : "";
                return `<button type="button" class="proj-task ${s}" ${s === "open" || s === "done" ? `onclick="Projects.openTask(${i})"` : s === "paid" ? `onclick="Paywall.open()"` : "disabled"}>
                    <span class="pt-icon">${icon}</span><span class="pt-main"><b>${i + 1}. ${kesc(t.title)}</b><small>${tierLabel[t.tier]}${why ? " · " + why : ""}</small></span></button>`;
            }).join("")}</div>
            <div class="proj-deliver">
                <div class="dossier-label">ENTREGÁVEL PARA O GITHUB</div>
                <p class="modal-desc">O pacote traz <code>README.md</code>, <code>schema.sql</code> e uma pasta <code>consultas/</code> com cada entrega. ${isDone(p) ? "Projeto completo!" : "Dá para baixar uma prévia e atualizar depois."}</p>
                <div class="pf-actions">
                    <button class="btn btn-primary" ${doneCount(p) ? "" : "disabled"} onclick="Projects.downloadZip('${p.id}')">⬇ BAIXAR REPOSITÓRIO (.zip)</button>
                </div>
                <div class="form-group">
                    <label for="repo-url">LINK DO SEU REPOSITÓRIO NO GITHUB (vai para o certificado):</label>
                    <input type="url" id="repo-url" placeholder="https://github.com/seu-usuario/${p.repo}" value="${kesc(repoUrl)}">
                </div>
                <button class="btn btn-secondary" onclick="Projects.saveRepo('${p.id}')">SALVAR LINK</button>
                <details class="pf-how"><summary>Como publicar no GitHub</summary>
                <ol>
                    <li>Extraia o .zip numa pasta.</li>
                    <li>Crie um repositório vazio no GitHub chamado <code>${p.repo}</code>.</li>
                    <li>No terminal, dentro da pasta:
<pre>git init
git add .
git commit -m "feat: ${kesc(p.name)} em SQL"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/${p.repo}.git
git push -u origin main</pre></li>
                    <li>Cole o link do repositório aqui em cima e fixe o projeto no seu perfil do GitHub.</li>
                </ol></details>
            </div>`;
    }

    function openTask(i) {
        view = { mode: "task", pid: view.pid, task: i };
        render();
    }

    function renderTask(host) {
        const p = proj(view.pid), i = view.task, t = p.tasks[i];
        const eng = engine();
        eng.loadLevel(asLevel(p, i));
        const tables = eng.getSchemaMetadata().map(tb => `<div class="schema-table-box"><div class="schema-table-name"><span>TABLE: ${tb.tableName}</span><span>${tb.columns.length} colunas</span></div><div class="schema-columns-list">${tb.columns.map(c => `<div class="schema-column-row"><span>${c.name}${c.pk ? ' <span class="schema-col-pk">[PK]</span>' : ""}</span><span class="schema-col-type">${c.type}</span></div>`).join("")}</div></div>`).join("");
        host.innerHTML = `
            <div class="proj-head"><span class="proj-emoji">${p.emoji}</span><div><h3>Entrega ${i + 1}: ${kesc(t.title)}</h3><small>${kesc(p.name)} · pedido de ${kesc(t.from)}</small></div></div>
            <div class="dossier-card"><div class="dossier-label">O PEDIDO</div><p class="briefing-text">${kesc(t.briefing)}</p></div>
            <details class="theory-box pt-how"><summary class="btn-theory-toggle">💡 Como fazer</summary><p class="theory-text">${kesc(t.hint)}</p></details>
            <div class="objective-card"><div class="dossier-label">O QUE ENTREGAR</div><p class="objective-text">${kesc(t.objective)}</p></div>
            <details class="schema-inspector"><summary class="dossier-label">TABELAS DO PROJETO</summary><div class="schema-tree">${tables}</div></details>
            <textarea id="proj-sql" class="proj-sql" spellcheck="false" placeholder="-- Escreva sua consulta aqui">${kesc(sol(p.id, i) || "")}</textarea>
            <div class="pf-actions">
                <button class="btn btn-primary" id="proj-run" onclick="Projects.run()">⚡ EXECUTAR E ENTREGAR</button>
            </div>
            <div id="proj-feedback"></div>
            <div class="table-wrapper proj-result" id="proj-result"></div>`;
        const ta = document.getElementById("proj-sql");
        ta.addEventListener("keydown", e => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); run(); } });
        setTimeout(() => ta.focus(), 50);
    }

    function run() {
        const p = proj(view.pid), i = view.task;
        const input = document.getElementById("proj-sql").value;
        const eng = engine();
        eng.loadLevel(asLevel(p, i));
        const ev = pValidator.evaluate(input, asLevel(p, i));
        const fb = document.getElementById("proj-feedback");
        const res = document.getElementById("proj-result");
        if (ev.userResult) {
            res.innerHTML = `<table class="sql-table"><thead><tr>${ev.userResult.columns.map(c => `<th>${kesc(c)}</th>`).join("")}</tr></thead><tbody>${ev.userResult.values.map(r => `<tr>${r.map(v => v === null ? '<td><span class="null-badge">NULL</span></td>' : `<td>${kesc(v)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
        } else res.innerHTML = "";
        if (ev.passed) {
            const first = !sol(p.id, i);
            const s = state();
            s.solutions[p.id] = s.solutions[p.id] || {};
            s.solutions[p.id][i] = input.trim();
            if (isDone(p) && !s.done.includes(p.id)) s.done.push(p.id);
            if (first) { Save.get().points += 300; }
            Save.persist();
            Score.hud();
            GameAudio.sfx("success");
            FX.burst(document.getElementById("proj-run"), "#ffb703");
            FX.vibrate(30);
            if (first) FX.float("+300", document.getElementById("proj-run"));
            const doneNow = isDone(p);
            fb.innerHTML = `<div class="feedback-banner success" style="display:flex"><div class="feedback-icon">✔</div><div class="feedback-content"><div class="feedback-title">ENTREGA ACEITA</div><div class="feedback-msg">${doneNow ? "Projeto completo! Baixe o repositório e publique no GitHub." : "Entrega registrada no projeto."}</div></div>
                <button class="btn btn-success" onclick="Projects.back()">VOLTAR AO PROJETO</button></div>`;
            if (doneNow && first) { FX.confetti(true); Site.sendScore(); }
            else if (first) Site.sendScore();
        } else {
            GameAudio.sfx("error");
            FX.shake(document.getElementById("projects-modal").querySelector(".modal-card"));
            FX.vibrate([60, 40, 60]);
            fb.innerHTML = `<div class="feedback-banner error" style="display:flex"><div class="feedback-icon">✖</div><div class="feedback-content"><div class="feedback-title">AINDA NÃO</div><div class="feedback-msg">${kesc(ev.message)}</div></div></div>`;
        }
    }

    function saveRepo(pid) {
        const v = document.getElementById("repo-url").value.trim();
        if (v && !/^https:\/\/github\.com\/[^\s/]+\/[^\s/]+\/?$/i.test(v)) {
            Platform.toast("Use o link completo do repositório, por exemplo https://github.com/seu-usuario/" + proj(pid).repo, "error", 6000);
            return;
        }
        state().repos[pid] = v;
        Save.persist();
        Platform.toast(v ? "Link salvo. Ele vai aparecer no certificado." : "Link removido.", "ok");
    }

    function sqlComment(text) {
        const words = String(text).split(/\s+/); const lines = []; let cur = "";
        words.forEach(w => { if ((cur + " " + w).trim().length > 86) { lines.push(cur.trim()); cur = w; } else cur += " " + w; });
        if (cur.trim()) lines.push(cur.trim());
        return lines.map(l => "-- " + l).join("\n");
    }
    const dedent = t => { const ls = t.replace(/^\n+|\s+$/g, "").split("\n"); const m = Math.min(...ls.filter(l => l.trim()).map(l => l.match(/^\s*/)[0].length)); return ls.map(l => l.slice(m)).join("\n"); };

    function files(p, author) {
        const date = todayISO();
        const out = [];
        out.push({ path: "schema.sql", content: `-- ${p.name} — esquema e dados fictícios\n-- Projeto do curso Operação QueryZero (Kora EduTech)\n-- Uso: sqlite3 ${p.id}.db < schema.sql\n\n${dedent(p.schemaDDL)}\n\n${dedent(p.seedData)}\n` });
        const rows = [];
        p.tasks.forEach((t, i) => {
            const q = sol(p.id, i);
            if (!q) return;
            out.push({ path: `consultas/${t.file}`, content: `-- Entrega ${i + 1}: ${t.title}\n-- Pedido de ${t.from}:\n${sqlComment(t.briefing)}\n--\n-- Objetivo:\n${sqlComment(t.objective)}\n\n${q}\n` });
            rows.push(`| ${i + 1} | ${t.title} | [\`consultas/${t.file}\`](consultas/${t.file}) |`);
        });
        const readme = `# ${p.name}

${p.pitch}

> Projeto de portfólio em SQL desenvolvido por **${author || "(seu nome)"}** no curso **Operação QueryZero**, da Kora EduTech. Empresa e dados são fictícios: a Aethelgard Dynamics tem sede em Florianópolis (SC).

## Por que este projeto importa

${p.why}

## Entregas

| # | Pergunta de negócio | Consulta |
|---|---|---|
${rows.join("\n")}

## Competências demonstradas

${p.skills.map(s => `- ${s}`).join("\n")}

## Como executar

Você precisa do [SQLite](https://www.sqlite.org/download.html) instalado.

\`\`\`bash
sqlite3 ${p.id}.db < schema.sql
sqlite3 -header -column ${p.id}.db < consultas/${p.tasks[0].file}
\`\`\`

Troque o nome do arquivo para rodar as outras consultas da pasta \`consultas/\`.

## Estrutura

\`\`\`
${p.repo}/
├── README.md
├── schema.sql
└── consultas/
${p.tasks.filter((_, i) => sol(p.id, i)).map(t => `    └── ${t.file}`).join("\n")}
\`\`\`

---
Gerado em ${date} · Curso livre de formação prática · Kora EduTech
`;
        out.unshift({ path: "README.md", content: readme });
        return out;
    }

    async function downloadZip(pid) {
        const p = proj(pid);
        if (typeof JSZip === "undefined") { Platform.toast("A biblioteca de compactação não carregou. Verifique a conexão e recarregue.", "error", 6000); return; }
        const author = getPlayerName() || Site.loginName();
        const zip = new JSZip();
        files(p, author).forEach(f => zip.file(`${p.repo}/${f.path}`, f.content));
        const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
        await saveFile(`${p.repo}.zip`, blob);
    }

    return { open, close, back, start, openProject, openTask, run, saveRepo, downloadZip, completedProjects, doneCount, sol, render, isDone };
})();

/* ---------------------------------------------------------------
   ENTREVISTA FINAL (ascensão de cargo)
   --------------------------------------------------------------- */
const INTERVIEW = [
    {
        q: "Maya: \"Me conte um problema real que você resolveu com SQL.\"",
        opts: [
            { t: "Conto um caso concreto: o problema, a consulta que escrevi, o resultado e o que aprendi. Por exemplo, o caminho do ataque até o db-financeiro.", ok: true, fb: "Ótimo. Situação, ação e resultado, com um exemplo do seu portfólio, mostram que você sabe usar o que aprendeu." },
            { t: "Listo os comandos que sei: SELECT, JOIN, GROUP BY, CTE, funções de janela…", ok: false, fb: "Saber os comandos é bom, mas a pergunta pedia um problema resolvido. Mostre o impacto, não só a lista." },
            { t: "Digo que ainda não resolvi nada real, só fiz exercícios.", ok: false, fb: "Você resolveu, sim: os projetos do curso são casos reais simulados. Valorize o que fez." }
        ]
    },
    {
        q: "Rafa: \"Depois de um JOIN, o faturamento do relatório dobrou. O que você investiga primeiro?\"",
        opts: [
            { t: "Coloco DISTINCT em tudo até o número parecer certo.", ok: false, fb: "DISTINCT pode esconder o problema e ainda apagar linhas legítimas." },
            { t: "Confiro a relação entre as tabelas: um lado 1 para N está repetindo linhas antes do SUM.", ok: true, fb: "Exato. JOIN com relação 1 para N multiplica linhas. Agregue antes ou ajuste a chave do JOIN." },
            { t: "Troco SUM por AVG para diminuir o valor.", ok: false, fb: "Isso muda a pergunta, não corrige o dado." }
        ]
    },
    {
        q: "Kenji: \"Qual é a diferença entre WHERE e HAVING?\"",
        opts: [
            { t: "Nenhuma, são sinônimos.", ok: false, fb: "Não são. A ordem de execução muda tudo." },
            { t: "HAVING é só uma versão mais rápida do WHERE.", ok: false, fb: "Não é questão de velocidade, e sim de momento: antes ou depois do GROUP BY." },
            { t: "WHERE filtra linhas antes de agrupar; HAVING filtra grupos depois do GROUP BY.", ok: true, fb: "Perfeito. É por isso que COUNT(*) >= 3 vai no HAVING." }
        ]
    },
    {
        q: "Ivy: \"Quando você usa LEFT JOIN em vez de INNER JOIN?\"",
        opts: [
            { t: "Quando preciso manter as linhas da esquerda mesmo sem par, como servidores sem nenhum alerta.", ok: true, fb: "Isso. LEFT JOIN com IS NULL é o jeito clássico de achar ausências." },
            { t: "Sempre, porque traz mais dados.", ok: false, fb: "Mais dados nem sempre é melhor: pode trazer linhas que não respondem à pergunta." },
            { t: "Quando a tabela da esquerda é menor.", ok: false, fb: "O tamanho não decide. O que decide é se você precisa manter quem não tem par." }
        ]
    },
    {
        q: "Maya: \"Como você apresentaria o caminho do ataque para a diretoria?\"",
        opts: [
            { t: "Mostro a consulta recursiva inteira e explico linha por linha.", ok: false, fb: "A diretoria precisa da conclusão, não do código. Guarde o SQL para o anexo." },
            { t: "Começo pela conclusão e pelo impacto, mostro a rota de forma simples e recomendo o que fazer.", ok: true, fb: "Excelente. Conclusão, evidência e recomendação: assim um achado técnico vira decisão." },
            { t: "Mando o resultado em planilha para eles analisarem.", ok: false, fb: "Quem analisa é você. Entregar dado cru transfere o trabalho." }
        ]
    },
    {
        q: "Luna: \"Você percebe que um colega publicou um número errado no painel. O que faz?\"",
        opts: [
            { t: "Deixo para lá, não é minha responsabilidade.", ok: false, fb: "Número errado no painel vira decisão errada. Em dados, qualidade é responsabilidade de todos." },
            { t: "Aviso no grupo geral que o painel está errado.", ok: false, fb: "Expor o colega gera desconfiança. Resolva primeiro com quem fez." },
            { t: "Converso com o colega, mostro a evidência, ajudo a corrigir e combinamos de avisar quem usa o painel.", ok: true, fb: "Isso é maturidade: corrige o dado e preserva a confiança do time." }
        ]
    }
];

const Interview = (() => {
    let st = null; // { i, score, answered }
    function available() { return completedLevels.size === LEVELS.length; }
    function open() {
        if (!available()) {
            Platform.toast("A entrevista libera quando você concluir as 90 fases.", "info", 5000);
            return;
        }
        st = { i: -1, score: 0, answered: false };
        render();
        document.getElementById("interview-modal").style.display = "flex";
    }
    function back() {
        if (st && st.i >= 0 && st.i < INTERVIEW.length) { st = { i: -1, score: 0, answered: false }; render(); return true; }
        return false;
    }
    function render() {
        const host = document.getElementById("interview-body");
        if (st.i === -1) {
            const last = Save.get().interview;
            host.innerHTML = `<div class="iv-cast">${Art.character("maya", "smile")}</div>
                <p class="modal-desc">A investigação acabou, e a Aethelgard quer você no time fixo de Florianópolis. Maya chamou você para a conversa de promoção: <b>Analista de Dados Pleno</b>, no núcleo forense.</p>
                <p class="modal-desc">São ${INTERVIEW.length} perguntas, cada uma com 3 opções. Você recebe o retorno de cada resposta e um parecer no final.</p>
                ${last ? `<p class="pf-meta">Última tentativa: ${last.score}/${last.total} em ${last.date.split("-").reverse().join("/")}</p>` : ""}
                <button class="btn btn-primary btn-large" onclick="Interview.next()">COMEÇAR A ENTREVISTA</button>`;
            return;
        }
        if (st.i >= INTERVIEW.length) return renderEnd(host);
        const item = INTERVIEW[st.i];
        host.innerHTML = `<div class="iv-progress"><i style="width:${Math.round(st.i / INTERVIEW.length * 100)}%"></i></div>
            <p class="iv-q">${kesc(item.q)}</p>
            <div class="iv-opts">${item.opts.map((o, k) => `<button type="button" class="iv-opt" onclick="Interview.answer(${k})">${String.fromCharCode(65 + k)}) ${kesc(o.t)}</button>`).join("")}</div>
            <div id="iv-fb"></div>`;
    }
    function next() { st.i++; st.answered = false; render(); }
    function answer(k) {
        if (st.answered) return;
        st.answered = true;
        const item = INTERVIEW[st.i], o = item.opts[k];
        if (o.ok) { st.score++; GameAudio.sfx("success"); FX.vibrate(30); } else { GameAudio.sfx("error"); FX.vibrate([60, 40, 60]); }
        document.querySelectorAll(".iv-opt").forEach((b, j) => { b.disabled = true; if (item.opts[j].ok) b.classList.add("right"); else if (j === k) b.classList.add("wrong"); });
        document.getElementById("iv-fb").innerHTML = `<div class="iv-fb ${o.ok ? "ok" : "no"}"><b>${o.ok ? "Boa resposta." : "Dá para melhorar."}</b> ${kesc(o.fb)}</div>
            <button class="btn btn-primary" onclick="Interview.next()">${st.i + 1 < INTERVIEW.length ? "PRÓXIMA PERGUNTA" : "VER PARECER"}</button>`;
    }
    function renderEnd(host) {
        const total = INTERVIEW.length, sc = st.score;
        Save.get().interview = { score: sc, total, date: todayISO() };
        Save.persist();
        const verdict = sc === total
            ? { t: "Promoção aprovada!", d: "Você respondeu como alguém que já trabalha com dados: explica com exemplos, conhece as armadilhas do SQL e sabe comunicar. Leve essa postura para as entrevistas de verdade." }
            : sc >= 4
            ? { t: "Aprovada com plano de desenvolvimento", d: "Base técnica sólida. Revise as respostas marcadas, principalmente as de comunicação, e treine contar seus projetos em voz alta: problema, ação e resultado." }
            : { t: "Ainda não foi desta vez", d: "Sem problema: entrevista também se treina. Releia os retornos, volte aos capítulos de JOIN e agregação e tente de novo quando quiser." };
        if (sc >= 4) FX.confetti(true);
        host.innerHTML = `<div class="iv-cast">${Art.character("maya", sc >= 4 ? "smile" : "neutral")}</div>
            <div class="iv-score">${sc}/${total}</div>
            <h3 class="iv-verdict">${verdict.t}</h3>
            <p class="modal-desc">${verdict.d}</p>
            <div class="pf-actions">
                <button class="btn btn-secondary" onclick="Interview.restart()">REFAZER A ENTREVISTA</button>
                <button class="btn btn-gold" onclick="document.getElementById('interview-modal').style.display='none'; KoraCert.open();">🎓 VER CERTIFICADO</button>
            </div>`;
    }
    function restart() { st = { i: -1, score: 0, answered: false }; next(); }
    return { open, back, next, answer, restart, available };
})();

/* ---------------------------------------------------------------
   CERTIFICADO PADRÃO KORA (1080 × 1350, PDF e LinkedIn)
   --------------------------------------------------------------- */
const KoraCert = (() => {
    const LEVELS_INFO = {
        basico:        { label: "BÁSICO", seal: "bronze", hours: () => KORA.hours.basico, skills: () => KORA.skills.basico, tiers: ["basico"] },
        intermediario: { label: "INTERMEDIÁRIO", seal: "prata", hours: () => KORA.hours.intermediario, skills: () => KORA.skills.intermediario, tiers: ["basico", "intermediario"] },
        avancado:      { label: "AVANÇADO", seal: "ouro", hours: () => KORA.hours.avancado, skills: () => KORA.skills.avancado, tiers: ["basico", "intermediario", "avancado"] },
        portfolio:     { label: "PORTFÓLIO COMPLETO · 3 projetos", seal: "ouro", hours: () => KORA.hours.portfolio, skills: () => KORA.skills.avancado, tiers: ["basico", "intermediario", "avancado"] }
    };
    let chosen = null;
    let logoImg = null;

    function earned() {
        const out = [];
        if (isTierFullyCompleted("basico")) out.push("basico");
        if (isTierFullyCompleted("basico") && isTierFullyCompleted("intermediario")) out.push("intermediario");
        const all = completedLevels.size === LEVELS.length;
        const nProj = Projects.completedProjects().length;
        if (all && nProj >= 1) out.push("avancado");
        if (all && nProj === 3) out.push("portfolio");
        return out;
    }

    // Projetos para o certificado: só o que foi feito nas etapas do nível.
    function projectLines(levelKey) {
        const tiers = LEVELS_INFO[levelKey].tiers;
        const repos = Save.get().projects.repos;
        return PROJECTS.map(p => {
            const done = p.tasks.map((t, i) => Projects.sol(p.id, i) && tiers.includes(t.tier) ? i + 1 : 0).filter(Boolean);
            if (!done.length) return null;
            if ((levelKey === "avancado" || levelKey === "portfolio") && !Projects.isDone(p)) return null;
            const full = done.length === p.tasks.length;
            return { name: p.name + (full ? "" : ` (entregas ${done[0]}–${done[done.length - 1]})`), url: repos[p.id] || "" };
        }).filter(Boolean);
    }

    async function code(name, levelKey) {
        const raw = `${KORA.game}|${levelKey}|${name}|${todayISO()}`;
        let hex = "";
        try {
            const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
            hex = [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
        } catch (e) {
            let h = 2166136261; for (const c of raw) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }
            hex = h.toString(16).padStart(8, "0") + (h ^ 0x5bd1e995).toString(16).padStart(8, "0");
        }
        const s = hex.toUpperCase().slice(0, 8);
        return `KQZ-${s.slice(0, 4)}-${s.slice(4, 8)}`;
    }

    function currentName() {
        const f = document.getElementById("cert-name");
        return (f ? f.value : "").trim();
    }

    function open() {
        const list = earned();
        const host = document.getElementById("cert-body");
        const nm = Site.loginName() || getPlayerName();
        if (!list.length) {
            host.innerHTML = `<p class="modal-desc">Seu primeiro certificado libera quando você concluir a trilha <b>Básico</b> (fases 1 a 30). Faltam ${getTierIndexes("basico").filter(i => !completedLevels.has(i)).length} fases.</p>
                <p class="modal-desc">Níveis: Básico → Intermediário → Avançado (curso completo + 1 ou 2 projetos) → Portfólio completo (curso completo + 3 projetos).</p>`;
            document.getElementById("cert-modal").style.display = "flex";
            return;
        }
        chosen = list[list.length - 1];
        const all = completedLevels.size === LEVELS.length;
        const nProj = Projects.completedProjects().length;
        host.innerHTML = `
            <div class="cert-levels">${list.map(k => `<button type="button" class="cert-level-btn ${k === chosen ? "active" : ""}" data-k="${k}" onclick="KoraCert.choose('${k}')">${LEVELS_INFO[k].label.split(" ·")[0]}</button>`).join("")}</div>
            ${all && nProj === 0 ? `<p class="pf-warn">Curso completo! Conclua 1 projeto de portfólio para liberar o certificado Avançado (e os 3 para o Portfólio completo).</p>` : ""}
            ${all && nProj > 0 && nProj < 3 ? `<p class="pf-meta">Conclua os ${3 - nProj} projeto(s) restante(s) para o certificado Portfólio completo.</p>` : ""}
            <div class="form-group">
                <label for="cert-name">NOME NO CERTIFICADO:</label>
                <input type="text" id="cert-name" value="${kesc(nm)}" placeholder="Seu nome completo" ${Site.loginName() ? "readonly" : ""}>
            </div>
            <div class="cert-preview-wrap"><canvas id="cert-canvas" width="1080" height="1350"></canvas></div>
            <div class="pf-actions">
                <button class="btn btn-primary" onclick="KoraCert.downloadPng()">⬇ IMAGEM (Instagram/LinkedIn)</button>
                <button class="btn btn-secondary" onclick="KoraCert.downloadPdf()">⬇ PDF PARA IMPRIMIR</button>
                <button class="btn btn-gold" onclick="KoraCert.linkedin()">in ADICIONAR AO LINKEDIN</button>
                <button class="btn btn-secondary" onclick="KoraCert.share()">COMPARTILHAR</button>
            </div>`;
        const f = document.getElementById("cert-name");
        f.addEventListener("input", () => { try { localStorage.setItem(PLAYER_NAME_STORAGE_KEY, f.value.trim()); } catch (e) { /* */ } const top = document.getElementById("player-name-field"); if (top) top.value = f.value; draw(); });
        document.getElementById("cert-modal").style.display = "flex";
        draw();
    }

    function choose(k) {
        chosen = k;
        document.querySelectorAll(".cert-level-btn").forEach(b => b.classList.toggle("active", b.dataset.k === k));
        draw();
    }

    function loadLogo() {
        if (logoImg) return Promise.resolve(logoImg);
        return new Promise(res => { const i = new Image(); i.onload = () => { logoImg = i; res(i); }; i.onerror = () => res(null); i.src = KORA_LOGO; });
    }

    function qrCanvas(text) {
        if (!text || typeof QRCode === "undefined") return null;
        const div = document.createElement("div");
        try { new QRCode(div, { text, width: 220, height: 220, correctLevel: QRCode.CorrectLevel.M }); } catch (e) { return null; }
        return div.querySelector("canvas");
    }

    function wrap(ctx, text, maxW) {
        const words = String(text).split(" "); const lines = []; let cur = "";
        words.forEach(w => { const t = cur ? cur + " " + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; });
        if (cur) lines.push(cur);
        return lines;
    }

    function sealColors(kind) {
        return kind === "bronze" ? ["#e3a46b", "#a0592b", "#6e3a17"] : kind === "prata" ? ["#f1f3f6", "#a9b1bd", "#5f6773"] : ["#ffe28a", "#d4a017", "#8a6508"];
    }

    let drawing = 0;
    async function draw() {
        const my = ++drawing;
        const cv = document.getElementById("cert-canvas");
        if (!cv || !chosen) return;
        const ctx = cv.getContext("2d");
        const info = LEVELS_INFO[chosen];
        const name = currentName() || "Seu nome aqui";
        const c = await code(currentName() || "-", chosen);
        const url = Site.verifyUrl(c);
        try { await document.fonts.load("64px 'Great Vibes'"); await document.fonts.load("bold 40px 'Playfair Display'"); } catch (e) { /* fontes opcionais */ }
        const logo = await loadLogo();
        if (my !== drawing) return;
        const W = 1080, H = 1350, ink = "#1d1736";
        cv.dataset.code = c;

        // Fundo
        if (chosen === "portfolio") {
            const g = ctx.createLinearGradient(0, 0, W, H);
            g.addColorStop(0, "#f6ecd6"); g.addColorStop(0.5, "#efe0c2"); g.addColorStop(1, "#e8d6b2");
            ctx.fillStyle = g;
        } else ctx.fillStyle = "#fbf6ee";
        ctx.fillRect(0, 0, W, H);

        // Circuitos discretos (avançado e portfólio)
        if (chosen === "avancado" || chosen === "portfolio") {
            ctx.save(); ctx.strokeStyle = "rgba(14,165,233,0.16)"; ctx.lineWidth = 2;
            for (let k = 0; k < 9; k++) {
                const y = 120 + k * 135, x = k % 2 ? W - 40 : 40, dir = k % 2 ? -1 : 1;
                ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + dir * 70, y); ctx.lineTo(x + dir * 100, y + 30); ctx.lineTo(x + dir * 150, y + 30); ctx.stroke();
                ctx.beginPath(); ctx.arc(x + dir * 150, y + 30, 5, 0, Math.PI * 2); ctx.stroke();
            }
            ctx.restore();
        }

        // Moldura
        const gold = chosen === "avancado" || chosen === "portfolio";
        ctx.strokeStyle = gold ? "#c9a227" : "#cbbfa8"; ctx.lineWidth = gold ? 6 : 3; ctx.strokeRect(28, 28, W - 56, H - 56);
        ctx.strokeStyle = gold ? "rgba(201,162,39,.5)" : "rgba(29,23,54,.15)"; ctx.lineWidth = 1.5; ctx.strokeRect(44, 44, W - 88, H - 88);

        // Logo
        if (logo) ctx.drawImage(logo, W / 2 - 160, 66, 320, 128);

        // Selo
        const [s1, s2, s3] = sealColors(info.seal);
        const sx = W - 142, sy = 150, sr = 74;
        const sg = ctx.createRadialGradient(sx - 20, sy - 25, 10, sx, sy, sr);
        sg.addColorStop(0, s1); sg.addColorStop(0.7, s2); sg.addColorStop(1, s3);
        ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(sx, sy, sr - 9, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = info.seal === "prata" ? "#2b3038" : "#2a1606"; ctx.textAlign = "center";
        const sealTxt = chosen === "portfolio" ? ["PORTFÓLIO", "COMPLETO", "3 projetos"] : [info.label];
        ctx.font = `bold ${sealTxt.length > 1 ? 17 : info.label.length > 10 ? 16 : 22}px 'JetBrains Mono', monospace`;
        sealTxt.forEach((t, k) => ctx.fillText(t, sx, sy + 6 + (k - (sealTxt.length - 1) / 2) * 22));

        // Título e nome
        ctx.fillStyle = ink; ctx.textAlign = "center";
        ctx.font = "600 30px 'JetBrains Mono', monospace";
        if ("letterSpacing" in ctx) { ctx.letterSpacing = "8px"; ctx.fillText("CERTIFICADO DE CONCLUSÃO", W / 2 + 4, 272); ctx.letterSpacing = "0px"; }
        else ctx.fillText("CERTIFICADO DE CONCLUSÃO", W / 2, 272);
        ctx.font = "26px Georgia, serif"; ctx.fillStyle = "#4b4466";
        ctx.fillText("Certificamos que", W / 2, 330);
        let fs = 64; ctx.font = `bold ${fs}px 'Playfair Display', Georgia, serif`;
        while (ctx.measureText(name).width > W - 200 && fs > 34) { fs -= 2; ctx.font = `bold ${fs}px 'Playfair Display', Georgia, serif`; }
        ctx.fillStyle = ink; ctx.fillText(name, W / 2, 412);
        ctx.strokeStyle = "rgba(29,23,54,.25)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(220, 436); ctx.lineTo(W - 220, 436); ctx.stroke();
        ctx.font = "26px Georgia, serif"; ctx.fillStyle = "#4b4466";
        ctx.fillText("concluiu o curso", W / 2, 482);
        ctx.font = "bold 32px Georgia, serif"; ctx.fillStyle = ink;
        ctx.fillText(KORA.course, W / 2, 528);
        const d = new Date();
        ctx.font = "22px 'JetBrains Mono', monospace"; ctx.fillStyle = "#4b4466";
        ctx.fillText(`Carga horária estimada: ${info.hours()} horas  ·  Concluído em ${d.toLocaleDateString("pt-BR")}`, W / 2, 570);

        // Competências
        let y = 632; const lx = 120;
        ctx.textAlign = "left"; ctx.fillStyle = "#7c4dff"; ctx.font = "bold 20px 'JetBrains Mono', monospace";
        ctx.fillText("COMPETÊNCIAS", lx, y); y += 36;
        ctx.fillStyle = ink; ctx.font = "24px Georgia, serif";
        info.skills().slice(0, 5).forEach(s => { ctx.fillText("•  " + s, lx, y); y += 34; });

        // Projetos
        const projs = projectLines(chosen);
        if (projs.length) {
            y += 14;
            ctx.fillStyle = "#7c4dff"; ctx.font = "bold 20px 'JetBrains Mono', monospace";
            ctx.fillText("PROJETOS DE PORTFÓLIO", lx, y); y += 36;
            projs.forEach(p => {
                ctx.fillStyle = ink; ctx.font = "bold 23px Georgia, serif";
                ctx.fillText("•  " + p.name, lx, y);
                const nw = ctx.measureText("•  " + p.name).width;
                ctx.font = "19px 'JetBrains Mono', monospace"; ctx.fillStyle = "#3f6df5";
                const link = p.url ? p.url.replace(/^https?:\/\//, "") : "";
                if (link) {
                    if (lx + nw + 24 + ctx.measureText(link).width < W - 110) ctx.fillText(link, lx + nw + 24, y);
                    else { y += 28; ctx.fillText(link, lx + 34, y); }
                }
                y += 36;
            });
        }

        // Linha final logo abaixo dos projetos: assinatura à esquerda, verificação e QR à direita
        const top = y + 34;
        const sigCx = 90 + 215;
        ctx.textAlign = "center"; ctx.fillStyle = ink;
        ctx.font = "52px 'Great Vibes', 'Brush Script MT', cursive";
        ctx.fillText("Márcia R. Campos", sigCx, top + 48);
        ctx.strokeStyle = ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(90, top + 66); ctx.lineTo(520, top + 66); ctx.stroke();
        ctx.font = "21px Georgia, serif"; ctx.fillStyle = ink;
        ctx.fillText("Márcia Rodrigues Campos", sigCx, top + 96);
        ctx.font = "18px Georgia, serif"; ctx.fillStyle = "#6b6458";
        ctx.fillText("Founder · Kora EduTech", sigCx, top + 122);

        const qr = qrCanvas(url);
        const boxX = W - 90 - 146, boxY = top - 14;
        if (qr) { ctx.fillStyle = "#fff"; ctx.fillRect(boxX, boxY, 146, 146); ctx.drawImage(qr, boxX + 8, boxY + 8, 130, 130); }
        const tx = qr ? boxX - 14 : W - 90;
        const maxTw = tx - 560;
        const where = (Site.verifyBase() || "site da Kora EduTech").replace(/^https?:\/\//, "");
        ctx.textAlign = "right";
        const fit = (txt, weight, size) => { let f = size; ctx.font = `${weight} ${f}px 'JetBrains Mono', monospace`; while (ctx.measureText(txt).width > maxTw && f > 11) { f--; ctx.font = `${weight} ${f}px 'JetBrains Mono', monospace`; } };
        fit("verifique em", "400", 16); ctx.fillStyle = "#6b6458"; ctx.fillText("verifique em", tx, top + 82);
        fit(where, "600", 16); ctx.fillStyle = ink; ctx.fillText(where, tx, top + 106);
        ctx.font = "400 16px 'JetBrains Mono', monospace"; ctx.fillStyle = "#6b6458";
        const codeTxt = "código "; const cw = (ctx.font = "600 16px 'JetBrains Mono', monospace", ctx.measureText(c).width);
        ctx.fillStyle = ink; ctx.fillText(c, tx, top + 130);
        ctx.font = "400 16px 'JetBrains Mono', monospace"; ctx.fillStyle = "#6b6458"; ctx.fillText(codeTxt, tx - cw, top + 130);

        // Rodapé centralizado
        ctx.textAlign = "center"; ctx.font = "15px Georgia, serif"; ctx.fillStyle = "#6b6458";
        ctx.fillText("Curso livre de formação prática.", W / 2, H - 58);
    }

    function fileBase() {
        const n = (currentName() || "aluno").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        return `certificado-queryzero-${chosen}-${n}`;
    }
    function needName() {
        if (currentName()) return false;
        Platform.toast("Digite seu nome completo no certificado.", "error");
        const f = document.getElementById("cert-name"); if (f) f.focus();
        return true;
    }
    async function pngBlob() {
        await draw();
        const cv = document.getElementById("cert-canvas");
        return new Promise(res => cv.toBlob(res, "image/png"));
    }
    async function downloadPng() {
        if (needName()) return;
        await saveFile(fileBase() + ".png", await pngBlob());
        GameAudio.sfx("success");
    }
    async function downloadPdf() {
        if (needName()) return;
        if (!window.jspdf) { Platform.toast("A biblioteca de PDF não carregou. Verifique a conexão.", "error"); return; }
        await draw();
        const cv = document.getElementById("cert-canvas");
        const pdf = new window.jspdf.jsPDF({ orientation: "portrait", unit: "mm", format: [216, 270] });
        pdf.addImage(cv.toDataURL("image/png"), "PNG", 0, 0, 216, 270);
        await saveFile(fileBase() + ".pdf", pdf.output("blob"));
    }
    async function linkedin() {
        if (needName()) return;
        await draw();
        const c = document.getElementById("cert-canvas").dataset.code;
        const d = new Date();
        const p = new URLSearchParams({
            startTask: "CERTIFICATION_NAME",
            name: `${KORA.course} (${LEVELS_INFO[chosen].label.split(" ·")[0]})`,
            organizationName: "Kora EduTech",
            issueYear: String(d.getFullYear()),
            issueMonth: String(d.getMonth() + 1),
            certId: c
        });
        const url = Site.verifyUrl(c);
        if (url) p.set("certUrl", url);
        window.open("https://www.linkedin.com/profile/add?" + p.toString(), "_blank", "noopener");
    }
    async function share() {
        if (needName()) return;
        const blob = await pngBlob();
        const file = new File([blob], fileBase() + ".png", { type: "image/png" });
        const text = `Concluí o nível ${LEVELS_INFO[chosen].label.split(" ·")[0]} da Operação QueryZero, curso de SQL da Kora EduTech!`;
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try { await navigator.share({ files: [file], title: "Meu certificado", text }); return; } catch (e) { return; }
        }
        await saveFile(file.name, blob);
        Platform.toast("Imagem baixada. Publique no Instagram ou no LinkedIn com a legenda que quiser!", "info", 6000);
    }

    return { open, choose, draw, downloadPng, downloadPdf, linkedin, share, earned };
})();

/* ---------------------------------------------------------------
   MONTAGEM DAS JANELAS NOVAS
   --------------------------------------------------------------- */
const KoraUI = {
    modal(id, badge, title, sub, bodyId, wide = true) {
        return `<div id="${id}" class="modal-backdrop" style="display:none;"><div class="modal-card ${wide ? "modal-wide" : ""}">
            <div class="modal-header"><span class="cyber-badge-gold">${badge}</span><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ""}</div>
            <div class="modal-body" id="${bodyId}"></div>
            <div class="modal-footer"><button class="btn btn-secondary" onclick="Nav.back()">FECHAR</button></div></div></div>`;
    },
    mount() {
        const host = document.createElement("div");
        host.innerHTML =
            KoraUI.modal("projects-modal", "📁 PORTFÓLIO", "PROJETOS DE PORTFÓLIO", "3 projetos, 6 entregas cada, prontos para o GitHub", "projects-body") +
            KoraUI.modal("cert-modal", "🎓 CERTIFICADO", "CERTIFICADO DE CONCLUSÃO", "Padrão Kora EduTech", "cert-body") +
            KoraUI.modal("interview-modal", "💼 ENTREVISTA", "CONVERSA DE PROMOÇÃO", "Aethelgard Dynamics · Florianópolis (SC)", "interview-body") +
            KoraUI.modal("achievements-modal", "🏅 CONQUISTAS", "SUAS CONQUISTAS", "", "achievements-body") +
            KoraUI.modal("challenge-modal", "🤝 DESAFIO", "DESAFIE UM AMIGO", "", "challenge-body", false) +
            `<div id="paywall-modal" class="modal-backdrop" style="display:none;"><div class="modal-card">
                <div class="modal-header"><span class="cyber-badge-gold">🔐 TRILHA AVANÇADO</span><h2>CAMADA POR CAMADA</h2>
                <p>A trilha Avançado faz parte do curso completo.</p></div>
                <div class="modal-body"><p class="modal-desc">Funções de janela, CTEs, recursão, as entregas finais dos projetos, a entrevista de promoção e o desfecho da história: quem é o Zero.</p>
                <p class="modal-desc">Seus certificados Básico e Intermediário continuam valendo. Concluindo o curso completo, você ganha também o Avançado ou o Portfólio completo.</p></div>
                <div class="modal-footer modal-footer-wrap"><button class="btn btn-gold btn-large" onclick="Paywall.unlockRequest()">LIBERAR O CURSO COMPLETO</button>
                <button class="btn btn-secondary" onclick="Nav.back()">AGORA NÃO</button></div></div></div>`;
        document.getElementById("app").appendChild(host);
    }
};
