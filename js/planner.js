// ============================================================
// planner.js — Interactive Academic Planner
// Demonstrates: arrays, functions, DOM manipulation, event
// handling, dynamic content updates, and localStorage persistence.
// ============================================================

(function () {
  const STORAGE_KEY = 'academicPlannerTasks';

  /** @type {{id:number, title:string, due:string, priority:string, completed:boolean}[]} */
  let tasks = [];
  let currentFilter = 'all';

  const form = document.getElementById('task-form');
  const titleInput = document.getElementById('task-title');
  const dueInput = document.getElementById('task-due');
  const priorityInput = document.getElementById('task-priority');
  const taskError = document.getElementById('task-error');
  const list = document.getElementById('task-list');
  const emptyState = document.getElementById('empty-state');
  const statTotal = document.getElementById('stat-total');
  const statOpen = document.getElementById('stat-open');
  const statDone = document.getElementById('stat-done');
  const filterButtons = document.querySelectorAll('.filter-btn');

  // ---------- Persistence ----------

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      tasks = raw ? JSON.parse(raw) : [];
    } catch (e) {
      tasks = [];
    }
  }

  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  // ---------- Core task operations ----------

  function addTask(title, due, priority) {
    const newTask = {
      id: Date.now(),
      title: title.trim(),
      due: due || '',
      priority: priority || 'medium',
      completed: false
    };
    tasks.push(newTask); // array method
    saveTasks();
    render();
  }

  function toggleComplete(id) {
    const task = tasks.find(function (t) { return t.id === id; });
    if (task) {
      task.completed = !task.completed;
      saveTasks();
      render();
    }
  }

  function deleteTask(id) {
    tasks = tasks.filter(function (t) { return t.id !== id; }); // array method
    saveTasks();
    render();
  }

  function getFilteredTasks() {
    if (currentFilter === 'pending') {
      return tasks.filter(function (t) { return !t.completed; });
    }
    if (currentFilter === 'completed') {
      return tasks.filter(function (t) { return t.completed; });
    }
    return tasks;
  }

  function formatDue(dateStr) {
    if (!dateStr) return 'No due date';
    const d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return 'No due date';
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }

  // ---------- Rendering (DOM manipulation) ----------

  function render() {
    const visible = getFilteredTasks();
    list.innerHTML = ''; // clear existing DOM content

    if (visible.length === 0) {
      emptyState.style.display = 'block';
      emptyState.textContent = tasks.length === 0
        ? 'No tasks yet — add your first assignment above.'
        : 'Nothing in this view yet.';
    } else {
      emptyState.style.display = 'none';
      visible.forEach(function (task) {
        list.appendChild(buildTaskElement(task));
      });
    }

    // Stats
    statTotal.textContent = tasks.length;
    statOpen.textContent = tasks.filter(function (t) { return !t.completed; }).length;
    statDone.textContent = tasks.filter(function (t) { return t.completed; }).length;
  }

  function buildTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'task-item priority-' + task.priority + (task.completed ? ' completed' : '');
    li.dataset.id = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', 'Mark "' + task.title + '" as completed');
    checkbox.addEventListener('change', function () { toggleComplete(task.id); });

    const title = document.createElement('span');
    title.className = 'task-title';
    title.textContent = task.title;

    const due = document.createElement('span');
    due.className = 'task-due';
    due.textContent = formatDue(task.due) + ' · ' + task.priority + ' priority';

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'icon-btn';
    deleteBtn.setAttribute('aria-label', 'Delete "' + task.title + '"');
    deleteBtn.textContent = '🗑️';
    deleteBtn.addEventListener('click', function () {
      if (confirm('Delete "' + task.title + '"?')) {
        deleteTask(task.id);
      }
    });

    li.appendChild(checkbox);
    li.appendChild(title);
    li.appendChild(due);
    li.appendChild(deleteBtn);
    return li;
  }

  // ---------- Event handling ----------

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const title = titleInput.value.trim();

    if (!title) {
      taskError.style.display = 'block';
      titleInput.focus();
      return;
    }
    taskError.style.display = 'none';

    addTask(title, dueInput.value, priorityInput.value);
    form.reset();
    priorityInput.value = 'medium';
    titleInput.focus();
  });

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      render();
    });
  });

  // ---------- Init ----------

  loadTasks();
  render();
})();
