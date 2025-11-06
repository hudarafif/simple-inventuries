import bcrypt from "bcrypt";
import User from "../models/User.js";
import connectDB from "../db/connect.js";

const register = async () => {
    try{
        await connectDB();
        const exist = await User.findOne({ email: "admin@gmail.com" });
    if (exist) {
        console.log("⚠️ Admin already exists");
        return;
    }
        const password = process.env.ADMIN_PASSWORD;
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ 
            username: "apip",
            email: "admin@gmail.com", 
            password: hashPassword,
            role: "admin"
        })
        await newUser.save();
        console.log("admin create successfully");
    }catch(err){
        console.log(err);
    }
}

 export {register};