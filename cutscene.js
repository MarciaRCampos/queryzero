/**
 * Operação QueryZero - Player de cenas animadas (cinemáticas)
 */

const Cutscene = (() => {
    let root, stage, bgEl, charsEl, glintEl, nameEl, textEl, hintEl, dotsEl, titleEl, dialogEl;
    let current = null;
    let typeTimer = null;
    const reduceMotion = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function build() {
        if (root) return;
        root = document.createElement("div");
        root.id = "cinema";
        root.className = "cinema";
        root.hidden = true;
        root.setAttribute("role", "dialog");
        root.setAttribute("aria-label", "Cena animada");
        root.innerHTML = `
            <div class="cine-stage">
                <div class="cine-bg"></div>
                <div class="cine-chars"></div>
                <div class="cine-glint-layer"></div>
                <div class="cine-vignette"></div>
            </div>
            <div class="cine-bar cine-bar-top"></div>
            <div class="cine-bar cine-bar-bottom"></div>
            <div class="cine-topbar">
                <span class="cine-title"></span>
                <span class="cine-dots"></span>
                <button type="button" class="cine-skip" title="Pular cena (Esc)">Pular ⏭</button>
            </div>
            <div class="cine-dialog">
                <div class="cine-name"></div>
                <p class="cine-text" aria-live="polite"></p>
                <div class="cine-next">Clique ou pressione Espaço ▸</div>
            </div>`;
        document.body.appendChild(root);

        stage = root.querySelector(".cine-stage");
        bgEl = root.querySelector(".cine-bg");
        charsEl = root.querySelector(".cine-chars");
        glintEl = root.querySelector(".cine-glint-layer");
        nameEl = root.querySelector(".cine-name");
        textEl = root.querySelector(".cine-text");
        hintEl = root.querySelector(".cine-next");
        dotsEl = root.querySelector(".cine-dots");
        titleEl = root.querySelector(".cine-title");
        dialogEl = root.querySelector(".cine-dialog");

        root.addEventListener("click", e => {
            if (e.target.closest(".cine-skip") || e.target.closest(".cine-glint")) return;
            advance();
        });
        root.querySelector(".cine-skip").addEventListener("click", () => finish());
    }

    function onKey(e) {
        if (!current) return;
        if (e.key === " " || e.key === "Enter" || e.key === "ArrowRight") {
            e.preventDefault();
            e.stopPropagation();
            advance();
        } else if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();
            finish();
        }
    }

    function renderDots() {
        const total = current.scene.shots.length;
        dotsEl.innerHTML = Array.from({ length: total }, (_, i) =>
            `<i class="${i < current.shot ? "done" : i === current.shot ? "now" : ""}"></i>`).join("");
    }

    function renderShot() {
        const shot = current.scene.shots[current.shot];
        stage.classList.add("cut");
        setTimeout(() => {
            if (!current) return;
            bgEl.innerHTML = Art.background(shot.bg);
            stage.className = "cine-stage " + (shot.fx || []).map(f => "fx-" + f).join(" ");
            charsEl.innerHTML = "";
            shot.chars.forEach(c => {
                const d = document.createElement("div");
                d.className = `cine-char slot-${c.slot}`;
                d.dataset.id = c.id;
                d.dataset.mood = c.mood || "neutral";
                d.innerHTML = Art.character(c.id, c.mood || "neutral");
                charsEl.appendChild(d);
            });
            renderGlint(shot);
            renderDots();
            if (shot.fx && shot.fx.includes("alarm")) GameAudio.sfx("alarm");
            showLine();
        }, reduceMotion() ? 0 : 320);
    }

    function renderGlint(shot) {
        glintEl.innerHTML = "";
        if (!shot.glint || Save.hasTreasure(shot.glint.id)) return;
        const t = TREASURES.find(x => x.id === shot.glint.id);
        const b = document.createElement("button");
        b.type = "button";
        b.className = "cine-glint";
        b.style.left = shot.glint.x + "%";
        b.style.top = shot.glint.y + "%";
        b.setAttribute("aria-label", "Algo brilha aqui");
        b.title = "Algo brilha aqui...";
        b.innerHTML = "<span></span>";
        b.addEventListener("click", ev => {
            ev.stopPropagation();
            b.classList.add("collected");
            setTimeout(() => b.remove(), 500);
            if (t) Treasures.claim(t.id);
        });
        glintEl.appendChild(b);
    }

    function showLine() {
        const shot = current.scene.shots[current.shot];
        const line = shot.lines[current.line];
        current.lineData = line;
        const who = line.who && CAST[line.who];

        if (who) {
            nameEl.hidden = false;
            nameEl.innerHTML = `<b style="color:${who.color}">${who.name}</b><small>${who.role}</small>`;
            dialogEl.classList.remove("narration");
            dialogEl.style.setProperty("--speaker", who.color);
        } else {
            nameEl.hidden = true;
            dialogEl.classList.add("narration");
            dialogEl.style.setProperty("--speaker", "#94a3b8");
        }
        dialogEl.classList.toggle("is-zero", line.who === "zero");

        charsEl.querySelectorAll(".cine-char").forEach(el => {
            const speaking = el.dataset.id === line.who;
            el.classList.toggle("speaking", speaking);
            el.classList.toggle("quiet", !!line.who && !speaking);
            if (speaking && line.mood && el.dataset.mood !== line.mood) {
                el.dataset.mood = line.mood;
                el.innerHTML = Art.character(line.who, line.mood);
            }
        });

        if (line.sfx) GameAudio.sfx(line.sfx);
        if (line.music) GameAudio.setMood(line.music);
        GameAudio.playLine(`${current.scene.id}_${current.shot}_${current.line}`, line.text, who ? who.voice : null, who ? line.who : null);

        typeText(line.text, !!who);
    }

    function typeText(text, spoken) {
        clearInterval(typeTimer);
        current.typing = true;
        hintEl.classList.remove("show");
        if (reduceMotion()) {
            finishTyping();
            return;
        }
        let i = 0;
        textEl.textContent = "";
        typeTimer = setInterval(() => {
            i++;
            textEl.textContent = text.slice(0, i);
            if (spoken && i % 3 === 0) GameAudio.sfx("type");
            if (i >= text.length) finishTyping();
        }, 22);
    }

    function finishTyping() {
        clearInterval(typeTimer);
        if (!current) return;
        textEl.textContent = current.lineData.text;
        current.typing = false;
        hintEl.classList.add("show");
    }

    function advance() {
        if (!current) return;
        if (current.typing) {
            finishTyping();
            return;
        }
        const shot = current.scene.shots[current.shot];
        if (current.line + 1 < shot.lines.length) {
            current.line++;
            showLine();
        } else if (current.shot + 1 < current.scene.shots.length) {
            current.shot++;
            current.line = 0;
            renderShot();
        } else {
            finish();
        }
    }

    function finish() {
        if (!current) return;
        clearInterval(typeTimer);
        GameAudio.stopSpeech();
        const { scene, resolve } = current;
        current = null;
        root.hidden = true;
        document.body.classList.remove("cinema-open");
        document.removeEventListener("keydown", onKey, true);
        Save.markScene(scene.id);
        const mood = typeof window.getGameMood === "function" ? window.getGameMood() : "play_basico";
        GameAudio.setMood(mood);
        resolve();
    }

    function play(sceneId, opts = {}) {
        build();
        const scene = STORY.scenes.find(s => s.id === sceneId);
        if (!scene || current) return Promise.resolve();
        return new Promise(resolve => {
            current = { scene, shot: 0, line: 0, typing: false, resolve, replay: !!opts.replay };
            GameAudio.init();
            GameAudio.setMood(scene.music || "suspense");
            titleEl.textContent = scene.title;
            document.body.classList.add("cinema-open");
            root.hidden = false;
            document.addEventListener("keydown", onKey, true);
            renderShot();
        });
    }

    return { play, isActive: () => !!current };
})();
