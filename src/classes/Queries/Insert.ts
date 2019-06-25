import Query from "../Query";

export default class Insert extends Query {
  private readonly fields: any;
  private readonly valuesParams: Array<string>;
  private valuesStatement: string = "";

  /**
   *
   * @param fields - list of fields to insert formatted as {field: value}
   */
  constructor(fields: any) {
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
  values(fields: any): Insert {
    let rowParsed = Array(Object.keys(fields).length + 1).join("?, ");
    rowParsed = rowParsed.substr(0, rowParsed.length - 2);
    Object.keys(fields).forEach(item => {
      this.valuesParams.push(fields[item]);
    });
    this.valuesStatement = rowParsed;
    return this;
  }

  toString(): string {
    return "INSERT INTO " + this.tableName + " (" + this.fields + ") VALUES (" + this.valuesStatement + ")";
  }

  exec(cback: Function): void {
    this.queryParams = this.valuesParams;
    super.exec(cback);
  }
}
