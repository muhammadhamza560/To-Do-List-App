
// Get HTML Elements
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const filterButtons = document.querySelectorAll(".filter-btn");

// Load tasks from Local Storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";


// Save Tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// Add New Task
taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const title = taskInput.value.trim();

    if (title === "") {
        alert("Please enter a task!");
        return;
    }

    const newTask = {
        id: Date.now(),
        title: title,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    displayTasks();

});


// Display Tasks
function displayTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    if (filteredTasks.length === 0) {

        const message = document.createElement("p");

        message.className = "empty-message";
        message.textContent = "No tasks found.";

        taskList.appendChild(message);

    }

    filteredTasks.forEach(function(task) {

        const taskItem = document.createElement("div");

        taskItem.className = "task-item";

        // Checkbox
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function() {

            task.completed = checkbox.checked;

            saveTasks();
            displayTasks();

        });

        // Task Title
        const title = document.createElement("span");

        title.className = "task-title";
        title.textContent = task.title;

        if (task.completed) {
            title.classList.add("completed");
        }

        // Action Buttons
        const actions = document.createElement("div");

        actions.className = "task-actions";

        // Edit Button
        const editButton = document.createElement("button");

        editButton.textContent = "Edit";
        editButton.className = "edit-btn";

        editButton.addEventListener("click", function() {

            const newTitle = prompt("Edit your task:", task.title);

            if (newTitle === null) {
                return;
            }

            if (newTitle.trim() === "") {
                alert("Task title cannot be empty!");
                return;
            }

            task.title = newTitle.trim();

            saveTasks();
            displayTasks();

        });

        // Delete Button
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function() {

            const confirmDelete = confirm(
                "Are you sure you want to delete this task?"
            );

            if (confirmDelete) {

                tasks = tasks.filter(item => item.id !== task.id);

                saveTasks();
                displayTasks();

            }

        });

        // Add Elements
        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        taskItem.appendChild(checkbox);
        taskItem.appendChild(title);
        taskItem.appendChild(actions);

        taskList.appendChild(taskItem);

    });

    updateSummary();

}


// Filter Tasks
filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        currentFilter = button.dataset.filter;

        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        displayTasks();

    });

});


// Update Task Summary
function updateSummary() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = total - completed;

    totalTasks.textContent = total;
    pendingTasks.textContent = pending;
    completedTasks.textContent = completed;

}


// Display Saved Tasks When Page Opens
displayTasks();
