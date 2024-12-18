import bcrypt from "bcryptjs";

export async function hashPassword(contrasenya){
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(contrasenya, salt);
    return contrasenya
}