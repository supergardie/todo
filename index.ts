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



app.get("/", function(req, res) {
    res.sendFile(index);
});



app.post("/todo", function(req, res) {
    let item = req.body.todoItem;
    addItems(item);
    
    var listItems = retrieveItems();

    res.send(`Added ${item} to list. Full list: ${listItems}. | <a href="/">Go back?</a>`);
});



app.post("/del", function(req, res) {
    let numDel = req.body.itemNum;
    numDel = parseInt(numDel);

    var delItem = todos.findOne({num: numDel});
    var delItem = delItem.listItem;
    deleteItems(numDel);

    var listItems = retrieveItems();
    res.send(`Removed ${delItem} from the list. Full list: ${listItems}. | <a href="/">Go back?</a>`)
});



app.listen(3000, function() {
    console.log("Listening on port 3000");
});



let retrieveItems = function() {
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


let deleteItems = function(item) {
    todos.remove(todos.findOne({num: item}));
}


let addItems = function(item) {
    todos.insert({num: listCount++, listItem: item});    
}