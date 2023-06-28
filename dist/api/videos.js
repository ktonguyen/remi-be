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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticateToken_1 = require("../middlewares/authenticateToken");
const video_1 = require("../model/video");
const websocketServer_1 = require("../websocketServer");
const router = (0, express_1.Router)();
router.post('/share', authenticateToken_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    // Only accessible with a valid JWT token
    try {
        const { url, title } = req.body;
        const video = new video_1.Video(title, url, (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id);
        if (!video.isValid()) {
            return res.status(400).json({ error: "Invalid data" });
        }
        let result = yield video.insert();
        if (result === null || result === void 0 ? void 0 : result.error) {
            return res.status(400).json({ error: result.error });
        }
        let maxObject = yield video_1.Video.getMaxId((_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id);
        websocketServer_1.SocketIOService.instance().getServer().emit("shareVideo", { url, title, shareBy: (_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.name, senderId: (_d = req === null || req === void 0 ? void 0 : req.user) === null || _d === void 0 ? void 0 : _d.id, id: maxObject.maxId });
        res.status(200).json({ url, title, shareBy: (_e = req === null || req === void 0 ? void 0 : req.user) === null || _e === void 0 ? void 0 : _e.name, message: "Video shared" });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}));
router.post('/videos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Only accessible with a valid JWT token
    try {
        const { offset, size } = req.body;
        const total = yield video_1.Video.getAllVideos();
        const videos = yield video_1.Video.getVideos(offset || 0, size || 10);
        res.status(200).json({ total: total.total, videos });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}));
exports.default = router;
