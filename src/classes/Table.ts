import Delete from "./Queries/Delete";
import Insert from "./Queries/Insert";
import Update from "./Queries/Update";
import Select from "./Queries/Select";
import InvalidFieldError from "./Errors/InvalidFieldError";

export default class Table {
  private readonly name: string;
  private fields: Array<string>;

  constructor(name: string, fields: Array<string>) {
    this.name = name;
    this.fields = fields;
  }

  Select(fields: Array<any>) {
    let missingFields: string[] = [];
    if (fields && fields !== ["*"]) {
      fields.forEach(field => {
        if (field instanceof Object) {
          field = field.name;
        }
        if (!this.fields.includes(field) && !field.includes(".")) missingFields.push(field);
        else if (field.includes(".")) {
          let table = field.split(".")[0];
          let attr = field.split(".")[1];
          if (table !== this.name) {
            if (module.exports[table] && !module.exports[table].fields.includes(attr)) {
              missingFields.push(field);
            }
          } else {
            if (!this.fields.includes(attr)) missingFields.push(attr);
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

  Update(items: Array<any>) {
    let missingFields: string[] = [];
    Object.keys(items).forEach(field => {
      if (!this.fields.includes(field)) missingFields.push(field);
    });
    if (missingFields.length > 0) {
      throw new InvalidFieldError("Field(s) not found in table: " + missingFields);
    } else {
      return new Update(items).table(this.name);
    }
  }

  Insert(items: Array<any>) {
    let missingFields: string[] = [];
    Object.keys(items).forEach(field => {
      if (!this.fields.includes(field)) missingFields.push(field);
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
