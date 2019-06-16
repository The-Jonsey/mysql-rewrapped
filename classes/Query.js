const WhereAlreadyPopulatedException = require("./Errors/WhereAlreadyPopulatedException");

class Query {
    /**
     *
     * @param type - type of query e.g "SELECT", "INSERT"
     */
    constructor(type) {
        this.type = type;
        this.whereStatement = "";
        this.whereParams = [];
        this.queryParams = [];
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
     * @returns {Query}
     * @param key - the fieldname for the where
     * @param value - the value for the where
     * @param operator - the comparison operator
     */
    where(key, value, operator) {

        if (this.whereStatement.length > 0) {
            throw new WhereAlreadyPopulatedException();
        }
        let [statement, whereParams] = parseWhere(key, value, operator);
        statement = " WHERE " + statement;
        this.whereStatement = statement;
        this.whereParams = whereParams;
        return this;
    }

    orWhere(key, value, operator) {
        let [statement, whereParams] = parseWhere(key, value, operator);
        statement = " OR " + statement;
        this.whereStatement += statement;
        this.whereParams = this.whereParams.concat(whereParams);
        return this;
    }

    andWhere(key, value, operator) {
        let [statement, whereParams] = parseWhere(key, value, operator);
        statement = " AND " + statement;
        this.whereParams = this.whereParams.concat(whereParams);
        this.whereStatement += statement;
        return this;
    }

    /**
     * Executes the query
     * @param cback - callback function
     */
    exec(cback) {
        let callback = (error, results) => {
            if (error) {
                cback(false);
            } else
                cback(results);
        };
        try {
            if (this.queryParams !== null) {
                db.connectionPool.query(this.toString(), this.queryParams, callback)
            } else
                db.connectionPool.query(this.toString(), callback)
        } catch (e) {
            throw e;
        }
    }
};

const safeOperators = ["=", "<=>", "<>", "!=", ">", ">=", "<", "<=", "like"];

function parseWhere(key, value, operator) {
    let whereParams = [];
    let statement = "";
    if (safeOperators.includes(operator.toLowerCase())) {
        statement += key + ' ' + operator + " ? ";
        whereParams.push(value);
    } else if (operator.toLowerCase() === "in") {
        statement += key + " IN (";
        value.forEach(val => {
            statement += "?, ";
            whereParams.push(val);
        });
        statement = statement.substr(0, statement.length - 2);
        statement += ") ";
    } else if (operator.toLowerCase() === "between") {
        statement += key + " BETWEEN ? AND ? ";
        whereParams.push(value[0]);
        whereParams.push(value[1]);
    } else {
        throw "Invalid Comparison Operator";
    }
    return [statement, whereParams];
}

let db;
module.exports = (database) => {
    db = database;
    return Query;
};