import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import resenaRoutes from './routes/resenaRoutes.js'; // Importamos las rutas de resena

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Conectamos tus rutas
app.use('/resena', resenaRoutes);

app.get('/', (req, res) => {
    res.json({ ok: true, mensaje: "Backend de agendaclinicas.cl corriendo perfectamente" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`Servidor activo en: http://localhost:${PORT}`);
    console.log(`======================================================\n`);
});
