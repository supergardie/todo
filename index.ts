import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from "path";
const loki = require('lokijs')



const db = new loki('todo.json');

const index = path.join(__dirname + "/index.html");
const app = express();

var todos = db.getCollection('todos');
if(!todos) {
    todos = db.addCollection('todos');
}

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



app.get("/", function(req, res, next) {
    next();
}, Render);


app.post("/todo", function(req, res, next) {
    let item = req.body.todoItem;

    //Todo validation
    addItems(item, todos);
    db.saveDatabase();

    next();
}, Render);


app.get("/del/:num", function(req, res, next) {
    let numDel = req.params.num;
    deleteItems(numDel, todos);
    db.saveDatabase();

    next();
},Render);

app.get("/done/:num", function(req, res, next) {
    let numDone = req.params.num;
    editItems(numDone, todos);
    db.saveDatabase();

    next();
},Render);

const server = app.listen(3000, function() {
    console.log("Listening on port 3000");
});


process.on("uncaughtError",function(){
    server.close(()=>process.exit());
});



/**********************************
 * HERE THERE BE FUNCTIONS, ARRRR *
 **********************************/

function retrieveItemNames(todo) {
    let printItem;
    let listItems = [];
    for(var ii = 0; ii < listCount; ii++) {
        printItem = todo.findOne({num: ii});
        if(printItem) {
            listItems.push(printItem.listItem);
        }
    }

    return listItems;
}

function retrieveItemNumbers(todo) {
    let list;
    let listNums = [];
    for(var ii = 0; ii < listCount; ii++) {
        list = todo.findOne({num: ii});
        if(list) {
            listNums.push(list.num);
        }
    }

    return listNums;
}


function retrieveStatus(todo) {
    let list;
    let listStats = [];
    for(var ii = 0; ii < listCount; ii++) {
        list = todo.findOne({num: ii});
        if(list) {
            listStats.push(list.done);
        }
    }

    return listStats;
}


function deleteItems(item, todo) {
    item = parseInt(item);
    todo.remove(todo.findOne({num: item}));
}


function addItems(item, todo) {
    if(validate(item)) {
        return todo.insert({num: listCount++, listItem: item, done: false});    
    } else {
        return null;
    }
}

function editItems(item, todo) {
    let edit;

    item = parseInt(item);

    edit = todo.findOne({num: item});
    edit.done = !edit.done;

    todo.update(edit);
}


function Render(req,res){
    res.render('default', {
        title: "To Do...",
        items: retrieveItemNames(todos),
        num: retrieveItemNumbers(todos),
        done: retrieveStatus(todos)
    });
}


function validate(item) {
    let valid = false;
    if(item.length > 1) {
        valid = true;
    }

    return valid;
}