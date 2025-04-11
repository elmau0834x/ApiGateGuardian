import Door from "../models/Doors.js";

const doorsDAO = {};

// Insertar una nueva puerta
doorsDAO.insert = async (doorData) => {
  return await Door.create(doorData);
};

// Obtener todas las puertas
doorsDAO.getAll = async () => {
  return await Door.find();
};

// Obtener una puerta por ID
doorsDAO.getOne = async (email) => {
  return await Door.findOne({email:email});
};

// Actualizar una puerta por ID
doorsDAO.updateOne = async (id, doorData) => {
  return await Door.findByIdAndUpdate(id, doorData, { new: true });
};

// Eliminar una puerta por ID
doorsDAO.deleteOne = async (id) => {
  return await Door.findByIdAndDelete(id);
};

// Validar si un usuario tiene acceso a una puerta
doorsDAO.validateAccess = async (door_id, user_id) => {
  const door = await Door.findOne({ door_id });
  if (!door) {
    return { accessGranted: false, message: "Puerta no encontrada" };
  }

  const hasAccess = door.allowedUsers.includes(user_id);
  return {
    accessGranted: hasAccess,
    message: hasAccess ? "Acceso concedido" : "Acceso denegado",
  };
};

// Registrar un intento de acceso en los logs
doorsDAO.logAccessAttempt = async (door_id, user_name, success) => {
  const door = await Door.findOne({ door_id });
  if (!door) {
    throw new Error("Puerta no encontrada");
  }

  // Agregar el intento al log
  door.log.push({
    timestamp: new Date(),
    action: "Access Attempt",
    user_name,
    success,
  });

  // Guardar los cambios
  return await door.save();
};

doorsDAO.getDoorById = async (door_id) => {
  return await Door.findOne({ door_id });
};


doorsDAO.verificarHuella = async (user_id) =>{
  return await Door.findOne({ "allowedUsers._id": user_id });
}

doorsDAO.agregarHuella = async (door_id, user_id) => {
  return await Door.updateOne(
    { door_id },
    { $addToSet: { allowedUsers: { _id: user_id } } }
  );
};

doorsDAO.addLog = async (door_id, log) => {
  return await Door.updateOne(
    { door_id },
    { $push: { log: log } }
  );
};

doorsDAO.addFingerprint = async (door_id, fingerprint) => {
  return await Door.updateOne(
    { door_id },
    { $addToSet: { allowedUsers: fingerprint } } // Evita duplicados
  );
};

doorsDAO.getUserByFingerprint = async (door_id, fingerprint_id) => {
  const door = await Door.findOne({ door_id });
  if (!door) {
    throw new Error("Puerta no encontrada");
  }

  // Buscar el usuario en la lista de usuarios permitidos
  const user = door.allowedUsers.find((u) => u._id === fingerprint_id);
  return user || null;
};


export default doorsDAO;