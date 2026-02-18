const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

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
};

const verifyController = async (req, res) => {
    try{
        const { token } = req.query;
        if(!token){
            return res.status(400).json({message: "Verification token is required"});
        }
        
        const decoded = jwt.verify(token, process.env.EMAIL_SECRET);
        const users = getUsers();
        const user = users.find(u => u.email === decoded.email);
        if(!user){
            return res.status(400).json({message: "Invalid verification token"});
        }

        if(user.verified){
            const loginToken = jwt.sign(
                { id: user.id, email: user.email, name: user.name },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            return res.json({
                token: loginToken,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                }
            });

        }

        user.verified = true;
        saveUsers(users);

        const loginToken = jwt.sign(
            {id: user.id, email: user.email, name: user.name},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        )

        return res.json({
            token: loginToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });

    }catch(err){
        console.error("Verification error:", err);
        return res.status(500).json({message: "Server error during verification"});
    }
}

module.exports = verifyController;