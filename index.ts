import * as express from "express";
import * as bodyParser from "body-parser";

let app = express();

app.get("/", function(req, res) {
    res.send('Hello Earth!');
});

app.listen(3000, function() {
    console.log("Listening on port 3000");
});