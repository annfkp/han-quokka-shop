-- Han Quokka Shop: ejecutar en la base asignada por Aiven (por ejemplo, defaultdb).
-- No crear ni seleccionar la base aquí; Aiven asigna su propio nombre.

CREATE TABLE IF NOT EXISTS categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255),
  precio DECIMAL(7,2) NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  categoria_id INT NOT NULL,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

INSERT INTO categorias (nombre)
SELECT 'Photocards' WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE nombre = 'Photocards');
INSERT INTO categorias (nombre)
SELECT 'Accesorios' WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE nombre = 'Accesorios');
INSERT INTO categorias (nombre)
SELECT 'Papelería' WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE nombre = 'Papelería');
INSERT INTO categorias (nombre)
SELECT 'Ropa y bolsas' WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE nombre = 'Ropa y bolsas');

INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id)
SELECT 'Pack de photocards fan-made', 'Pack decorativo inspirado en Han Jisung. Producto de demostración.', 3.50, 12, id FROM categorias WHERE nombre = 'Photocards'
AND NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Pack de photocards fan-made');
INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id)
SELECT 'Llavero estilo quokka', 'Accesorio fan-made para mochila o llaves.', 4.00, 8, id FROM categorias WHERE nombre = 'Accesorios'
AND NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Llavero estilo quokka');
INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id)
SELECT 'Set de stickers', 'Pegatinas temáticas para cuadernos y fundas.', 2.00, 15, id FROM categorias WHERE nombre = 'Papelería'
AND NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Set de stickers');
INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id)
SELECT 'Separador para álbum', 'Separador decorativo para organizar photocards.', 1.50, 20, id FROM categorias WHERE nombre = 'Papelería'
AND NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Separador para álbum');
INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id)
SELECT 'Tote bag fan-made', 'Bolsa de tela para llevar tus artículos favoritos.', 8.00, 5, id FROM categorias WHERE nombre = 'Ropa y bolsas'
AND NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Tote bag fan-made');
INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id)
SELECT 'Photocard holder', 'Porta-photocard para decorar la mochila.', 5.00, 7, id FROM categorias WHERE nombre = 'Accesorios'
AND NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Photocard holder');
