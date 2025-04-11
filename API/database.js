import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(`${process.env.MONGO_URL}`)
.then((db)=> console.log('MongoDB Atlas conect successfull'))
.catch((error)=> console.error(error));

export default mongoose;