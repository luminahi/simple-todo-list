import { TaskManager, WarningManager } from "./modules/lib.js";

window.onload = () => {
    const taskToAdd = document.querySelector(".task-to-add form");
    const todoList = document.querySelector(".all-tasks-todo ul");
    const doneList = document.querySelector(".all-tasks-done ul");
    const modal = document.querySelector(".modal");

    if (!localStorage.getItem(0)) {
        let obj = { quantity: 0, currentId: 0 };
        localStorage.setItem("0", JSON.stringify(obj));
    }

    const warningManager = new WarningManager(modal);
    const taskManager = new TaskManager(
        localStorage.getItem("0"),
        todoList,
        doneList,
        taskToAdd,
        warningManager
    );

    taskManager.loadTasks();
};
