import WhereAlreadyPopulatedException from "./Errors/WhereAlreadyPopulatedException";
import Database from "./Database";

export default abstract class Query {
  protected type: string;
  protected whereStatement: string = "";
  protected whereParams: Array<string> = [];
  protected queryParams: Array<string> = [];
  protected tableName: string | undefined;
  protected static safeOperators: Array<string> = ["=", "<=>", "<>", "!=", ">", ">=", "<", "<=", "like"];

  public constructor(type: string) {
    this.type = type;
  }

  public table(table: string): Query {
    this.tableName = table;
    return this;
  }

  where(key: string, value: Array<any> | any, operator: string): Query {
    if (this.whereStatement.length > 0) {
      throw new WhereAlreadyPopulatedException();
    }
    let [statement, whereParams] = this.parseWhere(key, value, operator);
    statement = " WHERE " + statement;
    this.whereStatement = statement;
    this.whereParams = whereParams;
    return this;
  }

  orWhere(key: string, value: Array<any> | any, operator: string): Query {
    let [statement, whereParams] = this.parseWhere(key, value, operator);
    statement = " OR " + statement;
    this.whereStatement += statement;
    this.whereParams = this.whereParams.concat(whereParams);
    return this;
  }

  andWhere(key: string, value: Array<any> | any, operator: string): Query {
    let [statement, whereParams] = this.parseWhere(key, value, operator);
    statement = " AND " + statement;
    this.whereParams = this.whereParams.concat(whereParams);
    this.whereStatement += statement;
    return this;
  }

  private parseWhere(key: string, value: Array<any> | any, operator: string): Array<any> {
    if (!(value instanceof Array)) {
      value = [value];
    }
    let whereParams = [];
    let statement = "";
    if (Query.safeOperators.indexOf(operator.toLowerCase()) > -1) {
      statement += key + " " + operator + " ? ";
      whereParams.push(value[0]);
    } else if (operator.toLowerCase() === "in") {
      statement += key + " IN (";
      value.forEach((val: any) => {
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

  public exec(cback: Function): void {
    let callback = (error: any, results: Array<object>) => {
      if (error) {
        cback(false);
      } else cback(results);
    };
    try {
      if (this.queryParams !== null) {
        Database.db.connectionPool.query(this.toString(), this.queryParams, callback);
      } else Database.db.connectionPool.query(this.toString(), callback);
    } catch (e) {
      throw e;
    }
  }

  public abstract toString(): string;
}
