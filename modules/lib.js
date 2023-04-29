class TaskManager {
    quantity;
    currentId;
    todoList;
    doneList;
    taskToAdd;
    warningManager;

    constructor(info, todoList, doneList, taskToAdd, warningManager) {
        this.todoList = todoList;
        this.doneList = doneList;
        this.taskToAdd = taskToAdd;
        this.warningManager = warningManager;

        let parsedInfo = JSON.parse(info);
        this.quantity = parsedInfo.quantity;
        this.currentId = parsedInfo.currentId;

        this.taskToAdd.onsubmit = (e) => {
            e.preventDefault();
            const field = taskToAdd.querySelector("input[type='text']");
            this.saveTaskInStorage(field.value);
            field.value = "";
        };
    }

    addInTodoList(task) {
        const div = this.addDivision();
        const li = this.addListItem(div, task);
        this.addDivision();
        this.addDeleteButton(div);
        this.addCompleteButton(div);
        this.addParagraph(div, task);
        this.todoList.appendChild(li);
    }

    addInDoneList(task) {
        const div = this.addDivision();
        const li = this.addListItem(div, task);
        this.addDivision();
        this.addDeleteButton(div);
        this.addParagraph(div, task);
        this.doneList.appendChild(li);
    }

    addListItem(div, task) {
        const li = document.createElement("li");
        li.id += `task-${task.id}`;
        li.appendChild(div);
        return li;
    }

    addDivision() {
        const div = document.createElement("div");
        div.className += "task";
        return div;
    }

    addDeleteButton(div) {
        const btnDelete = document.createElement("button");
        btnDelete.className += "btn-delete";
        btnDelete.textContent = "X";
        btnDelete.onclick = (e) => this.removeTask(e.target);
        div.appendChild(btnDelete);
        return btnDelete;
    }

    addCompleteButton(div) {
        const btnComplete = document.createElement("button");
        btnComplete.textContent = "!";
        btnComplete.className += "btn-complete";
        btnComplete.onclick = (e) => this.completeTask(e.target);
        div.appendChild(btnComplete);
        return btnComplete;
    }

    addParagraph(div, task) {
        const paragraph = document.createElement("p");
        paragraph.textContent = task.description;
        div.appendChild(paragraph);
    }

    removeTask(target) {
        let taskToRemove = target?.parentElement?.parentElement;
        if (taskToRemove) {
            let id = taskToRemove.id.replace("task-", "");
            localStorage.removeItem(`${id}`);
            this.removeTaskFromStorage();
            taskToRemove.remove();
        }
    }

    completeTask(target) {
        let taskToComplete = target?.parentElement?.parentElement;
        if (taskToComplete) {
            let id = taskToComplete.id.replace("task-", "");
            let description =
                target.parentElement.querySelector("p").textContent;

            let updatedTask = { description, isDone: true, id };
            let stringTask = JSON.stringify(updatedTask);

            localStorage.setItem(`${id}`, stringTask);
            target.remove();
            this.doneList.appendChild(taskToComplete);
        }
    }

    saveTaskInStorage(description) {
        if (!description) return;
        const id = this.addEntry();
        const task = {
            description,
            isDone: false,
            id,
        };

        let stringTask = JSON.stringify(task);
        localStorage.setItem(id, stringTask);

        this.updateStorage();
        this.addInTodoList(task);
        this.warningManager.warningTaskAdded();
    }

    removeTaskFromStorage() {
        this.removeEntry();
        this.updateStorage();
        this.warningManager.warningTaskRemoved();
    }

    addEntry() {
        this.quantity++;
        this.currentId++;
        return `${this.currentId}`;
    }

    removeEntry() {
        this.quantity--;
    }

    updateStorage() {
        let info = { quantity: this.quantity, currentId: this.currentId };
        let stringInfo = JSON.stringify(info);
        localStorage.setItem("0", stringInfo);
    }

    loadTasks() {
        const n = this.quantity;
        for (let i = 0; i <= n; i++) {
            let stringTask = localStorage.getItem(localStorage.key(i));
            if (stringTask) {
                let objTask = JSON.parse(stringTask);
                const { id } = objTask;

                if (!id) continue;

                if (!objTask.isDone) {
                    this.addInTodoList(objTask);
                } else {
                    this.addInDoneList(objTask);
                }
            }
        }
    }
}

class WarningManager {
    modal;
    modalBody;
    modalParagraph;
    timer;
    green = "rgb(110, 255, 158)";
    red = "rgb(255, 99, 99)";

    constructor(modal) {
        this.modal = modal;
        this.modalBody = this.modal.querySelector(".modal-body");
        this.modalParagraph = this.modalBody.querySelector("p");
        this.timer = 0;
    }

    warningTaskAdded() {
        this.modalBody.style.backgroundColor = this.green;
        this.modalParagraph.textContent = "Task Added";
        this.modalToggle(2000);
    }

    warningTaskRemoved() {
        this.modalBody.style.backgroundColor = this.red;
        this.modalParagraph.textContent = "Task Removed";
        this.modalToggle(2000);
    }

    modalToggle(time) {
        this.modalBody.show();

        if (this.timer) clearTimeout(this.timer);

        this.timer = setTimeout(() => {
            this.modalBody.close();
            this.timer = 0;
        }, time);
    }
}

export { TaskManager, WarningManager };
