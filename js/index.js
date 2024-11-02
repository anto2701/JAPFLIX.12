let movies = [];

// Cargar datos desde la API
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('https://japceibal.github.io/japflix_api/movies-data.json');
    movies = await response.json();
  } catch (error) {
    console.error("Error al cargar las películas:", error);
  }
});

// Función de búsqueda
document.getElementById('btnBuscar').addEventListener('click', () => {
  const searchQuery = document.getElementById('inputBuscar').value.toLowerCase();

  if (searchQuery) {
    const filteredMovies = movies.filter(movie =>
      movie.title.toLowerCase().includes(searchQuery) ||
      movie.genres.map(genre => genre.name).join(', ').toLowerCase().includes(searchQuery) ||
      movie.tagline.toLowerCase().includes(searchQuery) ||
      movie.overview.toLowerCase().includes(searchQuery)
    );
    displayMovies(filteredMovies);
  }
});

// Función para mostrar las películas filtradas
function displayMovies(movieList) {
  const lista = document.getElementById('lista');
  lista.innerHTML = ''; // Limpiamos la lista

  movieList.forEach(movie => {
    let stars = generateStars(movie.vote_average);
    let listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'bg-dark', 'text-dark');
    
    // Añadir el evento de clic en todo el rectángulo
    listItem.onclick = () => showMovieDetails(movie.id);
    
    listItem.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <h3 class="mb-0">${movie.title}</h3>
        <span>${stars}</span>
      </div>
      <p>${movie.tagline}</p>
    `;

    lista.appendChild(listItem);
  });
}


// Generar estrellas para el rating
function generateStars(voteAverage) {
  let fullStars = Math.floor(voteAverage / 2); // Convierte el rating de 10 a estrellas sobre 5
  let stars = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
  return stars;
}

// Mostrar detalles de la película en el Offcanvas
function showMovieDetails(movieId) {
  const selectedMovie = movies.find(movie => movie.id === movieId);
  if (!selectedMovie) return;

  // Elimina cualquier Offcanvas anterior para evitar duplicados
  const existingCanvas = document.getElementById('movieDetailsCanvas');
  if (existingCanvas) existingCanvas.remove();

  const movieDetails = `
      <div class="offcanvas offcanvas-top" id="movieDetailsCanvas" tabindex="-1" aria-labelledby="movieDetailsLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="movieDetailsLabel">${selectedMovie.title}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <p>${selectedMovie.overview}</p>
        
        <!-- Contenedor para los géneros y el botón "More" -->
        <div class="d-flex justify-content-between align-items-center">
          <p class="m-0">${selectedMovie.genres.map(genre => genre.name).join(' - ')}</p>
          <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">More</button>
          <ul class="dropdown-menu">
            <li class="dropdown-item">Year: ${new Date(selectedMovie.release_date).getFullYear()}</li>
            <li class="dropdown-item">Runtime: ${selectedMovie.runtime} minutos</li>
            <li class="dropdown-item">Budget: $${selectedMovie.budget}</li>
            <li class="dropdown-item">Revenue: $${selectedMovie.revenue}</li>
          </ul>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', movieDetails);
  let movieDetailsCanvas = new bootstrap.Offcanvas(document.getElementById('movieDetailsCanvas'));
  movieDetailsCanvas.show();
}

