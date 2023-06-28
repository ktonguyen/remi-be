"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIOService = void 0;
const socket_io_1 = require("socket.io");
class SocketIOService {
    constructor() {
        // Private constructor ensures singleton instance
    }
    static instance() {
        if (!this._instance) {
            return new SocketIOService();
        }
        return this._instance;
    }
    initialize(httpServer, opts) {
        SocketIOService.server = new socket_io_1.Server(httpServer, opts);
        return SocketIOService.server;
    }
    ready() {
        return SocketIOService.server !== null;
    }
    getServer() {
        if (!SocketIOService.server) {
            throw new Error('IO server requested before initialization');
        }
        return SocketIOService.server;
    }
    sendMessage(roomId, key, message) {
        this.getServer().to(roomId).emit(key, message);
    }
    emitAll(key, message) {
        this.getServer().emit(key, message);
    }
    getRooms() {
        return this.getServer().sockets.adapter.rooms;
    }
}
exports.SocketIOService = SocketIOService;
