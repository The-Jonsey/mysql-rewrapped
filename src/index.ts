import Database from "./classes/Database";
import InvalidFieldError from "./classes/Errors/InvalidFieldError";
import Select from "./classes/Queries/Select";
import Insert from "./classes/Queries/Insert";
import Update from "./classes/Queries/Update";
import Delete from "./classes/Queries/Delete";
import ConnectionFailedError from "./classes/Errors/ConnectionFailedError";
import InvalidJoinTypeError from "./classes/Errors/InvalidJoinTypeError";
import WhereAlreadyPopulatedException from "./classes/Errors/WhereAlreadyPopulatedException";
import Table from "./classes/Table";

let returner = async (config: any, cback: Function) => {
  let db = new Database(config);
  let returning: any = {
    Select,
    Insert,
    Update,
    Delete,
    InvalidFieldError,
    ConnectionFailedError,
    InvalidJoinTypeError,
    WhereAlreadyPopulatedException,
    Database: db,
  };

  db.meta((excep: Error) => {
    if (excep) {
      throw excep;
    }
    if (Object.keys(db.tables).length > 0) {
      Object.keys(db.tables).forEach(table => {
        returning[table] = new Table(table, Object.keys(db.tables[table]));
      });
    }
    cback(returning);
  });
};

export default returner;

module.exports = returner;
