const fs = require("fs");
const mysqlRewrapped = require("../index.js");
const assert = require("assert");
let conf = JSON.parse(fs.readFileSync("./test/config.json"));
let sql = fs.readFileSync("./test/db.sql", "utf8").replace(/\n/g, "");
let mysql;

describe("MySQL-Rewrapped tests", function() {
    before(function(done) {
        let doneCalled = false;
        mysqlRewrapped(conf, (db) => {
            mysql = db;
            if (!doneCalled) {
                doneCalled = true;
                done();
            }
        });
    });

    describe("Tests the MySql Object returned from MySQL rewrapped on creation", function() {
        it("Checks tables are returned", function() {
            assert.equal(mysql.Database.tables instanceof Object, true);
        });
        it("Checks connection to database", function(done) {
            new mysql.Select(["1 = 1"]).exec((data) => {
                assert.notEqual(data.length, 0);
                done();
            })
        });
    });
    describe("Test Select", function() {
        it("Simple Select", function(done) {
            mysql.Users.Select().exec(data => {
                assert.notEqual(data.length, 0);
                assert.equal(data[0].firstname, "John");
                done()
            });
        });
        describe("Test Where", function() {
            it("=", function(done) {
                mysql.Users.Select().where({firstname: {op: "=", value: "John"}}).exec(data => {
                    assert.notEqual(data.length, 0);
                    assert.equal(data[0].firstname, "John");
                    done()
                });
            });
            it("<=>", function(done) {
                mysql.Users.Select().where({firstname: {op: "<=>", value: "John"}}).exec(data => {
                    assert.notEqual(data.length, 0);
                    assert.equal(data[0].firstname, "John");
                    done()
                });
            });
            it("<>", function(done) {
                mysql.Users.Select().where({firstname: {op: "<>", value: "John"}}).exec(data => {
                    assert.equal(data.length, 49);
                    done()
                });
            });
            it("!=", function(done) {
                mysql.Users.Select().where({firstname: {op: "!=", value: "John"}}).exec(data => {
                    assert.equal(data.length, 49);
                    done()
                });
            });
            it(">", function(done) {
                mysql.Users.Select().where({id: {op: ">", value: 0}}).exec(data => {
                    assert.equal(data.length, 50);
                    assert.equal(data[0].firstname, "John");
                    done()
                });
            });
            it(">=", function(done) {
                mysql.Users.Select().where({id: {op: ">=", value: 1}}).exec(data => {
                    assert.equal(data.length, 50);
                    assert.equal(data[0].firstname, "John");
                    done()
                });
            });
            it("<", function(done) {
                mysql.Users.Select().where({id: {op: "<", value: 2}}).exec(data => {
                    assert.equal(data.length, 1);
                    assert.equal(data[0].firstname, "John");
                    done()
                });
            });
            it("<=", function(done) {
                mysql.Users.Select().where({id: {op: "<=", value: 1}}).exec(data => {
                    assert.equal(data.length, 1);
                    assert.equal(data[0].firstname, "John");
                    done()
                });
            });
            it("LIKE", function(done) {
                mysql.Users.Select().where({firstname: {op: "LIKE", value: "%oh%"}}).exec(data => {
                    assert.equal(data.length, 1);
                    assert.equal(data[0].firstname, "John");
                    done()
                });
            });
            it("IN", function(done) {
                mysql.Users.Select().where({firstname: {op: "IN", value: ["John", "Fred"]}}).exec(data => {
                    assert.equal(data.length, 1);
                    assert.equal(data[0].firstname, "John");
                    done()
                });
            });
            it("BETWEEN", function(done) {
                mysql.Users.Select().where({id: {op: "BETWEEN", value: [0, 2]}}).exec(data => {
                    assert.equal(data.length, 2);
                    assert.equal(data[0].firstname, "John");
                    done()
                });
            });
        });
        it("Invalid column", function() {
            assert.throws(function() {mysql.Users.Select(["Address"])}, mysql.InvalidFieldError);
        });
        it("Test Join", function(done) {
            mysql.UserGroups.Select(["Users.firstname", "Users.lastname", "Groups.Name"])
                .join([
                    {target: "Users", from: "UserGroups.userid", to: "Users.id"},
                    {target: "Groups", from: "UserGroups.groupid", to: "Groups.id"}
            ]).exec(data => {
                assert.equal(data.length, 50);
                assert.equal(data[0].firstname, "John");
                assert.equal(data[0].lastname, "Smith");
                assert.equal(data[0].Name, "Admin");
                done();
            });
        });
        it("Test Order By", function(done) {
            mysql.Users.Select().orderBy(["id"], true).exec(data => {
                assert.equal(data.length, 50);
                assert.equal(data[0].id, 50);
                done();
            });
        });
    });
    describe("Data Altering Tests", function() {
        afterEach(function(done) {
            this.timeout(1000000000);
            mysql.Database.connectionPool.query(sql, (err, res) => {
                if (err)
                    console.log(err);
                done();
            });
        });

        describe("Test Update", function() {
            it("Without Where", function(done) {
                mysql.Users.Update({firstname: "John"}).exec(() => {
                    mysql.Users.Select().exec(data => {
                        data.forEach(row => {
                            assert.equal(row.firstname, "John");
                        });
                        done();
                    });
                });
            });
            it("With Where", function(done) {
                mysql.Users.Update({lastname: "Doe"}).where({id: {value: 1, op: "="}}).exec(() => {
                    mysql.Users.Select().where({id: {value: 1, op: "="}}).exec(data => {
                        assert.equal(data[0].lastname, "Doe");
                        done();
                    });
                });
            });
        });
        describe("Test Insert", function() {
            it("Insert", function(done) {
                mysql.Users.Insert({firstname: "Geoff", lastname: "Goldblum"}).exec(data => {
                    assert.notEqual(data, false);
                    done();
                });
            });
        });
        describe("Test Delete", function() {
            it("Without Where", function(done) {
                mysql.UserGroups.Delete().exec(data => {
                    mysql.UserGroups.Select().exec(data => {
                        assert.equal(data.length, 0);
                        done();
                    });
                });
            });
            it("With Where", function(done) {
                mysql.UserGroups.Delete().where({userid: {value: 1, op: "="}}).exec(data => {
                    mysql.UserGroups.Select().exec(data => {
                        assert.equal(data.length, 49);
                        done();
                    });
                });
            });
        });
    });
});
