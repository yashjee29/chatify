const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
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

const loginController = async (req, res) => {
    try{
        const email = req.body.email.toLowerCase();
        const password = req.body.password;
        if(!email || !password){
            return res.status(400).json({message: "Email and password are required"});
        }
        const users = getUsers();
        const user = users.find(user => user.email === email);

        if(!user){
            return res.status(401).json({message: "Invalid email or password"});
        }

        if(!user.verified){
            const verificationToken = jwt.sign(
                {email: user.email},
                process.env.EMAIL_SECRET,
                {expiresIn: "2d"}
            );
            await sendVerificationEmail(user.email, verificationToken);
            console.log(`Sent verification email to ${user.email} with token: ${verificationToken}`);
            return res.status(403).json({message: "Please verify your email before logging in"});
        }

        const isMatch = await bycrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({message: "Invalid email or password"});
        }

        const token = jwt.sign(
            {id: user.id, email: user.email, name: user.name},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        )

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        })
    }catch(err){
        console.error("Login error:", err);
        res.status(500).json({message: "Server error during login"});
    }
}

module.exports = loginController;