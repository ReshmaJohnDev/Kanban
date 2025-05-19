import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [taskStatus, setTaskStatus] = useState("todo");

  // Fetch all tasks
  async function getTasks() {
    try {
      const response = await fetch(
        "https://jumpdecimal-newtonmike-3000.codio.io/tasks",
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`GET failed. status: ${response.status}`);
      }
      const taskList = await response.json();
      console.log(taskList);
      setTasks(() => taskList);
    } catch (error) {
      console.error("Fetch failed:", error);
      setTasks([]);
    }
  }

  //Add task
  const addTask = async (task) => {
    try {
      const response = await fetch(
        "https://jumpdecimal-newtonmike-3000.codio.io/tasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify(task),
        }
      );
      if (!response.ok) {
        throw new Error(`POST failed: ${response.status}`);
      }
      await getTasks();
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  //Update Task
  async function updateTask(task, event) {
    try {
      const updatedTask = {
        text: task.text,
        status: event.target.value,
      };
      const response = await fetch(
        `https://jumpdecimal-newtonmike-3000.codio.io/tasks/${task.id}`,
        {
          method: "PATCH",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTask),
        }
      );
      if (!response.ok) {
        throw new Error(`PATCH failed: ${response.status}`);
      }
      await getTasks();
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  }

  //Delete Task
  async function deleteTask(id) {
    try {
      const response = await fetch(
        `https://jumpdecimal-newtonmike-3000.codio.io/tasks/${id}`,
        {
          method: "DELETE",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`DELETE failed: ${response.status}`);
      }
      await getTasks();
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  }

  // Handle form submission
  function handleSubmit(event) {
    event.preventDefault();
    const task = {
      text: taskText,
      status: taskStatus,
    };
    addTask(task);

    setTaskText("");
    setTaskStatus("todo");
  }

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Kanban Board</h1>
        <div>
          <label>
            Task Test:
            <input
              type="text"
              required
              placeholder="Enter the to do task"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
            ></input>
          </label>
        </div>
        <div>
          <label>
            Status:
            <select
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value)}
            >
              <option value="todo">Todo</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
          </label>
        </div>
        <button type="submit">Add Task</button>
        <div>
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                {task.text}
                <button
                  value="todo"
                  onClick={() => updateTask(task, event)}
                  disabled={task.status === "todo"}
                >
                  Todo
                </button>
                <button
                  value="doing"
                  onClick={() => updateTask(task, event)}
                  disabled={task.status === "doing"}
                >
                  Doing
                </button>
                <button
                  value="done"
                  onClick={() => updateTask(task, event)}
                  disabled={task.status === "done"}
                >
                  Done
                </button>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </form>
    </div>
  );
}
export default App;
