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
  async function updateTask(task, newStatus) {
    try {
      const updatedTask = {
        text: task.text,
        status: newStatus,
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

  function renderTask(task) {
    return (
      <div key={task.id} className="taskCard">
        <div className="taskText">{task.text.toUpperCase()}</div>
        <div className="taskButtons">
          {task.status === "todo" && (
            <button
              className="status-btn"
              onClick={() => updateTask(task, "doing")}
            >
              Doing
            </button>
          )}
          {task.status === "doing" && (
            <button
              className="status-btn"
              onClick={() => updateTask(task, "done")}
            >
              Done
            </button>
          )}
          <button className="delete-btn" onClick={() => deleteTask(task.id)}>
            🗑️{" "}
          </button>
        </div>
      </div>
    );
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
      <h1>📋➡️📈 Kanban Board</h1>
      <form onSubmit={handleSubmit}>
        <div className="taskInput">
          <label>
            <input
              type="text"
              required
              placeholder="Task text"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
            ></input>
          </label>
        </div>
        <div className="status">
          <label>
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
        <div className="addTask">
          <button type="submit">Add Task</button>
        </div>
      </form>
      <div className="kanban-columns">
        <div className="column">
          <h2>Todo</h2>
          <div>{tasks.filter((t) => t.status === "todo").map(renderTask)}</div>
        </div>
        <div className="column">
          <h2>Doing</h2>
          <div>{tasks.filter((t) => t.status === "doing").map(renderTask)}</div>
        </div>
        <div className="column">
          <h2>Done</h2>
          <div>{tasks.filter((t) => t.status === "done").map(renderTask)}</div>
        </div>
      </div>
    </div>
  );
}
export default App;
