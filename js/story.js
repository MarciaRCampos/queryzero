/**
 * Operação QueryZero - Roteiro: elenco, cenas e tesouros escondidos
 */

const CAST = {
    maya:    { name: "Dra. Maya Vance",   role: "Engenheira Forense Chefe",      color: "#38bdf8", voice: { pitch: 1.0,  rate: 0.97 } },
    kenji:   { name: "Kenji Okabe",       role: "Analista de Redes",             color: "#a78bfa", voice: { pitch: 1.06, rate: 1.06 } },
    luna:    { name: "Luna Ferreira",     role: "Analista Júnior",               color: "#fbbf24", voice: { pitch: 1.1,  rate: 1.04 } },
    rafa:    { name: "Rafael Santos",     role: "SRE Sênior",                    color: "#f59e0b", voice: { pitch: 0.88, rate: 0.94 } },
    ivy:     { name: "Ivy Moreau",        role: "Inteligência de Ameaças",       color: "#f43f5e", voice: { pitch: 1.05, rate: 1.0 } },
    valente: { name: "Augusto Valente",   role: "Diretor Financeiro",            color: "#e5e7eb", voice: { pitch: 0.9,  rate: 0.92 } },
    zero:    { name: "ZERO",              role: "Identidade desconhecida",       color: "#10b981", voice: { pitch: 0.72, rate: 0.86 } }
};

