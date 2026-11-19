const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const {
    obtenerProductos,
    registrarUsuario,
    verificarCredenciales,
    crearProducto,
    actualizarProducto,
    eliminarProductoPorId
} = require('./consultas');
const { reportarConsulta, verificarToken, verificarAdmin } = require('./middlewares');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || 'esta_es_una_llave_secreta_muy_segura';

// Middlewares globales
app.use(express.json());
app.use(cors());
app.use(reportarConsulta); // Registra cada petición en consola

// Helper para normalizar los campos recibidos desde el frontend o desde la BD
const normalizarDatosProducto = (body = {}) => {
    const nombre = body.nombre ?? body.name ?? '';
    const descripcion = body.descripcion ?? body.desc ?? '';
    const precio = Number(body.precio ?? body.price);
    const stock = Number(body.stock ?? 0);
    const categoria = body.categoria ?? body.category ?? 'Panadería';
    const imagen = body.imagen ?? body.img ?? '';

    return { nombre, descripcion, precio, stock, categoria, imagen };
};

// --- RUTAS DE LA API ---

// 1. Ruta pública para ver el catálogo de productos
app.get('/productos', async (req, res) => {
    try {
        const productos = await obtenerProductos();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 1b. Crear producto (Solo Admin)
app.post('/productos', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const datos = normalizarDatosProducto(req.body);

        if (!datos.nombre.trim() || Number.isNaN(datos.precio) || datos.precio <= 0 || Number.isNaN(datos.stock) || datos.stock < 0) {
            return res.status(400).json({ error: 'Datos de producto inválidos (revisa nombre, precio y stock).' });
        }

        const nuevoProducto = await crearProducto({
            ...datos,
            nombre: datos.nombre.trim(),
            descripcion: datos.descripcion.trim(),
            imagen: datos.imagen.trim()
        });

        res.status(201).json({ mensaje: 'Producto creado con éxito', producto: nuevoProducto });
    } catch (error) {
        res.status(error.code || 500).json({ error: error.message });
    }
});

// 1c. Editar producto por ID (Solo Admin)
app.put('/productos/:id', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const datos = normalizarDatosProducto(req.body);

        if (!datos.nombre.trim() || Number.isNaN(datos.precio) || datos.precio <= 0 || Number.isNaN(datos.stock) || datos.stock < 0) {
            return res.status(400).json({ error: 'Datos de producto inválidos (revisa nombre, precio y stock).' });
        }

        const productoActualizado = await actualizarProducto(id, {
            ...datos,
            nombre: datos.nombre.trim(),
            descripcion: datos.descripcion.trim(),
            imagen: datos.imagen.trim()
        });

        res.json({ mensaje: 'Producto actualizado con éxito', producto: productoActualizado });
    } catch (error) {
        res.status(error.code || 500).json({ error: error.message });
    }
});

// 1d. Eliminar producto por ID (Solo Admin)
app.delete('/productos/:id', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const productoEliminado = await eliminarProductoPorId(id);
        res.json({ mensaje: 'Producto eliminado con éxito', producto: productoEliminado });
    } catch (error) {
        res.status(error.code || 500).json({ error: error.message });
    }
});

// 2. Ruta para registrar un nuevo usuario (asigna 'cliente' por defecto)
app.post('/usuarios', async (req, res) => {
    try {
        const { email, password, lenguage } = req.body;
        const rolPorDefecto = 'cliente'; // Blindaje: todo registro público entra como cliente
        const nuevoUsuario = await registrarUsuario(email, password, rolPorDefecto, lenguage);
        res.status(201).json({ mensaje: 'Usuario registrado con éxito', usuario: nuevoUsuario });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Ruta para el Login (Genera el token JWT con el rol incluido)
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await verificarCredenciales(email, password);

        const token = jwt.sign({ email: usuario.email, rol: usuario.rol }, SECRET_KEY, { expiresIn: '1h' });

        res.json({
            mensaje: 'Autenticación exitosa',
            token,
            rol: usuario.rol
        });
    } catch (error) {
        res.status(error.code || 500).json({ error: error.message });
    }
});

// 4. Ruta protegida de ejemplo (Requiere token JWT válido en los Headers)
app.get('/usuarios', verificarToken, async (req, res) => {
    try {
        res.json({ mensaje: `Ruta protegida accedida con éxito por el usuario: ${req.user.email}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Levantar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor encendido y escuchando en el puerto ${PORT}`);
});