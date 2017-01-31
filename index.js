"use strict";
var express = require("express");
var app = express();
app.get("/", function (req, res) {
    res.send('Hello Earth!');
});
app.listen(3000, function () {
    console.log("Listening on port 3000");
});
//# sourceMappingURL=index.js.map