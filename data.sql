CREATE DATABASE bancosolar;

\c bancosolar;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY, 
    nombre VARCHAR(50), 
    balance FLOAT CHECK (balance >= 0)
);

CREATE TABLE transferencias (
    id SERIAL PRIMARY KEY, 
    emisor INT, 
    receptor INT, 
    monto FLOAT, 
    fecha TIMESTAMP, 
    FOREIGN KEY (emisor) REFERENCES usuarios(id), 
    FOREIGN KEY (receptor) REFERENCES usuarios(id)
);

SELECT 
    t.fecha, 
    t.monto, 
    e.nombre AS nombre_emisor, 
    r.nombre AS nombre_receptor
FROM 
    transferencias t
JOIN 
    usuarios e ON t.emisor = e.id
JOIN 
    usuarios r ON t.receptor = r.id;


\dt

\d usuarios;
\d transferencias;

