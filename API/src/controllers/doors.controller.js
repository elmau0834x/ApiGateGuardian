import doorsDAO from "../dao/doors.dao.js";
import usersDao from "../dao/users.dao.js";
import { io } from '../../app.js';

const doorsController = {};

doorsController.insert = async (req, res) => {
    console.log(req.body);
    doorsDAO.insert(req.body)
        .then((result) => {
            cosnole.log(result);
            res.json({
                data:{
                    data: result,
                    message: "Door inserted"
                }
            })
        })
        .catch((err) => {
            res.json({
                error: err
            })
        });
}

doorsController.getAll = async (req, res) => {
    doorsDAO.getAll()
        .then((doors) => {
            res.json({
                data: doors,
                message: "Doors listed"
            })
        })
        .catch((err) => {
            res.json({
                error: err
            })
        });
}

doorsController.getOne = async (req, res) => {
    doorsDAO.getOne(req.params.id)
        .then((door) => {
            res.json({
                data: door,
                message: "Door listed"
            })
        })
        .catch((err) => {
            res.json({
                error: err
            })
        });
}

doorsController.updateOne = async (req, res) => {
    doorsDAO.updateOne(req.params.id, req.body)
        .then((door) => {
            res.json({
                data: door,
                message: "Door updated"
            })
        })
        .catch((err) => {
            res.json({
                error: err
            })
        });
}

doorsController.deleteOne = async (req, res) => {
    doorsDAO.deleteOne(req.params.id)
        .then((door) => {
            res.json({
                data: door,
                message: "Door deleted"
            })
        })
        .catch((err) => {
            res.json({
                error: err
            })
        });
}

