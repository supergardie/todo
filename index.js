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
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.locals.pagetitle = "YATDA!";
app.get("/", function (req, res) {
    res.render('default', {
        title: "To Do...",
        items: retrieveItemNames(),
        num: retrieveItemNumbers(),
        done: retrieveStatus()
    });
});
app.post("/todo", function (req, res) {
    var item = req.body.todoItem;
    addItems(item);
    res.render('default', {
        title: "To Do...",
        items: retrieveItemNames(),
        num: retrieveItemNumbers(),
        done: retrieveStatus()
    });
});
app.post("/edit", function (req, res) {
    if (req.body.del) {
        var numDel = req.body.del;
        deleteItems(numDel);
    }
    if (req.body.done) {
        var numDone = req.body.done;
        editItems(numDone);
    }
    res.render('default', {
        title: "To Do...",
        items: retrieveItemNames(),
        num: retrieveItemNumbers(),
        done: retrieveStatus()
    });
});
app.listen(3000, function () {
    console.log("Listening on port 3000");
});
var retrieveItemNames = function () {
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
var retrieveItemNumbers = function () {
    var list;
    var listNums = [];
    for (var ii = 0; ii < listCount; ii++) {
        list = todos.findOne({ num: ii });
        if (list) {
            listNums.push(list.num);
        }
    }
    return listNums;
};
var retrieveStatus = function () {
    var list;
    var listStats = [];
    for (var ii = 0; ii < listCount; ii++) {
        list = todos.findOne({ num: ii });
        if (list) {
            listStats.push(list.done);
        }
    }
    return listStats;
};
var deleteItems = function (item) {
    if (item.length > 1) {
        item.map(function (number) {
            if (number) {
                number = parseInt(number);
                todos.remove(todos.findOne({ num: number }));
            }
        });
    }
    else {
        item = parseInt(item);
        todos.remove(todos.findOne({ num: item }));
    }
};
var addItems = function (item) {
    todos.insert({ num: listCount++, listItem: item, done: false });
};
var editItems = function (item) {
    var edit;
    if (item.length > 1) {
        item.map(function (number) {
            number = parseInt(number);
            edit = todos.findOne({ num: number });
            edit.done = true;
            todos.update(edit);
        });
    }
    else {
        item = parseInt(item);
        edit = todos.findOne({ num: item });
        edit.done = true;
        todos.update(edit);
    }
};
//# sourceMappingURL=index.js.map