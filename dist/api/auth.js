"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const keys_1 = require("../config/keys");
const user_1 = require("../model/user");
const router = (0, express_1.Router)();
router.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = new user_1.User("", email, "");
        let result = yield user.findByEmail();
        if (!result) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        if (result === null || result === void 0 ? void 0 : result.error) {
            return res.status(400).json({ error: result.error });
        }
        if (bcrypt_1.default.compareSync(password, result.password || "")) {
            const token = jsonwebtoken_1.default.sign({ email, id: result.id, name: result.name }, keys_1.secretKey, { expiresIn: '4h' });
            res.json({ token, user: { email, id: result.id, name: result.name, accessToken: token } });
        }
        else {
            res.status(400).json({ error: 'Invalid email or password' });
        }
    }
    catch (err) {
        console.log("ress", err);
        res.status(400).json({ error: err.message });
    }
}));
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = bcrypt_1.default.hashSync(password, 10);
        const user = new user_1.User(name, email, hashedPassword);
        if (!user.isValid()) {
            return res.status(400).json({ error: "Invalid data" });
        }
        let userExist = yield user.findByEmail();
        if (userExist === null || userExist === void 0 ? void 0 : userExist.error) {
            return res.status(400).json({ error: userExist.error });
        }
        if (userExist) {
            return res.status(400).json({ error: "User already exist" });
        }
        let result = yield user.insert();
        res.status(200).json({ result });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}));
exports.default = router;
