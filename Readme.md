# GateGuardian API

La **GateGuardian API** es una solución diseñada para gestionar el acceso a puertas mediante huellas dactilares, claves temporales y registros de actividad. Esta API permite la integración con dispositivos IoT como lectores de huellas y controladores de servos, proporcionando una plataforma segura y eficiente para la administración de accesos.

## Características principales

- **Gestión de puertas**: Crear, actualizar, eliminar y consultar puertas.
- **Gestión de usuarios**: Registrar, autenticar y administrar usuarios.
- **Control de acceso**: Validar huellas dactilares y claves temporales para permitir o denegar el acceso.
- **Registros de actividad**: Registrar intentos de acceso y consultar logs históricos.
- **Soporte para dispositivos IoT**: Integración con hardware como lectores de huellas y servos.

## Endpoints principales

### Usuarios
- **POST /gg/users/createAccount**: Crear una nueva cuenta de usuario.
- **POST /gg/users/login**: Validar credenciales de usuario (inicio de sesión).
- **GET /gg/users/getAll**: Obtener todos los usuarios registrados.
- **GET /gg/users/getOne/{email}**: Obtener un usuario por su correo electrónico.
- **PUT /gg/users/updateOne/{email}**: Actualizar información de un usuario.
- **DELETE /gg/users/deleteOne/{id}**: Eliminar un usuario por su ID.

### Puertas
- **POST /gg/doors/insertOne**: Registrar una nueva puerta.
- **GET /gg/doors/getAll**: Obtener todas las puertas registradas.
- **GET /gg/doors/getOne/{id}**: Obtener información de una puerta específica.
- **PUT /gg/doors/updateOne/{id}**: Actualizar información de una puerta.
- **DELETE /gg/doors/deleteOne/{id}**: Eliminar una puerta por su ID.
- **POST /gg/doors/validateAccess**: Validar el acceso a una puerta mediante huella o clave.
- **POST /gg/doors/registerFingerprint**: Registrar una nueva huella dactilar.
- **POST /gg/doors/registerLog**: Registrar un intento de acceso en los logs.

### Logs y alertas
- **GET /gg/doors/getLogs**: Obtener los registros de actividad de una puerta.
- **GET /gg/doors/getAlerts**: Consultar alertas asociadas a una puerta.
- **POST /gg/doors/addAlert**: Agregar una alerta a una puerta.
- **POST /gg/doors/removeAlert**: Eliminar una alerta de una puerta.

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-repositorio/gateguardian-api.git