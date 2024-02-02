const todoController = require('../controllers/todo-controller');

const express = require('express');

const router = express.Router();

router.get('/',todoController.getAllTodos); //todos/...

router.post('/',todoController.addTodo);

router.patch('/:id',todoController.updateTodo);

router.delete('/:id',todoController.deleteTodo);

module.exports = router;