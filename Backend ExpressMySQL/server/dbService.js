const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
});


class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    async getWonGames() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM games WHERE state = 2;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getAllGames() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM games ORDER BY id DESC";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async insertNewGame(name, fields, state) {
        try {
            const date_time = new Date();
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO games (name, fields, date_time, state) VALUES (?,?,?,?);";

                connection.query(query, [name, fields, date_time, state] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
            return {
                id : insertId,
                name : name,
                fields : fields,
                date_time : date_time,
                state : state,
                success : true
            };
        } catch (error) {
            console.log(error);
        }
    }

    async updateGameById(id, fields, state) {
        try {
            id = parseInt(id, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE games SET fields = ?, state = ?  WHERE id = ?";
    
                connection.query(query, [fields, state, id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async deleteGames() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM games;";
    
                connection.query(query, [] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    
}

module.exports = DbService;