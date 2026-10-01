const form = document.querySelector('#task-form');
const tituloInput = document.querySelector('#titulo');
const cursoInput = document.querySelector('#curso');
const fechaInput = document.querySelector('#fechaEntrega');
const taskList = document.querySelector('#task-list');
const alertContainer = document.querySelector('#alert-container');
const filterButtons = document.querySelectorAll('.filter-btn');

let tareas = JSON.parse(localStorage.getItem('tareas')) || [];

const guardarTareas = () => {
    
    localStorage.setItem('tareas', JSON.stringify(tareas));
};

const mostrarAlerta = (mensaje, tipo = 'danger') => {
    alertContainer.innerHTML = `
        <div class="alert alert-${tipo}">
            ${mensaje}
        </div>
    `;

    setTimeout(() => {
        alertContainer.innerHTML = '';
    }, 3000);
};

const renderizarTareas = (filtro = 'todas') => {

    taskList.innerHTML = '';

    let tareasMostrar = [...tareas];

    if (filtro === 'pendientes') {
        tareasMostrar = tareas.filter(tarea => !tarea.completada);
    }

    if (filtro === 'completadas') {
        tareasMostrar = tareas.filter(tarea => tarea.completada);
    }

    if (tareasMostrar.length === 0) {
        taskList.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info empty-message">
                    No hay tareas para mostrar.
                </div>
            </div>
        `;

        return;
    }

    tareasMostrar.forEach(tarea => {

        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';

        const card = document.createElement('div');
        card.className = 'card shadow-sm task-card';

        const contenido = document.createElement('div');
        contenido.className = 'card-body';

        const titulo = document.createElement('h3');
        titulo.className = 'h5';

        if (tarea.completada) {
            titulo.classList.add('task-completed');
        }

        titulo.textContent = tarea.titulo;

        const curso = document.createElement('p');
        curso.className = 'mb-2';
        curso.textContent = `Curso: ${tarea.curso}`;

        const fecha = document.createElement('p');
        fecha.className = 'task-date';
        fecha.textContent = `Entrega: ${tarea.fechaEntrega}`;

        const botones = document.createElement('div');
        botones.className = 'd-flex gap-2 flex-wrap';

        const completarBtn = document.createElement('button');
        completarBtn.className = tarea.completada
            ? 'btn btn-warning btn-sm'
            : 'btn btn-success btn-sm';

        completarBtn.textContent = tarea.completada
            ? 'Marcar pendiente'
            : 'Completar';

        completarBtn.dataset.id = tarea.id;
        completarBtn.dataset.action = 'toggle';

        const eliminarBtn = document.createElement('button');
        eliminarBtn.className = 'btn btn-danger btn-sm';
        eliminarBtn.textContent = 'Eliminar';

        eliminarBtn.dataset.id = tarea.id;
        eliminarBtn.dataset.action = 'delete';

        botones.appendChild(completarBtn);
        botones.appendChild(eliminarBtn);

        contenido.appendChild(titulo);
        contenido.appendChild(curso);
        contenido.appendChild(fecha);
        contenido.appendChild(botones);

        card.appendChild(contenido);
        col.appendChild(card);

        taskList.appendChild(col);
    });
};

form.addEventListener('submit', (event) => {

    event.preventDefault();

    const titulo = tituloInput.value.trim();
    const curso = cursoInput.value.trim();
    const fechaEntrega = fechaInput.value;

    if (!titulo || !curso || !fechaEntrega) {
        mostrarAlerta('Todos los campos son obligatorios.');
        return;
    }

    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

    const fechaSeleccionada = new Date(fechaEntrega + 'T00:00:00');

    if (fechaSeleccionada <= fechaActual) {
        mostrarAlerta('La fecha de entrega debe ser posterior a la fecha actual.');
        return;
    }

    const nuevaTarea = {
        id: Date.now(),
        titulo,
        curso,
        fechaEntrega,
        completada: false
    };

    tareas.push(nuevaTarea);

    guardarTareas();

    form.reset();

    mostrarAlerta('Tarea agregada correctamente.', 'success');

    renderizarTareas();
});

taskList.addEventListener('click', (event) => {

    const boton = event.target.closest('button');

    if (!boton) {
        return;
    }

    const id = Number(boton.dataset.id);
    const accion = boton.dataset.action;

    if (accion === 'toggle') {

        const tarea = tareas.find(tarea => tarea.id === id);

        if (tarea) {
            tarea.completada = !tarea.completada;
        }

        guardarTareas();
        renderizarTareas();

    }

    if (accion === 'delete') {

        tareas = tareas.filter(tarea => tarea.id !== id);

        guardarTareas();
        renderizarTareas();
    }
});

filterButtons.forEach(boton => {

    boton.addEventListener('click', () => {

        filterButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        boton.classList.add('active');

        renderizarTareas(boton.dataset.filter);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    renderizarTareas();
});