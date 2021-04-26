var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const URI =
  "mongodb+srv://Mohit:9166927513@cluster0.1milb.mongodb.net/To-Do_App?retryWrites=true&w=majority";

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});
var date = new Date();

//mongoose schema
const todo = mongoose.Schema({
  todo: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

var Todo = mongoose.model("Todos", todo);

/* GET home page. */
router.get("/", function (req, res, next) {
  Todo.find()
    .sort([["date", -1]])
    .then((doc) => {
      console.log(doc);
      res.render("index", {
        title: "To-DO Creator",
        para: "Make your own ToDo here",
        items: doc,
      });
    });
});
router.post(
  "/delete",
  express.urlencoded({ extended: false }),

  (req, res, next) => {
    const id = req.body.Id;
    Todo.deleteOne({ _id: id })
      .exec()
      .then((result) => {
        res.status(200).redirect("/");
      })
      .catch((err) => {
        res.render("error", { error: err });
      });
  }
);

router.get("/update/:id", (req, res) => {
  id = req.params.id;
  res.render("id", { id });
});

router.post("/update/updating", (req, res) => {
  const id = req.body.id;

  Todo.findByIdAndUpdate({ _id: req.body.id }, req.body).then(function () {
    Todo.findOne({ _id: req.body.id });
    res.redirect("/");
  });
});

router.post("/submit", async (req, res, next) => {
  var task = new Todo({
    todo: req.body.todo,
  });
  await task.save().then(res.redirect("/"));
});

router.get("/500", function (req, res, next) {
  // trigger a generic (500) error
  next(new Error("keyboard cat!"));
});
module.exports = router;
