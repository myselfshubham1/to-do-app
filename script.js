// Get elements
const form = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filter-btn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = 'all';

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = '';
    let filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        if (filter === 'completed') return task.completed;
        if (filter === 'pending') return !task.completed;
    });
    filteredTasks.forEach((task, idx) => {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.completed ? ' completed' : '');
        
        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;
        li.appendChild(span);

        // Actions
        const actions = document.createElement('div');
        actions.className = 'task-actions';

        // Complete/Uncomplete
        const completeBtn = document.createElement('button');
        completeBtn.textContent = task.completed ? 'Undo' : 'Done';
        completeBtn.onclick = () => {
            tasks[idx].completed = !tasks[idx].completed;
            saveTasks();
            renderTasks();
        };
        actions.appendChild(completeBtn);

        // Edit
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => {
            const newText = prompt('Edit task:', task.text);
            if (newText !== null && newText.trim() !== '') {
                tasks[idx].text = newText.trim();
                saveTasks();
                renderTasks();
            }
        };
        actions.appendChild(editBtn);

        // Delete
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => {
            if (confirm('Delete this task?')) {
                tasks.splice(idx, 1);
                saveTasks();
                renderTasks();
            }
        };
        actions.appendChild(deleteBtn);

        li.appendChild(actions);
        taskList.appendChild(li);
    });
}

form.onsubmit = e => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (text) {
        tasks.push({ text, completed: false });
        saveTasks();
        renderTasks();
        taskInput.value = '';
    }
};

filterBtns.forEach(btn => {
    btn.onclick = () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filter = btn.getAttribute('data-filter');
        renderTasks();
    };
});

// Initial render
renderTasks(); 