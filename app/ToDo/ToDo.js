"use strict";
var loki = require("lokijs");
var ToDo = (function () {
    function ToDo() {
        var db = new loki('todo.json', {
            autosave: true,
            autosaveInterval: 30 * 1000,
            autoload: true
        });
        try {
            this.todos = db.getCollection('todos');
            console.log(this.todos);
            // this.count = this.todos.length;
            console.log("LOADED");
        }
        catch (e) {
            console.log("NOPE");
            console.log(e.message);
            this.todos = db.addCollection('todos');
            this.count = 0;
        }
    }
    Object.defineProperty(ToDo.prototype, "Todos", {
        get: function () {
            return this.todos;
        },
        enumerable: true,
        configurable: true
    });
    ToDo.prototype.retrieveItemNames = function (todo) {
        var printItem;
        var listItems = [];
        for (var ii = 0; ii < this.count; ii++) {
            printItem = todo.findOne({ num: ii });
            if (printItem) {
                listItems.push(printItem.listItem);
            }
        }
        return listItems;
    };
    ToDo.prototype.retrieveItemNumbers = function (todo) {
        var list;
        var listNums = [];
        for (var ii = 0; ii < this.count; ii++) {
            list = todo.findOne({ num: ii });
            if (list) {
                listNums.push(list.num);
            }
        }
        return listNums;
    };
    ToDo.prototype.retrieveStatus = function (todo) {
        var list;
        var listStats = [];
        for (var ii = 0; ii < this.count; ii++) {
            list = todo.findOne({ num: ii });
            if (list) {
                listStats.push(list.done);
            }
        }
        return listStats;
    };
    ToDo.prototype.deleteItems = function (item, todo) {
        item = parseInt(item);
        todo.remove(todo.findOne({ num: item }));
    };
    ToDo.prototype.addItems = function (item, todo) {
        if (this.validate(item)) {
            return todo.insert({ num: this.count++, listItem: item, done: false });
        }
        else {
            return null;
        }
    };
    ToDo.prototype.editItems = function (item, todo) {
        var edit;
        item = parseInt(item);
        edit = todo.findOne({ num: item });
        edit.done = !edit.done;
        todo.update(edit);
    };
    ToDo.prototype.validate = function (item) {
        var valid = false;
        if (item.length > 1) {
            valid = true;
        }
        return valid;
    };
    return ToDo;
}());
exports.ToDo = ToDo;
//# sourceMappingURL=ToDo.js.map