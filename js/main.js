const API_KEY = 'api_key=60a54b0f57e84cfed7f03d9b54cc4177';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const SEARCH_URL = `${BASE_URL}/search/movie?${API_KEY}&include_adult=false&language=en-US&query=`;

// Application state
const resultPage = 1;

// Search button
const $searchBtn = document.querySelector('.search-button');
const $searchInput = document.querySelector('.search-input');

// Movie container
const $movieResults = document.querySelector('.movie-results');

function searchMovies() {
  const xhr = new XMLHttpRequest();

  const searchTitle = $searchInput.value.trim();
  if (searchTitle) {
    xhr.open('GET', `${SEARCH_URL}${searchTitle}&page=${resultPage}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      const results = xhr.response.results;

      $movieResults.replaceChildren();
      for (let i = 0; i < results.length; i++) {
        $movieResults.append(renderMovie(results[i]));
      }
    });
    xhr.send();
  }
}

// {/* <i class="fa-solid fa-bookmark fa-fade"></i> */}

function renderMovie(results) {

  const $movie = document.createElement('div');
  $movie.classList.add('movie');
  const $moviePoster = document.createElement('img');
  $moviePoster.classList.add('movie-poster');

  if (results.poster_path === null) {
    $moviePoster.setAttribute('src', 'https://placehold.jp/DDDDDD/ffffff/500x750.jpg?text=No%20image%20available');
    $moviePoster.setAttribute('alt', 'No image available');
  } else {
    $moviePoster.setAttribute('src', `${IMG_URL}${results.poster_path}`);
    $moviePoster.setAttribute('alt', `Movie poster of ${results.title}`);
  }

  const $bookmarkIcon = document.createElement('i');
  $bookmarkIcon.classList.add('fa-solid', 'fa-bookmark');
  const $movieTitle = document.createElement('h3');
  $movieTitle.classList.add('movie-title');
  $movieTitle.textContent = results.title;
  const $movieInfo = document.createElement('div');
  $movieInfo.classList.add('movie-info', 'row');

  const $movieInfoCol = document.createElement('div');
  $movieInfoCol.classList.add('column-full', 'space-between');
  const $movieRating = document.createElement('p');
  $movieRating.classList.add('movie-rating');
  const $ratingIcon = document.createElement('i');
  $ratingIcon.classList.add('fa-solid', 'fa-star');

  $movieRating.append($ratingIcon, results.vote_average.toFixed(2));
  const $movieYear = document.createElement('p');
  $movieYear.classList.add('movie-year');
  $movieYear.textContent = results.release_date.substring(0, 4);
  $movie.append($moviePoster);
  $movie.append($bookmarkIcon);
  $movie.append($movieTitle);
  $movie.append($movieInfo);
  $movieInfo.append($movieInfoCol);
  $movieInfoCol.append($movieRating);
  $movieInfoCol.append($movieYear);

  return $movie;
}

$searchBtn.addEventListener('click', () => {
  searchMovies();
  $movieResults.classList.remove('hide');
  $searchInput.value = '';
  document.documentElement.scrollTop = 0;
});

$searchInput.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    $searchBtn.click();
  }
});

$movieResults.addEventListener('click', event => {
  if (event.target.tagName === 'I') {
    const watchListMovie = {};
    watchListMovie.poster_path = event.target.closest('.movie').querySelector('img').src;
    watchListMovie.title = event.target.closest('.movie').querySelector('.movie-title').textContent;
    watchListMovie.vote_average = event.target.closest('.movie').querySelector('.movie-rating').textContent;
    watchListMovie.release_date = event.target.closest('.movie').querySelector('.movie-year').textContent;
    watchListMovie.movieId = data.nextMovieId;
    data.nextMovieId++;

    data.watchlist.unshift(watchListMovie);
  }
});
