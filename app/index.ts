import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from "path";

import {config} from "./config/config";
import {ToDo} from "./ToDo/ToDo";


const app = express();
const todoList = new ToDo();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', config.viewEngine);
app.locals.pagetitle = config.pageTitle;



app.get("/", function(req, res, next) {
    next();
}, Render);

// Sent when adding new item
app.post("/todo", function(req, res, next) {
    let item = req.body.todoItem;
    todoList.addItems(item, todoList.Todos);

    next();
}, Render);

// Sent when deleting an item
app.get("/del/:num", function(req, res, next) {
    let numDel = req.params.num;
    todoList.deleteItems(numDel, todoList.Todos);

    next();
},Render);

// Sent when checking an item as done, or trying to uncheck one as done
app.get("/done/:num", function(req, res, next) {
    let numDone = req.params.num;
    todoList.editItems(numDone, todoList.Todos);

    next();
},Render);

// Start server
const server = app.listen(3000, function() {
    console.log("Listening on port 3000");
});

// Close when an unhandled error occurs
process.on("uncaughtError",function(){
    server.close(()=>process.exit());
});

// Render page
function Render(req,res){
    res.render('default', {
        title: "To Do...",
        items: todoList.retrieveItemNames(todoList.Todos),
        num: todoList.retrieveItemNumbers(todoList.Todos),
        done: todoList.retrieveStatus(todoList.Todos)
    });
}