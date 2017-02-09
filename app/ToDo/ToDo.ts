import * as loki from "lokijs";

export class ToDo {
    private todos;
    private count;
    private db;

    constructor() {
        this.db = new loki('todo.json', {
            autosave: true,
            autosaveInterval: 30 * 1000,
            autoload: true
        });
        
        this.todos = this.db.addCollection('todos');
        this.count = 0;
    }

    get Todos() {
        return this.todos;
    }

    public retrieveItemNames (todo) {
        let printItem;
        let listItems = [];
        for(var ii = 0; ii < this.count; ii++) {
            printItem = todo.findOne({num: ii});
            if(printItem) {
                listItems.push(printItem.listItem);
            }
        }

        return listItems;
    }

    public retrieveItemNumbers (todo) {
        let list;
        let listNums = [];
        for(var ii = 0; ii < this.count; ii++) {
            list = todo.findOne({num: ii});
            if(list) {
                listNums.push(list.num);
            }
        }

        return listNums;
    }


    public retrieveStatus (todo) {
        let list;
        let listStats = [];
        for(var ii = 0; ii < this.count; ii++) {
            list = todo.findOne({num: ii});
            if(list) {
                listStats.push(list.done);
            }
        }

        return listStats;
    }


    public deleteItems (item, todo) {
        item = parseInt(item);
        todo.remove(todo.findOne({num: item}));
    }


    public addItems (item, todo) {
        if(this.validate(item)) {
            return todo.insert({num: this.count++, listItem: item, done: false});    
        } else {
            return null;
        }
    }

    public editItems (item, todo) {
        let edit;

        item = parseInt(item);

        edit = todo.findOne({num: item});
        edit.done = !edit.done;

        todo.update(edit);
    }

    public validate (item) {
        let valid = false;
        if(item.length > 1) {
            valid = true;
        }

        return valid;
    }
}