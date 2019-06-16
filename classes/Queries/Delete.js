let Query;


let db;
module.exports = (database) => {
    db = database;
    Query = require("../Query")(db);
    return class Delete extends Query {
        constructor() {
            super("DELETE");
        }

        toString() {
            return "DELETE FROM " + this.tableName + (this.whereStatement !== null ? " " + this.whereStatement : "") + ";";
        }

        exec(cback) {
            this.queryParams = this.whereParams;
            super.exec(cback);
        }
    };
};