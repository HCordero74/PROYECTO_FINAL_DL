const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { obtenerProductos, registrarUsuario, verificarCredenciales } = require('./consultas');
const { reportarConsulta, verificarToken } = require('./middlewares');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || 'esta_es_una_llave_secreta_muy_segura';

// Middlewares globales
app.use(express.json());
app.use(cors());
app.use(reportarConsulta); // Registra cada petición en consola

// --- RUTAS DE LA API ---

// 1. Ruta pública para ver el catálogo de productos
app.get('/productos', verificarToken, async (req, res) => {
    try {
        const productos = await obtenerProductos();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Ruta para registrar un nuevo usuario
app.post('/usuarios', async (req, res) => {
    try {
        const { email, password, rol, lenguage } = req.body;
        const nuevoUsuario = await registrarUsuario(email, password, rol, lenguage);
        res.status(201).json({ mensaje: 'Usuario registrado con éxito', usuario: nuevoUsuario });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Ruta para el Login (Genera el token JWT)
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        await verificarCredenciales(email, password);
        
        // Se crea el token con los datos del usuario
        const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ mensaje: 'Autenticación exitosa', token });
    } catch (error) {
        res.status(error.code || 500).json({ error: error.message });
    }
});

// 4. Ruta protegida de ejemplo (Requiere token JWT válido en los Headers)
app.get('/usuarios', verificarToken, async (req, res) => {
    try {
        // Si el middleware 'verificarToken' pasa, req.user contiene el email
        res.json({ mensaje: `Ruta protegida accedida con éxito por el usuario: ${req.user.email}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Levantar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor encendido y escuchando en el puerto ${PORT}`);
});