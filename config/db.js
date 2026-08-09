import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Configuración de la conexión a la base de datos
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_DATABASE || 'resenas',
    waitForConnections: true,
    connectionLimit: 10, // maximo 10 conexiones simultaneas activas
    queueLimit: 0, // sin limite de conexiones en cola en espera

    });
    
    // Prueba rápida para que la terminal te avise si la clave o la BD están mal
pool.getConnection()
    .then(connection => {
        console.log("Conexión exitosa a MySQL de phpMyAdmin!");
        connection.release();
    })
    .catch(error => {
        console.error("ERROR DE CONEXIÓN A LA BASE DE DATOS:");
        console.error(error.message);
    });


    // Configuración de reconexión automática
    export default pool;
