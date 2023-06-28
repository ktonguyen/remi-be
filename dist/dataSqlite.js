"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlService = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
class SqlService {
    constructor() {
        // Private constructor ensures singleton instance
    }
    static instance() {
        if (!this._instance) {
            return new SqlService();
        }
        return this._instance;
    }
    initialize() {
        SqlService.db = new sqlite3_1.default.Database('./db/funnyvideo.db');
        this.initTable();
        return SqlService._instance;
    }
    getDb() {
        return SqlService.db;
    }
    initTable() {
        SqlService.db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
        SqlService.db.run(`
        CREATE TABLE IF NOT EXISTS videos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            userId INTEGER NOT NULL,
            title TEXT NOT NULL,
            like INTEGER NOT NULL DEFAULT 0,
            dislike INTEGER NOT NULL DEFAULT 0,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
    }
}
exports.SqlService = SqlService;
