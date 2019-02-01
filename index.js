const mysql = require("mysql");
class Database {
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
                    results.forEach(table => {
                        this.tables[table["Tables_in_" + this.dbname]] = {};
                    });
                    Object.keys(this.tables).forEach((table) => {
                        this.connectionPool.query("describe " + table, (error, results) => {
                            results.forEach(col => {
                                this.tables[table][col["Field"]] = col["Type"];
                            });
                            if (cback)
                                cback();
                        });
                    });
                }
            });
        });
    }
}

class Query {
    /**
     *
     * @param type - type of query e.g "SELECT", "INSERT"
     */
    constructor(type) {
        this.type = type;
        this.whereStatement = null;
        this.whereParams = [];
        this.queryParams = [];
        this.safeOperators = ["=", "<=>", "<>", "!=", ">", ">=", "<", "<=", "like"];
    }

    /**
     *
     * @param table - Table name
     * @returns {Query}
     */
    table(table) {
        this.tableName = table;
        return this;
    }

    /**
     *
     * @param params formatted as {fieldname: {value: value, op: operator}}
     * @returns {Query}
     */
    where(params) {
        let statement = "WHERE ";
        Object.keys(params).forEach((item) => {
            if (this.safeOperators.includes(params[item].op.toLowerCase())) {
                statement += item + ' ' + params[item].op + " ? AND ";
                this.whereParams.push(params[item].value);
            }
            else if (params[item].op.toLowerCase() === "in") {
                statement += item + " IN (";
                params[item].value.forEach(val => {
                    statement += "?, ";
                    this.whereParams.push(val);
                });
                statement = statement.substr(0, statement.length - 2);
                statement += ") AND ";
            }
            else {
                throw "Invalid Comparison Operator";
            }
        });
        statement = statement.substr(0, statement.length - 5);
        this.whereStatement = statement;
        return this;
    }

    /**
     * Executes the query
     * @param cback - callback function
     * @param res - response object - optional
     */
    exec(cback, res) {
        let callback = (error, results) => {
            if (error) {
                cback(false);
            }
            else
                cback(results);
        };
        try {
            if (this.queryParams !== null) {
                db.connectionPool.query(this.toString(), this.queryParams, callback)
            }
            else
                db.connectionPool.query(this.toString(), callback)
        }
        catch(e) {
            if (res)
                res.send(e);
            else
                throw e;
        }
    }
}

class Select extends Query {
    /**
     *
     * @param items - list if items to select formatted as either:
     *              - ["id", "firstname", "lastname"]
     *              - ["id", "firstname", {name: "lastname", as: "surname"}
     */
    constructor(items) {
        super("SELECT");
        if (!items) {
            items = "*";
        }
        else {
            if (typeof items === "string")
                items = JSON.parse(items);
            for (let i = 0; i < items.length; i++) {
                if (typeof items[i] === "object") {
                    items[i] = items[i].name + " AS " + items[i].as;
                }
            }
            items = items.join(", ");
        }
        this.items = items;
        this.joinStatement = null;
    }

    /**
     *
     * @param params join formatted as [{target: target table, from: field on main table, to: field on joining table}]
     * @returns {Select}
     */
    join(params) {
        if (params.length > 2) {
            return false;
        }
        let statement = "";
        params.forEach(item => {
            statement += "INNER JOIN " + item.target + " ON " + item.from + " = " + item.to + " " ;
        });
        this.joinStatement = statement;
        return this;
    }

    toString() {
        return this.type + " " + this.items + " FROM " + this.tableName + " " + (this.joinStatement !== null ? this.joinStatement + " " : "") + (this.whereStatement !== null ? this.whereStatement : "")
    }

    exec(cback) {
        this.queryParams = this.whereParams;
        super.exec(cback);
    }
}

class Update extends Query {

    /**
     *
     * @param fields - list of fields to update formatted as {field: value}
     */
    constructor(fields) {
        super("UPDATE");
        this.setStatement = "";
        this.setParams = [];
        Object.keys(fields).forEach(item => {
            this.setStatement += item + " = ?, ";
            this.setParams.push(fields[item]);
        });
    }

