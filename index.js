import "./database.js";
import { app, httpServer } from "./app.js";

httpServer.listen(app.get('port'), () => {
  console.log(`Server listening on port ${app.get('port')}`);
});