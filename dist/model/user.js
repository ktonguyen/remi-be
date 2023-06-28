"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const dataSqlite_1 = require("../dataSqlite");
class User {
    constructor(name, email, password) {
        this.id = 0;
        this.name = name;
        this.email = email;
        this.password = password;
    }
    insert() {
        const self = this;
        return new Promise((resolve, reject) => {
            try {
                let sql = `INSERT INTO users(name,email,password) VALUES (?,?,?)`;
                let params = [self.name, self.email, self.password];
                dataSqlite_1.SqlService.instance().getDb().run(sql, params, function (err) {
                    if (err) {
                        return reject({ error: err.message });
                    }
                    return resolve({ success: "success" });
                });
            }
            catch (err) {
                console.log("insert err", err);
                return reject({ error: err.message });
            }
        });
    }
    findByEmail() {
        const self = this;
        return new Promise((resolve, reject) => {
            try {
                let sql = `SELECT * FROM users WHERE email = ?`;
                let params = [self.email];
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
    isValid() {
        return this.name.length > 0 && this.email.length > 0 && this.password.length > 0;
    }
}
exports.User = User;
