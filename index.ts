import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from "path";
const loki = require('lokijs');

const db = new loki('todo.db');
const index = path.join(__dirname + "/index.html");
const app = express();

var todos = db.addCollection('todos');
var listCount = 0;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.locals.pagetitle = "YATDA!";



app.get("/", function(req, res) {
    res.render('default', {
        title: "To Do...",
        items: retrieveItemNames(),
        num: retrieveItemNumbers(),
        done: retrieveStatus()
    });
});


app.post("/todo", function(req, res) {
    let item = req.body.todoItem;
    addItems(item);

    res.render('default', {
        title: "To Do...",
        items: retrieveItemNames(),
        num: retrieveItemNumbers(),
        done: retrieveStatus()
    });
});


app.post("/edit", function(req, res) {
    if(req.body.del) {
        let numDel = req.body.del;
        deleteItems(numDel);
    }

    if(req.body.done) {
        let numDone = req.body.done;      
        editItems(numDone);
    }

    res.render('default', {
        title: "To Do...",
        items: retrieveItemNames(),
        num: retrieveItemNumbers(),
        done: retrieveStatus()
    });
});


app.listen(3000, function() {
    console.log("Listening on port 3000");
});



let retrieveItemNames = function() {
    let printItem;
    let listItems = [];
    for(var ii = 0; ii < listCount; ii++) {
        printItem = todos.findOne({num: ii});
        if(printItem) {
            listItems.push(printItem.listItem);
        }
    }

    return listItems;
}

let retrieveItemNumbers = function() {
    let list;
    let listNums = [];
    for(var ii = 0; ii < listCount; ii++) {
        list = todos.findOne({num: ii});
        if(list) {
            listNums.push(list.num);
        }
    }

    return listNums;
}

let retrieveStatus = function() {
    let list;
    let listStats = [];
    for(var ii = 0; ii < listCount; ii++) {
        list = todos.findOne({num: ii});
        if(list) {
            listStats.push(list.done);
        }
    }

    return listStats;
}


let deleteItems = function(item) {
    if(item.length > 1) {
        item.map(number => {
            if(number) {
                number = parseInt(number);
                todos.remove(todos.findOne({num: number}));
            }
        });
    } else {
        item = parseInt(item);
        todos.remove(todos.findOne({num: item}));
    }
}


let addItems = function(item) {
    todos.insert({num: listCount++, listItem: item, done: false});    
}

let editItems = function(item) {
    let edit;

    if(item.length > 1) {
        item.map(number => {
            number = parseInt(number);

            edit = todos.findOne({num: number});
            edit.done = true;

            todos.update(edit);            
        });
    } else {
        item = parseInt(item);

        edit = todos.findOne({num: item});
        edit.done = true;

        todos.update(edit);
    }
}