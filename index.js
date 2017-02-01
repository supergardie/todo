"use strict";
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var loki = require('lokijs');
var db = new loki('todo.db');
var index = path.join(__dirname + "/index.html");
var app = express();
var todos = db.addCollection('todos');
//different file with function 
/**
 * function autoid_generator;
 */
var listCount = 0;
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
    //Todo validation
    addItems(item, todos);
    next();
}, Render);
// app.get("/edit", function(req, res, next) {
//     console.log(req);
//     if(req.body.del) {
//         let numDel = req.body.del;
//         deleteItems(numDel, todos);
//     }
//     if(req.body.done) {
//         let numDone = req.body.done;      
//         editItems(numDone, todos);
//     }
//     next();
// },Render);
app.get("/del/:num", function (req, res, next) {
    var numDel = req.params.num;
    deleteItems(numDel, todos);
    next();
}, Render);
app.get("/done/:num", function (req, res, next) {
    var numDone = req.params.num;
    editItems(numDone, todos);
    next();
}, Render);
var server = app.listen(3000, function () {
    console.log("Listening on port 3000");
});
process.on("uncaughtError", function () {
    server.close(function () { return process.exit(); });
});
/**********************************
 * HERE THERE BE FUNCTIONS, ARRRR *
 **********************************/
function retrieveItemNames(todo) {
    var printItem;
    var listItems = [];
    for (var ii = 0; ii < listCount; ii++) {
        printItem = todo.findOne({ num: ii });
        if (printItem) {
            listItems.push(printItem.listItem);
        }
    }
    return listItems;
}
function retrieveItemNumbers(todo) {
    var list;
    var listNums = [];
    for (var ii = 0; ii < listCount; ii++) {
        list = todo.findOne({ num: ii });
        if (list) {
            listNums.push(list.num);
        }
    }
    return listNums;
}
function retrieveStatus(todo) {
    var list;
    var listStats = [];
    for (var ii = 0; ii < listCount; ii++) {
        list = todo.findOne({ num: ii });
        if (list) {
            listStats.push(list.done);
        }
    }
    return listStats;
}
function deleteItems(item, todo) {
    item = parseInt(item);
    todo.remove(todo.findOne({ num: item }));
}
function addItems(item, todo) {
    if (validate(item)) {
        return todo.insert({ num: listCount++, listItem: item, done: false });
    }
    else {
        return null;
    }
}
function editItems(item, todo) {
    var edit;
    item = parseInt(item);
    edit = todo.findOne({ num: item });
    edit.done = !edit.done;
    todo.update(edit);
}
function Render(req, res) {
    res.render('default', {
        title: "To Do...",
        items: retrieveItemNames(todos),
        num: retrieveItemNumbers(todos),
        done: retrieveStatus(todos)
    });
}
function validate(item) {
    var valid = false;
    if (item.length > 1) {
        valid = true;
    }
    return valid;
}
//# sourceMappingURL=index.js.map