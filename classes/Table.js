const InvalidFieldError = require("./Errors/InvalidFieldError");
let Select;
let Insert;
let Update;
let Delete;

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
                    if (table !== this.name) {
                        if (module.exports[table] && !module.exports[table].fields.includes(attr)) {
                            missingFields.push(field);
                        }
                    } else {
                        if (!this.fields.includes(attr))
                            missingFields.push(attr);
                    }
                }
            });
        } else {
            fields = ["*"];
        }
        if (missingFields.length > 0) {
            throw new InvalidFieldError("Field(s) not found in table: " + missingFields);
        } else {
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
        } else {
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
        } else {
            return new Insert(items).table(this.name);
        }
    }

    Delete() {
        return new Delete().table(this.name);
    }

}

let db;
module.exports = (database) => {
    db = database;
    Select = require("./Queries/Select")(db);
    Update = require("./Queries/Update")(db);
    Insert = require("./Queries/Insert")(db);
    Delete = require("./Queries/Delete")(db);
    return Table;
};