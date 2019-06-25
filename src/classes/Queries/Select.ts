import Query from "../Query";
import InvalidJoinTypeError from "../Errors/InvalidJoinTypeError";

export default class Select extends Query {
  private readonly items: string;
  private joinStatement: string = "";
  private isDistinct: boolean = false;
  private groupItems: string = "";
  private orderItems: string = "";
  private orderAsc: boolean = false;

  constructor(items: Array<any>) {
    super("SELECT");
    let itemsParsed = [];
    let itemsJoined = "";
    if (!items) {
      itemsParsed.push("*");
    } else {
      for (let i = 0; i < items.length; i++) {
        itemsParsed.push(items[i]);
        if (typeof items[i] === "object") {
          itemsParsed.push(items[i].name + " AS " + items[i].as);
        }
      }
      itemsJoined = items.join(", ");
    }
    this.items = itemsJoined;
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
  join(params: Array<any>) {
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
        statement += "INNER";
      }
      statement += " JOIN " + item.target + " ON " + item.from + " = " + item.to + " ";
    });
    this.joinStatement = statement;
    return this;
  }

  groupBy(items: Array<string>) {
    this.groupItems = items.join(", ");
    return this;
  }

  orderBy(items: Array<string>, asc: boolean) {
    this.orderItems = items.join(", ");
    this.orderAsc = asc;
    return this;
  }

  toString() {
    return (
      this.type +
      (this.isDistinct ? " DISTINCT " : "") +
      " " +
      this.items +
      (this.tableName ? " FROM " + this.tableName : "") +
      " " +
      (this.joinStatement ? this.joinStatement + " " : "") +
      (this.whereStatement ? this.whereStatement : "") +
      (this.groupItems ? " GROUP BY " + this.groupItems : "") +
      (this.orderItems ? " ORDER BY " + this.orderItems + (this.orderAsc ? " DESC" : " ASC") : "")
    );
  }

  exec(cback: Function) {
    this.queryParams = this.whereParams;
    super.exec(cback);
  }
}
