const Select = require("./classes/Queries/Select");
const Insert = require("./classes/Queries/Insert");
const Update = require("./classes/Queries/Update");
const Delete = require("./classes/Queries/Delete");
const Table = require("./classes/Table");
const Database = require("./classes/Database");
const Query = require("./classes/Query");
const InvalidFieldError = require("./classes/Errors/InvalidFieldError");
const ConnectionFailedError = require("./classes/Errors/ConnectionFailedError");
const InvalidJoinTypeError = require("./classes/Errors/InvalidJoinTypeError");
const WhereAlreadyPopulatedException = require("./classes/Errors/WhereAlreadyPopulatedException");

let db;
module.exports = function(config, cback) {
    db = new Database(config);
    Query(db);
    let returning = {
        Select: Select(db),
        Insert: Insert(db),
        Update: Update(db),
        Delete: Delete(db),
        InvalidFieldError,
        ConnectionFailedError,
        InvalidJoinTypeError,
        WhereAlreadyPopulatedException,
        Database: db,
    };

    db.meta((excep) => {
        if (excep) {
            throw excep;
        }
        if (Object.keys(db.tables).length > 0) {
            Object.keys(db.tables).forEach(table => {
                returning[table] = new (Table(db))(table, Object.keys(db.tables[table]));
            });
        }
        cback(returning);
    });

};