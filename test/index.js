const fs = require("fs");
const mysqlRewrapped = require("../index.js");
const assert = require("assertthat");
let mocha = require('mocha');
let describe = mocha.describe;
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
            assert.that(mysql.Database.tables).is.instanceOf(Object);
        });
        it("Checks connection to database", function(done) {
            new mysql.Select(["1 = 1"]).exec((data) => {
                assert.that(data.length).is.greaterThan(0);
                done();
            })
        });
    });
    describe("Test Select", function() {
        it("Simple Select", function(done) {
            mysql.Users.Select().exec(data => {
                assert.that(data.length).is.greaterThan(0);
                assert.that(data[0].firstname).is.equalTo("John");
                done()
            });
        });
        describe("Test Where", function() {
            it("=", function(done) {
                mysql.Users.Select().where({firstname: {op: "=", value: "John"}}).exec(data => {
                    assert.that(data.length).is.greaterThan(0);
                    assert.that(data[0].firstname).is.equalTo("John");
                    done()
                });
            });
            it("<=>", function(done) {
                mysql.Users.Select().where({firstname: {op: "<=>", value: "John"}}).exec(data => {
                    assert.that(data.length).is.greaterThan(0);
                    assert.that(data[0].firstname).is.equalTo("John");
                    done()
                });
            });
            it("<>", function(done) {
                mysql.Users.Select().where({firstname: {op: "<>", value: "John"}}).exec(data => {
                    assert.that(data.length).is.equalTo(49);
                    done()
                });
            });
            it("!=", function(done) {
                mysql.Users.Select().where({firstname: {op: "!=", value: "John"}}).exec(data => {
                    assert.that(data.length).is.equalTo(49);
                    done()
                });
            });
            it(">", function(done) {
                mysql.Users.Select().where({id: {op: ">", value: 0}}).exec(data => {
                    assert.that(data.length).is.equalTo(50);
                    assert.that(data[0].firstname, "John");
                    done()
                });
            });
            it(">=", function(done) {
                mysql.Users.Select().where({id: {op: ">=", value: 1}}).exec(data => {
                    assert.that(data.length).is.equalTo(50);
                    assert.that(data[0].firstname).is.equalTo("John");
                    done()
                });
            });
            it("<", function(done) {
                mysql.Users.Select().where({id: {op: "<", value: 2}}).exec(data => {
                    assert.that(data.length).is.equalTo(1);
                    assert.that(data[0].firstname).is.equalTo("John");
                    done()
                });
            });
            it("<=", function(done) {
                mysql.Users.Select().where({id: {op: "<=", value: 1}}).exec(data => {
                    assert.that(data.length).is.equalTo(1);
                    assert.that(data[0].firstname).is.equalTo("John");
                    done()
                });
            });
            it("LIKE", function(done) {
                mysql.Users.Select().where({firstname: {op: "LIKE", value: "%oh%"}}).exec(data => {
                    assert.that(data.length).is.equalTo(1);
                    assert.that(data[0].firstname).is.equalTo("John");
                    done()
                });
            });
            it("IN", function(done) {
                mysql.Users.Select().where({firstname: {op: "IN", value: ["John", "Fred"]}}).exec(data => {
                    assert.that(data.length).is.equalTo(1);
                    assert.that(data[0].firstname).is.equalTo("John");
                    done()
                });
            });
            it("BETWEEN", function(done) {
                mysql.Users.Select().where({id: {op: "BETWEEN", value: [0, 2]}}).exec(data => {
                    assert.that(data.length).is.equalTo(2);
                    assert.that(data[0].firstname).is.equalTo("John");
                    done()
                });
            });
        });
        it("Invalid column", function() {
            assert.that(function() {mysql.Users.Select(["Address"])}).is.throwing();
        });
        it("Test Join", function(done) {
            mysql.UserGroups.Select(["Users.firstname", "Users.lastname", "Groups.Name"])
                .join([
                    {target: "Users", from: "UserGroups.userid", to: "Users.id"},
                    {target: "Groups", from: "UserGroups.groupid", to: "Groups.id"}
            ]).exec(data => {
                assert.that(data.length).is.equalTo(50);
                assert.that(data[0].firstname).is.equalTo("John");
                assert.that(data[0].lastname).is.equalTo("Smith");
                assert.that(data[0].Name).is.equalTo("Admin");
                done();
            });
        });
        it("Test Order By", function(done) {
            mysql.Users.Select().orderBy(["id"], true).exec(data => {
                assert.that(data.length).is.equalTo(50);
                assert.that(data[0].id).is.equalTo(50);
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
                            assert.that(row.firstname).is.equalTo("John");
                        });
                        done();
                    });
                });
            });
            it("With Where", function(done) {
                mysql.Users.Update({lastname: "Doe"}).where({id: {value: 1, op: "="}}).exec(() => {
                    mysql.Users.Select().where({id: {value: 1, op: "="}}).exec(data => {
                        assert.that(data[0].lastname).is.equalTo("Doe");
                        done();
                    });
                });
            });
        });
        describe("Test Insert", function() {
            it("Insert", function(done) {
                mysql.Users.Insert({firstname: "Geoff", lastname: "Goldblum"}).exec(data => {
                    assert.that(data).is.not.falsy();
                    done();
                });
            });
        });
        describe("Test Delete", function() {
            it("Without Where", function(done) {
                mysql.UserGroups.Delete().exec(data => {
                    mysql.UserGroups.Select().exec(data => {
                        assert.that(data.length).is.equalTo(0);
                        done();
                    });
                });
            });
            it("With Where", function(done) {
                mysql.UserGroups.Delete().where({userid: {value: 1, op: "="}}).exec(data => {
                    mysql.UserGroups.Select().exec(data => {
                        assert.that(data.length).is.equalTo(49);
                        done();
                    });
                });
            });
        });
    });
});
