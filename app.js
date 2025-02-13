document.addEventListener('DOMContentLoaded', () => {
  const ejercicios = [];
  let currentIndex = 0;
  let isFullscreen = false;
  let series = 4; // Número total de series
  let serieActual = 1; // Serie actual
  let intervalo; // Variable para almacenar el intervalo del cronómetro
  let isPreparacionActive = false; // Bandera para indicar que se muestra la preparación

  // Definir cuántos ejercicios hay por serie (en orden) según el nuevo JSON
  const ejerciciosPorSerie = {
    1: 40, // Serie 1: Calentamiento, Pecho, Pierna, Antebrazo, Espalda, Hombro
    2: 32, // Serie 2: Pecho, Pierna, Antebrazo, Espalda, Hombro
    3: 32, // Serie 3: Pecho, Pierna, Antebrazo, Espalda, Hombro
    4: 1   // Serie 4: Mewing
  };

  // Función para actualizar la serie actual basado en currentIndex
  function updateSerieFromIndex() {
    let acumulado = 0;
    for (let i = 1; i <= series; i++) {
      acumulado += ejerciciosPorSerie[i];
      if (currentIndex < acumulado) {
        serieActual = i;
        break;
      }
    }
  }

  // Cargar ejercicios desde el archivo JSON y organizarlos según las series
  fetch('ejercicios.json')
    .then(response => response.json())
    .then(data => {
      // Serie 1: Calentamiento, Pecho, Pierna, Antebrazo, Espalda, Hombro
      ejercicios.push(...data.filter(ej => ej.categoria === "Calentamiento"));
      ejercicios.push(...data.filter(ej => ej.categoria === "Pecho"));
      ejercicios.push(...data.filter(ej => ej.categoria === "Pierna"));
      ejercicios.push(...data.filter(ej => ej.categoria === "Antebrazo"));
      ejercicios.push(...data.filter(ej => ej.categoria === "Espalda"));
      ejercicios.push(...data.filter(ej => ej.categoria === "Hombro"));

      // Serie 2: Pecho, Pierna, Antebrazo, Espalda, Hombro
      ejercicios.push(...data.filter(ej => ej.categoria === "Pecho"));
      ejercicios.push(...data.filter(ej => ej.categoria === "Pierna"));
      ejercicios.push(...data.filter(ej => ej.categoria === "Antebrazo"));
      ejercicios.push(...data.filter(ej => ej.categoria === "Espalda"));
      ejercicios.push(...data.filter(ej => ej.categoria === "Hombro"));

      // Serie 3: Pecho, Pierna, Antebrazo, Espalda, Hombro
      ejercicios.push(...data.filter(ej => ej.categoria === "Pecho"));
      ejercicios.push(...data.filter(ej => ej.categoria === "Pierna"));
      ejercicios.push(...data.filter(ej => ej.categoria === "Antebrazo"));
      ejercicios.push(...data.filter(ej => ej.categoria === "Espalda"));
      ejercicios.push(...data.filter(ej => ej.categoria === "Hombro"));

      // Serie 4: Mewing
      ejercicios.push(...data.filter(ej => ej.categoria === "Mewing"));

      // Iniciar el primer ejercicio al cargar la página
      cargarEjercicio(currentIndex);
      actualizarContadores(); // Actualizar contadores al inicio
    });

  const ejercicioContainer = document.getElementById('ejercicio-container');
  const timeline = document.getElementById('timeline');
  const contadorEjercicio = document.getElementById('contador-ejercicio');
  const contadorSerie = document.getElementById('contador-serie');
  const categoriaActual = document.getElementById('categoria-actual');
  const sonidoListo = new Audio('multimedia/listo.mp3'); // Sonido para finalizar ejercicio
  const sonidoFinal = new Audio('multimedia/final.mp3'); // Sonido al terminar todos los ejercicios

  // Función para actualizar los contadores de ejercicio y serie
  function actualizarContadores() {
    contadorEjercicio.textContent = `${currentIndex + 1}/${ejercicios.length}`;
    contadorSerie.textContent = `Serie ${serieActual}/${series}`;
  }

  // Función para cargar un ejercicio (agregamos el parámetro opcional skipPreparacion)
  function cargarEjercicio(index, skipPreparacion = false) {
    if (index >= ejercicios.length) {
      ejercicioContainer.innerHTML = 
        `<div class="text-center">
          <h2 class="text-3xl font-bold mt-4">¡Felicidades!</h2>
          <p class="text-xl text-gray-400 mt-2 font-bold">Has completado todas las series.</p>
        </div>`;
      timeline.style.width = '100%'; // Barra de progreso completa
      sonidoFinal.play(); // Reproducir sonido final
      return;
    }

    const ejercicio = ejercicios[index];
    const repeticiones = ejercicio.repeticiones || 12; // Valor por defecto
    const imagenSrc = ejercicio.imagen ? `multimedia/${ejercicio.imagen}.png` : '';

    let contenido =  
      `<div class="text-center">
        ${imagenSrc ? `<img src="${imagenSrc}" alt="${ejercicio.nombre}" class="w-full h-64 object-cover rounded-lg">` : ''}
        <h2 class="text-2xl font-bold mt-4">${ejercicio.nombre}</h2>
        <p class="text-gray-400 mt-2 font-bold ${ejercicio.tipo === 'repeticiones' ? 'text-3xl font-bold text-green-500' : ''}">
          ${ejercicio.tipo === 'repeticiones' ? `x${repeticiones}` : '30 segundos'}
        </p>`;

    if (ejercicio.tipo === 'repeticiones') {
      contenido += `<button id="listo-btn" class="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg font-bold">Listo</button>`;
    } else if (ejercicio.tipo === 'tiempo') {
      contenido += `<div id="cronometro" class="mt-4 text-4xl font-bold">30</div>`;
    }

    contenido += `</div>`;
    ejercicioContainer.innerHTML = contenido;

    // Actualizar la barra de progreso y la categoría
    timeline.style.width = `${((index + 1) / ejercicios.length) * 100}%`;
    categoriaActual.textContent = ejercicio.categoria;

    // Actualizar la serie según el índice actual
    updateSerieFromIndex();
    actualizarContadores();

    // Mostrar el cronómetro de preparación solo si no se ha indicado saltarlo
    if (!skipPreparacion) {
      mostrarPreparacion(index);
    }
  }

  // Función para mostrar el banner de preparación
  function mostrarPreparacion(index) {
    isPreparacionActive = true;
    const bannerPreparacion = document.createElement('div');
    bannerPreparacion.id = 'banner-preparacion'; // Asignar un ID para poder cancelarlo
    bannerPreparacion.className = 'fixed top-0 left-0 w-full bg-green-500 text-center py-4 z-50';
    bannerPreparacion.innerHTML = 
      `<h2 class="text-3xl font-bold text-purple-900">Preparación</h2>
      <div id="cronometro-preparacion" class="text-4xl font-bold text-purple-900">5</div>`;
    document.body.appendChild(bannerPreparacion);

    let segundos = 5;
    intervalo = setInterval(() => {
      segundos--;
      document.getElementById('cronometro-preparacion').textContent = segundos;
      if (segundos <= 0) {
        clearInterval(intervalo);
        bannerPreparacion.remove();
        isPreparacionActive = false;

        // Iniciar el cronómetro del ejercicio si es de tipo "tiempo"
        const ejercicio = ejercicios[index];
        if (ejercicio.tipo === 'tiempo') {
          iniciarCronometro(30, ejercicio.descanso, index + 1);
        }

        // Manejar el botón "Listo" si es de tipo "repeticiones"
        if (ejercicio.tipo === 'repeticiones') {
          const listoBtn = document.getElementById('listo-btn');
          listoBtn.addEventListener('click', () => {
            iniciarDescanso(ejercicio.descanso, index + 1);
          });
        }
      }
    }, 1000);
  }

  // Función para iniciar el cronómetro (cuenta regresiva) en ejercicios de tiempo
  function iniciarCronometro(tiempo, tiempoDescanso, siguienteIndex) {
    let segundos = tiempo;
    const cronometro = document.getElementById('cronometro');
    intervalo = setInterval(() => {
      segundos--;
      cronometro.textContent = segundos;
      if (segundos <= 0) {
        clearInterval(intervalo);
        currentIndex = siguienteIndex;
        updateSerieFromIndex();
        iniciarDescanso(tiempoDescanso, siguienteIndex);
        sonidoListo.play(); // Reproducir sonido al finalizar el ejercicio
      }
    }, 1000);
  }

  // Función para iniciar el descanso entre ejercicios
  function iniciarDescanso(tiempoDescanso, siguienteIndex) {
    if (siguienteIndex >= ejercicios.length) {
      ejercicioContainer.innerHTML = 
        `<div class="text-center">
          <h2 class="text-3xl font-bold mt-4">¡Felicidades!</h2>
          <p class="text-xl text-gray-400 mt-2 font-bold">Has completado todas las series.</p>
        </div>`;
      timeline.style.width = '100%';
      sonidoFinal.play(); // Reproducir sonido final
      return;
    }

    const siguienteEjercicio = ejercicios[siguienteIndex];

    ejercicioContainer.innerHTML = 
      `<div class="text-center">
        <h2 class="text-3xl font-bold mt-4">Descanso</h2>
        <p class="text-xl font-bold text-gray-400 mt-2">Próximo ejercicio: ${siguienteEjercicio.nombre}</p>
        <div id="cronometro-descanso" class="mt-4 text-4xl font-bold">${tiempoDescanso}</div>
      </div>`;

    // Cambiar la categoría a "Descanso"
    categoriaActual.textContent = "Descanso";

    let segundos = tiempoDescanso;
    intervalo = setInterval(() => {
      segundos--;
      document.getElementById('cronometro-descanso').textContent = segundos;
      if (segundos <= 0) {
        clearInterval(intervalo);
        currentIndex = siguienteIndex;
        updateSerieFromIndex();
        cargarEjercicio(siguienteIndex);
      }
    }, 1000);
  }

  // Manejar teclas de dirección y Enter
  document.addEventListener('keydown', (e) => {
    // Para navegación manual con flechas, si hay preparación en curso se cancela
    if (e.key === 'ArrowRight') {
      if (isPreparacionActive) {
        clearInterval(intervalo);
        const banner = document.getElementById('banner-preparacion');
        if (banner) banner.remove();
        isPreparacionActive = false;
      }
      siguienteEjercicio(currentIndex + 1, true); // Se salta la preparación
    } else if (e.key === 'ArrowLeft') {
      if (isPreparacionActive) {
        clearInterval(intervalo);
        const banner = document.getElementById('banner-preparacion');
        if (banner) banner.remove();
        isPreparacionActive = false;
      }
      if (currentIndex > 0) {
        siguienteEjercicio(currentIndex - 1, true);
      }
    } else if (e.key === 'ArrowUp') {
      document.documentElement.requestFullscreen();
    } else if (e.key === 'ArrowDown') {
      document.exitFullscreen();
    }
  });

  // Manejar tecla Enter para avanzar en el ejercicio actual
  document.addEventListener('keydown', (e) => {
    // Se ignora Enter si está en preparación
    if (isPreparacionActive) return;

    if (e.key === 'Enter') {
      const ejercicioActual = ejercicios[currentIndex];
      clearInterval(intervalo); // Limpiar cualquier intervalo en curso
      iniciarDescanso(ejercicioActual.descanso, currentIndex + 1);
    }
  });

  // Función para avanzar o retroceder entre ejercicios  
  // Se agrega el parámetro skipPreparacion para indicar si se debe saltar la cuenta de preparación
  function siguienteEjercicio(index, skipPreparacion = false) {
    if (index < 0 || index >= ejercicios.length) return; // Evitar índices inválidos
    currentIndex = index;
    cargarEjercicio(currentIndex, skipPreparacion);
  }
});
