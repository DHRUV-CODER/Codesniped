const express = require("express")
require('dotenv').config()
const app = express()
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
const port = 5000;

const Document = require("./models/Document")
const mongoose = require("mongoose")
const { text } = require("express")
mongoose.connect(process.env.MONGO_DB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})

app.get("/", (req, res) => {
  const code = `Welcome to Codesniped!
Here you can paste text or code and share it with other , with features like duplication`

  res.render("code-display", { code, language: "plaintext", title : "welcome.boi" })
})

app.get("/new", (req, res) => {
  res.render("new")
})

app.post("/save", async (req, res) => {
  const title = req.body.title
  const value = req.body.value
  try {
    const document = await Document.create({ 
      value : value,
      title : title,
    })
    res.redirect(`/${document.id}`)
  } catch (e) {
    console.log(e)
    res.render("new", { value })
  }
})


app.get("/:id/duplicate", async (req, res) => {
  const id = req.params.id
  try {
    const document = await Document.findById(id)
    res.render("new", { value: document.value })
  } catch (e) {
    res.redirect(`/${id}`)
  }
})

app.get("/:id", async (req, res) => {
  const id = req.params.id
  try {
    const document = await Document.findById(id)

    res.render("code-display", { code: document.value, id , title : document.title})
  } catch (e) {
    const code = `Couldn't find the information in Database`
      res.render("code-display", { code, language: "plaintext", title : "error.sad" })
  }
})


app.listen(process.env.PORT || port, () => console.log(`Visit Me at http://localhost:${port}`));
