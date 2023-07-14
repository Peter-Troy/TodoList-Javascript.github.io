// Get references to HTML elements
const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const audioinsert = new Audio("sound/insert.mp3"); 
const audiocomplete= new Audio("sound/complete.mp3"); 
const audiodelete = new Audio("sound/delete.mp3"); 

function playinsertsound(){
  audioinsert.play();
}

function playcompletesound(){
  audiocomplete.play();
}

function playdeletesound(){
  audiodelete.play();
  console.log();
}

// Populate task list on page load
populateTaskList();

function addTask() {
    const taskText = taskInput.value;
    if (taskText.trim() === "") {
      alert("Please enter a task.");
      return;
    }
  
    const taskItem = document.createElement("li");
    const taskId = Date.now().toString(); // Generate a unique ID for the task
    taskItem.dataset.taskId = taskId; // Set the taskId as a data attribute
  
    const taskTextSpan = document.createElement("span");
    taskTextSpan.innerText = taskText;
  
    const dropdown = createDropdown(); // Create the dropdown element
  
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", deleteTask);
  
    taskItem.appendChild(taskTextSpan);
    taskItem.appendChild(dropdown);
    taskList.appendChild(taskItem);
  
    saveTaskData(taskId, taskText); // Save the task data in local storage
  
    taskInput.value = "";
    playinsertsound();
  }

// Function to save task data in local storage
function saveTaskData(taskId, taskText) {
  const taskData = getTaskData();
  taskData[taskId] = taskText;
  localStorage.setItem("tasks", JSON.stringify(taskData));
}

// Function to retrieve task data from local storage
function getTaskData() {
  const taskData = localStorage.getItem("tasks");
  return taskData ? JSON.parse(taskData) : {};
}

function populateTaskList() {
    taskList.innerHTML = ""; // Clear existing task items
  
    const taskData = getTaskData();
    for (const taskId in taskData) {
      const taskText = taskData[taskId];
      const taskItem = createTaskItem(taskId, taskText);
      taskList.appendChild(taskItem);
    }
  }
  
  // Function to create a task item
  function createTaskItem(taskId, taskText) {
    const taskItem = document.createElement("li");
    taskItem.dataset.taskId = taskId; // Set the taskId as a data attribute
  
    const taskTextSpan = document.createElement("span");
    taskTextSpan.innerText = taskText;
  
    const dropdown = createDropdown(); // Create the dropdown element
  
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", deleteTask);
    taskItem.appendChild(taskTextSpan);
    taskItem.appendChild(dropdown);
  
    return taskItem;
  }

  taskList.addEventListener("change", function (event) {
    if (event.target.classList.contains("status-dropdown")) {
      handleDropdownChange(event);
    }
  });
  
// Function to create a dropdown for the task item
function createDropdown() {
    const dropdown = document.createElement("select");

    const optionInProgress = document.createElement("option");
    optionInProgress.value = "inprogress";
    optionInProgress.text = "In Progress";

    const optionCompleted = document.createElement("option");
    optionCompleted.value = "completed";
    optionCompleted.text = "Completed";
  
  
    const optionDeleted = document.createElement("option");
    optionDeleted.value = "deleted";
    optionDeleted.text = "Deleted";
  
    dropdown.appendChild(optionInProgress);
    dropdown.appendChild(optionCompleted);
    dropdown.appendChild(optionDeleted);
  
    dropdown.selectedIndex = 0;

    // Add event listener to the dropdown
    dropdown.addEventListener("change", handleDropdownChange);
  
    return dropdown;
  }
  
  // Function to handle dropdown change event
  function handleDropdownChange(event) {
    const selectedOption = event.target.value;
    const taskItem = event.target.parentNode;
  
    if (selectedOption === "completed") {
      taskItem.classList.add("completed");
      playcompletesound();
    } else if (selectedOption === "inprogress") {
      taskItem.classList.remove("completed");
      playcompletesound();
    } else if (selectedOption === "deleted") {
      taskList.removeChild(taskItem);
      playdeletesound()
      // Remove the task data from local storage
      const taskId = taskItem.dataset.taskId;
      removeTaskData(taskId);
    }

  const soundFile = event.target.options[event.target.selectedIndex].dataset.sound;
  if (soundFile) {
    const audio = new Audio("sound/" + soundFile);
    audio.play();

  }
}

// Function to mark a task as completed
function completeTask(event) {
  const taskItem = event.target.parentNode;
  taskItem.classList.add("completed");
  updateTaskData(taskItem);
}

// Function to mark a task as in progress
function progressTask(event) {
  const taskItem = event.target.parentNode;
  taskItem.classList.remove("completed");
  updateTaskData(taskItem);
}

// Function to update task data in local storage
function updateTaskData(taskItem) {
  const taskId = taskItem.dataset.taskId;
  const taskData = getTaskData();
  taskData[taskId] = taskItem.firstChild.innerText;
  localStorage.setItem("tasks", JSON.stringify(taskData));
}

// Function to handle task deletion
function deleteTask(event) {
  const taskItem = event.target.parentNode;
  taskList.removeChild(taskItem);
  removeTaskData(taskItem.dataset.taskId);
  playdeletesound();
}

// Function to remove task data from local storage
function removeTaskData(taskId) {
  const taskData = getTaskData();
  delete taskData[taskId];
  localStorage.setItem("tasks", JSON.stringify(taskData));
}

// Wait for the DOM content to be loaded
document.addEventListener("DOMContentLoaded", function () {
    addButton.addEventListener("click", addTask);
    
    populateTaskList();


  });