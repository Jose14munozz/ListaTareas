document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const allTasksButton = document.getElementById('allTasks');
    const activeTasksButton = document.getElementById('activeTasks');
    const completedTasksButton = document.getElementById('completedTasks');
    const clearCompletedButton = document.getElementById('clearCompleted');

    // Cargar tareas almacenadas localmente al cargar la página
    loadTasks();

    taskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && taskInput.value.trim() !== '') {
            addTask(taskInput.value.trim());
            saveTasks(); // Guardar tareas en el almacenamiento local
            taskInput.value = '';
        }
    });

    function addTask(taskText) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${taskText}</span>
            <button class="complete-btn">Completar</button>
            <button class="delete-btn">Borrar</button>
        `;
        taskList.appendChild(li);
        li.querySelector('.complete-btn').addEventListener('click', function() {
            li.classList.toggle('completed');
            const completeButton = li.querySelector('.complete-btn');
            completeButton.disabled = true;
            completeButton.textContent = 'Completada';
            saveTasks();
        });
        li.querySelector('.delete-btn').addEventListener('click', function() {
            li.remove();
            saveTasks();
        });
        // Escuchar cambios en el texto de la tarea y guardarlos
        li.querySelector('span').addEventListener('input', function() {
            saveTasks(); // Guardar tareas en el almacenamiento local
        });
        // Permitir la edición de la tarea al hacer doble clic en el elemento li
        li.addEventListener('dblclick', function() {
            const span = li.querySelector('span');
            const newText = prompt('Edit task:', span.textContent);
            if (newText !== null) {
                span.textContent = newText;
                saveTasks(); // Guardar tareas en el almacenamiento local
            }
        });
    }

    // Función para guardar las tareas en el almacenamiento local
    function saveTasks() {
        const tasks = [];
        Array.from(taskList.children).forEach(function(task) {
            const taskText = task.querySelector('span').textContent.trim();
            const isCompleted = task.classList.contains('completed');
            tasks.push({ text: taskText, completed: isCompleted });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Función para cargar las tareas desde el almacenamiento local
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(function(task) {
            addTask(task.text);
            if (task.completed) {
                const li = taskList.lastElementChild;
                li.classList.add('completed');
                const completeButton = li.querySelector('.complete-btn');
                completeButton.disabled = true;
                completeButton.textContent = 'Completed';
            }
        });
    }

    allTasksButton.addEventListener('click', function() {
        showAllTasks();
    });

    activeTasksButton.addEventListener('click', function() {
        showActiveTasks();
    });

    completedTasksButton.addEventListener('click', function() {
        showCompletedTasks();
    });

    clearCompletedButton.addEventListener('click', function() {
        clearCompletedTasks();
    });

    function showAllTasks() {
        Array.from(taskList.children).forEach(function(task) {
            task.style.display = 'block';
        });
    }

    function showActiveTasks() {
        Array.from(taskList.children).forEach(function(task) {
            if (!task.classList.contains('completed')) {
                task.style.display = 'block';
            } else {
                task.style.display = 'none';
            }
        });
    }

    function showCompletedTasks() {
        Array.from(taskList.children).forEach(function(task) {
            if (task.classList.contains('completed')) {
                task.style.display = 'block';
            } else {
                task.style.display = 'none';
            }
        });
    }

    function clearCompletedTasks() {
        Array.from(taskList.children).forEach(function(task) {
            if (task.classList.contains('completed')) {
                task.remove();
            }
        });
    }
});
