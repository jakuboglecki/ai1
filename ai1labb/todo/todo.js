document.addEventListener('DOMContentLoaded', function () {
    const taskList = document.getElementById('taskList');
    const taskForm = document.getElementById('taskForm');
    const newTaskInput = document.getElementById('newTask');
    const taskDateInput = document.getElementById('taskDate');
    const searchInput = document.getElementById('search');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Funkcja do zapisu zadań w Local Storage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Funkcja renderująca listę zadań
    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.dataset.index = index;

            // Checkbox do oznaczania ukończonego zadania
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', function () {
                task.completed = checkbox.checked;
                saveTasks();
                renderTasks();
            });
            li.appendChild(checkbox);

            // Zawartość zadania
            const span = document.createElement('span');
            span.innerHTML = task.content;
            if (task.completed) {
                span.style.textDecoration = 'line-through';
            }
            li.appendChild(span);

            // Termin zadania
            if (task.date) {
                const taskDate = document.createElement('span');
                taskDate.textContent = ` (${task.date})`;
                li.appendChild(taskDate);
            }

            // Przycisk Usuń
            const deleteButton = document.createElement('button');
            const deleteImg = document.createElement('img');
            deleteImg.src = 'x.png';
            deleteImg.alt = 'Usuń';
            deleteImg.style.width = '20px';
            deleteImg.style.height = '20px';
            deleteButton.appendChild(deleteImg);

            deleteButton.addEventListener('click', function (e) {
                e.stopPropagation();
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });
            li.appendChild(deleteButton);

            // Edycja zadania po kliknięciu
            li.addEventListener('click', function (e) {
                if (e.target !== deleteButton && e.target !== checkbox) {
                    editTask(li, index);
                }
            });

            taskList.appendChild(li);
        });
    }

    // Funkcja edytowania zadania
    function editTask(li, index) {
        li.innerHTML = '';

        // Pole do edycji treści zadania
        const contentInput = document.createElement('input');
        contentInput.type = 'text';
        contentInput.value = tasks[index].content;
        li.appendChild(contentInput);

        // Pole do edycji daty zadania
        const dateInput = document.createElement('input');
        dateInput.type = 'datetime-local';
        if (tasks[index].date) {
            const [date, time] = tasks[index].date.split(' ');
            const [day, month, year] = date.split('/');
            dateInput.value = `${year}-${month}-${day}T${time}`;
        }
        li.appendChild(dateInput);

        contentInput.focus();

        // Funkcja zapisu zmian
        function saveEdits() {
            tasks[index].content = contentInput.value;

            if (dateInput.value) {
                const [date, time] = dateInput.value.split('T');
                const [year, month, day] = date.split('-');
                tasks[index].date = `${day}/${month}/${year} ${time}`; // dd/mm/yyyy HH:MM
            } else {
                tasks[index].date = null;
            }

            saveTasks();
            renderTasks();
        }

        // Zatwierdzanie edycji tylko Enterem dla każdego pola
        contentInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.stopPropagation();
                saveEdits();
            }
        });

        dateInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.stopPropagation();
                saveEdits();
            }
        });
    }

    // Dodawanie nowego zadania
    taskForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const newTask = newTaskInput.value.trim();
        const taskDate = taskDateInput.value;

        // Walidacja zadania
        if (newTask.length < 3 || newTask.length > 255) {
            alert('Zadanie musi zawierać co najmniej 3 znaki i nie więcej niż 255.');
            return;
        }
        if (taskDate && new Date(taskDate) <= new Date()) {
            alert('Data musi być w przyszłości.');
            return;
        }

        tasks.push({
            content: newTask,
            date: taskDate ? taskDate.replace('T', ' ') : null,
            completed: false
        });

        saveTasks();
        renderTasks();
        taskForm.reset();
    });

    // Wyszukiwanie zadań
    searchInput.addEventListener('input', function () {
        const query = searchInput.value.trim().toLowerCase();

        if (query.length >= 2) {
            taskList.innerHTML = '';
            tasks.forEach((task, index) => {
                if (task.content.toLowerCase().includes(query)) {
                    const li = document.createElement('li');
                    li.dataset.index = index;

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.checked = task.completed;
                    checkbox.addEventListener('change', function () {
                        task.completed = checkbox.checked;
                        saveTasks();
                        renderTasks();
                    });
                    li.appendChild(checkbox);

                    const highlightedContent = task.content.replace(new RegExp(query, 'gi'), match => `<span class="highlight">${match}</span>`);
                    const span = document.createElement('span');
                    span.innerHTML = highlightedContent;
                    if (task.completed) {
                        span.style.textDecoration = 'line-through';
                    }
                    li.appendChild(span);

                    if (task.date) {
                        const taskDate = document.createElement('span');
                        taskDate.textContent = ` (${task.date})`;
                        li.appendChild(taskDate);
                    }

                    const deleteButton = document.createElement('button');
                    const deleteImg = document.createElement('img');
                    deleteImg.src = 'x.png';
                    deleteImg.alt = 'Usuń';
                    deleteImg.style.width = '20px';
                    deleteImg.style.height = '20px';
                    deleteButton.appendChild(deleteImg);
                    deleteButton.addEventListener('click', function (e) {
                        e.stopPropagation();
                        tasks.splice(index, 1);
                        saveTasks();
                        renderTasks();
                    });
                    li.appendChild(deleteButton);

                    li.addEventListener('click', function (e) {
                        if (e.target !== deleteButton && e.target !== checkbox) {
                            editTask(li, index);
                        }
                    });

                    taskList.appendChild(li);
                }
            });
        } else {
            renderTasks();
        }
    });

    renderTasks();
});
