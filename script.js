const storageKey = "kanban-board-tasks";

const columns = {
  todo: {
    list: document.querySelector("#todoList"),
    count: document.querySelector("#todoCount")
  },
  "in-progress": {
    list: document.querySelector("#inProgressList"),
    count: document.querySelector("#inProgressCount")
  },
  done: {
    list: document.querySelector("#doneList"),
    count: document.querySelector("#doneCount")
  }
};

const statusFlow = ["todo", "in-progress", "done"];
const taskForm = document.querySelector("#taskForm");
const taskTitle = document.querySelector("#taskTitle");
const taskPriority = document.querySelector("#taskPriority");
const taskDueDate = document.querySelector("#taskDueDate");
const boardColumns = document.querySelectorAll(".column");

let tasks = loadTasks();

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = taskTitle.value.trim();

  if (!title) {
    return;
  }

  tasks.push({
    id: createTaskId(),
    title,
    priority: taskPriority.value,
    dueDate: taskDueDate.value,
    status: "todo"
  });

  taskForm.reset();
  taskPriority.value = "medium";
  saveAndRender();
});

boardColumns.forEach((column) => {
  column.addEventListener("dragover", (event) => {
    event.preventDefault();
    column.classList.add("drag-over");
  });

  column.addEventListener("dragleave", () => {
    column.classList.remove("drag-over");
  });

  column.addEventListener("drop", (event) => {
    event.preventDefault();
    column.classList.remove("drag-over");

    const taskId = event.dataTransfer.getData("text/plain");
    updateTaskStatus(taskId, column.dataset.status);
  });
});

renderTasks();

function loadTasks() {
  const savedTasks = localStorage.getItem(storageKey);

  if (savedTasks) {
    return JSON.parse(savedTasks);
  }

  return [
    {
      id: "sample-1",
      title: "Plan the board layout",
      priority: "medium",
      dueDate: "",
      status: "todo"
    },
    {
      id: "sample-2",
      title: "Build drag and drop",
      priority: "high",
      dueDate: "",
      status: "in-progress"
    },
    {
      id: "sample-3",
      title: "Create project files",
      priority: "low",
      dueDate: "",
      status: "done"
    }
  ];
}

function saveAndRender() {
  localStorage.setItem(storageKey, JSON.stringify(tasks));
  renderTasks();
}

function renderTasks() {
  Object.values(columns).forEach(({ list }) => {
    list.innerHTML = "";
  });

  statusFlow.forEach((status) => {
    const matchingTasks = tasks.filter((task) => task.status === status);
    columns[status].count.textContent = matchingTasks.length;

    if (matchingTasks.length === 0) {
      const emptyItem = document.createElement("li");
      emptyItem.className = "empty-state";
      emptyItem.textContent = "No tasks here";
      columns[status].list.appendChild(emptyItem);
      return;
    }

    matchingTasks.forEach((task) => {
      columns[status].list.appendChild(createTaskCard(task));
    });
  });
}

function createTaskCard(task) {
  const card = document.createElement("li");
  card.className = "task-card";
  card.draggable = true;
  card.dataset.id = task.id;

  card.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", task.id);
    card.classList.add("is-dragging");
  });

  card.addEventListener("dragend", () => {
    card.classList.remove("is-dragging");
  });

  const title = document.createElement("h3");
  title.textContent = task.title;

  const meta = document.createElement("div");
  meta.className = "task-meta";

  const priority = document.createElement("span");
  priority.className = `badge priority-${task.priority}`;
  priority.textContent = task.priority;
  meta.appendChild(priority);

  if (task.dueDate) {
    const dueDate = document.createElement("span");
    dueDate.className = "badge due-date";
    dueDate.textContent = formatDate(task.dueDate);
    meta.appendChild(dueDate);
  }

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const editButton = createButton("Edit", () => editTask(task.id));
  const backButton = createButton("Back", () => moveTask(task.id, -1));
  const nextButton = createButton("Next", () => moveTask(task.id, 1));
  const deleteButton = createButton("Delete", () => deleteTask(task.id));
  deleteButton.className = "delete-btn";

  if (task.status !== "todo") {
    actions.appendChild(backButton);
  }

  actions.appendChild(editButton);

  if (task.status !== "done") {
    actions.appendChild(nextButton);
  }

  actions.appendChild(deleteButton);

  card.append(title, meta, actions);
  return card;
}

function createButton(label, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function createTaskId() {
  return `task-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function moveTask(taskId, direction) {
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return;
  }

  const currentIndex = statusFlow.indexOf(task.status);
  const nextIndex = currentIndex + direction;
  const nextStatus = statusFlow[nextIndex];

  if (nextStatus) {
    task.status = nextStatus;
    saveAndRender();
  }
}

function updateTaskStatus(taskId, status) {
  const task = tasks.find((item) => item.id === taskId);

  if (!task || !columns[status]) {
    return;
  }

  task.status = status;
  saveAndRender();
}

function editTask(taskId) {
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return;
  }

  const newTitle = prompt("Edit task title", task.title);

  if (newTitle === null || !newTitle.trim()) {
    return;
  }

  task.title = newTitle.trim();
  saveAndRender();
}

function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  saveAndRender();
}

function formatDate(dateValue) {
  const date = new Date(`${dateValue}T00:00:00`);

  return date.toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
