-- ============================================
-- ELIMINAR BASE DE DATOS SI EXISTE
-- ============================================
DROP DATABASE IF EXISTS Vinilos;
CREATE DATABASE Vinilos;
USE Vinilos;

-- ============================================
-- TABLA USUARIOS (para coincidir con la entidad Java Usuario)
-- ============================================
CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    rol VARCHAR(20) DEFAULT 'USUARIO',
    apellido VARCHAR(150),
    ciudad VARCHAR(50),
    direccion VARCHAR(200),
    codigo_postal VARCHAR(10),
    telefono VARCHAR(20),
    prefijo VARCHAR(10),
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    tipo_cliente ENUM('comprador','vendedor','ambos') DEFAULT 'comprador',
    valoracion_vendedor INT DEFAULT 0,
    tipo_coleccionista VARCHAR(50)
);

-- ============================================
-- TABLA VINILOS (catálogo general)
-- ============================================
CREATE TABLE vinilos (
    id_vinilo BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    artista VARCHAR(150) NOT NULL,
    genero VARCHAR(100),
    fecha_lanzamiento DATE,
    api_source_id VARCHAR(100),
    anio INT,
    imagen_url VARCHAR(500),
    discogs_id VARCHAR(100) UNIQUE
);

-- ============================================
-- TABLA COLECCIONES (vinilos que tiene el usuario)
-- ============================================
CREATE TABLE colecciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    id_vinilo BIGINT NOT NULL,
    fecha_adquisicion DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'NUEVO',
    calificacion INT DEFAULT 5,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (id_vinilo) REFERENCES vinilos(id_vinilo)
);

-- ============================================
-- TABLA VINILOS EN VENTA (MARKETPLACE)
-- ============================================
CREATE TABLE vinilos_en_venta (
    id_venta BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_vinilo BIGINT NOT NULL,
    id_vendedor BIGINT NOT NULL,
    estado_vinilo ENUM('Nuevo', 'Como nuevo', 'Muy bueno', 'Bueno', 'Aceptable') NOT NULL,
    estado_portada ENUM('Nuevo', 'Como nuevo', 'Muy bueno', 'Bueno', 'Aceptable') NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 1,
    FOREIGN KEY (id_vinilo) REFERENCES vinilos(id_vinilo),
    FOREIGN KEY (id_vendedor) REFERENCES usuarios(id)
);

-- ============================================
-- TABLA PEDIDOS
-- ============================================
CREATE TABLE pedidos (
    id_pedido BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_comprador BIGINT NOT NULL,
    fecha_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('pendiente','pagado','enviado','entregado','cancelado') DEFAULT 'pendiente',
    total DECIMAL(10,2),
    direccion_envio VARCHAR(150),
    FOREIGN KEY (id_comprador) REFERENCES usuarios(id)
);

-- ============================================
-- TABLA PAGOS
-- ============================================
CREATE TABLE pagos (
    id_pago BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_pedido BIGINT NOT NULL,
    metodo_pago ENUM('Tarjeta','Paypal','Transferencia'),
    fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
    monto DECIMAL(10,2),
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido)
);

-- ============================================
-- TABLA VALORACIONES
-- ============================================
CREATE TABLE valoraciones (
    id_valoracion BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_cliente_valorado BIGINT NOT NULL,
    id_cliente_valora BIGINT NOT NULL,
    puntuacion INT CHECK (puntuacion BETWEEN 1 AND 5),
    comentario VARCHAR(200),
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente_valorado) REFERENCES usuarios(id),
    FOREIGN KEY (id_cliente_valora) REFERENCES usuarios(id)
);

-- ============================================
-- TABLA LISTA DE DESEOS (WISHLIST)
-- ============================================
CREATE TABLE lista_de_deseos (
    id_deseo BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_cliente BIGINT NOT NULL,
    id_vinilo BIGINT NOT NULL,
    fecha_agregado DATETIME DEFAULT CURRENT_TIMESTAMP,
    prioridad ENUM('Alta','Media','Baja') DEFAULT 'Media',
    FOREIGN KEY (id_cliente) REFERENCES usuarios(id),
    FOREIGN KEY (id_vinilo) REFERENCES vinilos(id_vinilo),
    UNIQUE (id_cliente, id_vinilo)
);