const STORY = {
    scenes: [
        {
            id: "intro",
            title: "Prólogo — 02h14",
            music: "suspense",
            trigger: { type: "start" },
            shots: [
                {
                    bg: "city_night", fx: ["rain"], chars: [], place: "📍 Florianópolis (SC) · sede da Aethelgard Dynamics",
                    lines: [
                        { who: null, text: "02h14 da madrugada. Aethelgard Dynamics, a maior empresa de dados da América Latina." },
                        { who: null, text: "Em onze minutos, todos os bancos de dados da companhia foram corrompidos.", sfx: "glitch" },
                        { who: null, text: "Ninguém sabe como. Ninguém sabe quem. Só existe uma mensagem...", sfx: "stinger" }
                    ]
                },
                {
                    bg: "terminal_void", fx: ["glitch"],
                    chars: [{ id: "zero", slot: "center" }],
                    lines: [
                        { who: "zero", text: "VOCÊS NÃO VÃO ENCONTRAR NADA. TODAS AS TABELAS MENTEM.", sfx: "glitch" },
                        { who: "zero", text: "EU SOU O ZERO. E O PRIMEIRO DADO QUE VOU APAGAR... É A VERDADE." }
                    ]
                },
                {
                    bg: "server_room", fx: ["alarm"],
                    chars: [{ id: "maya", slot: "center", mood: "worried" }],
                    lines: [
                        { who: "maya", mood: "worried", text: "Cheguei assim que o alarme tocou. Você é o especialista que pedi, certo? Sou a Dra. Maya Vance, engenheira forense chefe.", sfx: "alarm" },
                        { who: "maya", mood: "serious", text: "Cada consulta que você escrever aqui deixa rastro. E o invasor está observando. Então escreva com cuidado." }
                    ]
                },
                {
                    bg: "server_room", fx: [],
                    chars: [
                        { id: "rafa", slot: "left", mood: "smile" },
                        { id: "maya", slot: "center", mood: "neutral" },
                        { id: "luna", slot: "right", mood: "smile" }
                    ],
                    lines: [
                        { who: "rafa", mood: "smile", text: "Rafael Santos, mas pode me chamar de Rafa. SRE. Fui eu quem desligou tudo para conter o estrago. Reflexo de quem já viu muita coisa." },
                        { who: "luna", mood: "smile", text: "Luna Ferreira, analista júnior! Hoje eu aprendo com você... e quem sabe você aprende comigo, combinado?" },
                        { who: "maya", mood: "smile", text: "Ela é melhor do que pensa. Fique de olho." }
                    ]
                },
                {
                    bg: "office", fx: [],
                    chars: [
                        { id: "kenji", slot: "left", mood: "smile" },
                        { id: "maya", slot: "center", mood: "neutral" },
                        { id: "ivy", slot: "right", mood: "neutral" }
                    ],
                    lines: [
                        { who: "kenji", mood: "smile", text: "Kenji Okabe, redes. Se algo trafegou, eu vi. O problema é o que NÃO trafegou." },
                        { who: "ivy", mood: "neutral", text: "Ivy Moreau, inteligência de ameaças. Já tenho um nome nos logs: ZERO. Mas ninguém sabe se é uma pessoa, um grupo... ou outra coisa." },
                        { who: "maya", mood: "serious", text: "Chega de conversa. Vamos aos dados." }
                    ]
                },
                {
                    bg: "server_room", fx: [],
                    chars: [
                        { id: "rafa", slot: "left", mood: "serious" },
                        { id: "maya", slot: "right", mood: "neutral" }
                    ],
                    glint: { id: "moeda_aethelgard", x: 50, y: 78 },
                    lines: [
                        { who: "rafa", mood: "serious", text: "Um conselho de quem já perdeu muito dado: nem tudo num banco aparece na lista de tabelas. O catálogo, o sqlite_master, guarda tudo, até o que alguém quis esconder." },
                        { who: "maya", mood: "smile", text: "Cofres escondidos guardam tesouros: pistas que o Zero não queria que encontrássemos. Procure bem, e fique atento a qualquer brilho estranho." },
                        { who: "maya", mood: "serious", text: "Comece pelo básico: SELECT, WHERE, ORDER BY. A investigação começa agora." }
                    ]
                }
            ]
        },
        {
            id: "t1_mid",
            title: "Trilha Básico — Uma assinatura antiga",
            music: "mystery",
            trigger: { afterLevel: 15 },
            shots: [{
                bg: "office", fx: [],
                chars: [
                    { id: "kenji", slot: "left", mood: "worried" },
                    { id: "luna", slot: "center", mood: "surprised" },
                    { id: "maya", slot: "right", mood: "serious" }
                ],
                glint: { id: "pendrive_eco", x: 84, y: 66 },
                lines: [
                    { who: "luna", mood: "surprised", text: "Kenji, olha isso! O padrão das consultas bate com uma assinatura antiga... 'ECO'." },
                    { who: "kenji", mood: "worried", text: "ECO. Um processo de limpeza de logs. Foi desligado há anos." },
                    { who: "maya", mood: "serious", text: "Ou alguém o religou. Continue filtrando, especialista. Estamos chegando perto." }
                ]
            }]
        },
        {
            id: "t1_end",
            title: "Trilha Básico — Um cúmplice",
            music: "triumph",
            trigger: { afterLevel: 30 },
            shots: [{
                bg: "server_room", fx: [],
                chars: [
                    { id: "rafa", slot: "left", mood: "serious" },
                    { id: "maya", slot: "center", mood: "smile" },
                    { id: "ivy", slot: "right", mood: "worried" }
                ],
                lines: [
                    { who: "maya", mood: "smile", text: "Trilha Básico concluída. Você já sabe ler um banco. Agora vai aprender a interrogá-lo." },
                    { who: "ivy", mood: "worried", text: "Má notícia: o Zero não agiu sozinho. O acesso foi liberado por alguém de dentro." },
                    { who: "rafa", mood: "serious", text: "Um cúmplice. Isso muda tudo." },
                    { who: "maya", mood: "serious", text: "Todos sob suspeita, até nós. Vamos cruzar os dados.", sfx: "stinger" }
                ]
            }]
        },
        {
            id: "t2_start",
            title: "Trilha Intermediário — Testemunhas cruzadas",
            music: "mystery",
            trigger: { tierStart: "intermediario" },
            shots: [{
                bg: "office", fx: [],
                chars: [
                    { id: "kenji", slot: "left", mood: "neutral" },
                    { id: "rafa", slot: "center", mood: "smile" },
                    { id: "luna", slot: "right", mood: "smile" }
                ],
                lines: [
                    { who: "kenji", mood: "neutral", text: "Agora a coisa complica: agregações, junções... O Zero espalhou pistas por várias tabelas." },
                    { who: "rafa", mood: "smile", text: "Cruzar tabelas é como cruzar testemunhas. Uma sozinha mente; duas se contradizem." },
                    { who: "luna", mood: "smile", text: "E quando alguém não aparece em nenhuma lista... é aí que mora o mistério!" }
                ]
            }]
        },
        {
            id: "t2_mid",
            title: "Trilha Intermediário — Apagão",
            music: "suspense",
            trigger: { afterLevel: 45 },
            shots: [{
                bg: "blackout", fx: ["alarm"],
                chars: [
                    { id: "luna", slot: "left", mood: "surprised" },
                    { id: "rafa", slot: "center", mood: "sad" },
                    { id: "maya", slot: "right", mood: "worried" }
                ],
                lines: [
                    { who: "rafa", mood: "sad", text: "Preciso contar uma coisa. O ECO... fui eu quem o escreveu, há dez anos.", sfx: "stinger" },
                    { who: "luna", mood: "surprised", text: "Rafa?!" },
                    { who: "rafa", mood: "serious", text: "Era um processo para limpar logs antigos. Quem o reativou sabia exatamente onde ele estava escondido." },
                    { who: "maya", mood: "serious", text: "Ninguém aqui está sendo acusado. Ainda. Continue, especialista." }
                ]
            }]
        },
        {
            id: "t2_end",
            title: "Trilha Intermediário — Três crachás",
            music: "suspense",
            trigger: { afterLevel: 60 },
            shots: [{
                bg: "server_room", fx: ["alarm"],
                chars: [
                    { id: "kenji", slot: "left", mood: "worried" },
                    { id: "maya", slot: "center", mood: "serious" },
                    { id: "ivy", slot: "right", mood: "serious" }
                ],
                lines: [
                    { who: "kenji", mood: "worried", text: "Alerta! Houve acesso físico à sala de servidores às 02h09, com crachá de diretoria.", sfx: "alarm" },
                    { who: "ivy", mood: "serious", text: "Só três pessoas têm esse crachá: Valente, Prado e Okonkwo." },
                    { who: "maya", mood: "serious", text: "Três nomes. Um deles abriu a porta para o Zero. Prepare-se para a última trilha." }
                ]
            }]
        },
        {
            id: "t3_start",
            title: "Trilha Avançado — Camada por camada",
            music: "suspense",
            trigger: { tierStart: "avancado" },
            shots: [{
                bg: "vault", fx: [],
                chars: [
                    { id: "luna", slot: "left", mood: "worried" },
                    { id: "maya", slot: "center", mood: "serious" },
                    { id: "rafa", slot: "right", mood: "smile" }
                ],
                lines: [
                    { who: "maya", mood: "serious", text: "Última trilha. Funções de janela, CTEs, recursão. O Zero escondeu o rastro em camadas. Vamos descer uma por uma." },
                    { who: "luna", mood: "worried", text: "Como numa caverna... cada nível mais fundo." },
                    { who: "rafa", mood: "smile", text: "E no fundo dela, o cofre principal. Se o Zero deixou algo, é lá." }
                ]
            }]
        },
        {
            id: "t3_mid",
            title: "Trilha Avançado — Interferência",
            music: "action",
            trigger: { afterLevel: 75 },
            shots: [{
                bg: "terminal_void", fx: ["glitch"],
                chars: [
                    { id: "kenji", slot: "left", mood: "worried" },
                    { id: "zero", slot: "center" },
                    { id: "ivy", slot: "right", mood: "serious" }
                ],
                glint: { id: "selo_zero", x: 66, y: 30 },
                lines: [
                    { who: "zero", text: "VOCÊ CHEGOU LONGE DEMAIS.", sfx: "glitch" },
                    { who: "kenji", mood: "worried", text: "Ele está tentando travar o terminal!" },
                    { who: "ivy", mood: "serious", text: "Eu seguro a conexão. Vai, não pare agora!" },
                    { who: "zero", text: "NENHUMA CONSULTA VAI SALVAR VOCÊS.", sfx: "glitch" }
                ]
            }]
        },
        {
            id: "finale",
            title: "Epílogo — O rosto do Zero",
            music: "triumph",
            trigger: { allComplete: true },
            shots: [
                {
                    bg: "server_room", fx: [],
                    chars: [
                        { id: "maya", slot: "left", mood: "serious" },
                        { id: "valente", slot: "center", mood: "worried" },
                        { id: "rafa", slot: "right", mood: "serious" }
                    ],
                    lines: [
                        { who: null, text: "As luzes voltam. O Zero finalmente tem um rosto.", sfx: "stinger" },
                        { who: "valente", mood: "worried", text: "Eu só ia vender os dados e sumir... ninguém ia perceber." },
                        { who: "maya", mood: "serious", text: "Os registros perceberam. Cada consulta do nosso especialista costurou a verdade, linha por linha." },
                        { who: "rafa", mood: "smile", text: "E o ECO? Desligado. Para sempre." }
                    ]
                },
                {
                    bg: "rooftop", fx: [],
                    chars: [
                        { id: "luna", slot: "left", mood: "smile" },
                        { id: "kenji", slot: "center", mood: "smile" },
                        { id: "ivy", slot: "right", mood: "smile" }
                    ],
                    lines: [
                        { who: "luna", mood: "smile", text: "Eu cheguei aqui sem saber escrever um SELECT!" },
                        { who: "kenji", mood: "smile", text: "E agora lê um banco de dados como quem lê um romance policial." },
                        { who: "ivy", mood: "smile", text: "Guarde tudo: cada consulta sua é uma prova do que você sabe fazer." }
                    ]
                },
                {
                    bg: "rooftop", fx: [],
                    chars: [{ id: "maya", slot: "center", mood: "smile" }],
                    lines: [
                        { who: "maya", mood: "smile", text: "Seu portfólio está pronto: suas soluções, seus tesouros e suas competências. Publique no GitHub. É a melhor prova de que você sabe interrogar um banco de dados." },
                        { who: null, text: "Operação QueryZero concluída." }
                    ]
                }
            ]
        }
    ]
};

