import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import resenaRoutes from './routes/resenaRoutes.js'; // Importamos las rutas de resena



dotenv.config();

const app = express();

// Configuración de CORS para permitir solicitudes desde cualquier origen
// Defino link especificos o dominio que puede consumir este backend
const opcionesCors = {
    origin: [
        'http://localhost:3000', 
        'https://ac-resenas.vercel.app',
        'https://ac-resenas.agendaclinicas.cl',
        'https://nativecode-finance.agendaclinicas.cl',
        'https://www.agendaclinicas.cl',
        'https://nativecode-finance.agendaclinicas.cl/dashboard'

    ]

}

app.use(cors());
app.use(express.json());

// Conectamos tus rutas
app.use('/resena', resenaRoutes);

app.get('/', (req, res) => {
    res.json({ ok: true, mensaje: "ACRESEÑAS corriendo perfectamente" });
});

const PORT = process.env.PORT || 3001;

// Un solo listen que levanta la IP universal '0.0.0.0' (necesaria para Linux)
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n======================================================`);
    console.log(`Servidor de AC activo`);
    console.log(`Escuchando en la red interna del puerto: ${PORT}`);
    console.log(`======================================================\n`);
});

// Requerido obligatoriamente para el despliegue serverless en Vercel
export default app;

