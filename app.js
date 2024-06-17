// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYmDdbIkfGfEa_053m1341R13HdR0gPTU",
  authDomain: "task-management-app-f716b.firebaseapp.com",
  databaseURL: "https://task-management-app-f716b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "task-management-app-f716b",
  storageBucket: "task-management-app-f716b.appspot.com",
  messagingSenderId: "1075488505790",
  appId: "1:1075488505790:web:2650fb813497e1cf7b03ef",
  measurementId: "G-7B79F22SY6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Get a reference to the database service
const database = firebase.database();

// Add tasks functionality
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

addTaskBtn.addEventListener('click', function() {
    const taskText = taskInput.value;
    if (taskText.trim() !== '') {
        // Push task data to Firebase database
        database.ref('tasks').push({
            text: taskText,
            completed: false
        });
        taskInput.value = '';
    }
});

// Display Tasks Functionality
// Listen for changes in the tasks data
database.ref('tasks').on('value', function(snapshot) {
    taskList.innerHTML = '';
    snapshot.forEach(function(childSnapshot) {
        const task = childSnapshot.val();
        const li = document.createElement('li');
        li.textContent = task.text;
        taskList.appendChild(li);
    });
});

// Edit task
taskList.addEventListener('click', function(event) {
    if (event.target.tagName === 'LI') {
        const taskId = event.target.key; // Assuming you have a unique key for each task
        const newText = prompt('Edit task:', event.target.textContent);
        if (newText !== null) {
            database.ref('tasks/' + taskId).update({ text: newText });
        }
    }
});

// Delete task
taskList.addEventListener('contextmenu', function(event) {
    event.preventDefault();
    if (event.target.tagName === 'LI') {
        const taskId = event.target.key; // Assuming you have a unique key for each task
        database.ref('tasks/' + taskId).remove();
    }
});
