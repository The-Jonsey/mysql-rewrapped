# MySQL-Rewrapped

[![Build Status](https://img.shields.io/travis/com/the-jonsey/mysql-rewrapped/master.svg?style=flat-square)](https://travis-ci.com/The-Jonsey/mysql-rewrapped)
![GitHub](https://img.shields.io/github/license/the-jonsey/mysql-rewrapped.svg?style=flat-square)
[![npm](https://img.shields.io/npm/dt/mysql-rewrapped.svg?style=flat-square)](https://www.npmjs.com/package/mysql-rewrapped)
![npm bundle size](https://img.shields.io/bundlephobia/min/mysql-rewrapped.svg?style=flat-square)
![npm](https://img.shields.io/npm/v/mysql-rewrapped.svg?style=flat-square)
## Description
MySQL wrapped is a nodejs library built to make querying a database without any knowledge of sql easy,
it depends on:
- mysql

## Setup

To install this module, from the command line run

`npm install --save mysql-rewrapped`

to include this package in your software, include this in your source code

`const mysql = require("mysql-rewrapped");`

To initialise an instance of mysql-wrapped, you need to give it config in the form of a json object,
as well as this, the initialisation is asynchronous, so you will need a callback e.g:

```js
const mysqlRewrapped = require("mysql-rewrapped");
let mysql;
mysqlRewrapped({
 "host": "127.0.0.1",
 "user": "root",
 "password": "password",
 "database": "EXAMPLE_SCHEMA",
 "connectionLimit": 10
}, (data) => {
    mysql = data;
});
```

## Usage

mysql-wrapped has 3 levels of abstraction, and it can be used at any level, with the lowest level being the default mysql package, so in ascending levels of abstraction, it could be used like this

### Level 1 - No abstraction

this would be used in the same way as the mysql package, and most of the best documentation would be found at that package, specifically on connection pools,
the way the connection pool is accessed is

`mysql.Database.connectionPool`

### Level 2 - Query generation

This level is where queries are generated, and can generate the 4 main types of query, which all have a common structure, with common functions

```js
new mysql.QUERYTYPE(
    
)
```
then you add functions on to the end depending on what you want to do with the query, but at to execute every query, you do:
```js
new mysql.QUERYTYPE().exec(
    //you place a callback in here, which returns your data
)
```
#### SELECT

To use SELECT statements with this library, you would do something along the lines of

```js
new mysql.Select(
    //field names here, as an array, or an asterisk to indicate a wildcard
)
```

The select statement has a special function called join, which is used as shown below
```js
join(
    /*
    Joining one table onto another, usage as shown:
    [{type: type of join. target: target table, from: field on main table, to: field on joining table}]
     */
)
```

The select statement has another function called distinct, which when called will make the query only select distinct fields, there are no parameters

#### Update

Update is very similar to the Select statement, the only difference being the constructor

```js
new mysql.Update(
    //json object of fields to update, with their values as shown below
    //{field: value} - e.g
    {firstname: "Bob"}
    
)
```

#### Insert
For insert, the constructor is the same as for Update, so
```js
new mysql.Insert(
    //json object of fields to insert, with their values as shown below
    //{field: value} - e.g
    {firstname: "Bob"}
    
)
```

#### Delete
For insert, the constructor does not take any parameters

#### Common Functions
```js
new mysql.QUERY.table(
    //the name of the table to select from
).where(
    /*
    Filtering the table, done by a json object as shown:
    {
        fieldname: {
            value: value, op: operator, or: boolean
        }
    }
    where the valid operators are "=", "<=>", "<>", "!=", ">", ">=", "<", "<=", "like"
    and the or value indicates whether the where after is `and` or an `or`
     */
).exec(
    /*
    This function executes the generated query, and returns in via a callback function
     */
)
```

### Level 3 - Table generation + field checks

so for level 3, the library will generate an instance of a table class for every table it finds in your database, it will use this to check your parameters, to check the fields exist in the tables.

To use this functionality, all you need to do is:

```
TABLENAME.Select()
TABLENAME.Insert()
```

the advantage of this is you also dont need to use the .table function when generating the query, as it is automatically done

in actual use the code would look like this

```js
Users.select("*")
    .where(
        {groupname:
            {
                value: "Admin",
                op: "=",
                or: false
            }
        })
    .join(
        [
            {
                type: "INNER",
                target: "UserGroups",
                from: "Users.id",
                to: "UserGroups.userid"
            },
            {
                type: "LEFT",
                target: "Groups",
                from: "UserGroups.groupid",
                to: "Groups.id"
            }
        ]
    ).exec(data => {
        console.log(data);
    }
);
```
