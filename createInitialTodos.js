import Datastore from "nedb-promises"
const todoDB = Datastore.create("./todo.db")

let todos = []
let id = 35
for(let i = 1; i <= id; i++) {
    todos.push({todo: `Todo ${i}`, done: false, createdAt: new Date(1000*3600*24*(365+i)*45)})
}

todoDB.insert(todos)
    .then(() => console.log("Todos created!"))
    .catch((err) => console.log("Database error: " + err))