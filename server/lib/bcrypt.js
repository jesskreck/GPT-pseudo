import bcyrpt from 'bcrypt'

export const encryptPassword = async (password) => {
    // generate password salt and hash in one step
    try {
        const saltRounds = 10;
        const salt = await bcyrpt.genSalt(saltRounds);
        const hashPassword = await bcyrpt.hash(password, salt);
        return hashPassword
    } catch (error) {
        console.log("Error: ", error);
    }
}


export const verifyPassword = async (password, hashedPassword) => {
    const verified = bcyrpt.compare(password, hashedPassword);
    return verified;
};