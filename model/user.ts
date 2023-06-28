import { SqlService } from '../dataSqlite';

export class User {
  public id: number;
  public name: string;
  public email: string;
  public password: string;

  constructor(name: string, email: string, password: string) {
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
  
        SqlService.instance().getDb().run(sql, params, function (err: any) {
          if (err) {
            return reject({error:  err.message });
          }
          return resolve({success: "success"});
        });
      } catch (err: any) {
        console.log("insert err", err);
        return reject({error:  err.message });
      }
      
    });
  }

  findByEmail() {
    const self = this;
    return new Promise((resolve, reject) => {
      try {
        let sql = `SELECT * FROM users WHERE email = ?`;
        let params = [self.email];
  
        return SqlService.instance().getDb().get(sql, params, function (err: any, row: any) {
          if (err) {
            return reject({error:  err.message });
          }
          return resolve(row);
        });
      } catch (err: any) {
        return reject({error:  err.message });
      }
      
    });
  }

  isValid() {
    return this.name.length > 0 && this.email.length > 0 && this.password.length > 0;
  }

}