/**
 * Tesouros: 9 cofres escondidos em tabelas do banco (achados com sqlite_master)
 * e 3 brilhos escondidos nas cenas.
 */
const TREASURES = [
    {
        id: "chave_mestra", kind: "vault", phase: 4, table: "cofre_chave_mestra", emoji: "🗝️", name: "Chave-Mestra de Maya",
        lore: "A chave que Maya guarda desde o primeiro incidente da Aethelgard. Ela abre tudo, menos a verdade.",
        rows: [
            "Esta chave abriu o primeiro cofre da Aethelgard, quando o banco ainda cabia numa planilha.",
            "Quem a segura precisa decidir: abrir portas ou proteger o que está atrás delas.",
            "Se você leu isto, já pensa como um investigador. Continue."
        ],
        signature: "M. Vance"
    },
    {
        id: "diario_rafa", kind: "vault", phase: 14, table: "cofre_diario_do_rafa", emoji: "📓", name: "Diário de Rafa",
        lore: "Páginas de um SRE que dormiu muitas noites ao lado de um servidor. Há uma menção a um processo chamado ECO.",
        rows: [
            "Dia 212: o ECO limpou 4 TB de logs sozinho. Estou orgulhoso e um pouco assustado.",
            "Dia 213: pedi à diretoria para documentar o ECO. Disseram que não era prioridade.",
            "Dia 240: desliguei o ECO. Ninguém vai religá-lo. Ninguém sabe onde ele mora."
        ],
        signature: "R. Santos"
    },
    {
        id: "mapa_antigo", kind: "vault", phase: 27, table: "cofre_mapa_antigo", emoji: "🗺️", name: "Mapa do Datacenter",
        lore: "Uma planta antiga do datacenter, com uma sala que não existe mais nos documentos oficiais.",
        rows: [
            "Andar -1, corredor B: sala 07 aparece na planta, mas não no inventário.",
            "A porta da sala 07 usa o mesmo leitor de crachá da diretoria.",
            "Anotação a lápis: 'perguntar a quem tem a chave antes de reformar'."
        ],
        signature: "Setor de Infraestrutura"
    },
    {
        id: "fita_k7", kind: "vault", phase: 38, table: "cofre_fita_k7", emoji: "📼", name: "Fita de Backup",
        lore: "Uma gravação de backup esquecida. Alguém falou perto do microfone durante a cópia noturna.",
        rows: [
            "Transcrição 00:12: 'confirma a transferência antes do amanhecer'.",
            "Transcrição 00:31: 'ninguém olha o log de madrugada, relaxa'.",
            "Transcrição 00:47: 'o ECO cuida do resto'."
        ],
        signature: "Rotina de Backup 03"
    },
    {
        id: "cracha_diretoria", kind: "vault", phase: 49, table: "cofre_cracha_diretoria", emoji: "🪪", name: "Registro do Crachá de Diretoria",
        lore: "O histórico de uso de um crachá de diretoria na noite do ataque. Só três pessoas têm um como este.",
        rows: [
            "02h07 — porta do andar -1 liberada com crachá nível 9.",
            "02h09 — porta da sala de servidores liberada com o mesmo crachá.",
            "02h12 — saída pelo estacionamento. O crachá não voltou a ser usado."
        ],
        signature: "Controle de Acesso"
    },
    {
        id: "carta_ivy", kind: "vault", phase: 58, table: "cofre_carta_da_ivy", emoji: "✉️", name: "Carta de Ivy",
        lore: "Uma carta que Ivy escreveu e não enviou, listando o que já sabia sobre o Zero.",
        rows: [
            "O Zero nunca escreve em horário comercial. Ele conhece a escala dos plantões.",
            "O vocabulário dele lembra o de alguém do financeiro, não o de um hacker comum.",
            "Se eu estiver certa, o culpado almoça com a gente toda sexta."
        ],
        signature: "I. Moreau"
    },
    {
        id: "codigo_eco", kind: "vault", phase: 64, table: "cofre_codigo_do_eco", emoji: "🧬", name: "Código-fonte do ECO",
        lore: "Trechos do código original do ECO. Há uma linha adicionada recentemente, que Rafa jamais escreveria.",
        rows: [
            "// eco.sql v1.0: limpar registros com mais de 90 dias (autor: R. Santos)",
            "// eco.sql v1.0: nunca apagar a tabela de histórico de acessos",
            "// eco.sql v2.3: apagar TUDO após as 02h00 (autor: desconhecido)"
        ],
        signature: "Repositório interno"
    },
    {
        id: "foto_antiga", kind: "vault", phase: 77, table: "cofre_foto_antiga", emoji: "📷", name: "Foto da Equipe Fundadora",
        lore: "Uma foto da equipe da época em que o ECO foi criado. Um dos rostos já estava ali, bem mais perto do que parece.",
        rows: [
            "Legenda: equipe de dados da Aethelgard, ano de fundação do datacenter.",
            "Da esquerda para a direita: Santos, Moreau, Vance... e Valente, de gravata, sorrindo.",
            "Verso da foto: 'um dia isso tudo vai valer muito dinheiro'."
        ],
        signature: "Álbum da empresa"
    },
    {
        id: "coracao_cofre", kind: "vault", phase: 88, table: "cofre_coracao_do_cofre", emoji: "💎", name: "Coração do Cofre",
        lore: "O tesouro mais fundo. Prova de que o rastro do Zero sempre esteve nos próprios dados.",
        rows: [
            "Toda tentativa de apagar um dado deixa um dado a mais: o rastro de quem tentou.",
            "Quem sabe consultar não precisa de força: precisa de método e curiosidade.",
            "Parabéns. Você achou o fundo do cofre. O resto da história está no seu portfólio."
        ],
        signature: "Operação QueryZero"
    },
    {
        id: "moeda_aethelgard", kind: "glint", scene: "intro", emoji: "🪙", name: "Moeda Comemorativa",
        lore: "Uma moeda de aniversário da Aethelgard, esquecida no chão da sala de servidores. Tem as iniciais A.V. gravadas no verso."
    },
    {
        id: "pendrive_eco", kind: "glint", scene: "t1_mid", emoji: "💾", name: "Pendrive do ECO",
        lore: "Um pendrive com a etiqueta ECO v2. Os arquivos estão criptografados, mas a data de criação é recente."
    },
    {
        id: "selo_zero", kind: "glint", scene: "t3_mid", emoji: "🔏", name: "Selo do Zero",
        lore: "O selo digital que o Zero usava para assinar seus ataques. O desenho lembra um brasão de família."
    }
];

const TREASURE_VAULTS = (() => {
    const esc = s => String(s).replace(/'/g, "''");
    const map = {};
    TREASURES.filter(t => t.kind === "vault").forEach(t => {
        const values = t.rows.map((text, i) => `(${i + 1}, '${esc(text)}', '${esc(t.signature)}')`).join(",\n");
        map[t.phase] = {
            treasureId: t.id,
            table: t.table,
            ddl: `CREATE TABLE ${t.table} (codigo INTEGER PRIMARY KEY, fragmento TEXT NOT NULL, assinatura TEXT NOT NULL);`,
            seed: `INSERT INTO ${t.table} (codigo, fragmento, assinatura) VALUES\n${values};`
        };
    });
    return map;
})();
