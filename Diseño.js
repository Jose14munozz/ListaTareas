document.addEventListener('DOMContentLoaded', function() {
    // Obtener elementos del DOM
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const allTasksButton = document.getElementById('allTasks');
    const activeTasksButton = document.getElementById('activeTasks');
    const completedTasksButton = document.getElementById('completedTasks');
    const clearCompletedButton = document.getElementById('clearCompleted');

    // Cargar tareas almacenadas localmente al cargar la página
    loadTasks();

    // Agregar una nueva tarea cuando se presiona Enter
    taskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && taskInput.value.trim() !== '') {
            addTask(taskInput.value.trim());
            saveTasks(); // Guardar tareas en el almacenamiento local
            taskInput.value = '';
        }
    });

    // Función para agregar una nueva tarea a la lista
    function addTask(taskText) {
        const li = document.createElement('li');
        // Crear la estructura HTML de una tarea
        li.innerHTML = `
            <span>${taskText}</span>
            <button class="complete-btn">Completar</button>
            <button class="delete-btn">Borrar</button>
            <i class="fas fa-trash de"></i>
        `;
        // Agregar la tarea a la lista
        taskList.appendChild(li);

        // Agregar eventos para completar, borrar y editar la tarea
        li.querySelector('.complete-btn').addEventListener('click', function() {
            // Marcar la tarea como completada
            li.classList.toggle('completed');
            // Deshabilitar el botón de completar y cambiar su texto
            const completeButton = li.querySelector('.complete-btn');
            completeButton.disabled = true;
            completeButton.textContent = 'Completada';
            saveTasks(); // Guardar tareas en el almacenamiento local
        });
        li.querySelector('.delete-btn').addEventListener('click', function() {
            // Eliminar la tarea
            li.remove();
            saveTasks(); // Guardar tareas en el almacenamiento local
        });
        // Escuchar cambios en el texto de la tarea y guardarlos
        li.querySelector('span').addEventListener('input', function() {
            saveTasks(); // Guardar tareas en el almacenamiento local
        });
        // Permitir la edición de la tarea al hacer doble clic en el elemento li
        li.addEventListener('dblclick', function() {
            const span = li.querySelector('span');
            const newText = prompt('Editar Tareas:', span.textContent);
            if (newText !== null) {
                span.textContent = newText;
                saveTasks(); // Guardar tareas en el almacenamiento local
            }
        });
    }

    // Función para guardar las tareas en el almacenamiento local
    function saveTasks() {
        const tasks = [];
        // Recorrer cada tarea en la lista y guardar sus detalles
        Array.from(taskList.children).forEach(function(task) {
            const taskText = task.querySelector('span').textContent.trim();
            const isCompleted = task.classList.contains('completed');
            tasks.push({ text: taskText, completed: isCompleted });
        });
        // Guardar las tareas como una cadena JSON en el almacenamiento local
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Función para cargar las tareas desde el almacenamiento local
    function loadTasks() {
        // Obtener las tareas guardadas del almacenamiento local
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        // Iterar sobre las tareas y agregarlas a la lista
        tasks.forEach(function(task) {
            addTask(task.text);
            // Si la tarea está marcada como completada, actualizar su estado visual
            if (task.completed) {
                const li = taskList.lastElementChild;
                li.classList.add('completed');
                const completeButton = li.querySelector('.complete-btn');
                completeButton.disabled = true;
                completeButton.textContent = 'Completed';
            }
        });
    }

    // Eventos para mostrar diferentes categorías de tareas
    allTasksButton.addEventListener('click', function() {
        showAllTasks();
    });

    activeTasksButton.addEventListener('click', function() {
        showActiveTasks();
    });

    completedTasksButton.addEventListener('click', function() {
        showCompletedTasks();
    });

    // Funciones para mostrar tareas según su estado
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

    // Función para limpiar tareas completadas
    function clearCompletedTasks() {
        Array.from(taskList.children).forEach(function(task) {
            if (task.classList.contains('completed')) {
                task.remove();
            }
        });
    }

    // Evento para limpiar tareas completadas
    clearCompletedButton.addEventListener('click', function() {
        clearCompletedTasks();
    });
});
