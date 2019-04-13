const fs = require("fs");
const mysqlRewrapped = require("../index.js");
const assert = require("assert");
let conf = JSON.parse(fs.readFileSync("./test/config.json"));
let sql = fs.readFileSync("./test/db.sql");
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

    afterEach(function(done) {
        mysql.Database.connectionPool.query(sql, (err, res) => {
            done();
        })
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
        describe("Where", function() {
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
                    assert.equal(data.length, 0);
                    done()
                });
            });
            it("!=", function(done) {
                mysql.Users.Select().where({firstname: {op: "!=", value: "John"}}).exec(data => {
                    assert.equal(data.length, 0);
                    done()
                });
            });
            it(">", function(done) {
                mysql.Users.Select().where({id: {op: ">", value: 0}}).exec(data => {
                    assert.notEqual(data.length, 0);
                    assert.equal(data[0].firstname, "John");
                    done()
                });
            });
            it(">=", function(done) {
                mysql.Users.Select().where({id: {op: ">=", value: 1}}).exec(data => {
                    assert.notEqual(data.length, 0);
                    assert.equal(data[0].firstname, "John");
                    done()
                });
            });
            it("<", function(done) {
                mysql.Users.Select().where({id: {op: "<", value: 2}}).exec(data => {
                    assert.notEqual(data.length, 0);
                    assert.equal(data[0].firstname, "John");
                    done()
                });
            });
            it("<=", function(done) {
                mysql.Users.Select().where({id: {op: "<=", value: 1}}).exec(data => {
                    assert.notEqual(data.length, 0);
                    assert.equal(data[0].firstname, "John");
                    done()
                });
            });
            it("LIKE", function(done) {
                mysql.Users.Select().where({firstname: {op: "LIKE", value: "%oh%"}}).exec(data => {
                    assert.notEqual(data.length, 0);
                    assert.equal(data[0].firstname, "John");
                    done()
                });
            });
            it("IN", function(done) {
                mysql.Users.Select().where({firstname: {op: "IN", value: ["John", "Fred"]}}).exec(data => {
                    assert.notEqual(data.length, 0);
                    assert.equal(data[0].firstname, "John");
                    done()
                });
            });
            it("BETWEEN", function(done) {
                mysql.Users.Select().where({id: {op: "BETWEEN", value: [0, 2]}}).exec(data => {
                    assert.notEqual(data.length, 0);
                    assert.equal(data[0].firstname, "John");
                    done()
                });
            });
        });
        it("join", function(done) {
            mysql.UserGroups.Select(["Users.firstname", "Users.lastname", "Groups.Name"]).join([{target: "Users", from: "UserGroups.userid", to: "Users.id"}, {target: "Groups", from: "UserGroups.groupid", to: "Groups.id"}]).exec(data => {
                assert.notEqual(data.length, 0);
                assert.equal(data[0].firstname, "John");
                assert.equal(data[0].lastname, "Smith");
                assert.equal(data[0].Name, "Admin");
                done();
            });
        })
    });
});