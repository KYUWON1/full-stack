const Todo = require('../models/todo-models');

async function getAllTodos(req,res,next){
    let todos;
    try{
        todos = await Todo.getAllTodos();
    }catch(error){
        return next(error);
    }

    res.json({
        todos:todos,
    })
};

async function addTodo(req,res,next){
    const todoText = req.body.text;

    const todo = new Todo(todoText);

    let insertedId;
    try{
       const result = await todo.save();
       insertedId = result.insertedId;  // db자체에서 insertedID를 취급함 _id로 
    }catch(error){
        return next(error);
    }

    todo.id = insertedId.toString();

    res.json({
        message:'todo insert clear',
        createdTodo : todo,
    });
};

async function updateTodo(req,res,next){
    const todoId = req.params.id;
    const newTodoText = req.body.newText;

    const todo = new Todo(newTodoText,todoId);
    try{
        await todo.save(); 
    }catch(error){
        return next(error);
    }

    res.json({message:'todo 업데이트',updatedTodo: todo});
};

async function deleteTodo(req,res,next){
    const todoId = req.params.id;

    const todo = new Todo(null,todoId);

    try{
        await todo.delete(); 
    }catch(error){
        return next(error);
    }

    res.json({message:'todo 삭제'});
}; 

module.exports = {
  getAllTodos: getAllTodos,
  addTodo: addTodo,
  updateTodo: updateTodo,
  deleteTodo: deleteTodo,
};