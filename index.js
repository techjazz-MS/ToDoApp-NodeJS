//require the installed express app
const express = require("express");
const mongoose = require("mongoose");

const dotenv = require("dotenv");

//then we call express
const app = express();
const hostname = 'localhost';
const port = 3000;

//models
const TodoTask = require("./models/ToDoTask");



// Environment Variables
dotenv.config();

//connection to DB
mongoose.set("useFindAndModify", false);
mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true}, () => {
    console.log("Succesfully connected to DB!");
    app.listen(port, hostname, () => console.log(`Server Up and running at http://${hostname}:${port}`));  
});

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

//view engine configuration
app.set('view engine', 'ejs');

//takes us to the root(/) URL
//GET method --> Read data stored in Database
app.get('/',(req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.render("todo", {todoTasks: tasks});
    });
    //res.render('todo');
});

//POST method --> Send the data to Database
app.post('/', async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try{
        await todoTask.save();
        res.redirect("/");
    } catch(err){
        res.redirect("/");
    }
    //console.log(req.body);
});

//UPDATE --> update the contents in DB
app.route("/edit/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
        res.render("todoEdit", {todoTasks: tasks, idTask: id});
    });
}).post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, {content: req.body.content}, err => {
        if(err) return res.send(500, err);
        res.redirect("/");
    });
});

//DELETE --> Delete contents from Database
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if(err) return res.send(500, err);
        res.redirect("/");
    });
});
