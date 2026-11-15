-- Creación de la base de datos
-- CREATE DATABASE panaderia_lucy;

-- Tabla de Usuarios (para el registro y autenticación con JWT y bcrypt)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL,
    rol VARCHAR(25),
    lenguage VARCHAR(20)
);

-- Tabla de Productos / Catálogo (para la panadería y pastelería)
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio INT NOT NULL,
    stock INT NOT NULL,
    categoria VARCHAR(50),
    imagen TEXT
);

-- Datos iniciales de prueba para productos
INSERT INTO productos (nombre, descripcion, precio, stock, categoria, imagen) VALUES 
('Pan Amasado Tradicional', 'Recién horneado, crujiente por fuera y blando por dentro.', 300, 50, 'Panadería', 'pan_amasado.jpg'),
('Kuchen de Manzana', 'Tradicional pastel alemán de manzana y migas crujientes.', 2500, 15, 'Pastelería', 'kuchen_manzana.jpg'),
('Cupcake de Chocolate', 'Bizcocho húmedo de cacao con cobertura de crema de avellanas.', 1200, 30, 'Pastelería', 'cupcake_choco.jpg');


