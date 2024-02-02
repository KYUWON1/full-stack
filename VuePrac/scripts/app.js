const TodosApp = {
  data() {
    return {
      isLoading: false, //버퍼링에 대한 상태
      todos: [],
      enteredTodoText: "",
      editedTodoId: null,
    };
  },
  //사용자 지정 메소드
  methods: {
    async saveTodo(event) {
      event.preventDefault();

      if (this.editedTodoId) {
        //updating
        const todoId = this.editedTodoId;

        let response;

        try {
          response = await fetch("http://localhost:3000/todos/" + todoId, {
            method: 'PATCH',
            body: JSON.stringify({
              newText: this.enteredTodoText ,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          alert("Something went wrong!");
          return;
        }

        if (!response.ok) {
          alert("Something went wrong!");
          return;
        }

        const todoIndex = this.todos.findIndex(function (todoItem) {
          return todoItem.id === todoId;
        });
        const updateTodoItem = {
          id: this.todos[todoIndex].id, // id는 유지
          text: this.enteredTodoText,
        };

        this.todos[todoIndex] = updateTodoItem; //항목교체
        this.editedTodoId = null;
      } else {
        //creating
        let response;

        try {
          response = await fetch("http://localhost:3000/todos", {
            method: "POST",
            body: JSON.stringify({
              text: this.enteredTodoText,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          alert("Something went wrong!");
          return;
        }

        if (!response.ok) {
          alert("Something went wrong!");
          return;
        }

        const responseData = await response.json();
        const todoId = responseData.createdTodo.id;

        const newTodo = {
          text: this.enteredTodoText,
          id: todoId,
        };

        this.todos.push(newTodo);
      }
      this.enteredTodoText = "";
    },
    startEditTodo(todoId) {
      this.editedTodoId = todoId;
      const todo = this.todos.find(function (todoItem) {
        return todoItem.id === todoId;
      });
      this.enteredTodoText = todo.text;
    },
    async deleteTodo(todoId) {
      this.todos = this.todos.filter(function (todoItem) {
        return todoItem.id !== todoId; //false반환하는 값을 삭제한 배열 전달, 같으면 false
      });
      let response;

      try {
        response = await fetch("http://localhost:3000/todos/" + todoId, {
          method: "DELETE",
        });
      } catch (error) {
        alert("Something went wrong!");
        return;
      }

      if (!response.ok) {
        alert("Something went wrong!");
        return;
      }
    },
  },
  //앱이 생성될때마다 호출될 메소드
  async created() {
    let response;
    this.isLoading = true; //수동으로 로딩상태관리해줌 Vue랑 async의 약간의 차이때문에
    try {
      response = await fetch("http://localhost:3000/todos");
    } catch (error) {
      alert("Something went wrong!");
      this.isLoading = false;
      return;
    }
    this.isLoading = false;

    if (!response.ok) {
      alert("Something went wrong!");
      return;
    }

    const responseData = await response.json();
    this.todos = responseData.todos;
  },
  mounted() {
    //DOm이 갱신될때마다 호출될 메소드
  },
};

Vue.createApp(TodosApp).mount("#todos-app");
