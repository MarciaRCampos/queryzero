# Operação QueryZero

Curso-jogo de SQL da **Kora EduTech**, do básico ao avançado. São 90 fases em 3 trilhas e um thriller forense na Aethelgard Dynamics, empresa fictícia com sede em Florianópolis (SC). O SQLite roda no próprio navegador.

## O que tem no jogo

- **90 fases** em 3 trilhas (Básico, Intermediário e Avançado) e 18 capítulos de 5 fases.
- **Cadeados**: a próxima fase abre quando a anterior é concluída.
- **Prova rápida** no início de cada capítulo: quem resolve o desafio final pula as outras 4 fases.
- **História** com cenas animadas, vozes dubladas, música, 12 tesouros escondidos e personagens diversos.
- **Medalhas, pontos, combo, sequência de dias, modo relâmpago** e desafio entre amigos.
- **3 projetos de portfólio** (Rastro do invasor, Painel de e-commerce e Mapa da rede), com 6 entregas cada. Cada projeto gera um repositório pronto para o GitHub.
- **Entrevista de promoção** no final: 6 perguntas de 3 opções, com retorno.
- **Certificado padrão Kora** em 4 níveis (Básico, Intermediário, Avançado e Portfólio completo): imagem 1080 × 1350, PDF, QR code e botão do LinkedIn.
- Funciona no computador e no celular. Tem botão Voltar em todas as telas, e a tecla Esc também volta.

## Arquivos

| Caminho | Para que serve |
|---|---|
| `index.html` | **Arquivo único** (CSS, JS, logo e vozes embutidos). É o que vai para o site e para o GitHub Pages. |
| `dev.html` | Versão de desenvolvimento, que carrega `js/`, `css/` e `audio/` separados. |
| `js/`, `css/` | Código-fonte. |
| `audio/vozes/` | 49 falas dubladas em MP3, mais o `manifest.json`. |
| `tools/build.py` | Gera o `index.html` a partir dos fontes. |

## Como gerar o arquivo único

```bash
python3 tools/build.py
```

## Teste local

```bash
python3 -m http.server 8000
```

Abra `http://localhost:8000/` (arquivo único) ou `http://localhost:8000/dev.html` (fontes separados).

## Integração com o site Kora EduTech

- **Trilha Avançado (fases 61 a 90)**: é paga. O jogo lê `window.__MESTRES_GRIOTS__.completo`; se o objeto não existir, tudo fica liberado.
- **Nome no certificado**: vem de `window.__MESTRES_GRIOTS__.nome`.
- **Ranking**: o jogo envia `postMessage` com `{ origem: "kora-edutech", jogo: "operacao-queryzero", tipo: "pontuacao", pontos, fases, nome }`.
- **Progresso**: fica salvo no navegador, na chave `mg_queryzero_v1`.

---
Curso livre de formação prática · Kora EduTech
