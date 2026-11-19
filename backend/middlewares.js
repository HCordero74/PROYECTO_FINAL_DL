const jwt = require('jsonwebtoken');

// Middleware para reportar las consultas que llegan a la API (opcional)
const reportarConsulta = (req, res, next) => {
    const url = req.url;
    const metodo = req.method;
    console.log(`[LOG SERVER] Hoy ${new Date().toLocaleString()} se ha recibido una consulta en la ruta ${metodo} ${url}`);
    next();
};

// Middleware para verificar la presencia y validez del Token JWT en las cabeceras (Headers)
const verificarToken = (req, res, next) => {
    try {
        const Authorization = req.header("Authorization");
        if (!Authorization) {
            return res.status(401).json({ message: "No se encontró el token de autorización en las cabeceras" });
        }

        const token = Authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Formato de token inválido" });
        }

        // Para verificar el token usando la llave secreta
        const secretKey = process.env.JWT_SECRET || 'esta_es_una_llave_secreta_muy_segura';
        const usuarioValido = jwt.verify(token, secretKey);
        
        req.user = usuarioValido; // Se guardan los datos del usuario para la siguiente función
        next();
    } catch (error) {
        console.error("Error al verificar el token:", error.message);
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
};

const verificarAdmin = (req, res, next) => {
    // req.user fue inyectado previamente por verificarToken
    if (req.user && req.user.rol === 'admin') {
        return next(); // El usuario es admin, puede continuar
    }
    return res.status(403).json({ 
        message: "Acceso denegado. Se requieren privilegios de administrador para realizar esta acción." 
    });
};

module.exports = {
    reportarConsulta,
    verificarToken,
    verificarAdmin
};