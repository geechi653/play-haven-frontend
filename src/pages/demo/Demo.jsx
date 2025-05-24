import { useGlobalStore } from '../../hooks/useGlobalStore.js';
import { useState, useEffect } from 'react';
import { fetchTodos, addTodo, deleteTodo } from '../../utils/api.js';

function Demo() {
  // load the store to this component
  const { store, dispatch } = useGlobalStore();
  // local state to manage the task input
  const [task, setTask] = useState('');
  // get the user id from the store
  const USER_ID = store.user.userId;

  // if no user id is found, show a message
  if (!USER_ID) {
    return (
      <div className="container text-center mt-5">
        <h2>No active user</h2>
        <p>
          You must have an active user to use this API. Please create one using
          the API, see the docs at{' '}
          <a
            href="http://yollstudentapi.com/api/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Swagger Documentation
          </a>
          .
        </p>
      </div>
    );
  }

  // fetch the tasks from the API
  const handleFetchTasks = async () => {
    try {
      // use the function to fetch from utiils api.js
      const tasksFromApi = await fetchTodos(USER_ID);
      // make a request to modify the store
      // remember flux doesnt allow you to modify the store directly from the view (component)
      // you must use the dispatch function to modify the store
      dispatch({ type: 'SET_TODOS', payload: { todos: tasksFromApi } });
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // useEffect to fetch the tasks when the component mounts (at the beginning when its rendered)
  useEffect(() => {
    document.querySelector('html').setAttribute('data-bs-theme', 'dark');
    handleFetchTasks();
  }, []);

  // functions to handle the add and delete tasks
  const handleAddTask = async () => {
    // check if the task is empty
    if (!task) return;

    try {
      // use the function to add a task from utiils api.js
      const newTask = await addTodo({
        title: task,
        completed: false,
        user_id: USER_ID,
      });
      // make a request to modify the store
      dispatch({
        type: 'SET_TODOS',
        payload: { todos: [...store.todos, newTask] },
      });
      // clear the input
      setTask('');
    } catch (error) {
      console.error(error);
    }
  };

  // function to handle the delete task
  const handleDeleteTask = async (id) => {
    try {
      // use the function to delete a task from utiils api.js
      await deleteTodo(id, USER_ID);
      // make a request to modify the store
      dispatch({
        type: 'SET_TODOS',
        payload: { todos: store.todos.filter((task) => task.id !== id) },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="text-center col-md-6 mx-auto">
        <h1>Demo Todo</h1>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <button className="btn btn-outline-primary" onClick={handleAddTask}>
            Add Task
          </button>
        </div>
        <ul className="list-unstyled list-group ">
          {store.todos.map((todo) => (
            <li
              className="list-group-item d-flex justify-content-between"
              key={todo.id}
            >
              <div>{todo.title}</div>
              <button
                onClick={() => handleDeleteTask(todo.id)}
                className="btn border border-0 m-0 p-0 fw-bold text-danger"
              >
                X
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Demo;
