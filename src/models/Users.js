import { Schema } from "mongoose";
import { model } from "mongoose";

const usersSchema = new Schema({
    name: String,
    email: String,
    password: String, // Considera almacenar el hash de la contraseña en lugar de la contraseña en texto plano
},{
    versionKey: false,
    timestamps: true,
});

export default model("User", usersSchema);