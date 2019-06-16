const mysql = require("mysql");
const ConnectionFailedError = require("./Errors/ConnectionFailedError");
module.exports = class Database {
    constructor(conf) {
        this.dbname = conf.database;
        this.connectionPool = mysql.createPool(conf);
        this.tables = {};
        this.conf = conf;
    }

    meta(cback, counter = 0) {
        if (counter >= 600) {
            cback(new ConnectionFailedError("The connection was not able to be established in a timely manner"));
        }
        this.connectionPool.getConnection((err, conn) => {
            if (err) {
                setInterval(() => {
                    this.meta(cback, counter + 1);
                }, 50)
            }
            this.connectionPool.query("SHOW TABLES;", (error, results) => {
                if (error) {
                    setInterval(() => {
                        this.meta(cback, counter + 1);
                    }, 50)
                }
                if (results !== undefined) {
                    if (results.length === 0) {
                        if (cback) {
                            return cback();
                        }
                    }
                    results.forEach(table => {
                        this.tables[table["Tables_in_" + this.dbname]] = {};
                    });
                    let len = Object.keys(this.tables).length;
                    let counter = 0;
                    Object.keys(this.tables).forEach((table) => {
                        this.connectionPool.query("describe " + table, (error, results) => {
                            results.forEach(col => {
                                this.tables[table][col["Field"]] = col["Type"];
                            });
                            counter++;
                            if (counter === len) {
                                if (cback)
                                    cback();
                            }
                        });
                    });
                }
            });
        });
    }
}