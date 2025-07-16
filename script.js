const categories = document.querySelectorAll('.category');
const taskList = document.getElementById('taskList');
const currentCatTitle = document.getElementById('currentCat');
const addBtn = document.getElementById('addBtn');

let currentCat = 'Today';

const tasks = {
  Today: [],
  Planned: [],
  Personal: [],
  Work: [],
  Shopping: []
};

// Switch category
categories.forEach(function(cat) {
  cat.addEventListener('click', function() {
    categories.forEach(function(c) { c.classList.remove('active'); });
    cat.classList.add('active');
    currentCat = cat.getAttribute('data-cat');
    currentCatTitle.innerText = currentCat;
    renderTasks();
  });
});

// Render tasks
function renderTasks() {
  taskList.innerHTML = '';
  tasks[currentCat].forEach(function(task, index) {
    const li = document.createElement('li');
    if (task.done) li.classList.add('done');

    let deadlineHTML = '';
    if (task.deadline) {
      deadlineHTML = `<br><small>⏰ ${task.deadline}</small>`;
    }

    li.innerHTML = `
      <input type="checkbox" ${task.done ? 'checked' : ''} onclick="toggleDone(${index})">
      <span class="text">${task.text}${deadlineHTML}</span>
      <div class="actions">
        <button onclick="editTask(${index})">✏️</button>
        <button onclick="deleteTask(${index})">🗑️</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

// Add task
addBtn.addEventListener('click', function() {
  const text = prompt(`Add new task for ${currentCat}:`);
  if (text) {
    let deadline = null;
    if (currentCat === "Planned") {
      deadline = prompt("Enter deadline date and time (YYYY-MM-DD HH:MM):");
    }
    tasks[currentCat].push({ text: text, done: false, deadline: deadline, alerted: false });
    renderTasks();
  }
});

// Toggle done
function toggleDone(index) {
  tasks[currentCat][index].done = !tasks[currentCat][index].done;
  renderTasks();
}

// Edit task
function editTask(index) {
  const newText = prompt('Edit task:', tasks[currentCat][index].text);
  if (newText) {
    tasks[currentCat][index].text = newText;
    renderTasks();
  }
}

// Delete task
function deleteTask(index) {
  tasks[currentCat].splice(index, 1);
  renderTasks();
}

renderTasks();

// Check deadlines every minute
setInterval(function() {
  const now = new Date();
  tasks.Planned.forEach(function(task) {
    if (task.deadline && !task.alerted) {
      const taskTime = new Date(task.deadline);
      if (taskTime <= now) {
        alert(`⏰ Deadline reached for task: "${task.text}"`);
        task.alerted = true;
      }
    }
  });
}, 60000);
