"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticateToken_1 = require("../middlewares/authenticateToken");
const router = (0, express_1.Router)();
router.get('/protected', authenticateToken_1.authenticateToken, (req, res) => {
    // Only accessible with a valid JWT token
    res.json({ message: 'Protected route accessed successfully', user: req.user });
});
exports.default = router;
