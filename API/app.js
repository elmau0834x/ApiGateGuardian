import express from "express";
import morgan from "morgan";
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from "http";
import { Server } from "socket.io";
import doorsRoutes from './src/routers/doors.routes.js';
import usersRoutes from './src/routers/users.routes.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const allowedOrigins = ['http://localhost:3000', 'http://example.com', 'http://localhost:4200', 'exp://192.168.137.186:8081'];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GateGuardian API",
      version: "1.0.0",
      description: "Documentación de la API para el sistema GateGuardian",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local",
      },
    ],
  },
  apis: ["./src/routers/*.js", "./src/controllers/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Ruta Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(cors(corsOptions));
app.set("port", process.env.PORT || 3000);
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.get("/gg", (req, res) => {
  res.json({ message: "Welcome to GateGuardian API" });
});

app.use("/gg/doors", doorsRoutes);
app.use("/gg/users", usersRoutes);

// Socket.io connection
let connectedClients = {}; // Para almacenar los clientes conectados

io.on("connection", (socket) => {
  console.log(`Nuevo cliente conectado: ${socket.id}`);

  // Almacenar el cliente conectado en el objeto
  connectedClients[socket.id] = socket;

  // Notificar a todos los clientes que un nuevo cliente se ha conectado
  io.emit("clientConnected", {
    message: `Cliente ${socket.id} se ha conectado.`,
  });

  // Escuchar eventos personalizados desde el cliente
  socket.on("customEvent", (data) => {
    console.log("Evento personalizado recibido:", data);
    // Procesar datos y emitir una respuesta
    socket.emit("customResponse", { message: "Evento procesado correctamente" });
  });

  // Escuchar desconexión
  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
    
    // Eliminar el cliente desconectado del objeto
    delete connectedClients[socket.id];

    // Notificar a todos los clientes que un cliente se ha desconectado
    io.emit("clientDisconnected", {
      message: `Cliente ${socket.id} se ha desconectado.`,
    });
  });
});

// Exportar io para usarlo en los controladores
export { app, httpServer, io };
