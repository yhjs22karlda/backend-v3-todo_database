//TODO add PUT to change 'done'
//TODO validera input string
import express from "express"
import Datastore from "nedb-promises"
const todoDB = Datastore.create("./todo.db")

const app = express()
const PORT = 3000
app.use(express.json())


app.get("/api/todo", async (req, res) => {
    let page = Math.floor(Number(req.query.page)) || 1
    let perPage = Math.floor(Number(req.query.perpage)) || 10

    let todos = await todoDB.find({}).sort({createdAt: 1})
    todos = todos.map((item, i) => ({...item, nr: i + 1}))

    let startIndex = (page -1) * perPage
    if(todos.length < (page * perPage)) startIndex = 0
    let endIndex = startIndex + perPage
    res.json(todos.slice(startIndex, endIndex))
})

app.post("/api/todo", (req, res) => {
    if(Object.hasOwn(req.body, "todo") && typeof req.body.todo === "string") { // kräver bättre validering???
        let todo = {
            todo: req.body.todo,
            done: false,
            createdAt: new Date()
        }
        todoDB.insert(todo)
        res.json("Todo added")
    } else {
        res.status(400).json("Bad request.")
    }
})

app.delete("/api/todo/:id", (req, res) => {
    todoDB.remove({_id: req.params.id})
        .then(itemsRemoved => res.json(`${itemsRemoved} items removed.`))
        .catch(err => console.log(err))
})


app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
})