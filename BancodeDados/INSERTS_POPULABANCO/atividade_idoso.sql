-- Inserts para a tabela 'atividade_idoso'
-- Observação: os IDs de atividade e idoso assumem que as tabelas usam IDs numéricos já existentes.
INSERT INTO atividade_idoso (atividade_id, idoso_id, criado_em) 
VALUES  
    (1, 11, NOW()),  -- Atividade 1 (Fisioterapia) para o Idoso 11
    (2, 12, NOW()),  -- Atividade 2 (Recreativa) para o Idoso 12
    (3, 13, NOW()),  -- Atividade 3 (Acompanhamento Médico) para o Idoso 13
    (4, 14, NOW()),  -- Atividade 4 (Oficina de Artes) para o Idoso 14
    (5, 15, NOW()),  -- Atividade 5 (Yoga e Relaxamento) para o Idoso 15
    (6, 16, NOW()),  -- Atividade 6 (Aula de Dança) para o Idoso 16
    (7, 17, NOW()),  -- Atividade 7 (Leitura e Discussão) para o Idoso 17
    (8, 18, NOW()),  -- Atividade 8 (Caminhada ao Ar Livre) para o Idoso 18
    (9, 19, NOW()),  -- Atividade 9 (Terapia Ocupacional) para o Idoso 19
    (10, 20, NOW()); -- Atividade 10 (Música Terapêutica) para o Idoso 20
