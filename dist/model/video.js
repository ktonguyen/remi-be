"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Video = void 0;
const dataSqlite_1 = require("../dataSqlite");
class Video {
    constructor(title, url, userId) {
        this.id = 0;
        this.title = title;
        this.url = url;
        this.userId = userId;
        this.like = 0;
        this.disklike = 0;
    }
    setId(id) {
        this.id = id;
    }
    insert() {
        const self = this;
        return new Promise((resolve, reject) => {
            try {
                let sql = `INSERT INTO videos(url,title,userId,like,dislike) VALUES (?,?,?,?,?)`;
                let params = [self.url, self.title, self.userId, self.like, self.disklike];
                dataSqlite_1.SqlService.instance().getDb().run(sql, params, (err) => {
                    if (err) {
                        return reject({ error: err.message });
                    }
                    return resolve({ success: "sucess" });
                });
            }
            catch (err) {
                console.log("insert err", err);
                return reject({ error: err.message });
            }
        });
    }
    findById() {
        const self = this;
        return new Promise((resolve, reject) => {
            try {
                let sql = `SELECT * FROM videos WHERE email = ?`;
                let params = [self.id];
                return dataSqlite_1.SqlService.instance().getDb().get(sql, params, function (err, row) {
                    if (err) {
                        return reject({ error: err.message });
                    }
                    return resolve(row);
                });
            }
            catch (err) {
                return reject({ error: err.message });
            }
        });
    }
    static getAllVideos() {
        return new Promise((resolve, reject) => {
            try {
                let sql = `SELECT count(1) total FROM videos`;
                return dataSqlite_1.SqlService.instance().getDb().get(sql, [], function (err, row) {
                    if (err) {
                        return reject({ error: err.message });
                    }
                    return resolve(row);
                });
            }
            catch (err) {
                return reject({ error: err.message });
            }
        });
    }
    static getMaxId(userId) {
        return new Promise((resolve, reject) => {
            try {
                let sql = `SELECT max(id) maxId FROM videos where userId = ?`;
                return dataSqlite_1.SqlService.instance().getDb().get(sql, [userId], function (err, row) {
                    if (err) {
                        return reject({ error: err.message });
                    }
                    return resolve(row);
                });
            }
            catch (err) {
                return reject({ error: err.message });
            }
        });
    }
    static getVideos(offset, size) {
        return new Promise((resolve, reject) => {
            try {
                let sql = `
                SELECT v.id, u.name shareBy, v.url, v.title, v.createdAt FROM videos v 
                join users u on u.id = v.userId
                ORDER BY v.createdAt DESC
                LIMIT ${size} OFFSET ${offset}
                `;
                return dataSqlite_1.SqlService.instance().getDb().all(sql, [], function (err, row) {
                    if (err) {
                        return reject({ error: err.message });
                    }
                    return resolve(row);
                });
            }
            catch (err) {
                return reject({ error: err.message });
            }
        });
    }
    isValid() {
        return this.url.length > 0 && this.title.length > 0 && this.userId > 0;
    }
}
exports.Video = Video;
