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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app")); // Import your Express app instance
const websocketServer_1 = require("../websocketServer");
const time = new Date().getTime();
const socket_io_client_1 = require("socket.io-client");
describe('Socket.io Events', () => {
    let io = websocketServer_1.SocketIOService.instance().getServer();
    it('should receive a socket message', (done) => {
        io.on('connection', (socket) => {
            socket.on('shareVideo', (message) => {
                expect(message).toBe('Hello, shareVideo!');
                // Finish the test once the message is received
                done();
            });
        });
        // Send a Socket.io message
        const socket = (0, socket_io_client_1.io)(`http://localhost:8080`);
        socket.on('connect', () => {
            socket.emit('shareVideo', 'Hello, shareVideo!');
        });
    });
});
describe('Authentication Endpoints', () => {
    describe('POST /signin', () => {
        it('should return a token and user information on successful authentication', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/auth/signin').set('Content-Type', 'application/json')
                .send({ email: '123456a@gmail.com', password: '1' });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toHaveProperty('email', '123456a@gmail.com');
        }));
        it('should return an error when email or password is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/auth/signin').set('Content-Type', 'application/json')
                .send({ email: 'invalid@example.com', password: 'invalidpassword' });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Invalid email or password');
        }));
    });
    describe('POST /signup', () => {
        it('should return a success message on successful signup', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/auth/signup').set('Content-Type', 'application/json')
                .send({ name: 'Nguyen 1', email: `${time}@example.com`, password: 'password123' });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("result", { "success": "success" });
        }));
        it('should return an error when user already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/auth/signup').set('Content-Type', 'application/json')
                .send({ name: 'Nguyen 1', email: `${time}@example.com`, password: 'password123' });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'User already exist');
        }));
    });
});
describe('Videos', () => {
    describe('POST /share', () => {
        it('should share successfull video', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/auth/signin').set('Content-Type', 'application/json')
                .send({ email: '123456a@gmail.com', password: '1' });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toHaveProperty('email', '123456a@gmail.com');
            const resShare = yield (0, supertest_1.default)(app_1.default)
                .post('/api/share').set('Content-Type', 'application/json')
                .set('authorization', `Bearer ${response.body.token}`)
                .send({ title: '123456a@gmail.com share', url: 'https://youtube.com?v=1111' });
            expect(resShare.status).toBe(200);
            expect(resShare.body).toHaveProperty('url', 'https://youtube.com?v=1111');
        }));
        it('should return an error when title or url is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/auth/signin').set('Content-Type', 'application/json')
                .send({ email: '123456a@gmail.com', password: '1' });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toHaveProperty('email', '123456a@gmail.com');
            const resShare = yield (0, supertest_1.default)(app_1.default)
                .post('/api/share').set('Content-Type', 'application/json')
                .set('authorization', `Bearer ${response.body.token}`)
                .send({ title: '123456a@gmail.com share', url: '' });
            expect(resShare.status).toBe(400);
            expect(resShare.body).toHaveProperty('error', 'Invalid data');
        }));
    });
    describe('POST /videos', () => {
        it('should return list videos', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/videos').set('Content-Type', 'application/json')
                .send({ offset: 0, size: 10 });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("total");
            expect(response.body).toHaveProperty("videos");
        }));
    });
});
