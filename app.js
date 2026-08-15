import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import resenaRoutes from './routes/resenaRoutes.js'; // Importamos las rutas de resena



dotenv.config();

const app = express();

// Orígenes autorizados a consumir la API desde un navegador.
// CORS_ORIGINS permite agregar dominios sin modificar el código, separados por coma.
const allowedOrigins = new Set([
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5500',
    'https://ac-resenas.vercel.app',
    'https://ac-resenas.agendaclinicas.cl',
    'https://nativecode-finance.agendaclinicas.cl',
    'https://www.agendaclinicas.cl',
    ...((process.env.CORS_ORIGINS || '')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)),
]);

const opcionesCors = {
    origin(origin, callback) {
        // Clientes como curl, monitoreo y llamadas servidor a servidor no envían Origin.
        if (!origin || allowedOrigins.has(origin)) {
            return callback(null, true);
        }

        return callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
};

app.use(cors(opcionesCors));
app.use(express.json());

// Conectamos tus rutas
app.use('/resena', resenaRoutes);

app.get('/', (req, res) => {
    res.json({ ok: true, mensaje: "ACRESEÑAS corriendo perfectamente" });
});

const PORT = process.env.PORT || 3001;

// Nginx publica la API y se conecta a este proceso por la interfaz local.
app.listen(PORT, '127.0.0.1', () => {
    console.log(`\n======================================================`);
    console.log(`Servidor de AC activo`);
    console.log(`Escuchando en la red interna del puerto: ${PORT}`);
    console.log(`======================================================\n`);
});

// Requerido obligatoriamente para el despliegue serverless en Vercel
export default app;
