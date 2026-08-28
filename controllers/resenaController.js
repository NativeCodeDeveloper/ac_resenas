import resena from "../models/resena.js";

export default class resenaController {
    constructor() { }

    // 1. Post / resena / crear

    static async crear(req, res) {
        try {
            const {
                nombre_autor,
                nombre_consulta,
                titulo,
                comentario,
                calificacion,
                profesional_id,
            } = req.body;

            const autor = typeof nombre_autor === "string" ? nombre_autor.trim() : "";

            const consulta = typeof nombre_consulta === "string" ? nombre_consulta.trim() : "";

            const tituloLimpio = typeof titulo === "string" ? titulo.trim() : "";

            const profesionalIdLimpio = typeof profesional_id === "string" ? profesional_id.trim() : profesional_id;

            const comentarioLimpio = typeof comentario === "string" ? comentario.trim() : "";

            // Validar que todos los campos estén presentes
            if ((!autor && !consulta) || !tituloLimpio || !comentarioLimpio || !calificacion) {
                return res
                    .status(400)
                    .json({ mensaje: "Indica tu nombre o el nombre de tu consulta, además de todos los campos obligatorios" });
            }

            // Validar que la calificación esté en el rango de 1 a 5
            if (calificacion < 1 || calificacion > 5) {
                return res
                    .status(400)
                    .json({ mensaje: "La calificación debe estar entre 1 y 5" });
            }

            const modelo = new resena();

            const nuevaResena = await modelo.crear({
                id_usuario: null,
                profesional_id: profesionalIdLimpio || null,
                nombre_autor: autor || null,
                nombre_consulta: consulta || null,
                titulo: tituloLimpio,
                comentario: comentarioLimpio,
                calificacion,
            });

            return res.json({
                ok: true,
                mensaje: "Reseña creada exitosamente",
                resena: nuevaResena,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensaje: "Error al crear la reseña" });
        }
    }

     // 2. Post / resena / listar (Soporta Web y Dashboard)
    static async listar(req, res) {
        try {
            // El frontend del Dashboard enviará {"esDashboard": true} en el JSON
            const esDashboard = Boolean(req.esDashboard);
            const { profesional_id } = req.body;

            const modelo = new resena();
            const listaResenas = await modelo.seleccionarActivas(esDashboard, profesional_id || null);

            return res.json({ ok: true, resenas: listaResenas });
        } catch (error) {
            console.error("[Resenacontroller] Error al listar", error);
            return res.status(500).json({ mensaje: "Error al listar las reseñas" });
        }
    }

    // 3. Post / resena / actualizar

    static async actualizar(req, res) {
        try {
            const { id, titulo, comentario, calificacion } = req.body;
            // Validar que todos los campos estén presentes
            if (!id || !titulo || !comentario || !calificacion) {
                return res
                    .status(400)
                    .json({ mensaje: "Todos los campos son obligatorios" });
            }
            // Validar que la calificación esté en el rango de 1 a 5
            if (calificacion < 1 || calificacion > 5) {
                return res
                    .status(400)
                    .json({ mensaje: "La calificación debe estar entre 1 y 5" });
            }

            const modelo = new resena();
            await modelo.actualizar(id, titulo, comentario, calificacion);

            return res.json({ ok: true, mensaje: "Reseña actualizada exitosamente" });
        } catch (error) {
            console.error("[ResenaController] Error al actualizar", error);
            return res.status(500).json({ mensaje: "Error al actualizar la reseña" });
        }
    }

    // 4. Post / resena / Desactivar

    static async desactivar(req, res) {
        try {
            const { id } = req.body;

            if (!id) {
                return res
                    .status(400)
                    .json({ mensaje: "El id de la reseña es obligatorio" });
            }

            const modelo = new resena();
            await modelo.desactivarResena(id);

            return res.json({ ok: true, mensaje: "Reseña desactivada exitosamente" });
        } catch (error) {
            console.error("[ResenaController] Error al desactivar", error);
            return res.status(500).json({ mensaje: "Error al desactivar la reseña" });
        }
    }


     // 5. Post / resena / puntuación general
    static async obtenerPuntuacionGeneral(req, res) {
        try {
            const { profesional_id } = req.body;
            const modelo = new resena();
            const resultadoBD = await modelo.obtenerPuntuacionGeneral(profesional_id || null);

            const puntuacion = Array.isArray(resultadoBD) ? resultadoBD[0] : resultadoBD;

            // Si la base de datos no arrojó resultados o el conteo de filas es cero
            if (!puntuacion || puntuacion.totalResenas === 0 || puntuacion.totalResenas === '0') {
                return res.json({ 
                    ok: true,
                    promedio: "0.0", 
                    totalResenas: 0 
                });
            }

            // Retorna los cálculos matemáticos reales del motor de db
            return res.json({
                ok: true,
                promedio: puntuacion.promedio || "0.0",
                totalResenas: parseInt(puntuacion.totalResenas)
            });

        } catch (error) {
            console.error("[ResenaController] Error al obtener la puntuación general", error);
            return res.status(500).json({ mensaje: "Error al obtener la puntuación general" });
        }
    }

}
