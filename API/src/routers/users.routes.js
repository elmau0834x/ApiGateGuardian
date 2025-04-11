import { Router } from "express";
import usersController from "../controllers/users.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints para la gestión de usuarios
 */

/**
 * @swagger
 * /gg/users/createAccount:
 *   post:
 *     summary: Crear una nueva cuenta de usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 */
router.post("/createAccount", usersController.createUser);

/**
 * @swagger
 * /gg/users/getAll:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get("/getAll", usersController.getUsers);

/**
 * @swagger
 * /gg/users/getOne/{email}:
 *   get:
 *     summary: Obtener un usuario por correo
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Correo del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/getOne/:email", usersController.getUserByEmail);

/**
 * @swagger
 * /gg/users/login:
 *   post:
 *     summary: Validar usuario (inicio de sesión)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario validado correctamente
 *       401:
 *         description: Credenciales inválidas
 */
router.post("/login", usersController.validateUser);

/**
 * @swagger
 * /gg/users/updateOne/{email}:
 *   put:
 *     summary: Actualizar usuario por correo
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Correo del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       404:
 *         description: Usuario no encontrado
 */
router.put("/updateOne/:email", usersController.updateUser);

/**
 * @swagger
 * /gg/users/deleteOne/{id}:
 *   delete:
 *     summary: Eliminar usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 */
router.delete("/deleteOne/:id", usersController.deleteUser);

export default router;
