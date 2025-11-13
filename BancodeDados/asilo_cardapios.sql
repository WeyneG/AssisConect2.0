CREATE TABLE cardapios (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    data DATE NOT NULL,
    cafe_da_manha TEXT NOT NULL,
    almoco TEXT NOT NULL,
    jantar TEXT NOT NULL
);