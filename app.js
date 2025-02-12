document.addEventListener('DOMContentLoaded', () => {
  const ejercicios = [];
  let currentIndex = 0;
  let isFullscreen = false;
  let series = 4; // Número de series
  let serieActual = 1; // Serie actual
  let intervalo; // Variable para almacenar el intervalo del cronómetro

  // Cargar ejercicios desde el archivo JSON y organizarlos según las series
  fetch('ejercicios.json')
    .then(response => response.json())
    .then(data => {
      // Serie 1: Categoría 1, Categoría 2, Categoría 3, Categoría 4, Categoría 5, Categoría 6
      ejercicios.push(...data.filter(ej => ej.categoria === "Calentamiento"));
      ejercicios.push(...data.filter(ej => ej.categoria === "Pecho"));
      ejercicios.push(...data.filter(ej => ej.categoria === "Pierna"));
      ejercicios.push(...data.filter(ej => ej.categoria === "Antebrazo"));
      ejercicios.push(...data.filter(ej => ej.categoria === "Espalda"));
      ejercicios.push(...data.filter(ej => ej.categoria === "Hombro"));

      // Serie 2: Categoría 2, Categoría 3, Categoría 4, Categoría 5, Categoría 6
      ejercicios.push(...data.filter(ej => ej.categoria === "Pecho"));
      ejercicios.push(...data.filter(ej => ej.categoria === "Pierna"));
      ejercicios.push(...data.filter(ej => ej.categoria === "Antebrazo"));
      ejercicios.push(...data.filter(ej => ej.categoria === "Espalda"));
      ejercicios.push(...data.filter(ej => ej.categoria === "Hombro"));

      // Serie 3: Categoría 2, Categoría 3, Categoría 4, Categoría 5, Categoría 6
      ejercicios.push(...data.filter(ej => ej.categoria === "Pecho"));
      ejercicios.push(...data.filter(ej => ej.categoria === "Pierna"));
      ejercicios.push(...data.filter(ej => ej.categoria === "Antebrazo"));
      ejercicios.push(...data.filter(ej => ej.categoria === "Espalda"));
      ejercicios.push(...data.filter(ej => ej.categoria === "Hombro"));

      // Serie 4: Categoría 7
      ejercicios.push(...data.filter(ej => ej.categoria === "Mewing"));

      // Mostrar aviso de inicio
      mostrarAvisoInicio();
    });

  const ejercicioContainer = document.getElementById('ejercicio-container');
  const timeline = document.getElementById('timeline');
  const contadorEjercicio = document.getElementById('contador-ejercicio');
  const contadorSerie = document.getElementById('contador-serie');
  const categoriaActual = document.getElementById('categoria-actual');

  // Función para mostrar el aviso de inicio
  function mostrarAvisoInicio() {
    ejercicioContainer.innerHTML = `
      <div class="text-center">
        <h2 class="text-3xl font-bold mt-4">¡Comencemos!</h2>
        <p class="text-xl text-gray-400 mt-2 font-bold">Preparados para la primera serie.</p>
        <button id="iniciar-btn" class="mt-4 px-6 py-2 bg-green-500 text-white font-bold rounded-lg">Iniciar</button>
      </div>
    `;

    const iniciarBtn = document.getElementById('iniciar-btn');
    iniciarBtn.addEventListener('click', () => {
      cargarEjercicio(currentIndex);
    });

    // Manejar la tecla "Enter" para el botón de inicio
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && ejercicioContainer.innerHTML.includes('¡Comencemos!')) {
        cargarEjercicio(currentIndex);
      } else if (e.key === 'Enter' && ejercicioContainer.innerHTML.includes('Listo')) {
        clearInterval(intervalo); // Limpiar el intervalo si existe
        iniciarDescanso(ejercicios[currentIndex].descanso, currentIndex + 1);
      }
    });
  }

  // Función para actualizar los contadores de ejercicio y serie
  function actualizarContadores() {
    contadorEjercicio.textContent = `${currentIndex + 1}/${ejercicios.length}`;
    contadorSerie.textContent = `Serie ${serieActual}/${series}`;
  }

  // Función para cargar un ejercicio
  function cargarEjercicio(index) {
    if (index >= ejercicios.length) {
      ejercicioContainer.innerHTML = `
        <div class="text-center">
          <h2 class="text-3xl font-bold mt-4">¡Felicidades!</h2>
          <p class="text-xl text-gray-400 mt-2 font-bold">Has completado todas las series.</p>
        </div>
      `;
      timeline.style.width = `100%`; // Asegurar que la barra de progreso esté llena
      return;
    }

    const ejercicio = ejercicios[index];
    const repeticiones = ejercicio.repeticiones || 12; // Usar 12 como valor predeterminado si no hay repeticiones especificadas
    const imagenSrc = ejercicio.imagen ? `multimedia/${ejercicio.imagen}.png` : ''; // Construir la ruta de la imagen

    let contenido = `
      <div class="text-center">
        ${imagenSrc ? `<img src="${imagenSrc}" alt="${ejercicio.nombre}" class="w-full h-64 object-cover rounded-lg">` : ''}
        <h2 class="text-2xl font-bold mt-4">${ejercicio.nombre}</h2>
        <p class="text-gray-400 mt-2 font-bold ${ejercicio.tipo === 'repeticiones' ? 'text-3xl font-bold text-green-500' : ''}">${ejercicio.tipo === 'repeticiones' ? `x${repeticiones}` : '30 segundos'}</p>
    `;

    if (ejercicio.tipo === 'repeticiones') {
      contenido += `<button id="listo-btn" class="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg font-bold">Listo</button>`;
    } else if (ejercicio.tipo === 'tiempo') {
      contenido += `<div id="cronometro" class="mt-4 text-4xl font-bold">30</div>`;
    }

    contenido += `</div>`;
    ejercicioContainer.innerHTML = contenido;

    // Actualizar timeline
    timeline.style.width = `${((index + 1) / ejercicios.length) * 100}%`;

    // Mostrar la categoría actual en la barra de progreso
    categoriaActual.textContent = ejercicio.categoria;

    // Mostrar el banner de preparación
    mostrarPreparacion(index);
  }

  // Función para mostrar el banner de preparación
  function mostrarPreparacion(index) {
    const bannerPreparacion = document.createElement('div');
    bannerPreparacion.className = 'fixed top-0 left-0 w-full bg-green-500 text-center py-4 z-50';
    bannerPreparacion.innerHTML = `
      <h2 class="text-3xl font-bold text-purple-900">Preparación</h2>
      <div id="cronometro-preparacion" class="text-4xl font-bold text-purple-900">5</div>
    `;
    document.body.appendChild(bannerPreparacion);

    let segundos = 5;
    intervalo = setInterval(() => {
      segundos--;
      document.getElementById('cronometro-preparacion').textContent = segundos;
      if (segundos <= 0) {
        clearInterval(intervalo);
        bannerPreparacion.remove(); // Eliminar el banner de preparación

        // Iniciar el cronómetro del ejercicio si es de tiempo
        const ejercicio = ejercicios[index];
        if (ejercicio.tipo === 'tiempo') {
          iniciarCronometro(30, ejercicio.descanso, index + 1);
        }

        // Manejar el botón "Listo" si es de repeticiones
        if (ejercicio.tipo === 'repeticiones') {
          const listoBtn = document.getElementById('listo-btn');
          listoBtn.addEventListener('click', () => {
            iniciarDescanso(ejercicio.descanso, index + 1);
          });
        }
      }
    }, 1000);
  }

  // Función para iniciar el descanso
  function iniciarDescanso(tiempoDescanso, siguienteIndex) {
    const siguienteEjercicio = ejercicios[siguienteIndex];

    ejercicioContainer.innerHTML = `
      <div class="text-center">
        <h2 class="text-3xl font-bold mt-4">Descanso</h2>
        <p class="text-xl font-bold text-gray-400 mt-2">Próximo ejercicio: ${siguienteEjercicio.nombre}</p>
        <div id="cronometro-descanso" class="mt-4 text-4xl font-bold">${tiempoDescanso}</div>
      </div>
    `;

    // Cambiar la categoría a "Descanso"
    categoriaActual.textContent = "Descanso";

    let segundos = tiempoDescanso;
    intervalo = setInterval(() => {
      segundos--;
      document.getElementById('cronometro-descanso').textContent = segundos;
      if (segundos <= 0) {
        clearInterval(intervalo);
        cargarEjercicio(siguienteIndex); // Cargar el siguiente ejercicio
      }
    }, 1000);
  }

  // Función para iniciar el cronómetro (cuenta regresiva)
  function iniciarCronometro(tiempo, tiempoDescanso, siguienteIndex) {
    let segundos = tiempo;
    const cronometro = document.getElementById('cronometro');
    intervalo = setInterval(() => {
      segundos--;
      cronometro.textContent = segundos;
      if (segundos <= 0) {
        clearInterval(intervalo);
        iniciarDescanso(tiempoDescanso, siguienteIndex);
      }
    }, 1000);
  }

  // Manejar teclas de dirección
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      siguienteEjercicio(currentIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      if (currentIndex > 0) {
        siguienteEjercicio(currentIndex - 1);
      }
    } else if (e.key === 'ArrowUp') {
      document.documentElement.requestFullscreen();
    } else if (e.key === 'ArrowDown') {
      document.exitFullscreen();
    }
  });
});
