"use strict";
var express = require("express");
var bodyParser = require("body-parser");
var config_1 = require("./config/config");
var ToDo_1 = require("./ToDo/ToDo");
var app = express();
var todoList = new ToDo_1.ToDo();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', config_1.config.viewEngine);
app.locals.pagetitle = config_1.config.pageTitle;
app.get("/", function (req, res, next) {
    next();
}, Render);
// Sent when adding new item
app.post("/todo", function (req, res, next) {
    var item = req.body.todoItem;
    todoList.addItems(item, todoList.Todos);
    next();
}, Render);
// Sent when deleting an item
app.get("/del/:num", function (req, res, next) {
    var numDel = req.params.num;
    todoList.deleteItems(numDel, todoList.Todos);
    next();
}, Render);
// Sent when checking an item as done, or trying to uncheck one as done
app.get("/done/:num", function (req, res, next) {
    var numDone = req.params.num;
    todoList.editItems(numDone, todoList.Todos);
    next();
}, Render);
// Start server
var server = app.listen(3000, function () {
    console.log("Listening on port 3000");
});
// Close when an unhandled error occurs
process.on("uncaughtError", function () {
    server.close(function () { return process.exit(); });
});
// Render page
function Render(req, res) {
    res.render('default', {
        title: "To Do...",
        items: todoList.retrieveItemNames(todoList.Todos),
        num: todoList.retrieveItemNumbers(todoList.Todos),
        done: todoList.retrieveStatus(todoList.Todos)
    });
}
//# sourceMappingURL=index.js.map