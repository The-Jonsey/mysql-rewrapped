let Query;
let db;
module.exports = (database) => {
    db = database;
    Query = require("../Query")(db);
    return class Update extends Query {

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
            this.setStatement = this.setStatement.substr(0, this.setStatement.length - 2) + " ";
        }

        toString() {
            return this.type + " " + this.tableName + " SET " + this.setStatement + (this.whereStatement !== null ? this.whereStatement : "");
        }

        exec(cback) {
            this.queryParams = this.setParams.concat(this.whereParams);
            super.exec(cback);
        }
    };
};