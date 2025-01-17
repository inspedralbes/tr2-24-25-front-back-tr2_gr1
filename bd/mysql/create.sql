-- Tabla ASSOCIACIO
CREATE TABLE ASSOCIACIO (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255),
    descripcio TEXT
);

-- Tabla USUARI
CREATE TABLE USUARI (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255),
    cognoms VARCHAR(255),
    contrasenya VARCHAR(255),
    correu VARCHAR(255),
    imatge VARCHAR(255),
    permisos VARCHAR(255)
);

-- Tabla USUARI_ASSOCIACIO
CREATE TABLE USUARI_ASSOCIACIO (
    idUsu INT,
    idAsso INT,
    PRIMARY KEY (idUsu, idAsso),
    FOREIGN KEY (idUsu) REFERENCES USUARI(id),
    FOREIGN KEY (idAsso) REFERENCES ASSOCIACIO(id)
);

-- Tabla PROPOSTA
CREATE TABLE PROPOSTA (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titol VARCHAR(255),
    subtitol VARCHAR(255),
    contingut TEXT,
    autor INT,
    idAsso INT,
    data DATE,
    color VARCHAR(7) DEFAULT '#FFFFFF',
    FOREIGN KEY (autor) REFERENCES USUARI(id),
    FOREIGN KEY (idAsso) REFERENCES ASSOCIACIO(id)
);

-- Tabla COMENTARI
CREATE TABLE COMENTARI (
    id INT AUTO_INCREMENT PRIMARY KEY,
    autor INT,
    idProp INT,
    contingut TEXT,
    actiu BOOLEAN,
    FOREIGN KEY (autor) REFERENCES USUARI(id),
    FOREIGN KEY (idProp) REFERENCES PROPOSTA(id)
);

-- Tabla ESDEVENIMENT
CREATE TABLE ESDEVENIMENT (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255),
    data DATE,
    tipus VARCHAR(255),
    adreca VARCHAR(255),
    idAsso INT,
    descripcio TEXT,
    FOREIGN KEY (idAsso) REFERENCES ASSOCIACIO(id)
);

-- Tabla ESDEVENIMENT_USUARI (relación N:M)
CREATE TABLE ESDEVENIMENT_USUARI (
    idEsde INT,
    idUsu INT,
    PRIMARY KEY (idEsde, idUsu),
    FOREIGN KEY (idEsde) REFERENCES ESDEVENIMENT(id),
    FOREIGN KEY (idUsu) REFERENCES USUARI(id)
);

-- Tabla NOTICIA
CREATE TABLE NOTICIA (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titol VARCHAR(255),
    subtitol VARCHAR(255),
    contingut TEXT,
    imatge VARCHAR(255),
    autor INT,
    idAsso INT,
    FOREIGN KEY (autor) REFERENCES USUARI(id),
    FOREIGN KEY (idAsso) REFERENCES ASSOCIACIO(id)
);

-- Tabla VOTACIONS
CREATE TABLE VOTACIONS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idProp INT,
    idUsu INT,
    resposta BOOLEAN,
    UNIQUE(idProp, idUsu),
    FOREIGN KEY (idProp) REFERENCES PROPOSTA(id),
    FOREIGN KEY (idUsu) REFERENCES USUARI(id)
);
