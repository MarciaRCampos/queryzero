/**
 * Operação QueryZero - Projetos de portfólio (3 projetos, 6 entregas cada)
 * Cada entrega é validada pelo mesmo motor das fases.
 * Entregas 1-2 pedem a trilha Básico; 3-4 a Intermediário; 5-6 a Avançado.
 * Todos os dados são fictícios.
 */

const PROJECTS = [
{
    id: "rastro",
    emoji: "🕵️",
    name: "Rastro do invasor",
    repo: "rastro-do-invasor-sql",
    client: "Ivy Moreau · Inteligência de Ameaças",
    pitch: "Auditar os logins da Aethelgard em Florianópolis e montar o relatório que mostra por onde o invasor entrou.",
    why: "Toda empresa guarda registros de acesso. Saber ler esses registros é o que separa um palpite de uma prova, e é tarefa diária de quem trabalha com dados e segurança.",
    skills: ["Filtros e intervalos de data", "JOIN e HAVING", "LAG para comparar acessos", "RANK por departamento"],
    schemaDDL: `
        CREATE TABLE usuarios (
            usuario_id INTEGER PRIMARY KEY,
            nome TEXT NOT NULL,
            departamento TEXT NOT NULL
        );
        CREATE TABLE logins (
            login_id INTEGER PRIMARY KEY,
            usuario_id INTEGER NOT NULL,
            ip TEXT NOT NULL,
            cidade TEXT NOT NULL,
            sucesso INTEGER NOT NULL,
            data_hora TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO usuarios VALUES
        (1, 'Aline Nascimento', 'Financeiro'),
        (2, 'Bruno Tavares', 'Engenharia'),
        (3, 'Camila Yamamoto', 'Engenharia'),
        (4, 'Davi Okoye', 'Financeiro'),
        (5, 'Elisa Brandão', 'RH'),
        (6, 'Fábio Guarani', 'RH'),
        (7, 'Graça Monteiro', 'Diretoria');
        INSERT INTO logins VALUES
        (1, 1, '10.0.0.11', 'Florianópolis', 1, '2026-03-13 08:02'),
        (2, 2, '10.0.0.12', 'Florianópolis', 1, '2026-03-13 08:15'),
        (3, 3, '10.0.0.13', 'São José', 1, '2026-03-13 09:01'),
        (4, 4, '10.0.0.14', 'Florianópolis', 0, '2026-03-13 09:20'),
        (5, 4, '10.0.0.14', 'Florianópolis', 1, '2026-03-13 09:22'),
        (6, 7, '10.0.0.17', 'Florianópolis', 1, '2026-03-13 10:05'),
        (7, 5, '10.0.0.15', 'Palhoça', 1, '2026-03-13 13:40'),
        (8, 7, '185.22.9.4', 'Desconhecida', 0, '2026-03-14 01:51'),
        (9, 7, '185.22.9.4', 'Desconhecida', 0, '2026-03-14 01:53'),
        (10, 7, '185.22.9.4', 'Desconhecida', 0, '2026-03-14 01:56'),
        (11, 7, '185.22.9.4', 'Desconhecida', 1, '2026-03-14 02:01'),
        (12, 2, '185.22.9.4', 'Desconhecida', 0, '2026-03-14 02:05'),
        (13, 2, '185.22.9.4', 'Desconhecida', 0, '2026-03-14 02:06'),
        (14, 2, '185.22.9.4', 'Desconhecida', 0, '2026-03-14 02:08'),
        (15, 6, '45.77.1.20', 'Desconhecida', 0, '2026-03-14 03:30'),
        (16, 6, '45.77.1.20', 'Desconhecida', 0, '2026-03-14 03:31'),
        (17, 1, '10.0.0.11', 'Florianópolis', 1, '2026-03-14 08:00'),
        (18, 3, '10.0.0.31', 'Florianópolis', 1, '2026-03-14 08:40'),
        (19, 2, '10.0.0.12', 'Florianópolis', 1, '2026-03-14 09:10'),
        (20, 4, '10.0.0.14', 'Florianópolis', 0, '2026-03-14 09:12'),
        (21, 4, '10.0.0.14', 'Florianópolis', 0, '2026-03-14 09:13'),
        (22, 4, '10.0.0.14', 'Florianópolis', 1, '2026-03-14 09:15'),
        (23, 6, '45.77.1.20', 'Desconhecida', 0, '2026-03-14 11:02'),
        (24, 7, '185.22.9.4', 'Desconhecida', 0, '2026-03-14 02:10');
    `,
    tasks: [
        {
            tier: "basico",
            file: "01_logins_com_falha.sql",
            title: "Logins que falharam",
            from: "Ivy",
            briefing: "Antes de qualquer teoria, quero ver todas as tentativas de login que falharam. É o primeiro filtro de toda auditoria.",
            objective: "Da tabela 'logins', projete 'login_id', 'usuario_id', 'ip' e 'data_hora' apenas onde 'sucesso' = 0. Ordene por 'data_hora' crescente.",
            expectedQuery: `SELECT login_id, usuario_id, ip, data_hora FROM logins WHERE sucesso = 0 ORDER BY data_hora ASC;`,
            hint: "WHERE sucesso = 0 e ORDER BY data_hora ASC. Datas no formato 'AAAA-MM-DD HH:MM' ordenam certo como texto."
        },
        {
            tier: "basico",
            file: "02_madrugada_do_ataque.sql",
            title: "A madrugada do ataque",
            from: "Ivy",
            briefing: "O alarme tocou às 02h14 do dia 14. Preciso de todos os acessos entre meia-noite e 05h59 daquele dia, de qualquer cidade.",
            objective: "Da tabela 'logins', projete 'login_id', 'usuario_id', 'cidade' e 'data_hora' onde 'data_hora' esteja entre '2026-03-14 00:00' e '2026-03-14 05:59' (use BETWEEN). Ordene por 'data_hora' crescente.",
            expectedQuery: `SELECT login_id, usuario_id, cidade, data_hora FROM logins WHERE data_hora BETWEEN '2026-03-14 00:00' AND '2026-03-14 05:59' ORDER BY data_hora ASC;`,
            hint: "BETWEEN funciona com texto quando o formato da data é fixo: WHERE data_hora BETWEEN '2026-03-14 00:00' AND '2026-03-14 05:59'."
        },
        {
            tier: "intermediario",
            file: "03_usuarios_com_muitas_falhas.sql",
            title: "Quem errou a senha demais",
            from: "Ivy",
            briefing: "Agora quero nomes. Quem acumulou 3 ou mais falhas de login? Cruze com a tabela de usuários.",
            objective: "Faça INNER JOIN entre 'usuarios' e 'logins' por 'usuario_id', considere só 'sucesso' = 0, agrupe por usuário e projete 'nome' e COUNT(*) AS 'falhas', mantendo apenas quem tem 3 ou mais falhas (HAVING). Ordene por 'falhas' decrescente e, no empate, por 'nome' crescente.",
            expectedQuery: `SELECT u.nome, COUNT(*) AS falhas FROM usuarios u INNER JOIN logins l ON l.usuario_id = u.usuario_id WHERE l.sucesso = 0 GROUP BY u.usuario_id, u.nome HAVING COUNT(*) >= 3 ORDER BY falhas DESC, u.nome ASC;`,
            hint: "WHERE filtra as linhas antes de agrupar (sucesso = 0); HAVING filtra os grupos depois (COUNT(*) >= 3)."
        },
        {
            tier: "intermediario",
            file: "04_nunca_entraram.sql",
            title: "Contas que nunca entraram",
            from: "Rafa",
            briefing: "Conta que só tem tentativa falha e nenhum login bem-sucedido é suspeita: ou alguém está forçando a entrada, ou a conta foi esquecida.",
            objective: "Projete 'nome' e 'departamento' dos usuários que NÃO aparecem em nenhum login com 'sucesso' = 1 (use NOT IN com subconsulta). Ordene por 'nome' crescente.",
            expectedQuery: `SELECT nome, departamento FROM usuarios WHERE usuario_id NOT IN (SELECT usuario_id FROM logins WHERE sucesso = 1) ORDER BY nome ASC;`,
            hint: "WHERE usuario_id NOT IN (SELECT usuario_id FROM logins WHERE sucesso = 1)."
        },
        {
            tier: "avancado",
            file: "05_troca_de_ip.sql",
            title: "Troca repentina de IP",
            from: "Kenji",
            briefing: "Um usuário que muda de IP de um acesso para o outro merece um olhar. Compare cada login com o login anterior da mesma pessoa.",
            objective: "Use uma CTE com LAG(ip) OVER (PARTITION BY usuario_id ORDER BY data_hora) AS 'ip_anterior'. Na consulta final, projete 'usuario_id', 'data_hora', 'ip_anterior' e 'ip' só das linhas em que 'ip_anterior' não é nulo e é diferente de 'ip'. Ordene por 'usuario_id' e depois 'data_hora', ambos crescentes.",
            expectedQuery: `WITH h AS (SELECT usuario_id, data_hora, ip, LAG(ip) OVER (PARTITION BY usuario_id ORDER BY data_hora) AS ip_anterior FROM logins) SELECT usuario_id, data_hora, ip_anterior, ip FROM h WHERE ip_anterior IS NOT NULL AND ip_anterior <> ip ORDER BY usuario_id ASC, data_hora ASC;`,
            hint: "Funções de janela não podem ir direto no WHERE. Calcule o LAG numa CTE e filtre na consulta de fora."
        },
        {
            tier: "avancado",
            file: "06_mais_suspeito_por_departamento.sql",
            title: "O mais suspeito de cada área",
            from: "Maya",
            briefing: "Para o relatório final, quero o usuário com mais falhas em cada departamento. Se empatar, os dois entram.",
            objective: "Numa CTE, conte as falhas (sucesso = 0) por usuário com JOIN em 'usuarios' (colunas 'departamento', 'nome', 'falhas'). Noutra CTE, aplique RANK() OVER (PARTITION BY departamento ORDER BY falhas DESC) AS 'posicao'. Projete 'departamento', 'nome' e 'falhas' onde 'posicao' = 1. Ordene por 'departamento' e depois 'nome', crescentes.",
            expectedQuery: `WITH f AS (SELECT u.departamento, u.nome, COUNT(*) AS falhas FROM usuarios u JOIN logins l ON l.usuario_id = u.usuario_id WHERE l.sucesso = 0 GROUP BY u.usuario_id, u.departamento, u.nome), r AS (SELECT departamento, nome, falhas, RANK() OVER (PARTITION BY departamento ORDER BY falhas DESC) AS posicao FROM f) SELECT departamento, nome, falhas FROM r WHERE posicao = 1 ORDER BY departamento ASC, nome ASC;`,
            hint: "RANK dá a mesma posição para empates; ROW_NUMBER não. Por isso aqui é RANK."
        }
    ]
},
{
    id: "ecommerce",
    emoji: "🛒",
    name: "Painel de e-commerce",
    repo: "painel-ecommerce-sql",
    client: "Luna Ferreira · Analista Júnior (projeto paralelo)",
    pitch: "A loja virtual Maré Mansa, de Florianópolis, contratou a Aethelgard para entender vendas, produtos e clientes.",
    why: "Faturamento, ticket médio e produto campeão são as perguntas mais comuns numa vaga de analista de dados. Quem responde isso em SQL chega pronto na entrevista.",
    skills: ["Filtros e Top N", "SUM e GROUP BY com JOIN", "HAVING", "Acumulado com SUM OVER", "ROW_NUMBER por categoria"],
    schemaDDL: `
        CREATE TABLE clientes (
            cliente_id INTEGER PRIMARY KEY,
            nome TEXT NOT NULL,
            cidade TEXT NOT NULL,
            uf TEXT NOT NULL
        );
        CREATE TABLE produtos (
            produto_id INTEGER PRIMARY KEY,
            nome TEXT NOT NULL,
            categoria TEXT NOT NULL,
            preco REAL NOT NULL
        );
        CREATE TABLE pedidos (
            pedido_id INTEGER PRIMARY KEY,
            cliente_id INTEGER NOT NULL,
            data_pedido TEXT NOT NULL,
            status TEXT NOT NULL
        );
        CREATE TABLE itens_pedido (
            pedido_id INTEGER NOT NULL,
            produto_id INTEGER NOT NULL,
            quantidade INTEGER NOT NULL,
            preco_unit REAL NOT NULL
        );
    `,
    seedData: `
        INSERT INTO clientes VALUES
        (1, 'Ana Clara Pereira', 'Florianópolis', 'SC'),
        (2, 'Benedito Souza', 'Salvador', 'BA'),
        (3, 'Chen Wei', 'São Paulo', 'SP'),
        (4, 'Dandara Lima', 'Recife', 'PE'),
        (5, 'Enzo Kaingang', 'Chapecó', 'SC'),
        (6, 'Fernanda Rocha', 'Belém', 'PA');
        INSERT INTO produtos VALUES
        (1, 'Fone sem fio', 'Eletrônicos', 249.90),
        (2, 'Teclado mecânico', 'Eletrônicos', 389.00),
        (3, 'Cabo USB-C', 'Eletrônicos', 39.90),
        (4, 'Monitor 24 pol', 'Eletrônicos', 899.00),
        (5, 'Mochila notebook', 'Acessórios', 179.90),
        (6, 'Garrafa térmica', 'Acessórios', 89.90),
        (7, 'Livro de SQL', 'Livros', 119.00),
        (8, 'Livro de Python', 'Livros', 129.00),
        (9, 'Cadeira ergonômica', 'Móveis', 1290.00),
        (10, 'Luminária de mesa', 'Móveis', 159.00);
        INSERT INTO pedidos VALUES
        (1, 1, '2026-01-05', 'entregue'),
        (2, 2, '2026-01-12', 'entregue'),
        (3, 1, '2026-01-20', 'entregue'),
        (4, 3, '2026-02-02', 'cancelado'),
        (5, 4, '2026-02-10', 'entregue'),
        (6, 1, '2026-02-15', 'entregue'),
        (7, 5, '2026-02-28', 'entregue'),
        (8, 3, '2026-03-03', 'entregue'),
        (9, 6, '2026-03-09', 'entregue'),
        (10, 4, '2026-03-18', 'entregue'),
        (11, 2, '2026-03-22', 'cancelado'),
        (12, 4, '2026-03-30', 'entregue');
        INSERT INTO itens_pedido VALUES
        (1, 1, 1, 249.90), (1, 3, 2, 39.90),
        (2, 7, 1, 119.00), (2, 8, 1, 129.00),
        (3, 6, 2, 89.90),
        (4, 4, 1, 899.00),
        (5, 2, 1, 389.00), (5, 3, 3, 39.90),
        (6, 5, 1, 179.90), (6, 7, 2, 119.00),
        (7, 9, 1, 1290.00),
        (8, 1, 2, 249.90), (8, 10, 1, 159.00),
        (9, 8, 1, 129.00), (9, 6, 1, 89.90),
        (10, 3, 4, 39.90), (10, 5, 1, 179.90),
        (11, 2, 1, 389.00),
        (12, 4, 1, 899.00), (12, 10, 2, 159.00);
    `,
    tasks: [
        {
            tier: "basico",
            file: "01_eletronicos_acima_de_200.sql",
            title: "Eletrônicos acima de R$ 200",
            from: "Luna",
            briefing: "A loja quer montar uma vitrine de eletrônicos premium. Quais eletrônicos custam mais de R$ 200?",
            objective: "Da tabela 'produtos', projete 'nome' e 'preco' onde 'categoria' = 'Eletrônicos' e 'preco' > 200. Ordene por 'preco' decrescente.",
            expectedQuery: `SELECT nome, preco FROM produtos WHERE categoria = 'Eletrônicos' AND preco > 200 ORDER BY preco DESC;`,
            hint: "Junte as duas condições com AND."
        },
        {
            tier: "basico",
            file: "02_top3_mais_caros.sql",
            title: "Os 3 produtos mais caros",
            from: "Luna",
            briefing: "Para a campanha de frete grátis, quero os 3 produtos mais caros do catálogo inteiro.",
            objective: "Da tabela 'produtos', projete 'nome', 'categoria' e 'preco', ordene por 'preco' decrescente e traga só 3 linhas (LIMIT).",
            expectedQuery: `SELECT nome, categoria, preco FROM produtos ORDER BY preco DESC LIMIT 3;`,
            hint: "ORDER BY preco DESC LIMIT 3."
        },
        {
            tier: "intermediario",
            file: "03_faturamento_por_categoria.sql",
            title: "Faturamento por categoria",
            from: "Luna",
            briefing: "Pedido cancelado não é dinheiro no caixa. Quanto cada categoria faturou só com pedidos entregues?",
            objective: "Junte 'itens_pedido', 'pedidos' e 'produtos'. Considere só 'status' = 'entregue'. Projete 'categoria' e ROUND(SUM(quantidade * preco_unit), 2) AS 'faturamento', agrupando por categoria. Ordene por 'faturamento' decrescente.",
            expectedQuery: `SELECT pr.categoria, ROUND(SUM(i.quantidade * i.preco_unit), 2) AS faturamento FROM itens_pedido i JOIN pedidos p ON p.pedido_id = i.pedido_id JOIN produtos pr ON pr.produto_id = i.produto_id WHERE p.status = 'entregue' GROUP BY pr.categoria ORDER BY faturamento DESC;`,
            hint: "Dois JOINs: itens → pedidos (para o status) e itens → produtos (para a categoria)."
        },
        {
            tier: "intermediario",
            file: "04_clientes_recorrentes.sql",
            title: "Clientes que voltam",
            from: "Luna",
            briefing: "Cliente que compra mais de uma vez vale ouro. Quem fez 2 ou mais pedidos entregues?",
            objective: "Junte 'clientes' e 'pedidos', considere só 'status' = 'entregue', agrupe por cliente e projete 'nome', 'cidade' e COUNT(*) AS 'pedidos'. Mantenha quem tem 2 ou mais (HAVING). Ordene por 'pedidos' decrescente e, no empate, por 'nome' crescente.",
            expectedQuery: `SELECT c.nome, c.cidade, COUNT(*) AS pedidos FROM clientes c JOIN pedidos p ON p.cliente_id = c.cliente_id WHERE p.status = 'entregue' GROUP BY c.cliente_id, c.nome, c.cidade HAVING COUNT(*) >= 2 ORDER BY pedidos DESC, c.nome ASC;`,
            hint: "WHERE status = 'entregue' antes, HAVING COUNT(*) >= 2 depois do GROUP BY."
        },
        {
            tier: "avancado",
            file: "05_faturamento_mensal_acumulado.sql",
            title: "Faturamento mês a mês",
            from: "Maya",
            briefing: "A diretoria da loja quer ver o crescimento: faturamento de cada mês e o acumulado do ano.",
            objective: "Numa CTE, some ROUND(SUM(quantidade * preco_unit), 2) AS 'faturamento' por mês (substr(data_pedido, 1, 7) AS 'mes'), só pedidos entregues. Na consulta final, projete 'mes', 'faturamento' e ROUND(SUM(faturamento) OVER (ORDER BY mes), 2) AS 'acumulado'. Ordene por 'mes' crescente.",
            expectedQuery: `WITH m AS (SELECT substr(p.data_pedido, 1, 7) AS mes, ROUND(SUM(i.quantidade * i.preco_unit), 2) AS faturamento FROM pedidos p JOIN itens_pedido i ON i.pedido_id = p.pedido_id WHERE p.status = 'entregue' GROUP BY substr(p.data_pedido, 1, 7)) SELECT mes, faturamento, ROUND(SUM(faturamento) OVER (ORDER BY mes), 2) AS acumulado FROM m ORDER BY mes ASC;`,
            hint: "SUM(...) OVER (ORDER BY mes) soma tudo do primeiro mês até a linha atual."
        },
        {
            tier: "avancado",
            file: "06_campeao_por_categoria.sql",
            title: "O campeão de cada categoria",
            from: "Luna",
            briefing: "Qual produto mais vendeu (em unidades, pedidos entregues) em cada categoria? Esse vai para o banner.",
            objective: "Numa CTE, some as unidades vendidas por produto em pedidos entregues ('categoria', 'nome', SUM(quantidade) AS 'unidades'). Noutra, numere com ROW_NUMBER() OVER (PARTITION BY categoria ORDER BY unidades DESC, nome ASC) AS 'rn'. Projete 'categoria', 'nome' e 'unidades' onde 'rn' = 1. Ordene por 'categoria' crescente.",
            expectedQuery: `WITH v AS (SELECT pr.categoria, pr.nome, SUM(i.quantidade) AS unidades FROM itens_pedido i JOIN pedidos p ON p.pedido_id = i.pedido_id JOIN produtos pr ON pr.produto_id = i.produto_id WHERE p.status = 'entregue' GROUP BY pr.produto_id, pr.categoria, pr.nome), r AS (SELECT categoria, nome, unidades, ROW_NUMBER() OVER (PARTITION BY categoria ORDER BY unidades DESC, nome ASC) AS rn FROM v) SELECT categoria, nome, unidades FROM r WHERE rn = 1 ORDER BY categoria ASC;`,
            hint: "ROW_NUMBER com desempate por nome garante um único campeão por categoria."
        }
    ]
},
{
    id: "rede",
    emoji: "🕸️",
    name: "Mapa da rede",
    repo: "mapa-da-rede-sql",
    client: "Kenji Okabe · Redes",
    pitch: "Mapear os servidores da Aethelgard como um grafo e descobrir o caminho que o ataque percorreu até o banco financeiro.",
    why: "Redes, organogramas, rotas e recomendações são grafos. Percorrer grafos em SQL com recursão é habilidade rara e muito valorizada em engenharia de dados.",
    skills: ["Filtros com IN", "LEFT JOIN para achar ausências", "Contagem com JOIN", "WITH RECURSIVE em grafos"],
    schemaDDL: `
        CREATE TABLE servidores (
            servidor_id INTEGER PRIMARY KEY,
            nome TEXT NOT NULL,
            zona TEXT NOT NULL,
            sistema TEXT NOT NULL
        );
        CREATE TABLE conexoes (
            origem_id INTEGER NOT NULL,
            destino_id INTEGER NOT NULL,
            porta INTEGER NOT NULL
        );
        CREATE TABLE alertas (
            alerta_id INTEGER PRIMARY KEY,
            servidor_id INTEGER NOT NULL,
            severidade TEXT NOT NULL,
            descricao TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO servidores VALUES
        (1, 'gw-borda', 'DMZ', 'Linux'),
        (2, 'web-loja', 'DMZ', 'Linux'),
        (3, 'vpn-floripa', 'DMZ', 'Linux'),
        (4, 'app-pagamentos', 'Interna', 'Linux'),
        (5, 'app-rh', 'Interna', 'Windows'),
        (6, 'ad-central', 'Interna', 'Windows'),
        (7, 'db-financeiro', 'Cofre', 'Linux'),
        (8, 'db-rh', 'Cofre', 'Linux'),
        (9, 'backup-noturno', 'Cofre', 'Linux'),
        (10, 'impressora-3andar', 'Interna', 'Embarcado');
        INSERT INTO conexoes VALUES
        (1, 2, 443),
        (1, 3, 1194),
        (2, 4, 8080),
        (3, 5, 3389),
        (3, 6, 445),
        (5, 6, 445),
        (6, 4, 22),
        (6, 5, 3389),
        (4, 7, 5432),
        (5, 8, 5432),
        (7, 9, 22),
        (8, 9, 22),
        (10, 6, 445);
        INSERT INTO alertas VALUES
        (1, 3, 'alta', 'Login VPN fora do horário'),
        (2, 6, 'crítica', 'Criação de conta administrativa'),
        (3, 6, 'alta', 'Muitas falhas de autenticação'),
        (4, 4, 'média', 'Consulta incomum ao banco'),
        (5, 7, 'crítica', 'Exportação de tabela inteira'),
        (6, 2, 'baixa', 'Varredura de portas');
    `,
    tasks: [
        {
            tier: "basico",
            file: "01_servidores_da_dmz.sql",
            title: "Quem fica na borda",
            from: "Kenji",
            briefing: "A DMZ é a parte da rede exposta à internet. É por ela que todo ataque começa. Liste os servidores da DMZ.",
            objective: "Da tabela 'servidores', projete 'nome' e 'sistema' onde 'zona' = 'DMZ'. Ordene por 'nome' crescente.",
            expectedQuery: `SELECT nome, sistema FROM servidores WHERE zona = 'DMZ' ORDER BY nome ASC;`,
            hint: "WHERE zona = 'DMZ' ORDER BY nome."
        },
        {
            tier: "basico",
            file: "02_portas_sensiveis.sql",
            title: "Portas sensíveis",
            from: "Kenji",
            briefing: "As portas 22 (SSH), 445 (compartilhamento) e 3389 (área de trabalho remota) são as preferidas de quem quer controlar uma máquina.",
            objective: "Da tabela 'conexoes', projete 'origem_id', 'destino_id' e 'porta' onde 'porta' esteja em (22, 445, 3389) (use IN). Ordene por 'origem_id' e depois 'destino_id', crescentes.",
            expectedQuery: `SELECT origem_id, destino_id, porta FROM conexoes WHERE porta IN (22, 445, 3389) ORDER BY origem_id ASC, destino_id ASC;`,
            hint: "WHERE porta IN (22, 445, 3389)."
        },
        {
            tier: "intermediario",
            file: "03_conexoes_de_saida.sql",
            title: "Quem fala com mais máquinas",
            from: "Kenji",
            briefing: "Servidor que abre conexão para muitas máquinas é um ótimo trampolim para o invasor. Conte as conexões de saída de cada um.",
            objective: "Junte 'servidores' e 'conexoes' (servidor_id = origem_id), agrupe e projete 'nome' e COUNT(*) AS 'saidas'. Ordene por 'saidas' decrescente e, no empate, por 'nome' crescente.",
            expectedQuery: `SELECT s.nome, COUNT(*) AS saidas FROM servidores s JOIN conexoes c ON c.origem_id = s.servidor_id GROUP BY s.servidor_id, s.nome ORDER BY saidas DESC, s.nome ASC;`,
            hint: "INNER JOIN deixa de fora quem não tem nenhuma saída, e é isso que queremos aqui."
        },
        {
            tier: "intermediario",
            file: "04_servidores_sem_alerta.sql",
            title: "Silêncio também é pista",
            from: "Ivy",
            briefing: "Servidor sem nenhum alerta pode estar limpo... ou sem monitoramento. Quero a lista para revisar.",
            objective: "Faça LEFT JOIN de 'servidores' com 'alertas' e projete 'nome' e 'zona' só dos servidores sem alerta (alerta_id IS NULL). Ordene por 'nome' crescente.",
            expectedQuery: `SELECT s.nome, s.zona FROM servidores s LEFT JOIN alertas a ON a.servidor_id = s.servidor_id WHERE a.alerta_id IS NULL ORDER BY s.nome ASC;`,
            hint: "No LEFT JOIN, quem não tem par fica com as colunas da direita nulas."
        },
        {
            tier: "avancado",
            file: "05_alcance_a_partir_da_borda.sql",
            title: "Até onde dá para chegar",
            from: "Kenji",
            briefing: "Partindo do gw-borda, quais servidores um invasor alcança e em quantos saltos, no mínimo?",
            objective: "Use WITH RECURSIVE: comece em 'gw-borda' com 0 AS 'saltos' e siga 'conexoes' somando 1 a cada passo (limite saltos < 6). Agrupe por servidor e projete 'nome' e MIN(saltos) AS 'saltos', sem incluir o próprio 'gw-borda'. Ordene por 'saltos' e depois 'nome', crescentes.",
            expectedQuery: `WITH RECURSIVE alc(servidor_id, saltos) AS (SELECT servidor_id, 0 FROM servidores WHERE nome = 'gw-borda' UNION SELECT c.destino_id, a.saltos + 1 FROM alc a JOIN conexoes c ON c.origem_id = a.servidor_id WHERE a.saltos < 6) SELECT s.nome, MIN(a.saltos) AS saltos FROM alc a JOIN servidores s ON s.servidor_id = a.servidor_id WHERE s.nome <> 'gw-borda' GROUP BY s.servidor_id, s.nome ORDER BY saltos ASC, s.nome ASC;`,
            hint: "A rede tem ciclos (ad-central ↔ app-rh). O limite de saltos impede a recursão de rodar para sempre."
        },
        {
            tier: "avancado",
            file: "06_caminho_do_ataque.sql",
            title: "O caminho do ataque",
            from: "Maya",
            briefing: "Fecha o caso: qual é o caminho mais curto do gw-borda até o db-financeiro? Quero a rota escrita, máquina por máquina.",
            objective: "Use WITH RECURSIVE guardando 'servidor_id', 'caminho' (texto com os nomes ligados por ' > ') e 'saltos', partindo de 'gw-borda'. Não revisite servidores (use instr no caminho) e limite saltos < 6. Projete 'caminho' e 'saltos' da rota que termina em 'db-financeiro', ordenando por 'saltos' e depois 'caminho', e traga só 1 linha.",
            expectedQuery: `WITH RECURSIVE rota(servidor_id, caminho, saltos) AS (SELECT servidor_id, nome, 0 FROM servidores WHERE nome = 'gw-borda' UNION ALL SELECT c.destino_id, r.caminho || ' > ' || s.nome, r.saltos + 1 FROM rota r JOIN conexoes c ON c.origem_id = r.servidor_id JOIN servidores s ON s.servidor_id = c.destino_id WHERE instr(r.caminho, s.nome) = 0 AND r.saltos < 6) SELECT r.caminho, r.saltos FROM rota r JOIN servidores s ON s.servidor_id = r.servidor_id WHERE s.nome = 'db-financeiro' ORDER BY r.saltos ASC, r.caminho ASC LIMIT 1;`,
            hint: "Monte o texto com ||. instr(caminho, nome) = 0 evita voltar a uma máquina já visitada."
        }
    ]
}
];

if (typeof module !== "undefined" && module.exports) {
    module.exports = { PROJECTS };
}
