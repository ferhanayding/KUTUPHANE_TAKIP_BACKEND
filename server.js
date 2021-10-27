const express = require("express");
const bodyParser = require("body-Parser");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const BookStore = require("./models/BookModel");
const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// mongoose
mongoose
  .connect(
    "mongodb+srv://ferhanaydin:udemy123@ferhanaydin.v58wt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  )
  .then(console.log("connected to database"))
  .catch((err) => console.log(err));

app.get("/books", (req, res) => {
  BookStore.find().then((books) => res.json(books));
});

app.post("/newbook", async (req, res) => {
  try {
    const newBook = new BookStore({
      bookName: req.body.bookName,
      author: req.body.author,
      quantity: req.body.quantity,
      department: req.body.department,
      comments: req.body.comments,
    });

    const book = await newBook.save();
    res.status(200).json(book);
  } catch (error) {
    console.log("olmadı");
  }
});

app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  BookStore.findByIdAndDelete({ _id: id }, (err) => {
    if (!err) {
      return console.log("book deleted");
    }
    console.log(err + "silerken hata");
  });
});
app.put("/lend/:id", async (req, res) => {
  try {
    await BookStore.findByIdAndUpdate(req.params.id, {
      $inc: { quantity: -1 },
    });
  } catch (err) {
    consolo.log(err);
  }
});
app.put("/back/:id", async (req, res) => {
  try {
    await BookStore.findByIdAndUpdate(req.params.id, {
      $inc: { quantity: 1 },
    });
  } catch (err) {
    consolo.log(err);
  }
});

app.listen(5000, () => {
  console.log("server calısıyor");
});
