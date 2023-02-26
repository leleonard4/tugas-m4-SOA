//npm install --save mysql2
//npm install sequelize
const express = require("express");
const app = express();
const port = 3000;

const ruter = require("./routes/router")
const databasenya = require("./database/connection")

app.use(express.urlencoded({extended: true}));
app.use("/api", ruter);
app.listen(port, () => {
});
