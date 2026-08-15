import db from "../config/db.js";
import { v4 as uuidv4 } from 'uuid';

export default class resena {
    constructor() { }

    // 1. Crear una nueva reseña
    async crear({ id_usuario = null, nombre_autor, nombre_consulta, titulo, comentario, calificacion }) {
        const id_seguro = uuidv4(); // Generar un UUID para la nueva reseña

        // Genera la fecha/hora exacta de Santiago de Chile sin importar dónde corra el servidor
        const fechaChile = new Date().toLocaleString("sv-SE", { timeZone: "America/Santiago" });
        // El formato "sv-SE" nos devuelve limpiamente: "YYYY-MM-DD HH:MM:SS"


        const sql = `
            INSERT INTO ac_resenas (
                id, id_usuario, nombre_autor, nombre_consulta,
                titulo, comentario, calificacion, activo, creado_en, actualizado_en
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
            `;

        // Retornar un objeto con los datos de la nueva reseña creada
        await db.execute(sql, [
            id_seguro,
            id_usuario,
            nombre_autor,
            nombre_consulta,
            titulo,
            comentario,
            calificacion,
            fechaChile,
            fechaChile,
        ]);

        // Retornar un objeto con los datos de la nueva reseña creada
        return {
            id: id_seguro,
            id_usuario,
            nombre_autor,
            nombre_consulta,
            titulo,
            comentario,
            calificacion,
            creado_en: fechaChile,
        };

    }

    // 2. listar todas las reseñas activas
    async seleccionarActivas(esDashboard = false) {
        // Si es para el dashboard, no filtramos por activo
        const condicion = esDashboard ? "1 = 1" : "activo = 1";

        const sql = `
            SELECT id, id_usuario, nombre_autor, nombre_consulta,
            titulo, comentario, calificacion, activo,
            DATE_FORMAT(creado_en, '%Y-%m-%d %H:%i:%s') AS creado_en,
            DATE_FORMAT(actualizado_en, '%Y-%m-%d %H:%i:%s') AS actualizado_en
            FROM ac_resenas
            WHERE ${condicion}
            ORDER BY creado_en DESC
        `;


        // Ejecutar la consulta SQL para obtener las reseñas activas
        const [resenas] = await db.execute(sql);
        return resenas;
    }

    // 3. actualizar una reseña existente
    async actualizar(id, titulo, comentario, calificacion) {
        const sql = `
                UPDATE ac_resenas
                SET titulo = ?, comentario = ?, calificacion = ?, actualizado_en = NOW()
                WHERE id = ? AND activo = 1;
            `;

        // Ejecutar la consulta SQL para actualizar la reseña
        const [resultado] = await db.execute(sql, [titulo, comentario, calificacion, id]);

        return resultado.affectedRows > 0; // Retorna true si se actualizó alguna fila, false en caso contrario
    }

    // 4. desactivar una reseña existente
    async desactivarResena(id) {
        const sql = `
                UPDATE ac_resenas
                SET activo = 0, actualizado_en = NOW()
                WHERE id = ? AND activo = 1;
            `;

        // Ejecutar la consulta SQL para desactivar la reseña
        const [resultado] = await db.execute(sql, [id]);

        return resultado.affectedRows > 0; // Retorna true si se desactivó alguna fila, false en caso contrario

    }

    // 5. obtener la puntuación general de todas las reseñas activas
    async obtenerPuntuacionGeneral() {
        const sql = `
                SELECT 
                    ROUND (IFNULL(AVG(calificacion), 0), 1) AS promedio, 
                    COUNT(*) AS totalResenas
                FROM ac_resenas
                WHERE activo = 1;
            `;
        const [resultado] = await db.execute(sql);
        return resultado[0];
    }

}
