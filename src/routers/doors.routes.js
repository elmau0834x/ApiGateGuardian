import { Router } from "express";
import doorsController from "../controllers/doors.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Doors
 *   description: Endpoints para la gestión de puertas
 */

/**
 * @swagger
 * /gg/doors/insertOne:
 *   post:
 *     summary: Insertar una nueva puerta
 *     tags: [Doors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Door'
 *     responses:
 *       201:
 *         description: Puerta creada correctamente
 */
router.post("/insertOne", doorsController.insert);

router.post("/agregarHuella", doorsController.agregarHuella);

/**
 * @swagger
 * /doors/getLogs:
 *   post:
 *     summary: Obtiene los registros (logs) de una puerta.
 *     description: Recupera los registros de acceso de la puerta especificada.
 *     tags: [Doors]
 *     parameters:
 *       - in: body
 *         name: door_id
 *         description: ID de la puerta para obtener sus registros.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             door_id:
 *               type: string
 *               example: "door123"
 *     responses:
 *       200:
 *         description: Registros de la puerta obtenidos exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-10T14:33:00Z"
 *                       action:
 *                         type: string
 *                         example: "Access Attempt"
 *                       user_id:
 *                         type: string
 *                         example: "user123"
 *                       success:
 *                         type: boolean
 *                         example: true
 *                 message:
 *                   type: string
 *                   example: "Logs obtenidos"
 *       404:
 *         description: Puerta no encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Puerta no encontrada"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error interno del servidor"
 */
router.get("/getLogs", doorsController.getLogs);

/**
 * @swagger
 * /gg/doors/getAll:
 *   get:
 *     summary: Obtener todas las puertas
 *     tags: [Doors]
 *     responses:
 *       200:
 *         description: Lista de puertas
 */
router.get("/getAll", doorsController.getAll);

/**
 * @swagger
 * /gg/doors/getOne/{id}:
 *   get:
 *     summary: Obtener una puerta por ID
 *     tags: [Doors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la puerta
 *     responses:
 *       200:
 *         description: Puerta encontrada
 *       404:
 *         description: Puerta no encontrada
 */
router.get("/getOne/:id", doorsController.getOne);

/**
 * @swagger
 * /gg/doors/updateOne/{id}:
 *   put:
 *     summary: Actualizar puerta por ID
 *     tags: [Doors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la puerta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Door'
 *     responses:
 *       200:
 *         description: Puerta actualizada correctamente
 */
router.put("/updateOne/:id", doorsController.updateOne);

/**
 * @swagger
 * /gg/doors/deleteOne/{id}:
 *   delete:
 *     summary: Eliminar puerta por ID
 *     tags: [Doors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la puerta
 *     responses:
 *       200:
 *         description: Puerta eliminada correctamente
 */
router.delete("/deleteOne/:id", doorsController.deleteOne);

/**
 * @swagger
 * /gg/doors/validateAccess:
 *   post:
 *     summary: Validar acceso a una puerta
 *     tags: [Doors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               door_id:
 *                 type: string
 *               user_email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Acceso validado correctamente
 *       403:
 *         description: Acceso denegado
 */
router.post("/validateAccess", doorsController.validateAccess);

/**
 * @swagger
 * /gg/doors/getDoorById:
 *   post:
 *     summary: Obtener una puerta por ID
 *     tags: [Doors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               door_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Puerta encontrada
 */
router.get("/verificar", doorsController.verificarHuella);
/**
 * @swagger
 * /gg/doors/registerLog:
 *   post:
 *     summary: Registrar un log al abrir la puerta
 *     tags: [Doors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               door_id:
 *                 type: string
 *               user_name:
 *                 type: string
 *               action:
 *                 type: string
 *               success:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Log registrado correctamente
 *       404:
 *         description: Puerta no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.post("/registerLog", doorsController.registerLog);
    
/**
 * @swagger
 * /gg/doors/registerFingerprint:
 *   post:
 *     summary: Registrar una nueva huella
 *     tags: [Doors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               door_id:
 *                 type: string
 *                 description: ID de la puerta
 *               fingerprint_id:
 *                 type: string
 *                 description: ID de la huella (proporcionado por el módulo)
 *               name:
 *                 type: string
 *                 description: Nombre del usuario asociado a la huella
 *     responses:
 *       200:
 *         description: Huella registrada correctamente
 *       400:
 *         description: Datos faltantes
 *       404:
 *         description: Puerta no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.post("/registerFingerprint", doorsController.registerFingerprint);

export default router;
