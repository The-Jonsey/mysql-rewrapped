import Query from "../Query";

export default class Update extends Query {
  private setStatement: string;
  private setParams: Array<string>;

  constructor(fields: any) {
    super("UPDATE");
    this.setStatement = "";
    this.setParams = [];
    Object.keys(fields).forEach(item => {
      this.setStatement += item + " = ?, ";
      this.setParams.push(fields[item]);
    });
    this.setStatement = this.setStatement.substr(0, this.setStatement.length - 2) + " ";
  }

  toString(): string {
    return (
      this.type +
      " " +
      this.tableName +
      " SET " +
      this.setStatement +
      (this.whereStatement !== null ? this.whereStatement : "")
    );
  }

  exec(cback: Function) {
    this.queryParams = this.setParams.concat(this.whereParams);
    super.exec(cback);
  }
}
