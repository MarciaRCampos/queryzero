/**
 * Operação QueryZero - Tesouros escondidos (cofres no banco e brilhos nas cenas)
 */

const Treasures = (() => {
    let popupTimer = null;

    const sceneTitle = id => {
        const s = STORY.scenes.find(x => x.id === id);
        return s ? s.title : "uma cena";
    };

    function foundCount() {
        return Save.get().treasures.length;
    }

    function updateHud() {
        const el = document.getElementById("treasure-count");
        if (el) el.textContent = `${foundCount()}/${TREASURES.length}`;
    }

    function hidePopup() {
        const host = document.getElementById("treasure-popup");
        if (host) host.classList.remove("show");
        clearTimeout(popupTimer);
    }

    function showPopup(t) {
        const host = document.getElementById("treasure-popup");
        if (!host) return;
        host.innerHTML = `
            <div class="tp-emoji">${t.emoji}</div>
            <div class="tp-body">
                <div class="tp-kicker">TESOURO ENCONTRADO · ${foundCount()}/${TREASURES.length}</div>
                <div class="tp-name">${t.name}</div>
                <p class="tp-lore">${t.lore}</p>
                <div class="tp-actions">
                    <button type="button" class="btn btn-gold" onclick="Treasures.openCollection()">Ver coleção</button>
                    <button type="button" class="btn btn-secondary" onclick="Treasures.hidePopup()">Fechar</button>
                </div>
            </div>`;
        host.classList.add("show");
        clearTimeout(popupTimer);
        popupTimer = setTimeout(hidePopup, 9000);
    }

    function claim(id) {
        if (Save.hasTreasure(id)) return false;
        const t = TREASURES.find(x => x.id === id);
        if (!t) return false;
        Save.addTreasure(id);
        GameAudio.sfx("treasure");
        showPopup(t);
        updateHud();
        renderCollection();
        setRadar(typeof LEVELS !== "undefined" ? LEVELS[currentLevelIndex] : null);
        return true;
    }

    function renderCollection() {
        const grid = document.getElementById("treasure-grid");
        if (!grid) return;
        grid.innerHTML = TREASURES.map(t => {
            if (Save.hasTreasure(t.id)) {
                const where = t.kind === "vault" ? `Cofre da fase ${t.phase} · tabela <code>${t.table}</code>` : `Brilho na cena: ${sceneTitle(t.scene)}`;
                return `<div class="treasure-card found">
                    <div class="tc-emoji">${t.emoji}</div>
                    <div class="tc-name">${t.name}</div>
                    <p class="tc-lore">${t.lore}</p>
                    <div class="tc-where">${where}</div></div>`;
            }
            const hint = t.kind === "vault"
                ? `Escondido no banco da fase ${t.phase}. O catálogo do banco sabe onde procurar.`
                : `Brilha em uma cena: ${sceneTitle(t.scene)}. Fique atento.`;
            return `<div class="treasure-card locked">
                <div class="tc-emoji">🔒</div>
                <div class="tc-name">???</div>
                <p class="tc-lore">${hint}</p></div>`;
        }).join("");
        const sum = document.getElementById("treasure-summary");
        if (sum) sum.textContent = `${foundCount()} de ${TREASURES.length} tesouros encontrados`;
    }

    function openCollection() {
        hidePopup();
        renderCollection();
        document.getElementById("treasure-modal").style.display = "flex";
    }

    function closeCollection() {
        document.getElementById("treasure-modal").style.display = "none";
    }

    function setRadar(level) {
        const el = document.getElementById("vault-radar");
        if (!el) return;
        const vault = level ? TREASURE_VAULTS[level.id] : null;
        if (!vault) {
            el.hidden = true;
            return;
        }
        el.hidden = false;
        const t = TREASURES.find(x => x.id === vault.treasureId);
        if (Save.hasTreasure(vault.treasureId)) {
            el.className = "vault-radar opened";
            el.innerHTML = `✓ Cofre aberto neste banco: <b>${t.name}</b>`;
        } else {
            el.className = "vault-radar";
            el.innerHTML = `📡 <b>Sinal anômalo detectado neste banco.</b> Nem tudo está na lista de tabelas acima. Quem sabe perguntar ao catálogo do banco acha o que está escondido.`;
        }
    }

    function checkVaultAttempt(level, input, userResult) {
        const vault = TREASURE_VAULTS[level.id];
        if (!vault || !userResult || !userResult.values.length) return;
        if (!userResult.columns.includes("fragmento")) return;
        if (!new RegExp("\\b" + vault.table + "\\b", "i").test(input)) return;
        claim(vault.treasureId);
    }

    return { claim, updateHud, openCollection, closeCollection, hidePopup, setRadar, checkVaultAttempt, renderCollection };
})();
