import Query from "../Query";

export default class Delete extends Query {
  constructor() {
    super("DELETE");
  }

  toString(): string {
    return "DELETE FROM " + this.tableName + (this.whereStatement !== null ? " " + this.whereStatement : "") + ";";
  }

  exec(cback: Function): void {
    this.queryParams = this.whereParams;
    super.exec(cback);
  }
}
