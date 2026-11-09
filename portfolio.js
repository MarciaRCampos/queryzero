/**
 * Operação QueryZero - Gerador de portfólio para o GitHub
 * Empacota README.md, uma página index.html e as soluções .sql de cada fase concluída.
 */

const Portfolio = (() => {
    const TIERS = ["basico", "intermediario", "avancado"];
    const FOLDER = { basico: "01-basico", intermediario: "02-intermediario", avancado: "03-avancado" };
    const FOCUS = {
        basico: "SELECT, WHERE, LIKE, IN, BETWEEN, ORDER BY, LIMIT",
        intermediario: "Agregações, GROUP BY, HAVING, JOINs e subconsultas",
        avancado: "Window Functions, CTEs e CTEs recursivas"
    };

    const pad = n => String(n).padStart(2, "0");
    const slug = s => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
        .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "item";
    const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    const shortTitle = l => l.title.replace(/^Nível \d+:\s*/, "");

    function dedent(text) {
        const lines = String(text).replace(/\r/g, "").split("\n");
        while (lines.length && !lines[0].trim()) lines.shift();
        while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
        const indents = lines.filter(l => l.trim()).map(l => l.match(/^\s*/)[0].length);
        const min = indents.length ? Math.min(...indents) : 0;
        return lines.map(l => l.slice(min).replace(/\s+$/, "")).join("\n");
    }

    function wrapComment(text, width = 88) {
        const words = String(text).split(/\s+/);
        const out = [];
        let line = "";
        words.forEach(w => {
            if ((line + " " + w).trim().length > width) {
                out.push(line);
                line = w;
            } else {
                line = (line + " " + w).trim();
            }
        });
        if (line) out.push(line);
        return out.map(l => "-- " + l).join("\n");
    }

    function sqlFile(level, solution) {
        const sol = solution.trim().replace(/;?\s*$/, ";");
        return [
            "-- " + "=".repeat(70),
            `-- Operação QueryZero · Fase ${pad(level.id)} de ${LEVELS.length}`,
            `-- Título: ${shortTitle(level)}`,
            `-- Trilha: ${TIER_LABELS[level.tier]} · Competência: ${level.certModule}`,
            "-- " + "-".repeat(70),
            "-- Objetivo:",
            wrapComment(level.objective),
            "-- " + "=".repeat(70),
            "",
            "-- 1) Esquema e dados da fase (SQLite)",
            dedent(level.schemaDDL),
            "",
            dedent(level.seedData),
            "",
            "-- 2) Minha solução",
            sol,
            ""
        ].join("\n");
    }

    function collect() {
        const done = LEVELS.filter(l => Save.isCompleted(l.id) && Save.solutionFor(l.id));
        const skills = new Map();
        LEVELS.forEach(l => {
            if (!skills.has(l.certModule)) skills.set(l.certModule, { tier: l.tier, total: 0, done: 0 });
            const s = skills.get(l.certModule);
            s.total++;
            if (done.includes(l)) s.done++;
        });
        const treasures = TREASURES.filter(t => Save.hasTreasure(t.id));
        return { done, skills, treasures };
    }

    function fileName(l) {
        return `solucoes/${FOLDER[l.tier]}/${pad(l.id)}-${slug(shortTitle(l))}.sql`;
    }

    function readme(name, date, info) {
        const { done, skills, treasures } = info;
        const total = LEVELS.length;
        const badge = (label, value, color) => `![${label}](https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(value).replace(/-/g, "--")}-${color}?style=flat-square)`;
        const tierRows = TIERS.map(t => {
            const all = LEVELS.filter(l => l.tier === t).length;
            const d = done.filter(l => l.tier === t).length;
            return `| ${TIER_LABELS[t]} | ${d}/${all} | ${FOCUS[t]} |`;
        }).join("\n");

        const skillBlocks = TIERS.map(t => {
            const items = [...skills.entries()].filter(([, s]) => s.tier === t).map(([n, s]) =>
                `- ${s.done === s.total ? "✅" : s.done ? "🟡" : "⬜"} **${n}** — ${s.done}/${s.total} fases`).join("\n");
            return `### ${TIER_LABELS[t]}\n\n${items}`;
        }).join("\n\n");

        const treasureList = treasures.length
            ? treasures.map(t => `- ${t.emoji} **${t.name}** — ${t.lore}`).join("\n")
            : "_Nenhum tesouro encontrado ainda. Dica: nem tudo num banco aparece na lista de tabelas._";

        const solutionTables = TIERS.map(t => {
            const rows = done.filter(l => l.tier === t).map(l =>
                `| ${pad(l.id)} | ${shortTitle(l).replace(/\|/g, "/")} | ${l.certModule.replace(/\|/g, "/")} | [\`${fileName(l).split("/").pop()}\`](${fileName(l)}) |`).join("\n");
            return `### ${TIER_LABELS[t]}\n\n` + (rows
                ? `| # | Fase | Competência | Solução |\n|---|---|---|---|\n${rows}`
                : "_Nenhuma fase concluída nesta trilha ainda._");
        }).join("\n\n");

        const example = done.length ? fileName(done[0]) : "solucoes/01-basico/01-exemplo.sql";

        return `# 🛡️ Portfólio SQL — ${name}

> Evidências do meu treinamento prático em SQL na **Operação QueryZero**, um jogo forense com ${total} fases em SQLite.
> Atualizado em ${date}.

${badge("fases", `${done.length}/${total}`, "38bdf8")} ${badge("tesouros", `${treasures.length}/${TREASURES.length}`, "fbbf24")} ${badge("SQL", "SQLite", "003B57")}

## Resumo

| Trilha | Fases concluídas | Foco |
|---|---|---|
${tierRows}

## Competências demonstradas

${skillBlocks}

## Tesouros encontrados (${treasures.length}/${TREASURES.length})

${treasureList}

## Soluções

Cada arquivo \`.sql\` traz o esquema, os dados da fase e a consulta que eu escrevi para resolvê-la.

${solutionTables}

## Como executar uma solução

Com o [SQLite](https://www.sqlite.org/download.html) instalado:

\`\`\`bash
sqlite3 :memory: ".read ${example}"
\`\`\`

## Sobre

Gerado automaticamente pela Operação QueryZero. A página \`index.html\` deste repositório mostra o mesmo conteúdo e pode ser publicada no GitHub Pages.
`;
    }

    function indexHtml(name, date, info) {
        const { done, skills, treasures } = info;
        const total = LEVELS.length;
        const pct = (a, b) => Math.round((a / b) * 100);
        const tierCards = TIERS.map(t => {
            const all = LEVELS.filter(l => l.tier === t).length;
            const d = done.filter(l => l.tier === t).length;
            return `<div class="card tier-${t}"><div class="k">${TIER_LABELS[t]}</div><div class="v">${d}<small>/${all}</small></div>
                <div class="bar"><i style="width:${pct(d, all)}%"></i></div><p>${esc(FOCUS[t])}</p></div>`;
        }).join("");
        const skillChips = [...skills.entries()].map(([n, s]) =>
            `<span class="chip ${s.done === s.total ? "full" : s.done ? "part" : ""} t-${s.tier}">${esc(n)} <b>${s.done}/${s.total}</b></span>`).join("");
        const treasureHtml = treasures.length
            ? treasures.map(t => `<li><span>${t.emoji}</span><div><b>${esc(t.name)}</b><p>${esc(t.lore)}</p></div></li>`).join("")
            : `<li><div><p>Nenhum tesouro encontrado ainda.</p></div></li>`;
        const solutions = TIERS.map(t => {
            const items = done.filter(l => l.tier === t).map(l =>
                `<details><summary><b>${pad(l.id)}</b> ${esc(shortTitle(l))} <em>${esc(l.certModule)}</em></summary>
                <pre><code>${esc(Save.solutionFor(l.id).trim().replace(/;?\s*$/, ";"))}</code></pre></details>`).join("");
            return `<h3 class="t-${t}">${TIER_LABELS[t]}</h3>${items || "<p class=\"muted\">Nenhuma fase concluída nesta trilha ainda.</p>"}`;
        }).join("");

        return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Portfólio SQL — ${esc(name)}</title>
<style>
:root{--bg:#070a13;--panel:#111827;--line:#243046;--text:#e2e8f0;--mut:#94a3b8;--cy:#38bdf8;--am:#f59e0b;--ro:#f43f5e;--go:#fbbf24}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:15px/1.6 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
main{max-width:980px;margin:0 auto;padding:40px 20px 80px}
header{border-bottom:1px solid var(--line);padding-bottom:24px;margin-bottom:28px}
.kicker{color:var(--cy);letter-spacing:2px;font-size:12px}h1{margin:6px 0 4px;font-size:clamp(26px,5vw,40px);color:#fff}
.sub{color:var(--mut);margin:0}h2{margin:36px 0 12px;font-size:14px;letter-spacing:2px;color:var(--go)}
h3{margin:22px 0 8px;font-size:13px;letter-spacing:1.5px}.t-basico{color:var(--cy)}.t-intermediario{color:var(--am)}.t-avancado{color:var(--ro)}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}
.card{background:var(--panel);border:1px solid var(--line);border-left:3px solid var(--line);border-radius:4px;padding:14px}
.card.tier-basico{border-left-color:var(--cy)}.card.tier-intermediario{border-left-color:var(--am)}.card.tier-avancado{border-left-color:var(--ro)}
.card .k{font-size:11px;letter-spacing:1.5px;color:var(--mut)}.card .v{font-size:30px;font-weight:700;color:#fff}.card .v small{font-size:14px;color:var(--mut)}
.card p{margin:8px 0 0;font-size:12px;color:var(--mut)}.bar{height:6px;background:#1a2234;border-radius:3px;overflow:hidden;margin-top:6px}.bar i{display:block;height:100%;background:var(--cy)}
.tier-intermediario .bar i{background:var(--am)}.tier-avancado .bar i{background:var(--ro)}
.chips{display:flex;flex-wrap:wrap;gap:8px}.chip{font-size:12px;border:1px solid var(--line);border-radius:3px;padding:4px 9px;color:var(--mut)}
.chip.full{color:#fff;border-color:#10b981;background:rgba(16,185,129,.1)}.chip.part{border-color:var(--go)}
ul.tr{list-style:none;padding:0;margin:0;display:grid;gap:10px}ul.tr li{display:flex;gap:12px;background:var(--panel);border:1px solid var(--line);border-radius:4px;padding:12px}
ul.tr span{font-size:26px}ul.tr p{margin:2px 0 0;color:var(--mut);font-size:13px}
details{background:var(--panel);border:1px solid var(--line);border-radius:4px;margin:6px 0}summary{cursor:pointer;padding:10px 12px;font-size:13px}
summary em{color:var(--mut);font-style:normal;margin-left:8px;font-size:12px}details pre{margin:0;padding:12px;border-top:1px solid var(--line);overflow-x:auto;color:var(--cy);font-size:13px}
.muted{color:var(--mut)}footer{margin-top:48px;color:var(--mut);font-size:12px;border-top:1px solid var(--line);padding-top:16px}
</style></head><body><main>
<header><div class="kicker">[ OPERAÇÃO QUERYZERO · PORTFÓLIO ]</div><h1>${esc(name)}</h1>
<p class="sub">${done.length} de ${total} fases de SQL resolvidas · ${treasures.length} de ${TREASURES.length} tesouros · atualizado em ${date}</p></header>
<h2>PROGRESSO POR TRILHA</h2><div class="grid">${tierCards}</div>
<h2>COMPETÊNCIAS</h2><div class="chips">${skillChips}</div>
<h2>TESOUROS ENCONTRADOS</h2><ul class="tr">${treasureHtml}</ul>
<h2>MINHAS SOLUÇÕES</h2>${solutions}
<footer>Gerado pela Operação QueryZero. Cada solução é a consulta SQL aprovada no jogo (SQLite).</footer>
</main></body></html>`;
    }

    function build(name) {
        const date = new Date().toISOString().slice(0, 10);
        const info = collect();
        const files = info.done.map(l => ({ path: fileName(l), content: sqlFile(l, Save.solutionFor(l.id)) }));
        files.unshift({ path: "index.html", content: indexHtml(name, date, info) });
        files.unshift({ path: "README.md", content: readme(name, date, info) });
        return { files, info, date };
    }

    function currentName() {
        const input = document.getElementById("portfolio-name");
        const name = (input ? input.value : "").trim();
        if (!name) {
            Platform.toast("Digite seu nome para gerar o portfólio.", "error");
            if (input) input.focus();
            return null;
        }
        try { localStorage.setItem(PLAYER_NAME_STORAGE_KEY, name); } catch (e) { /* sem armazenamento */ }
        const top = document.getElementById("player-name-field");
        if (top) top.value = name;
        return name;
    }

    function render() {
        const host = document.getElementById("portfolio-body");
        if (!host) return;
        const info = collect();
        const total = LEVELS.length;
        const complete = info.done.length === total;
        const nameField = document.getElementById("player-name-field");
        const rows = TIERS.map(t => {
            const all = LEVELS.filter(l => l.tier === t).length;
            const d = info.done.filter(l => l.tier === t).length;
            return `<div class="pf-row tier-${t}"><span>${TIER_LABELS[t]}</span><div class="pf-bar"><i style="width:${Math.round(d / all * 100)}%"></i></div><b>${d}/${all}</b></div>`;
        }).join("");
        host.innerHTML = `
            <p class="modal-desc">${complete
                ? "Missão cumprida! Seu portfólio está completo e pronto para o GitHub."
                : "Seu portfólio é montado com as consultas que você já resolveu. Pode gerar uma prévia agora e atualizar quando terminar."}</p>
            <div class="pf-rows">${rows}</div>
            <div class="pf-meta">💎 ${info.treasures.length}/${TREASURES.length} tesouros · ${info.done.length} soluções registradas</div>
            <div class="form-group">
                <label for="portfolio-name">SEU NOME NO PORTFÓLIO:</label>
                <input type="text" id="portfolio-name" placeholder="Ex: Ana Souza" value="${esc(nameField ? nameField.value.trim() : "")}">
            </div>
            <div class="pf-actions">
                <button class="btn btn-primary" ${info.done.length ? "" : "disabled"} onclick="Portfolio.downloadZip()">⬇ BAIXAR PACOTE PARA O GITHUB (.zip)</button>
                <button class="btn btn-secondary" ${info.done.length ? "" : "disabled"} onclick="Portfolio.copyReadme()">COPIAR README.md</button>
                <button class="btn btn-secondary" ${info.done.length ? "" : "disabled"} onclick="Portfolio.downloadIndex()">BAIXAR index.html</button>
            </div>
            ${info.done.length ? "" : '<p class="pf-warn">Resolva ao menos uma fase para liberar o pacote.</p>'}
            <details class="pf-how"><summary>Como publicar no GitHub</summary>
                <ol>
                    <li>Extraia o .zip numa pasta (ela terá <code>README.md</code>, <code>index.html</code> e a pasta <code>solucoes/</code>).</li>
                    <li>Crie um repositório vazio no GitHub, por exemplo <code>portfolio-sql</code>.</li>
                    <li>No terminal, dentro da pasta extraída:
<pre>git init
git add .
git commit -m "feat: meu portfólio SQL (Operação QueryZero)"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/portfolio-sql.git
git push -u origin main</pre></li>
                    <li>Opcional: em <b>Settings → Pages</b>, escolha a branch <code>main</code> e a raiz. Seu portfólio vira um site em <code>https://SEU-USUARIO.github.io/portfolio-sql/</code>.</li>
                    <li>Fixe o repositório no seu perfil e cite o link no LinkedIn e no currículo.</li>
                </ol></details>`;
    }

    function open() {
        render();
        document.getElementById("portfolio-modal").style.display = "flex";
    }

    function close() {
        document.getElementById("portfolio-modal").style.display = "none";
    }

    async function downloadZip() {
        const name = currentName();
        if (!name) return;
        if (typeof JSZip === "undefined") {
            Platform.toast("A biblioteca de compactação não carregou. Verifique a conexão e recarregue.", "error", 6000);
            return;
        }
        const pack = build(name);
        const zip = new JSZip();
        pack.files.forEach(f => zip.file(f.path, f.content));
        const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
        await saveFile(`portfolio-sql-${slug(name)}.zip`, blob);
    }

    async function downloadIndex() {
        const name = currentName();
        if (!name) return;
        const pack = build(name);
        const file = pack.files.find(f => f.path === "index.html");
        await saveFile("index.html", new Blob([file.content], { type: "text/html" }));
    }

    async function copyReadme() {
        const name = currentName();
        if (!name) return;
        const text = build(name).files.find(f => f.path === "README.md").content;
        try {
            await navigator.clipboard.writeText(text);
            Platform.toast("README.md copiado para a área de transferência.", "ok");
        } catch (e) {
            const ta = document.createElement("textarea");
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            let ok = false;
            try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
            ta.remove();
            Platform.toast(ok ? "README.md copiado." : "Não foi possível copiar aqui. Use o pacote .zip.", ok ? "ok" : "error");
        }
    }

    return { open, close, build, render, downloadZip, downloadIndex, copyReadme };
})();
