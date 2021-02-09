var taskInput = document.getElementById("new-task");//Add a new task.
var addButton = document.getElementsByTagName("button")[0];//first button
var incompleteTaskHolder = document.getElementById("incomplete-tasks");//ul of #incomplete-tasks
var completedTasksHolder = document.getElementById("completed-tasks");//completed-tasks


//New task list item 
var createNewTaskElement = function (taskString) {

  var listItem = document.createElement("li");

  //input (checkbox)
  var checkBox = document.createElement("input");//checkbx
  //label
  var label = document.createElement("label");//label
  //input (text)
  var editInput = document.createElement("input");//text
  //button.edit
  var editButton = document.createElement("button");//edit button

  //button.delete
  var deleteButton = document.createElement("button");//delete button

  label.innerText = taskString;

  //Each elements, needs appending
  checkBox.type = "checkbox";
  editInput.type = "text";

  editButton.innerText = "Edit";//innerText encodes special characters, HTML does not.
  editButton.className = "edit";
  deleteButton.innerText = "Delete";
  deleteButton.className = "delete";



  //and appending.
  listItem.appendChild(checkBox);
  listItem.appendChild(label);
  listItem.appendChild(editInput);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);
  return listItem;
}



var addTask = function () {
  console.log("Add Task...");
  //Create a new list item with the text from the #new-task:
  var listItem = createNewTaskElement(taskInput.value);

  //Append listItem to incompleteTaskHolder
  incompleteTaskHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);

  taskInput.value = "";

}

//Edit an existing task.

var editTask = function () {
  console.log("Edit Task...");
  console.log("Change 'edit' to 'save'");


  var listItem = this.parentNode;

  var editInput = listItem.querySelector('input[type=text]');
  var label = listItem.querySelector("label");
  var containsClass = listItem.classList.contains("editMode");
  //If class of the parent is .editmode
  if (containsClass) {

    //switch to .editmode
    //label becomes the inputs value.
    label.innerText = editInput.value;
  } else {
    editInput.value = label.innerText;
  }

  //toggle .editmode on the parent.
  listItem.classList.toggle("editMode");
}




//Delete task.
var deleteTask = function () {
  console.log("Delete Task...");

  var listItem = this.parentNode;
  var ul = listItem.parentNode;
  //Remove the parent list item from the ul.
  ul.removeChild(listItem);

}


//Mark task completed
var taskCompleted = function () {
  console.log("Complete Task...");

  //Append the task list item to the #completed-tasks
  var listItem = this.parentNode;
  completedTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskIncomplete);

}


var taskIncomplete = function () {
  console.log("Incomplete Task...");
  //Mark task as incomplete.
  //When the checkbox is unchecked
  //Append the task list item to the #incomplete-tasks.
  var listItem = this.parentNode;
  incompleteTaskHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);
}



var ajaxRequest = function () {
  console.log("AJAX Request");
}

//The glue to hold it all together.


//Set the click handler to the addTask function.
addButton.addEventListener("click", addTask);
addButton.addEventListener("click", ajaxRequest);


var bindTaskEvents = function (taskListItem, checkBoxEventHandler) {
  console.log("bind list item events");
  //select ListItems children
  var checkBox = taskListItem.querySelector("input[type=checkbox]");
  var editButton = taskListItem.querySelector("button.edit");
  var deleteButton = taskListItem.querySelector("button.delete");


  //Bind editTask to edit button.
  editButton.onclick = editTask;
  //Bind deleteTask to delete button.
  deleteButton.onclick = deleteTask;
  //Bind taskCompleted to checkBoxEventHandler.
  checkBox.onchange = checkBoxEventHandler;
}

//cycle over incompleteTaskHolder ul list items
//for each list item
for (var i = 0; i < incompleteTaskHolder.children.length; i++) {

  //bind events to list items chldren(tasksCompleted)
  bindTaskEvents(incompleteTaskHolder.children[i], taskCompleted);
}




//cycle over completedTasksHolder ul list items
for (var i = 0; i < completedTasksHolder.children.length; i++) {
  //bind events to list items chldren(tasksIncompleted)
  bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
}

//Cookie Handler By @luke110206
function getCookie(cname) { //Get Specific Cookie
  var name = cname + "="; //i.e getCookie('username') name = 'username='
  var decodedCookie = decodeURIComponent(document.cookie); //Unencode cookie
  var ca = decodedCookie.split(';'); //Split string into array at ';'
  for (var i = 0; i < ca.length; i++) { // for each cookie vaiable in document.cookie do
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
window.onbeforeunload = closingCode; //Before page unloads
function closingCode() {
  let completedTasksCookie = [] //List of completed tasks
  let incompleteTasksCookie = [] //List of incomplete tasks
  for (let i = 0; i < incompleteTaskHolder.children.length; i++) { //Search all incomplete tasks
    incompleteTasksCookie.push(incompleteTaskHolder.children[i].children[1].innerText) //apend the text of the task to the array
  }
  for (let i = 0; i < completedTasksHolder.children.length; i++) { //Search all incomplete tasks
    completedTasksCookie.push(completedTasksHolder.children[i].children[1].innerText) //apend the text of the task to the array
  }
  document.cookie = `completed=${completedTasksCookie.toString()}; expires=Fri, 1 Jan 2100 0:00:00 UTC; path=/;`; //Push First Cookie (Completed Tasks)
  document.cookie = `incomplete=${incompleteTasksCookie.toString()}; expires=Fri, 1 Jan 2100 0:00:00 UTC; path=/;` //Push Second Cookie (Incomplete Tasks)
  //Note: Automatic Delete Date means future date must be set (Will not work after Jan 1 2100 0:00 UTC+0)
  //Note: You have to use 2 document.cookie instances
  return null;
}
//Loading Tasks Back
var incompleteTasks = getCookie('incomplete');
var completedTasks = getCookie('completed');
if (completedTasks != "") {
  var completedTasksToMake = completedTasks.split(',');
  completedTasksToMake.forEach((item, index) => {
    let newItem = createNewTaskElement(item)
    newItem.children[0].checked = true;
    completedTasksHolder.appendChild(newItem);
    bindTaskEvents(newItem, taskIncomplete);
  });

}
if (incompleteTasks != "") {
  var incompleteTasksToMake = incompleteTasks.split(',');
  incompleteTasksToMake.forEach((item, index) => {
    let newItem = createNewTaskElement(item)
    incompleteTaskHolder.appendChild(newItem);
    bindTaskEvents(newItem, taskCompleted);
  });
}