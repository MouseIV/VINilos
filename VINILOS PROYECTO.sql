DROP DATABASE IF EXISTS Vinilos;
CREATE DATABASE Vinilos;
USE Vinilos;

---------------------------------------------------------
-- TABLA CLIENTES
---------------------------------------------------------
CREATE TABLE Clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(150),
    usuario VARCHAR(50) UNIQUE NOT NULL,
    ciudad VARCHAR(50),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(200) NOT NULL,
    direccion VARCHAR(200),
    codigo_postal VARCHAR(10),
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    tipo_cliente ENUM('comprador','vendedor','ambos') DEFAULT 'comprador',
    valoracion_vendedor INT DEFAULT 0
);

---------------------------------------------------------
-- TABLA VINILOS (CATÁLOGO GENERAL)
---------------------------------------------------------
CREATE TABLE Vinilos (
    id_vinilo INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    artista VARCHAR(150) NOT NULL,
    genero VARCHAR(100),
    fecha_lanzamiento DATE,
    api_source_id VARCHAR(100)
);

---------------------------------------------------------
-- TABLA VINILOS EN VENTA (MARKETPLACE)
---------------------------------------------------------
CREATE TABLE Vinilos_en_venta (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    id_vinilo INT NOT NULL,
    id_vendedor INT NOT NULL,
    estado_vinilo ENUM('Nuevo', 'Como nuevo', 'Muy bueno', 'Bueno', 'Aceptable') NOT NULL,
    estado_portada ENUM('Nuevo', 'Como nuevo', 'Muy bueno', 'Bueno', 'Aceptable') NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 1,
    FOREIGN KEY (id_vinilo) REFERENCES Vinilos(id_vinilo),
    FOREIGN KEY (id_vendedor) REFERENCES Clientes(id_cliente)
);

---------------------------------------------------------
-- TABLA PEDIDOS
---------------------------------------------------------
CREATE TABLE Pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_comprador INT NOT NULL,
    fecha_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('pendiente','pagado','enviado','entregado','cancelado') DEFAULT 'pendiente',
    total DECIMAL(10,2),
    direccion_envio VARCHAR(150),
    FOREIGN KEY (id_comprador) REFERENCES Clientes(id_cliente)
);

---------------------------------------------------------
-- TABLA PAGOS
---------------------------------------------------------
CREATE TABLE Pagos (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    metodo_pago ENUM('Tarjeta','Paypal','Transferencia'),
    fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
    monto DECIMAL(10,2),
    FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido)
);

---------------------------------------------------------
-- TABLA VALORACIONES
---------------------------------------------------------
CREATE TABLE Valoraciones (
    id_valoracion INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente_valorado INT NOT NULL,
    id_cliente_valora INT NOT NULL,
    puntuacion INT CHECK (puntuacion BETWEEN 1 AND 5),
    comentario VARCHAR(200),
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente_valorado) REFERENCES Clientes(id_cliente),
    FOREIGN KEY (id_cliente_valora) REFERENCES Clientes(id_cliente)
);

---------------------------------------------------------
-- TABLA COLECCION (VINILOS QUE TIENE EL USUARIO)
---------------------------------------------------------
CREATE TABLE Coleccion (
    id_coleccion INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_vinilo INT NOT NULL,
    fecha_adquisicion DATE DEFAULT CURRENT_DATE,
    estado ENUM('Nuevo', 'Como nuevo', 'Muy bueno', 'Bueno', 'Aceptable') DEFAULT 'Bueno',
    calificacion INT DEFAULT 5,
    FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente),
    FOREIGN KEY (id_vinilo) REFERENCES Vinilos(id_vinilo),
    UNIQUE (id_cliente, id_vinilo)
);

---------------------------------------------------------
-- TABLA LISTA DE DESEOS (WISHLIST)
---------------------------------------------------------
CREATE TABLE Lista_de_deseos (
    id_deseo INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_vinilo INT NOT NULL,
    fecha_agregado DATETIME DEFAULT CURRENT_TIMESTAMP,
    prioridad ENUM('Alta','Media','Baja') DEFAULT 'Media',
    FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente),
    FOREIGN KEY (id_vinilo) REFERENCES Vinilos(id_vinilo),
    UNIQUE (id_cliente, id_vinilo)

INSERT INTO Vinilos (titulo, artista, genero, fecha_lanzamiento, api_source_id) VALUES
('Abbey Road', 'The Beatles', 'Rock', '1969-09-26', 'beatles_abbey'),
('Thriller', 'Michael Jackson', 'Pop', '1982-11-30', 'mj_thriller'),
('The Dark Side of the Moon', 'Pink Floyd', 'Rock', '1973-03-01', 'pinkfloyd_darkside'),
('Back in Black', 'AC/DC', 'Hard Rock', '1980-07-25', 'acdc_backinblack'),
('Rumours', 'Fleetwood Mac', 'Rock', '1977-02-04', 'fleetwood_rumours'),
('Nevermind', 'Nirvana', 'Grunge', '1991-09-24', 'nirvana_nevermind');