    toString() {
        return this.type + " " + this.tableName + " " + this.setStatement + (this.whereStatement !== null ? this.whereStatement : "");
    }

    exec(cback) {
        this.queryParams = this.setParams.concat(this.whereParams);
        super.exec(cback);
    }
}

class Insert extends Query {
    /**
     *
     * @param fields - list of fields to insert formatted as {field: value}
     */
    constructor(fields) {
        super("INSERT");
        this.fields = Object.keys(fields).join(", ");
        this.valuesParams = [];
        this.values(fields);
    }

    /**
     *
     * @param fields - fields to insert formatted as {field: value}
     * @returns {Insert}
     */
    values(fields) {
        let rowParsed = Array(Object.keys(fields).length + 1).join("?, ");
        rowParsed = rowParsed.substr(0, rowParsed.length - 2);
        Object.keys(fields).forEach((item) => {
            this.valuesParams.push(fields[item]);
        });
        this.valuesStatement = rowParsed;
        return this;
    }

    toString() {
        return "INSERT INTO " + this.tableName + " (" + this.fields + ") VALUES (" + this.valuesStatement + ")"
    }

    exec(cback) {
        this.queryParams = this.valuesParams;
        super.exec(cback)
    }
}

class Delete extends Query {
    constructor() {
        super("DELETE");
    }

    toString() {
        return "DELETE FROM " + this.tableName + (this.whereStatement !== null ? this.whereStatement : "");
    }

    exec(cback) {
        this.queryParams = this.whereParams;
        super.exec(cback);
    }
}

class InvalidFieldError extends Error {
    constructor(args) {
        super(args);
        Error.captureStackTrace(this, InvalidFieldError);
    }
}

class ConnectionFailedError extends Error {
    constructor(args) {
        super(args);
        Error.captureStackTrace(this, ConnectionFailedError);
    }
}

class Table {
    constructor(name, fields) {
        this.name = name;
        this.fields = fields;
    }

    Select(fields) {
        let missingFields = [];
        if (fields && fields !== ["*"] && fields !== "*") {
            fields.forEach(field => {
                if (field instanceof Object) {
                    field = field.name;
                }
                if (!this.fields.includes(field) && !field.includes("."))
                    missingFields.push(field);
                else if (field.includes(".")) {
                    let table = field.split(".")[0];
                    let attr = field.split(".")[1];
                    if (!module.exports[table] || !module.exports[table].fields.includes(attr)) {
                        missingFields.push(field);
                    }
                }
            });
        }
        else {
            fields = ["*"];
        }
        if (missingFields.length > 0) {
            throw new InvalidFieldError("Field(s) not found in table: " + missingFields);
        }
        else {
            return new Select(fields).table(this.name);
        }
    }

    Update(items) {
        let missingFields = [];
        Object.keys(items).forEach((field) => {
            if (!this.fields.includes(field))
                missingFields.push(field);
        });
        if (missingFields.length > 0) {
            throw new InvalidFieldError("Field(s) not found in table: " + missingFields);
        }
        else {
            return new Update(items).table(this.name);
        }
    }

    Insert(items) {
        let missingFields = [];
        Object.keys(items).forEach((field) => {
            if (!this.fields.includes(field))
                missingFields.push(field)
        });
        if (missingFields.length > 0) {
            throw new InvalidFieldError("Field(s) not found in table: " + missingFields);
        }
        else {
            return new Insert(items).table(this.name);
        }
    }

    Delete() {
        return new Delete().table(this.name);
    }

}
let db;
module.exports = function(config, cback) {
    db = new Database(config);
    let returning = {
        Select,
        Insert,
        Update,
        Delete,
        InvalidFieldError,
        ConnectionFailedError,
        Database: db,
    };

    db.meta((excep) => {
        if (excep) {
            throw excep;
        }
        Object.keys(db.tables).forEach(table => {
            returning[table] = new Table(table, Object.keys(db.tables[table]));
        });
        cback(returning);
    });

};