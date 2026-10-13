# Kanban Task Board

A responsive Kanban task board built with HTML, CSS, and JavaScript. The app helps users organize tasks by moving them through three stages: To Do, In Progress, and Done.

## Features

- Add new tasks
- Edit task titles
- Delete tasks
- Move tasks between columns
- Drag and drop task cards
- Set task priority
- Add due dates
- View task counts for each column
- Save tasks in the browser with localStorage
- Responsive layout for desktop and mobile screens

## Technologies Used

- HTML
- CSS
- JavaScript

## How It Works

The app stores each task as a JavaScript object with an ID, title, priority, due date, and status. When a task is added, edited, moved, or deleted, the page updates and saves the latest task list to localStorage.

The three board columns represent the progress of each task:

- To Do: tasks that have not started yet
- In Progress: tasks currently being worked on
- Done: completed tasks

## How to Run

1. Download or clone the project.
2. Open the project folder.
3. Open `index.html` in your browser.

No installation or extra setup is required.

## Project Purpose

This project was created to practice core frontend development skills, including DOM manipulation, event handling, drag and drop, responsive layout, and browser storage.

## Folder Structure

```text
kanban-task-board/
  index.html
  style.css
  script.js
  README.md
```
