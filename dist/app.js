"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./api/auth"));
const videos_1 = __importDefault(require("./api/videos"));
const http_1 = __importDefault(require("http"));
const websocketServer_1 = require("./websocketServer");
const dataSqlite_1 = require("./dataSqlite");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.static('public'));
app.use('/static', express_1.default.static(path_1.default.join(__dirname, 'public')));
// Routes
app.use('/auth', auth_1.default);
app.use('/api', videos_1.default);
// 404 Route
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
// Error handler
app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});
const server = http_1.default.createServer(app);
dataSqlite_1.SqlService.instance().initialize();
websocketServer_1.SocketIOService.instance().initialize(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'], // Allow specific HTTP methods
    }
});
const wss = websocketServer_1.SocketIOService.instance().getServer();
// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
exports.default = app;
