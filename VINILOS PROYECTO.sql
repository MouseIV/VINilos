DROP DATABASE IF EXISTS Vinilos;
CREATE DATABASE Vinilos;
USE Vinilos;

CREATE TABLE Clientes (
    id_cliente INT PRIMARY KEY,
    Nombre VARCHAR(100),
    Apellido VARCHAR(150),
    Usuario VARCHAR(50),
    Ciudad VARCHAR(50),
    Email VARCHAR(100),
    Password_bash VARCHAR(100),
    Direccion VARCHAR(200),
    Codigo_Postal VARCHAR(10),
    Fecha_registro DATETIME,
    Tipo_de_cliente ENUM('comprador','vendedor','ambos'),
    Valoracion_cliente INT
);

CREATE TABLE Vinilos (
    id_Vinilos INT PRIMARY KEY,
    Titulo VARCHAR(200),
    Artista VARCHAR(150),
    Genero VARCHAR(100),
    Fecha_de_lanzamiento DATETIME
);

CREATE TABLE Pedidos (
    id_Pedido INT PRIMARY KEY,
    id_Comprador INT,
    Fecha_pedido DATETIME,
    Estado ENUM('pendiente','pagado','enviado','entregado','cancelado'),
    Total DOUBLE,
    Direccion_envio VARCHAR(150)
);

CREATE TABLE Pagos (
    id_Pago INT PRIMARY KEY,
    id_Pedido INT NOT NULL,
    metodo_pago ENUM('Tarjeta','paypal','transferencia'),
    FOREIGN KEY (id_Pedido) REFERENCES Pedidos(id_Pedido)
);

CREATE TABLE Valoraciones (
    id_valoracion INT PRIMARY KEY,
    id_cliente_valorado INT,
    id_cliente_que_valorado INT,
    Puntuacion INT,
    Comentario VARCHAR(200),
    Fecha DATETIME
);

CREATE TABLE vinilos_en_venta (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    id_catalogo INT NOT NULL,
    id_vendedor INT NOT NULL,
    estado_vinilo ENUM('Nuevo', 'Como nuevo', 'Muy bueno', 'Bueno', 'Aceptable') NOT NULL,
    estado_portada ENUM('Nuevo', 'Como nuevo', 'Muy bueno', 'Bueno', 'Aceptable') NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 100
);