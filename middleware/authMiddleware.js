import jwt from 'jsonwebtoken';


export const verificarTokenAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Toma el string después de 'Bearer'

    if (!token) {
        return res.status(401).json({ ok: false, mensaje: "Acceso denegado. Token no proporcionado." });
    }

    try {
        // Asegúrate de definir JWT_SECRET en tu .env con la misma clave del login

        const secreto = process.env.JWT_SECRET;

        if (!secreto) {
            return res.status(500).json({
                ok: false,
                mensaje: 'JWT_SECRET no está configurado.'
            });
        }
        const usuarioVerificado = jwt.verify(token, secreto);

        // Validamos estrictamente que sea administrador
        if (usuarioVerificado.rol !== 'admin' && usuarioVerificado.role !== 'admin') {
            return res.status(403).json({ ok: false, mensaje: "Acceso denegado. Requiere rol de administrador." });
        }

        req.usuarioLogueado = usuarioVerificado;
        next();
    } catch (error) {
        return res.status(403).json({ ok: false, mensaje: "Token inválido o expirado." });
    }
};