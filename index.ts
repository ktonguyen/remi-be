import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoutes from './api/auth';
import protectedRoutes from './api/videos';
import { Server, Socket }  from 'socket.io';
import http from 'http';
import { SocketIOService } from "./websocketServer";
import { SqlService } from './dataSqlite';
import path from 'path';

const app: Application = express();
const allowCrossDomain = (req: Request, res: Response, next: any) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
  res.header(`Access-Control-Allow-Headers`, `Content-Type`);
  next();
};
// Middleware
app.use(express.json());
app.use(cors());
app.use(allowCrossDomain);
app.use(express.static('public'))
app.use('/static', express.static(path.join(__dirname, 'public')))
// Routes
app.use('/auth', authRoutes);
app.use('/api', protectedRoutes);

// 404 Route
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err: any, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const server = http.createServer(app);
SqlService.instance().initialize();
SocketIOService.instance().initialize(server, {
  cors: {
    origin: ['http://localhost:8088', 'http://103.69.193.66:8088'],
    methods: ['GET', 'POST'], // Allow specific HTTP methods
  }
});

const wss = SocketIOService.instance().getServer();

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

export default app;