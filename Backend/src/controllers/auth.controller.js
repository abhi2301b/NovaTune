const usermodel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function registerUser(req, res) {
    const { username, email, password, role="user" } = req.body;

    const isUserExist = await usermodel.findOne({
        $or: [{ username }, { email }]
    })
    if (isUserExist) {
        return res.status(409).json({ message: 'User already exists' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = new usermodel({
        username,
        email,
        password: hash,
        role
    })
    await user.save();
    const token = jwt.sign({ 
        id: user._id, 
        role: user.role 
    },  process.env.JWT_SECRET)

    res.cookie('token', token);

    res.status(201).json({ 
        message: 'User registered successfully',
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })

}

async function loginUser(req, res) {
    const {username, email, password} = req.body;
    
    const user = await usermodel.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ 
        id: user._id, 
        role: user.role 
    }, process.env.JWT_SECRET);

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false, 
    });

    res.status(200).json({ 
        message: 'Login successful',
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    });
}

async function logoutUser(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
    });
    res.status(200).json({ message: 'Logout successful' });
}

async function getCurrentUser(req, res) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await usermodel.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.json({
            user,
        });
    } catch (err) {
        res.status(401).json({
            message: "Unauthorized",
        });
    }
}

module.exports = { registerUser, loginUser, logoutUser, getCurrentUser };