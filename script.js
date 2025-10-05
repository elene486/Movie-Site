const APILINK  = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=a99c497982c48b13c800429ab9e1585f&page=1';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCHAPI = 'https://api.themoviedb.org/3/search/movie?api_key=a99c497982c48b13c800429ab9e1585f&query=';

const main  = document.getElementById('section');
const form  = document.getElementById('form');
const search = document.getElementById('query');

getMovies(APILINK);

async function getMovies(url) {
  try {
    const res = await fetch(url, { headers: { accept: 'application/json' } });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} – check your API key / URL`);
    }
    const data = await res.json();

    // if the key is wrong, TMDB often returns { status_message, status_code }
    if (!data.results || !Array.isArray(data.results)) {
      main.innerHTML = `<p>TMDB error: ${data.status_message || 'No results returned.'}</p>`;
      console.error('TMDB response:', data);
      return;
    }

    main.innerHTML = ''; // clear old content

    data.results.forEach(movie => {
      const row = document.createElement('div');   row.className = 'row';
      const col = document.createElement('div');   col.className = 'column';
      const card = document.createElement('div');  card.className = 'card';

      const img = document.createElement('img');
      img.className = 'thumbnail';
      img.alt = movie.title || 'Movie poster';
      if (movie.poster_path) {
        img.src = IMG_PATH + movie.poster_path;    // ✅ correct variable
      } else {
        img.style.display = 'none';                // hide if no poster
      }

      const title = document.createElement('h3');
      title.textContent = movie.title || '(Untitled)';

      // Build DOM
      card.appendChild(img);                       // ✅ append the image
      card.appendChild(title);
      col.appendChild(card);
      row.appendChild(col);
      main.appendChild(row);
    });
  } catch (err) {
    console.error(err);
    main.innerHTML = `<p>Failed to load movies: ${String(err)}</p>`;
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const term = (search.value || '').trim();
  if (term) {
    getMovies(SEARCHAPI + encodeURIComponent(term));  // ✅ encode search
    search.value = '';
  }
});
