let Query;


let db;
module.exports = (database) => {
    db = database;
    Query = require("../Query")(db);
    return class Insert extends Query {
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
    };
};