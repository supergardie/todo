"use strict";
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var loki = require('lokijs');
var db = new loki('todo.db');
var index = path.join(__dirname + "/index.html");
var app = express();
var todos = db.addCollection('todos');
var listCount = 0;
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", function (req, res) {
    res.sendFile(index);
});
app.post("/todo", function (req, res) {
    var item = req.body.todoItem;
    addItems(item);
    var listItems = retrieveItems();
    res.send("Added " + item + " to list. Full list: " + listItems + ". | <a href=\"/\">Go back?</a>");
});
app.post("/del", function (req, res) {
    var numDel = req.body.itemNum;
    numDel = parseInt(numDel);
    var delItem = todos.findOne({ num: numDel });
    var delItem = delItem.listItem;
    deleteItems(numDel);
    var listItems = retrieveItems();
    res.send("Removed " + delItem + " from the list. Full list: " + listItems + ". | <a href=\"/\">Go back?</a>");
});
app.listen(3000, function () {
    console.log("Listening on port 3000");
});
var retrieveItems = function () {
    var printItem;
    var listItems = [];
    for (var ii = 0; ii < listCount; ii++) {
        printItem = todos.findOne({ num: ii });
        if (printItem) {
            listItems.push(printItem.listItem);
        }
    }
    return listItems;
};
var deleteItems = function (item) {
    todos.remove(todos.findOne({ num: item }));
};
var addItems = function (item) {
    todos.insert({ num: listCount++, listItem: item });
};
//# sourceMappingURL=index.js.map