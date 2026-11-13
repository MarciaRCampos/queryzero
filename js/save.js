/**
 * Operação QueryZero - Progresso salvo e utilidades de plataforma
 * (persistência local, avisos na tela e entrega de arquivos ao jogador)
 */

const SAVE_KEY = "mg_queryzero_v1";
const LEGACY_SAVE_KEY = "queryzero_save_v2";

const Save = (() => {
    const fresh = () => ({
        completed: [],            // ids de fases concluídas
        solutions: {},            // id da fase -> última consulta aprovada
        treasures: [],            // ids de tesouros encontrados
        scenes: [],               // ids de cenas já assistidas
        settings: { music: true, sfx: true, voice: false },
        points: 0,                // pontuação total (enviada ao ranking do site)
        combo: 0,                 // acertos seguidos de primeira
        bestCombo: 0,
        streak: { last: null, count: 0, best: 0 },
        chapterMedals: [],        // capítulos (grupos de 5 fases) concluídos
        quick: [],                // capítulos liberados pela prova rápida
        projects: { active: null, solutions: {}, repos: {}, done: [] },
        interview: null,          // { score, total, date }
        relampago: false,
        startedAt: null,
        updatedAt: null
    });

    let data = fresh();

    function load() {
        try {
            let raw = window.localStorage.getItem(SAVE_KEY);
            if (!raw) raw = window.localStorage.getItem(LEGACY_SAVE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                const base = fresh();
                data = { ...base, ...parsed, settings: { ...base.settings, ...(parsed.settings || {}) },
                         streak: { ...base.streak, ...(parsed.streak || {}) },
                         projects: { ...base.projects, ...(parsed.projects || {}) } };
            }
        } catch (e) {
            data = fresh();
        }
        return data;
    }

    function persist() {
        try {
            data.updatedAt = Date.now();
            window.localStorage.setItem(SAVE_KEY, JSON.stringify(data));
        } catch (e) { /* armazenamento indisponível: o jogo segue sem salvar */ }
    }

    function reset() {
        const keepSettings = data.settings;
        data = fresh();
        data.settings = keepSettings;
        persist();
    }

    return {
        load, persist, reset,
        get: () => data,
        hasProgress: () => data.completed.length > 0 || data.scenes.length > 0,
        isCompleted: id => data.completed.includes(id),
        markCompleted(id, sql) {
            if (!data.completed.includes(id)) data.completed.push(id);
            if (sql) data.solutions[id] = sql;
            if (!data.startedAt) data.startedAt = Date.now();
            persist();
        },
        solutionFor: id => data.solutions[id] || null,
        hasTreasure: id => data.treasures.includes(id),
        addTreasure(id) {
            if (!data.treasures.includes(id)) data.treasures.push(id);
            persist();
        },
        sceneSeen: id => data.scenes.includes(id),
        markScene(id) {
            if (!data.scenes.includes(id)) data.scenes.push(id);
            persist();
        },
        setSetting(key, value) {
            data.settings[key] = value;
            persist();
        }
    };
})();

const Platform = {
    toast(message, kind = "info", ms = 4200) {
        const host = document.getElementById("toast-host");
        if (!host) return;
        while (host.children.length >= 2) host.firstElementChild.remove();
        const el = document.createElement("div");
        el.className = `toast toast-${kind}`;
        el.textContent = message;
        host.appendChild(el);
        setTimeout(() => el.classList.add("toast-out"), ms);
        setTimeout(() => el.remove(), ms + 500);
    },

    /**
     * Entrega um arquivo gerado ao jogador.
     * No Artifact usa a capacidade "downloads" (o sandbox bloqueia downloads diretos);
     * fora dele (pacote .zip em servidor local ou GitHub Pages) usa o download do navegador.
     */
    async saveFile(filename, blob) {
        const claudeApi = window.claude;
        if (claudeApi && typeof claudeApi.use === "function") {
            try {
                const downloads = await claudeApi.use("downloads");
                if (downloads) {
                    await downloads.save({ filename, data: blob });
                    Platform.toast(`Arquivo salvo: ${filename}`, "ok");
                    return true;
                }
            } catch (err) {
                if (err && err.code === "declined") return false;
                Platform.toast(`Não foi possível salvar o arquivo aqui (${(err && err.code) || "erro"}).`, "error", 6000);
                return false;
            }
            Platform.toast("Downloads indisponíveis nesta visualização. Use o pacote .zip do jogo no seu computador.", "error", 6500);
            return false;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        Platform.toast(`Download iniciado: ${filename}`, "ok");
        return true;
    }
};

function saveFile(filename, blob) {
    return Platform.saveFile(filename, blob);
}
