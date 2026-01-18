const API_KEY = 'ea7e1c0b';
const BASE_URL = 'https://www.omdbapi.com/';
function getSecurePoster(url) {
    if (!url || url === "N/A") {
        return "https://via.placeholder.com/300x450?text=No+Poster";
    }
    return url.replace("http://", "https://");
}


const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const movieGrid = document.getElementById('movieGrid');
const loader = document.getElementById('loader');
const loadMoreBtn = document.getElementById('loadMoreBtn');


const modal = document.getElementById('movieModal');
const closeModal = document.getElementById('closeModal');
const modalPoster = document.getElementById('modalPoster');
const modalTitle = document.getElementById('modalTitle');
const modalYear = document.getElementById('modalYear');
const modalGenre = document.getElementById('modalGenre');
const modalRuntime = document.getElementById('modalRuntime');
const modalRating = document.getElementById('modalRating');
const modalPlot = document.getElementById('modalPlot');
const modalActors = document.querySelector('#modalActors span');


let currentPage = 1;
let currentQuery = '';
let totalResults = 0;


searchBtn.addEventListener('click', handleSearch);

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    fetchMovies(currentQuery, currentPage);
});

closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

function handleSearch() {
    const query = searchInput.value.trim();
    if (query) {
        currentQuery = query;
        currentPage = 1;
        fetchMovies(query, 1);
    }
}


async function fetchMovies(query, page = 1) {
    showLoader(true);


    if (page === 1) {
        movieGrid.innerHTML = '';
        loadMoreBtn.style.display = 'none';
        totalResults = 0;
    }

    try {
        const response = await fetch(`${BASE_URL}?s=${query}&page=${page}&apikey=${API_KEY}`);
        const data = await response.json();

        if (data.Response === "True") {
            if (page === 1) {
                totalResults = parseInt(data.totalResults);
            }
            displayMovies(data.Search);

            const displayedResults = page * 10;
            if (displayedResults < totalResults) {
                loadMoreBtn.style.display = 'block';
            } else {
                loadMoreBtn.style.display = 'none';
            }

        } else {
            if (page === 1) {
                movieGrid.innerHTML = `<p style="color: white; text-align: center; width: 100%;">No results found for "${query}"</p>`;
            }
            loadMoreBtn.style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        if (page === 1) {
            movieGrid.innerHTML = `<p style="color: red; text-align: center; width: 100%;">Something went wrong. Please try again later.</p>`;
        }
    } finally {
        showLoader(false);
    }
}

function displayMovies(movies) {
    movies.forEach(movie => {

        const card = document.createElement('div');
        card.className = 'movie-card';
        card.addEventListener('click', () => fetchMovieDetails(movie.imdbID));


        const posterSrc = getSecurePoster(movie.Poster);

        card.innerHTML = `
            <img src="${posterSrc}" alt="${movie.Title}" class="movie-poster">
            <div class="movie-info">
                <h3 class="movie-title">${movie.Title}</h3>
                <p class="movie-year">${movie.Year}</p>
            </div>
        `;
        movieGrid.appendChild(card);
    });
}


async function fetchMovieDetails(id) {
    try {
        const response = await fetch(`${BASE_URL}?i=${id}&apikey=${API_KEY}`);
        const data = await response.json();

        if (data.Response === "True") {
            openModal(data);
        }
    } catch (error) {
        console.error('Error fetching details:', error);
    }
}

function openModal(movie) {
   
   modalPoster.src = getSecurePoster(movie.Poster);
    modalTitle.textContent = movie.Title;
    modalYear.textContent = movie.Year;
    modalGenre.textContent = movie.Genre;
    modalRuntime.textContent = movie.Runtime;
    modalRating.textContent = `IMDb: ${movie.imdbRating}`;
    modalPlot.textContent = movie.Plot;
    modalActors.textContent = movie.Actors;

    modal.classList.add('active');
}

function showLoader(show) {
    loader.style.display = show ? 'block' : 'none';
}

currentQuery = 'Marvel';
fetchMovies('Marvel', 1);
