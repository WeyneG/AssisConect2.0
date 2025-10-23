-- Inserts para a tabela 'usuarios'
INSERT INTO usuarios (nome, email, senha, role, data_criacao, ultimo_login, status) 
VALUES  
    ('Carlos Almeida', 'carlos.almeida@exemplo.com', 'senha_forte_carlos', 'admin', NOW(), NOW(), 'ativo'),
    ('Juliana Costa', 'juliana.costa@exemplo.com', 'senha_forte_juliana', 'funcionario', NOW(), NOW(), 'ativo'),
    ('Renato Pereira', 'renato.pereira@exemplo.com', 'senha_forte_renato', 'familiar', NOW(), NOW(), 'ativo'),
    ('Gabriela Souza', 'gabriela.souza@exemplo.com', 'senha_forte_gabriela', 'funcionario', NOW(), NOW(), 'ativo'),
    ('Marta Ribeiro', 'marta.ribeiro@exemplo.com', 'senha_forte_marta', 'familiar', NOW(), NOW(), 'ativo'),
    ('Eduardo Silva', 'eduardo.silva@exemplo.com', 'senha_forte_eduardo', 'admin', NOW(), NOW(), 'ativo'),
    ('Luciana Oliveira', 'luciana.oliveira@exemplo.com', 'senha_forte_luciana', 'familiar', NOW(), NOW(), 'ativo'),
    ('Pedro Gomes', 'pedro.gomes@exemplo.com', 'senha_forte_pedro', 'funcionario', NOW(), NOW(), 'ativo'),
    ('Fernanda Alves', 'fernanda.alves@exemplo.com', 'senha_forte_fernanda', 'familiar', NOW(), NOW(), 'ativo'),
    ('Lucas Martins', 'lucas.martins@exemplo.com', 'senha_forte_lucas', 'funcionario', NOW(), NOW(), 'ativo');
