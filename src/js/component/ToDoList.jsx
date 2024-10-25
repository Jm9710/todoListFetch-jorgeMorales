import React, { useState, useEffect } from "react";

const ToDoList = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const obtenerTodo = () => {
    fetch("https://playground.4geeks.com/todo/users/jorge")
      .then((resp) => {
        console.log(resp.status);
        if (!resp.ok) {
          throw new Error("Error al obtener las tareas");
        }
        return resp.json();
      })
      .then((data) => {
        console.log(data);
        setTasks(data.todos || []);
      })
      .catch((error) => {
        console.error("Error al cargar las tareas:", error);
      });
  };

  useEffect(() => {
    obtenerTodo();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && task.trim() !== "") {
      const newTask = { label: task.trim(), done: false };
      
      fetch("https://playground.4geeks.com/todo/todos/jorge", {
        method: "POST",
        body: JSON.stringify(newTask),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          console.log(response.status);
          return response.json();
        })
        .then((data) => {
          console.log("Tarea agregada en el servidor:", data);
          obtenerTodo(); 
          setTask(""); 
        })
        .catch((err) => {
          console.error("Error al agregar la tarea:", err);
        });
    }
  };

  const deleteTask = (index) => {
    const taskToDelete = tasks[index];
    if (taskToDelete && taskToDelete.id) {
      fetch(`https://playground.4geeks.com/todo/todos/${taskToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((resp) => {
        if (resp.ok) {
          console.log("Tarea eliminada con éxito");
          obtenerTodo(); 
        } else {
          console.error("Error al eliminar la tarea");
        }
      })
      .catch((error) => console.error("Error en la solicitud:", error));
    } else {
      console.error("La tarea no tiene un ID válido", taskToDelete);
    }
  };
  

  const deleteAllTasks = () => {
    const deletePromises = tasks.map((task) => {
      if (task.id) {
        return fetch(`https://playground.4geeks.com/todo/todos/${task.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((resp) => {
          if (!resp.ok && resp.status !== 404) {
            throw new Error(`No se pudo eliminar la tarea con id ${task.id}`);
          }
        });
      }
      return Promise.resolve(); 
    });
  
    Promise.all(deletePromises)
      .then(() => {
        console.log("Todas las tareas eliminadas o ya inexistentes.");
        obtenerTodo(); 
      })
      .catch((error) => console.error("Error al eliminar todas las tareas:", error));
  };
  
  

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">To Do List</h2>
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6 shadow p-0 mb-0 bg-white rounded-0">
          <ul className="list-group">
            <li className="list-group-item p-0 border-0 border-dark rounded-0">
              <input
                type="text"
                placeholder="¿Qué necesitas?"
                value={task}
                className="form-control border-0 rounded-0"
                onChange={(e) => setTask(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </li>
            {tasks.map((t, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center border-bottom border-end-0 border-start-0 border-grey rounded-0"
              >
                {t.label}
                <span
                  className="close text-danger"
                  onClick={() => deleteTask(index)}
                  style={{ cursor: "pointer" }}
                >
                  ✖
                </span>
              </li>
            ))}
            <div className="m-0">{tasks.length} tareas</div>
          </ul>

          <div className="d-flex justify-content-center mt-3">
            <button className="btn btn-danger" onClick={deleteAllTasks}>
              Eliminar todas las tareas
            </button>
          </div>

          <div className="leaf-container">
            <div className="leaf-1 p-1 shadow"></div>
            <div className="leaf-2 p-1 shadow"></div>
            <div className="leaf-3 p-1 shadow"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToDoList;
