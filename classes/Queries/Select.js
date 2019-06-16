const InvalidJoinTypeError = require("../Errors/InvalidJoinTypeError");

let Query;

let db;
module.exports = (database) => {
    db = database;
    Query = require("../Query")(db);
    return class Select extends Query {
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
            } else {
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

        distinct() {
            this.isDistinct = true;
            return this;
        }

        /**
         *
         * @param params join formatted as [{target: target table, from: field on main table, to: field on joining table, type: type of join}]
         * @returns {Select}
         */
        join(params) {
            let jointypes = ["INNER", "FULL OUTER", "LEFT", "RIGHT"];
            let statement = "";
            params.forEach(item => {
                if (item.type) {
                    if (jointypes.includes(item.type.toUpperCase())) {
                        statement += item.type.toUpperCase();
                    } else {
                        throw new InvalidJoinTypeError(item.type + " Is not a valid type of join");
                    }
                } else {
                    statement += "INNER"
                }
                statement += " JOIN " + item.target + " ON " + item.from + " = " + item.to + " ";
            });
            this.joinStatement = statement;
            return this;
        }

        groupBy(items) {
            this.groupItems = items.join(", ");
            return this;
        }

        orderBy(items, asc) {
            this.orderItems = items.join(", ");
            this.orderAsc = asc;
            return this;
        }

        toString() {
            return this.type + (this.isDistinct ? " DISTINCT " : "") + " " + this.items + (this.tableName ? " FROM " + this.tableName : "") + " " + (this.joinStatement !== null ? this.joinStatement + " " : "") + (this.whereStatement !== null ? this.whereStatement : "") + (this.groupItems ? " GROUP BY " + this.groupItems : "") + (this.orderItems ? " ORDER BY " + this.orderItems + (this.orderAsc ? " DESC" : " ASC") : "");
        }

        exec(cback) {
            this.queryParams = this.whereParams;
            super.exec(cback);
        }
    };
};