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

INSERT INTO productos (nombre, descripcion, precio, stock, categoria, imagen) VALUES
-- 1 al 10
('Dulces Nogados', 'Dulce artesanal relleno con manjar y cubierto con nuez.', 1000, 20, 'Pastelería', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80'),
('Dulces de Maicena (Maicenitos)', 'Dulces de maicena rellenos de manjar y cubiertos con coco rallado.', 800, 20, 'Pastelería', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80'),
('Queque (Trozo)', 'Porción individual de queque casero esponjoso recién horneado.', 800, 20, 'Pastelería', 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=800&q=80'),
('Cachitos de Manjar', 'Masa hojaldrada crocante rellena con abundante manjar artesanal.', 800, 20, 'Pastelería', 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=800&q=80'),
('Merengues', 'Suspiros de merengue horneado crujientes por fuera y suaves por dentro.', 700, 20, 'Pastelería', 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80');
INSERT INTO productos (nombre, descripcion, precio, stock, categoria, imagen) VALUES
('Pie de Arándanos (Trozo)', 'Porción de pie con masa crocante, crema pastelera y arándanos frescos.', 2200, 20, 'Pastelería', 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=800&q=80'),
('Brazo de Reina de Coco', 'Porción de bizcocho enrollado relleno de manjar y cubierto con coco rallado.', 1800, 20, 'Pastelería', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80'),
('Donas', 'Dona esponjosa artesanal con glaseado dulce.', 1500, 20, 'Pastelería', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80'),
('Trufas', 'Bocados intensos de cacao y bizcocho cubiertos con chocolate.', 900, 20, 'Pastelería', 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=800&q=80'),
('Pie de Maracuyá (Entero)', 'Pie entero con base sablé crocante, crema suave de maracuyá y merengue.', 12000, 10, 'Pastelería', 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80');

INSERT INTO productos (nombre, descripcion, precio, stock, categoria, imagen) VALUES
('Pie de Limón (Entero)', 'Pie entero tradicional con crema de limón natural y merengue dorado.', 13000, 10, 'Pastelería', 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80'),
('Torta Bizcochuelo (Trozo)', 'Porción de torta de bizcochuelo húmedo con relleno artesanal.', 2200, 20, 'Pastelería', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80'),
('Torta Amor (Mil Hojas)', 'Porción de torta de finas capas de hojarasca con manjar, crema y frambuesa.', 3000, 20, 'Pastelería', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80'),
('Magdalenas', 'Magdalenas caseras esponjosas con suave aroma a vainilla y ralladura cítrica.', 1700, 20, 'Pastelería', 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=800&q=80'),
('Berlines (Manjar - Crema)', 'Berlín tradicional esponjoso relleno a elección con manjar o crema pastelera.', 800, 20, 'Pastelería', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80'),
('Pie de Limón (Trozo)', 'Porción individual de pie de limón casero con merengue tostado.', 2400, 20, 'Pastelería', 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80'),
('Brazo de Reina de Nuez (Trozo)', 'Porción de bizcocho enrollado con manjar y nueces seleccionadas.', 2000, 20, 'Pastelería', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80'),
('Pie de Arándano (Entero)', 'Pie entero con base crocante, relleno cremoso y cobertura de arándanos.', 12000, 10, 'Pastelería', 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=800&q=80'),
('Pie de Nuez (Entero)', 'Pie entero artesanal relleno de caramelo y abundantes nueces tostadas.', 14000, 10, 'Pastelería', 'https://images.unsplash.com/photo-1535920527002-b35e96722eb9?auto=format&fit=crop&w=800&q=80'),
('Brazo de Reina de Nuez (Entero)', 'Bizcocho enrollado entero relleno con manjar casero y nueces.', 14000, 10, 'Pastelería', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80'),
('Brazo de Reina de Coco (Entero)', 'Bizcocho enrollado entero relleno con manjar y cubierto en coco rallado.', 12000, 10, 'Pastelería', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80'),
('Cocadas', 'Bolitas dulces artesanales elaboradas con coco rallado, galleta y manjar.', 500, 20, 'Pastelería', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80'),
('Trenzitas', 'Masas dulces trenzadas y horneadas con un toque de azúcar.', 1800, 20, 'Pastelería', 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=800&q=80'),
('Queque de Zanahoria Bañado en Chocolate (Entero)', 'Queque entero húmedo de zanahoria especiada con cobertura de chocolate.', 4500, 10, 'Pastelería', 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=800&q=80'),
('Queque de Zanahoria con Nuez (Entero)', 'Queque entero artesanal de zanahoria con trozos de nuez.', 4500, 10, 'Pastelería', 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=800&q=80'),
('Chandelle', 'Postre cremoso individual de chocolate con cobertura de crema.', 1500, 20, 'Pastelería', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80'),
('Bavarois (Babarúa)', 'Postre frío esponjoso y cremoso de fruta natural.', 1500, 20, 'Pastelería', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80'),
('Profiteroles (Repollitos)', 'Masas choux rellenas de crema pastelera o manjar espolvoreadas con azúcar flor.', 1500, 20, 'Pastelería', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80'),
('Antojitos', 'Bocados dulces artesanales surtidos de la casa.', 700, 20, 'Pastelería', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80'),
('Rollitos de Canela', 'Rollos de masa esponjosa horneada con canela aromática y glaseado.', 2000, 20, 'Pastelería', 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=800&q=80');

SELECT COUNT(*) FROM productos;