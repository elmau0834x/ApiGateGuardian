import { Schema, model } from "mongoose";

// Subesquema para los logs
const logSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  action: { type: String, },
  user_name: { type: String, },
  success: { type: Boolean, } // Indica si el intento fue exitoso
});

// Subesquema para los dispositivos de E/S
const ioDeviceSchema = new Schema({ 
  ioDevice_id: { type: String,},
  name: { type: String, },
  status: { type: Boolean, }
});

// Subesquema para las alertas
const alertSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  type: { type: String },
  message: { type: String }
});

const allowedUsersSchema = new Schema({
  _id: { type: String},
  name: { type: String, required: true },
});

// Esquema principal para la puerta
const doorsSchema = new Schema(
  {
    door_id: { type: String, required: true },
    name: { type: String, required: true },
    status: { type: Boolean, required: true },
    allowedUsers: [allowedUsersSchema], // IDs de usuarios permitidos
    log: [logSchema], // Documento embebido
    ioDevices: [ioDeviceSchema], // Documento embebido
    alerts: [alertSchema] // Documento embebido
  },
  {
    versionKey: false,
    timestamps: true
  }
);

export default model("Door", doorsSchema);