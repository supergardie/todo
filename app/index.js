"use strict";
var express = require("express");
var bodyParser = require("body-parser");
var ToDo_1 = require("./ToDo/ToDo");
var loki = require('lokijs');
var app = express();
var todoList = new ToDo_1.ToDo();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
/**
 * Store configs in different file and folder
 *
 */
app.set('view engine', 'ejs');
app.locals.pagetitle = "YATDA!";
app.get("/", function (req, res, next) {
    next();
}, Render);
app.post("/todo", function (req, res, next) {
    var item = req.body.todoItem;
    todoList.addItems(item, todoList.Todos);
    next();
}, Render);
app.get("/del/:num", function (req, res, next) {
    var numDel = req.params.num;
    todoList.deleteItems(numDel, todoList.Todos);
    next();
}, Render);
app.get("/done/:num", function (req, res, next) {
    var numDone = req.params.num;
    todoList.editItems(numDone, todoList.Todos);
    next();
}, Render);
var server = app.listen(3000, function () {
    console.log("Listening on port 3000");
});
process.on("uncaughtError", function () {
    server.close(function () { return process.exit(); });
});
function Render(req, res) {
    res.render('default', {
        title: "To Do...",
        items: todoList.retrieveItemNames(todoList.Todos),
        num: todoList.retrieveItemNumbers(todoList.Todos),
        done: todoList.retrieveStatus(todoList.Todos)
    });
}
//# sourceMappingURL=index.js.map