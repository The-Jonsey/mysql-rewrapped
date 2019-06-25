import * as mysql from "mysql";
import { Pool } from "mysql";
import ConnectionFailedError from "./Errors/ConnectionFailedError";

export default class Database {
  public static db: Database;
  private readonly dbname: string;
  public connectionPool: Pool;
  public readonly tables: any;
  private conf: object;

  constructor(conf: any) {
    this.dbname = conf.database;
    this.connectionPool = mysql.createPool(conf);
    this.tables = {};
    this.conf = conf;
    Database.db = this;
  }

  meta(cback: Function, counter: number = 0) {
    if (counter >= 600) {
      cback(new ConnectionFailedError("The connection was not able to be established in a timely manner"));
    }
    this.connectionPool.getConnection(err => {
      if (err) {
        setInterval(() => {
          this.meta(cback, counter + 1);
        }, 50);
      }
      this.connectionPool.query("SHOW TABLES;", (error, results) => {
        if (error) {
          setInterval(() => {
            this.meta(cback, counter + 1);
          }, 50);
        }
        if (results !== undefined) {
          if (results.length === 0) {
            if (cback) {
              return cback();
            }
          }
          results.forEach((table: any) => {
            this.tables[table["Tables_in_" + this.dbname]] = {};
          });
          let len = Object.keys(this.tables).length;
          let counter = 0;
          Object.keys(this.tables).forEach(table => {
            this.connectionPool.query("describe " + table, (error, results) => {
              results.forEach((col: any) => {
                this.tables[table][col["Field"]] = col["Type"];
              });
              counter++;
              if (counter === len) {
                if (cback) cback();
              }
            });
          });
        }
      });
    });
  }
}
