const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'tu_contraseña', 
    database: process.env.DB_DATABASE || 'softjobs', 
    port: process.env.DB_PORT || 5432,
    allowExitOnIdle: true
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

module.exports = {
    obtenerProductos,
    registrarUsuario,
    verificarCredenciales
};