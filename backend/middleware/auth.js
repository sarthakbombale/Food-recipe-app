const jwt=require("jsonwebtoken")

const verifyToken = async (req, res, next) => {
    try {
        let token = req.headers["authorization"];

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        token = token.split(" ")[1];
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid token" });
            }
            req.user = decoded;
            next();
        });
    } catch (error) {
        return res.status(500).json({ message: "Token verification failed" });
    }
};

module.exports = verifyToken;