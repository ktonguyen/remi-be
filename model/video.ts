import { SqlService } from '../dataSqlite';

export class Video {
  private id: number;
  private title: string;
  private url: string;
  private userId: number;
  private like: number;
  private disklike: number;

  constructor(title: string, url: string, userId: number) {
    this.id = 0;
    this.title = title;
    this.url = url;
    this.userId = userId;
    this.like = 0;
    this.disklike = 0;
    
  }
  setId(id: number) {
    this.id = id;
  }

  insert() {
    const self = this;
    return new Promise((resolve, reject) => {
      try {
        let sql = `INSERT INTO videos(url,title,userId,like,dislike) VALUES (?,?,?,?,?)`;
        let params = [self.url, self.title, self.userId, self.like, self.disklike];
        SqlService.instance().getDb().run(sql, params,  (err: any) => {
          if (err) {
            return reject({error:  err.message });
          }
          return resolve({success: "sucess"});
        });
      } catch (err: any) {
        console.log("insert err", err);
        return reject({error:  err.message });
      }
      
    });
  }

  findById() {
    const self = this;
    return new Promise((resolve, reject) => {
      try {
        let sql = `SELECT * FROM videos WHERE email = ?`;
        let params = [self.id];
  
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

  static getAllVideos() {
    return new Promise((resolve, reject) => {
      try {
        let sql = `SELECT count(1) total FROM videos`;
  
        return SqlService.instance().getDb().get(sql, [], function (err: any, row: any) {
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
  static getMaxId(userId: number) {
    return new Promise((resolve, reject) => {
      try {
        let sql = `SELECT max(id) maxId FROM videos where userId = ?`;

  
        return SqlService.instance().getDb().get(sql, [userId], function (err: any, row: any) {
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

  static getVideos(offset: number, size: number) {
    return new Promise((resolve, reject) => {
      try {
        let sql = `
                SELECT v.id, u.name shareBy, v.url, v.title, v.createdAt FROM videos v 
                join users u on u.id = v.userId
                ORDER BY v.createdAt DESC
                LIMIT ${size} OFFSET ${offset}
                `;

        return SqlService.instance().getDb().all(sql, [], function (err: any, row: any) {
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
    return this.url.length > 0 && this.title.length > 0 && this.userId >0;
  }

}