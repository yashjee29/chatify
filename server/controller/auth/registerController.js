const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { sendVerificationEmail } = require("../../utils/sendEmail");

const userPath = path.join(__dirname, "..", "..", "data", "users.json");

const getUsers = () => {
    if (!fs.existsSync(userPath)) {
        fs.writeFileSync(userPath, JSON.stringify([]));
        return [];
    }

    const data = fs.readFileSync(userPath, "utf-8");

    try {
        const users = JSON.parse(data);
        return Array.isArray(users) ? users : [];
    } catch {
        return [];
    }
};

const saveUsers = (users) => {
    fs.writeFileSync(userPath, JSON.stringify(users, null, 2));
}

const registerController = async (req, res) => {
    try{
        const { name, password } = req.body;
        const email = req.body.email.toLowerCase();
        if(!name || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        }

        const users = getUsers();
        const existingUser = users.find(user => user.email === email);
        
        if(existingUser && existingUser.verified){
            return res.status(400).json({message: "Email already registered"});
        }
        if(existingUser && !existingUser.verified){
            const updatedUsers = users.filter(user => user.email !== email);
            saveUsers(updatedUsers);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = jwt.sign(
            {email},
            process.env.EMAIL_SECRET,
            {expiresIn: "2d"}
        )

        const updatedUsers = users.filter(user => user.email !== email);
        updatedUsers.push({
            id: uuidv4(),
            name,
            email,
            password: hashedPassword,
            verified: false
        })

        saveUsers(updatedUsers);

        await sendVerificationEmail(email, verificationToken);
        res.status(201).json({message: "Registration successful. Please verify your email."});
    }catch(err){
        console.error("Registration error:", err);
        res.status(500).json({message: "Server error during registration"});
    }
}

module.exports = registerController;