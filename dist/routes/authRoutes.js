"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const keys_1 = require("../config/keys");
const router = (0, express_1.Router)();
router.post('/login', (req, res) => {
    // In a real-world scenario, validate the user's credentials here
    const { username, password } = req.body;
    // Hash and store the password in the database
    const hashedPassword = bcrypt_1.default.hashSync(password, 10);
    // Generate JWT token
    const token = jsonwebtoken_1.default.sign({ username }, keys_1.secretKey, { expiresIn: '1h' });
    // Return the token
    res.json({ token });
});
exports.default = router;
