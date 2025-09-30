let header = document.querySelector('header');

window.addEventListener('scroll', () =>{
  header.classList.toggle('shadow', window.scrollY > 0)
})

  const menuToggle = document.getElementById('menu-icon');
    const navMenu = document.getElementById('nav-menu');
    
    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('bx-x');
        navMenu.classList.toggle('active');
    });

    window.addEventListener('scroll', function() {
        menuToggle.classList.remove('bx-x');
        navMenu.classList.remove('active');
    });

    // Swiper


var swiper = new Swiper(".home", {
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
       
      });

const apiKey = "7b8081a1d5df404f4b4e33b4fa2368ea";
const trendingContainer = document.getElementById("trending-container");

// Fetch Trending Movies
async function fetchTrending() {
  const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`);
  const data = await res.json();
  displayMovies(data.results);
}

// Display Movies (works for trending & search)
function displayMovies(movies) {
  trendingContainer.innerHTML = "";

  movies.forEach(movie => {
    if (!movie.poster_path) return; // skip movies without poster

    const box = document.createElement("div");
    box.classList.add("box");

    // ✅ clickable
    box.addEventListener("click", () => showMovieDetails(movie.id));

    box.innerHTML = `
      <div class="box-img">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
      </div>
      <h3>${movie.title}</h3>
      <span>${movie.release_date ? movie.release_date.split("-")[0] : "N/A"} | ${movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</span>
    `;

    trendingContainer.appendChild(box);
  });

  console.log("Loaded movies:", movies.length);

}


// Search Movies
async function searchMovies() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) return fetchTrending();

  const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
  const data = await res.json();

  // ✅ now uses the same displayMovies()
  displayMovies(data.results);
}



// Show Movie Details (with trailer, cast, and similar)
async function showMovieDetails(movieId) {
  // Fetch movie details
  const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=videos,credits,similar`);
  const movie = await res.json();

  // Pick a trailer if available
  const trailer = movie.videos.results.find(v => v.type === "Trailer" && v.site === "YouTube");

  let castList = movie.credits.cast.slice(0, 5).map(c => c.name).join(", ");
  let similarMovies = movie.similar.results.slice(0, 4).map(m => `
    <div class="box" onclick="showMovieDetails(${m.id})">
      <div class="box-img">
        <img src="https://image.tmdb.org/t/p/w500${m.poster_path}" alt="${m.title}">
      </div>
      <h3>${m.title}</h3>
      <span>${m.release_date ? m.release_date.split("-")[0] : "N/A"}</span>
    </div>
  `).join("");

  // Fill modal
  document.getElementById("trailerModal").style.display = "block";
  document.getElementById("trailerFrame").src = trailer ? `https://www.youtube.com/embed/${trailer.key}` : "";
  document.getElementById("movieDetails").innerHTML = `
    <h2>${movie.title}</h2>
    <p>${movie.overview}</p>
    <p><strong>Release:</strong> ${movie.release_date}</p>
    <p><strong>Rating:</strong> ${movie.vote_average.toFixed(1)}/10</p>
    <p><strong>Cast:</strong> ${castList || "N/A"}</p>
    <h3>Similar Movies</h3>
    <div class="movie-container">${similarMovies}</div>
  `;
}

// Close Trailer Modal
function closeTrailer() {
  document.getElementById("trailerModal").style.display = "none";
  document.getElementById("trailerFrame").src = "";
  document.getElementById("movieDetails").innerHTML = "";
}

// Load trending on page start
fetchTrending();




