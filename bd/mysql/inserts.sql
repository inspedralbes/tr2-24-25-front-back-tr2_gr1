-- Tabla ASSOCIACIÓ
INSERT INTO ASSOCIACIO (nom, descripcio) VALUES
('Associació Cultural', 'Promoció de la cultura local'),
('Associació Esportiva', 'Foment de l\'esport en comunitat');

-- Tabla USUARI
INSERT INTO USUARI (nom, cognoms, contrasenya, correu, imatge, permisos) VALUES
('Joan', 'Garcia', 'pass123', 'joan@example.com', 'joan.jpg', 'admin'),
('Maria', 'Lopez', 'pass456', 'maria@example.com', 'maria.jpg', 'user');

-- Tabla PROPOSTA
INSERT INTO PROPOSTA (titol, subtitol, contingut, autor, idAsso, data) VALUES
('Millores al parc', 'Proposta per a millorar el parc', 'Augmentar zones verdes i afegir bancs.', 1, 1, '2024-12-01'),
('Festes locals', 'Organització de festes populars', 'Planificar un calendari de festes locals anuals.', 2, 2, '2024-12-02');

-- Tabla COMENTARI
INSERT INTO COMENTARI (autor, idProp, contingut, actiu) VALUES
(2, 1, 'M\'agrada aquesta idea!', TRUE),
(1, 2, 'Crec que necessitem més informació.', TRUE);

-- Tabla ESDEVENIMENT
INSERT INTO ESDEVENIMENT (nom, data, tipus, adreca, idAsso, descripcio) VALUES
('Torneig de futbol', '2024-12-10', 'Esportiu', 'Camp municipal', 2, 'Competició de futbol per equips locals'),
('Concert de música', '2024-12-15', 'Cultural', 'Plaça Major', 1, 'Concert amb artistes locals');

-- Tabla ESDEVENIMENT/USUARI
INSERT INTO `ESDEVENIMENT_USUARI` (idEsde, idUsu) VALUES
(1, 1),
(2, 2);

-- Tabla NOTICIA
INSERT INTO NOTICIA (titol, subtitol, contingut, imatge, autor, idAsso) VALUES
('Nova normativa', 'Canvis en la normativa local', 'Es prohibeix l\'ús de plàstics d\'un sol ús.', 'noticia1.jpg', 1, 1),
('Èxit del torneig', 'Gran participació en el torneig', 'Més de 10 equips van competir al torneig de futbol.', 'noticia2.jpg', 2, 2);
