const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = process.env.DATABASE_URL
    ? new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false },
      })
    : new Pool({
          host: process.env.DB_HOST || 'localhost',
          user: process.env.DB_USER || 'postgres',
          password: process.env.DB_PASSWORD || 'tu_contraseña',
          database: process.env.DB_DATABASE || 'softjobs',
          port: process.env.DB_PORT || 5432,
          allowExitOnIdle: true,
      });

// Prueba de conexión inicial
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Error al conectar a la base de datos:', err);
    } else {
        console.log('✅ Base de datos conectada con éxito a PostgreSQL:', res.rows[0].now);
    }
});

// 1. Obtener todos los productos del catálogo
const obtenerProductos = async () => {
    const { rows } = await pool.query('SELECT * FROM productos');
    return rows;
};

// 2. Registrar un nuevo usuario (con contraseña encriptada)
const registrarUsuario = async (email, password, rol, lenguage) => {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const consulta = 'INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [email, hashedPassword, rol, lenguage];
    const { rows } = await pool.query(consulta, values);
    return rows[0];
};

// 3. Verificar credenciales de usuario para el Login
const verificarCredenciales = async (email, password) => {
    const consulta = 'SELECT * FROM usuarios WHERE email = $1';
    const { rows, rowCount } = await pool.query(consulta, [email]);
    
    if (!rowCount) throw { code: 404, message: 'Usuario no encontrado' };

    const usuario = rows[0];
    const passwordIsValid = bcrypt.compareSync(password, usuario.password);

    if (!passwordIsValid) throw { code: 401, message: 'Credenciales inválidas' };

    return usuario;
};

// 4. Crear un nuevo producto en PostgreSQL
const crearProducto = async ({ nombre, descripcion, precio, stock, categoria, imagen }) => {
    const consulta = `
        INSERT INTO productos (nombre, descripcion, precio, stock, categoria, imagen)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;
    const values = [nombre, descripcion, precio, stock, categoria, imagen];
    const { rows } = await pool.query(consulta, values);
    return rows[0];
};

// 5. Editar un producto existente por ID en PostgreSQL
const actualizarProducto = async (id, { nombre, descripcion, precio, stock, categoria, imagen }) => {
    const consulta = `
        UPDATE productos
        SET nombre = $1,
            descripcion = $2,
            precio = $3,
            stock = $4,
            categoria = $5,
            imagen = $6
        WHERE id = $7
        RETURNING *
    `;
    const values = [nombre, descripcion, precio, stock, categoria, imagen, id];
    const { rows, rowCount } = await pool.query(consulta, values);

    if (!rowCount) throw { code: 404, message: 'Producto no encontrado' };
    return rows[0];
};

// 6. Eliminar un producto por ID en PostgreSQL
const eliminarProductoPorId = async (id) => {
    const consulta = 'DELETE FROM productos WHERE id = $1 RETURNING *';
    const { rows, rowCount } = await pool.query(consulta, [id]);

    if (!rowCount) throw { code: 404, message: 'Producto no encontrado' };
    return rows[0];
};

module.exports = {
    obtenerProductos,
    registrarUsuario,
    verificarCredenciales,
    crearProducto,
    actualizarProducto,
    eliminarProductoPorId
};