async function getMovieDetails(movieId) {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=videos`);
  const movie = await res.json();

  const container = document.getElementById("movie-detail-container");
  const trailer = movie.videos.results.find(v => v.type === "Trailer" && v.site === "YouTube");
  
  container.innerHTML = `
    <div class="box">
      <div class="box-img">
        <img src="${imgBase + movie.poster_path}" alt="${movie.title}">
      </div>
      <h3>${movie.title}</h3>
      <span>${movie.release_date} | Rating: ${movie.vote_average}</span>
      <p>${movie.overview}</p>
      ${trailer ? `<div class="trailer"><a href="https://www.youtube.com/watch?v=${trailer.key}" target="_blank">▶ Watch Trailer</a></div>` : ""}
    </div>
  `;
}


/* ---------- TMDB: Trending + Search (append this to the end of script.js) ---------- */
(function(){
  const API_KEY = "7b8081a1d5df404f4b4e33b4fa2368ea";
  const BASE = "https://api.themoviedb.org/3";
  const IMG = "https://image.tmdb.org/t/p/w500";
  const NO_POSTER = "img/no-poster.png";

  let currentPage = 1;
  let currentMode = "trending"; // "trending" or "search"
  let currentQuery = "";

  // tolerant element lookup (some pages might use different IDs)
  const trendingContainer = document.getElementById('trending-container');
  const loadMoreBtn = document.getElementById('load-more');
  const searchForm = document.getElementById('search-form') || document.querySelector('.search-bar') || null;
  const searchInput = document.getElementById('search-input') || document.getElementById('searchInput') || null;

  if(!trendingContainer) {
    // no trending area on this page — nothing to do
    return;
  }

  async function fetchJSON(url){
    try {
      const res = await fetch(url);
      if(!res.ok) throw new Error('Network error');
      return await res.json();
    } catch(err){
      console.error('fetchJSON', err, url);
      return null;
    }
  }

  function makeBoxElement(movie){
    const poster = movie.poster_path ? (IMG + movie.poster_path) : NO_POSTER;
    const div = document.createElement('div');
    div.className = 'box';
    div.innerHTML = `
      <div class="box-img">
        <a href="movie.html?id=${movie.id}">
          <img src="${poster}" alt="${escapeHtml(movie.title)}">
        </a>
      </div>
      <h3>${escapeHtml(movie.title)}</h3>
      <span>${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'} | ⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
    `;
    return div;
  }

  function escapeHtml(t){ if(!t) return ''; return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function renderMovies(list, append=false){
    if(!append) trendingContainer.innerHTML = '';
    if(!list || list.length === 0){
      if(!append) trendingContainer.innerHTML = '<p style="color:#ccc; text-align:center;">No results found.</p>';
      return;
    }
    list.forEach(m => {
      trendingContainer.appendChild(makeBoxElement(m));
    });
  }

  async function loadTrending(page = 1, append = false){
    const data = await fetchJSON(`${BASE}/trending/movie/day?api_key=${API_KEY}&page=${page}`);
    if(!data) return;
    renderMovies(data.results, append);
    if(loadMoreBtn) loadMoreBtn.style.display = data.page < data.total_pages ? 'inline-block' : 'none';
  }

  async function loadSearch(query, page = 1, append = false){
    const data = await fetchJSON(`${BASE}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
    if(!data) return;
    renderMovies(data.results, append);
    if(loadMoreBtn) loadMoreBtn.style.display = data.page < data.total_pages ? 'inline-block' : 'none';
  }

  // Search handler
  if(searchForm && searchInput){
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = searchInput.value.trim();
      if(!q){
        // empty -> go back to trending
        currentMode = 'trending';
        currentPage = 1;
        currentQuery = '';
        loadTrending(1, false);
        return;
      }
      currentMode = 'search';
      currentQuery = q;
      currentPage = 1;
      loadSearch(q, 1, false);
    });
  }

  // Load more handler
  if(loadMoreBtn){
    loadMoreBtn.addEventListener('click', () => {
      currentPage++;
      if(currentMode === 'trending') loadTrending(currentPage, true);
      else loadSearch(currentQuery, currentPage, true);
    });
  }

  // initial load
  loadTrending(1, false);

})();

// Search Movies Function
function searchMovies(query) {
  fetch(`https://api.themoviedb.org/3/search/movie?api_key=YOUR_API_KEY&query=${query}`)
    .then(response => response.json())
    .then(data => {
      const resultsContainer = document.getElementById("search-results");
      resultsContainer.innerHTML = "";

      data.results.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");

        movieCard.innerHTML = `
          <a href="movie.html?id=${movie.id}" class="movie-link">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
          </a>
        `;

        resultsContainer.appendChild(movieCard);
      });
    })
    .catch(error => console.error("Error fetching movies:", error));
}


document.getElementById("search-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const query = document.getElementById("search-input").value;
  if (query) {
    searchMovies(query);
  }
});







