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
    
}

module.exports = DbService;