doorsController.validateAccess = async (req, res) => {
  const { fingerprintID, door_id } = req.body;
  console.log(req.body);

  try {
    // Buscar al usuario por su fingerprintID
    const user = await usersDao.getUsers().then((users) =>
      users.find((u) => u.user_id === fingerprintID)
    );

    if (!user) {
      return res.status(404).json({
        accessGranted: false,
        message: "Usuario no encontrado",
      });
    }

    // Verificar si el usuario tiene acceso a la puerta
    const door = await doorsDAO.getOne(door_id);
    if (!door) {
      return res.status(404).json({
        accessGranted: false,
        message: "Puerta no encontrada",
      });
    }

    const hasAccess = door.allowedUsers.includes(user.user_id);

    // Registrar el intento en los logs de la puerta
    door.log.push({
      timestamp: new Date(),
      action: "Access Attempt",
      user_id: user.user_id,
      success: hasAccess,
    });
    await door.save();

    // Emitir evento por WebSocket cuando se valide el acceso
    io.emit('accessValidated', { door_id, user_id: user.user_id, success: hasAccess });

    // Responder al ESP32
    if (hasAccess) {
      return res.json({
        accessGranted: true,
        message: "Acceso concedido",
      });
    } else {
      return res.json({
        accessGranted: false,
        message: "Acceso denegado",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      accessGranted: false,
      message: "Error interno del servidor",
    });
  }
};

  //Cuantas veces se abrio en el dia
  doorsController.countAccess = async (req, res) => {
    const { door_id } = req.params;
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
    try {
      const door = await doorsDAO.getOne(door_id);
      if (!door) {
        return res.status(404).json({
          message: "Puerta no encontrada",
        });
      }
  
      const accessCount = door.log.filter((entry) => {
        return (
          entry.timestamp >= startOfDay && entry.timestamp <= endOfDay
        ).length;
      });
  
      res.json({
        accessCount: accessCount,
        message: "Accesos contados",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  };

  doorsController.getAlerts = async (req, res) => {
    const { door_id } = req.params;
  
    try {
      const door = await doorsDAO.getOne(door_id);  
      if (!door) {
        return res.status(404).json({
          message: "Puerta no encontrada",
        });
      }
  
      res.json({
        alerts: door.alerts,
        message: "Alertas obtenidas",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }
  doorsController.getLogs = async (req, res) => {
    const { door_id } = req.params;
  
    try {
      const door = await doorsDAO.getOne(door_id);
      if (!door) {
        return res.status(404).json({
          message: "Puerta no encontrada",
        });
      }
  
      // Emitir el evento con los logs al cliente conectado
      io.emit('logsUpdated', {
        door_id: door_id,
        logs: door.log
      });
  
      res.json({
        logs: door.log,
        message: "Logs obtenidos",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }; 
  
  doorsController.sendLogs = async (req, res) => {
    const { name } = req.body;
    const { door_id } = req.params;
  };

  doorsController.getIODevices = async (req, res) => {
    const { door_id } = req.params;
  
    try {
      const door = await doorsDAO.getOne(door_id);
      if (!door) {
        return res.status(404).json({
          message: "Puerta no encontrada",
        });
      }
  
      res.json({
        ioDevices: door.ioDevices,
        message: "Dispositivos de E/S obtenidos",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }

  doorsController.getAllowedUsers = async (req, res) => {
    const { door_id } = req.params;
  
    try {
      const door = await doorsDAO.getOne(door_id);
      if (!door) {
        return res.status(404).json({
          message: "Puerta no encontrada",
        });
      }
  
      res.json({
        allowedUsers: door.allowedUsers,
        message: "Usuarios permitidos obtenidos",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }

  doorsController.addAllowedUser = async (req, res) => {
    const { door_id } = req.params;
    const { user_id } = req.body;
  
    try {
      const door = await doorsDAO.getOne(door_id);
      if (!door) {
        return res.status(404).json({
          message: "Puerta no encontrada",
        });
      }
  
      // Verificar si el usuario ya está permitido
      if (door.allowedUsers.includes(user_id)) {
        return res.status(400).json({
          message: "El usuario ya tiene acceso a esta puerta",
        });
      }
  
      // Agregar el usuario permitido
      door.allowedUsers.push(user_id);
      await door.save();
  
      res.json({
        message: "Usuario agregado a la lista de permitidos",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }

  doorsController.removeAllowedUser = async (req, res) => {
    const { door_id } = req.params;
    const { user_id } = req.body;
  
    try {
      const door = await doorsDAO.getOne(door_id);
      if (!door) {
        return res.status(404).json({
          message: "Puerta no encontrada",
        });
      }
  
      // Verificar si el usuario está permitido
      if (!door.allowedUsers.includes(user_id)) {
        return res.status(400).json({
          message: "El usuario no tiene acceso a esta puerta",
        });
      }
  
      // Eliminar el usuario permitido
      door.allowedUsers = door.allowedUsers.filter((id) => id !== user_id);
      await door.save();
  
      res.json({
        message: "Usuario eliminado de la lista de permitidos",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }

  doorsController.addAlert = async (req, res) => {
    const { door_id } = req.params;
    const { type, message } = req.body;
  
    try {
      const door = await doorsDAO.getOne(door_id);
      if (!door) {
        return res.status(404).json({
          message: "Puerta no encontrada",
        });
      }
  
      // Agregar la alerta
      door.alerts.push({
        timestamp: new Date(),
        type,
        message,
      });
      await door.save();
  
      res.json({
        message: "Alerta agregada",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }

  doorsController.removeAlert = async (req, res) => {
    const { door_id } = req.params;
    const { alert_id } = req.body;
  
    try {
      const door = await doorsDAO.getOne(door_id);
      if (!door) {
        return res.status(404).json({
          message: "Puerta no encontrada",
        });
      }
  
      // Verificar si la alerta existe
      const alertIndex = door.alerts.findIndex((alert) => alert._id === alert_id);
      if (alertIndex === -1) {
        return res.status(400).json({
          message: "Alerta no encontrada",
        });
      }
  
      // Eliminar la alerta
      door.alerts.splice(alertIndex, 1);
      await door.save();
  
      res.json({
        message: "Alerta eliminada",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }
  doorsController.verificarHuella = async (req, res) => {
    const fingerprintID = req.query.id;
    console.log(fingerprintID);
  
    try {
      const result = await doorsDAO.verificarHuella(fingerprintID);
      console.log(result);
  
      if (result) {
        res.json({
          success: true,
          message: "Huella verificada",
          data: result
        });
      } else {
        res.json({
          success: false,
          message: "Huella no verificada"
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message || "Error interno del servidor"
      });
    }
  };

  doorsController.agregarHuella = async (req, res) => {
    const { fingerprintID } = req.body;
    console.log(fingerprintID);
  
    try {
      const result = await doorsDAO.agregarHuella(fingerprintID);
      console.log(result);
  
      if (result) {
        res.json({
          success: true,
          message: "Huella agregada",
          data: result
        });
      } else {
        res.json({
          success: false,
          message: "Huella no agregada"
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message || "Error interno del servidor"
      });
    }
  };

  doorsController.registerFingerprint = async (req, res) => {
    const { door_id, fingerprint_id, name } = req.body;
  
    if (!door_id || !fingerprint_id || !name) {
      return res.status(400).json({
        success: false,
        message: "Se requieren 'door_id', 'fingerprint_id' y 'name'",
      });
    }
  
    try {
      // Crear el objeto de la huella
      const fingerprint = {
        _id: fingerprint_id,
        name,
      };
  
      // Agregar la huella a la puerta
      const result = await doorsDAO.addFingerprint(door_id, fingerprint);
  
      if (result.modifiedCount > 0) {
        // Registrar un log
        const log = {
          timestamp: new Date(),
          action: "Fingerprint Registered",
          user_name: name,
          success: true,
        };
        await doorsDAO.addLog(door_id, log);
  
        res.json({
          success: true,
          message: "Huella registrada correctamente",
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Puerta no encontrada",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  };

  doorsController.registerLog = async (req, res) => {
    const { door_id, fingerprint_id, action } = req.body;
  
    if (!door_id || !fingerprint_id) {
      return res.status(400).json({
        success: false,
        message: "Se requieren 'door_id' y 'fingerprint_id'",
      });
    }
  
    try {
      // Buscar al usuario por fingerprint_id
      const user = await doorsDAO.getUserByFingerprint(door_id, fingerprint_id);
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado para esta puerta",
        });
      }
  
      // Crear el log
      const log = {
        timestamp: new Date(),
        action: action || "Door Opened",
        user_name: user.name,
        success: true,
      };
  
      // Registrar el log en la base de datos
      const result = await doorsDAO.addLog(door_id, log);
  
      if (result.modifiedCount > 0) {
        res.json({
          success: true,
          message: "Log registrado correctamente",
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Error al registrar el log",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  };
  

export default doorsController;