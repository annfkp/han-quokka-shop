require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const configuracion = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10
};

if (process.env.DB_SSL === 'true') {
  configuracion.ssl = { rejectUnauthorized: false };
}

const conexion = mysql.createPool(configuracion);

app.get('/', (req, res) => {
  res.json({ mensaje: 'API de Han Quokka Shop funcionando', ruta: '/productos' });
});

app.get('/categorias', (req, res) => {
  conexion.query('SELECT * FROM categorias ORDER BY nombre', (err, resultados) => {
    if (err) return res.status(500).json({ error: 'No se pudieron cargar las categorías' });
    res.json(resultados);
  });
});

app.get('/productos', (req, res) => {
  const sql = `SELECT p.id, p.nombre, p.descripcion, p.precio, p.stock,
    p.categoria_id, c.nombre AS categoria
    FROM productos p INNER JOIN categorias c ON p.categoria_id = c.id
    ORDER BY p.id DESC`;
  conexion.query(sql, (err, resultados) => {
    if (err) return res.status(500).json({ error: 'No se pudieron cargar los productos' });
    res.json(resultados);
  });
});

app.post('/productos', (req, res) => {
  const { nombre, descripcion, precio, stock, categoria_id } = req.body;
  if (!nombre || precio === '' || precio === undefined || stock === '' || stock === undefined || !categoria_id) {
    return res.status(400).json({ error: 'Completa el nombre, precio, stock y categoría.' });
  }
  const sql = 'INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id) VALUES (?, ?, ?, ?, ?)';
  conexion.query(sql, [nombre, descripcion || '', Number(precio), Number(stock), Number(categoria_id)], (err, resultado) => {
    if (err) return res.status(500).json({ error: 'No se pudo guardar el producto. Revisa la base de datos.' });
    res.status(201).json({ message: 'Producto agregado correctamente', id: resultado.insertId });
  });
});

app.put('/productos/:id', (req, res) => {
  const { nombre, descripcion, precio, stock, categoria_id } = req.body;
  const sql = 'UPDATE productos SET nombre=?, descripcion=?, precio=?, stock=?, categoria_id=? WHERE id=?';
  conexion.query(sql, [nombre, descripcion || '', Number(precio), Number(stock), Number(categoria_id), req.params.id], (err, resultado) => {
    if (err) return res.status(500).json({ error: 'No se pudo actualizar el producto.' });
    if (!resultado.affectedRows) return res.status(404).json({ error: 'No se encontró ese producto.' });
    res.json({ message: 'Producto actualizado correctamente' });
  });
});

app.delete('/productos/:id', (req, res) => {
  conexion.query('DELETE FROM productos WHERE id=?', [req.params.id], (err, resultado) => {
    if (err) return res.status(500).json({ error: 'No se pudo eliminar el producto.' });
    if (!resultado.affectedRows) return res.status(404).json({ error: 'No se encontró ese producto.' });
    res.json({ message: 'Producto eliminado correctamente' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en puerto ${PORT}`);
});
