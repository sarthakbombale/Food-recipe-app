const User = require("../models/userModel.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSignUp = async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email and password are required" })
    }
    let user = await User.findOne({ email })
    if (user) {
        return res.status(400).json({ error: "Email already exists" })
    }
    const hashPwd = await bcrypt.hash(password, 10)
    const newUser = await User.create({
        name,
        email,
        password: hashPwd
    })
    let token = jwt.sign({ email, id: newUser._id, name: newUser.name }, process.env.SECRET_KEY)
    return res.status(200).json({ token, user: newUser })

}

const userLogin = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password is required" })
    }
    let user = await User.findOne({ email })
    if (user && await bcrypt.compare(password, user.password)) {
        let token = jwt.sign({ email, id: user._id, name: user.name }, process.env.SECRET_KEY)
        return res.status(200).json({ token, user })
    }
    else {
        return res.status(400).json({ error: "Invalid credentials" })
    }
}

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.json({ name: user.name, email: user.email })
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch user" })
    }
}

module.exports = { userLogin, userSignUp, getUser }