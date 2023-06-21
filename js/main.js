const API_KEY = 'api_key=60a54b0f57e84cfed7f03d9b54cc4177';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const SEARCH_URL = `${BASE_URL}/search/movie?${API_KEY}&include_adult=false&language=en-US&query=`;

// Application state
const resultPage = 1;

// Views
const $searchView = document.querySelector('[data-view="search-view"]');
const $watchlistView = document.querySelector('[data-view="watchlist-view"]');

const $navbar = document.querySelector('nav');

// Search button
const $searchBtn = document.querySelector('.search-button');
const $searchInput = document.querySelector('.search-input');

// Movie containers
const $movieSearchResults = document.querySelector('.movie-results');
const $movieWatchlistResults = document.querySelector('.movie-watchlist');

// Watchlist
const $emptyWatchlistMessage = document.querySelector('.empty-watchlist-message');
const $watchlistHeader = document.querySelector('.watchlist-header');

function searchMovies() {
  const xhr = new XMLHttpRequest();
  const searchTitle = $searchInput.value.trim();
  if (searchTitle) {
    xhr.open('GET', `${SEARCH_URL}${searchTitle}&page=${resultPage}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      const results = xhr.response.results;
      $movieSearchResults.replaceChildren();
      for (let i = 0; i < results.length; i++) {
        $movieSearchResults.append(renderMovie(results[i]));
      }
    });
    xhr.send();
  }
}

// Render movie function
function renderMovie(results) {

  const $movie = document.createElement('div');
  $movie.classList.add('movie');
  $movie.setAttribute('id', results.id);

  const $moviePoster = document.createElement('img');
  $moviePoster.classList.add('movie-poster');

  const $bookmarkIcon = document.createElement('i');
  $bookmarkIcon.classList.add('fa-solid', 'fa-bookmark');
  for (let i = 0; i < data.watchlist.length; i++) {
    if (data.watchlist[i].id === results.id) {
      $bookmarkIcon.classList.add('icon-yellow');
    }
  }

  if ($bookmarkIcon.classList.contains('icon-yellow')) {
    $moviePoster.setAttribute('src', results.poster_path);
    $moviePoster.setAttribute('alt', 'No image available');
  } else if (results.poster_path === null) {
    $moviePoster.setAttribute('src', 'https://placehold.jp/DDDDDD/ffffff/500x750.jpg?text=No%20image%20available');
    $moviePoster.setAttribute('alt', 'No image available');
  } else {
    $moviePoster.setAttribute('src', `${IMG_URL}${results.poster_path}`);
    $moviePoster.setAttribute('alt', `Movie poster of ${results.title}`);
  }

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
  $movieRating.append($ratingIcon, Number(results.vote_average).toFixed(2));
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

$navbar.addEventListener('click', viewSwap);

$searchBtn.addEventListener('click', () => {
  searchMovies();
  $movieSearchResults.classList.remove('hide');
  $searchInput.value = '';
  document.documentElement.scrollTop = 0;
});

$searchInput.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    $searchBtn.click();
  }
});

$movieSearchResults.addEventListener('click', event => {
  if (event.target.tagName === 'I') {
    event.target.classList.add('icon-yellow');
    const watchListMovie = {};
    watchListMovie.poster_path = event.target.closest('.movie').querySelector('img').src;
    watchListMovie.title = event.target.closest('.movie').querySelector('.movie-title').textContent;
    watchListMovie.vote_average = event.target.closest('.movie').querySelector('.movie-rating').textContent;
    watchListMovie.release_date = event.target.closest('.movie').querySelector('.movie-year').textContent;
    watchListMovie.id = Number(event.target.closest('.movie').getAttribute('id'));

    data.watchlist.unshift(watchListMovie);
  }
});

function viewSwap(event) {
  if (event.target.matches('#navSearch')) {
    $searchView.classList.remove('hide');
    $watchlistView.classList.add('hide');
  } else if (event.target.matches('#navWatchlist')) {
    toggleEmptyWatchlist();
    $searchView.classList.add('hide');
    $watchlistView.classList.remove('hide');
  }
}

function toggleEmptyWatchlist() {
  if (data.watchlist.length === 0) {
    $emptyWatchlistMessage.classList.remove('hide');
    $movieWatchlistResults.classList.add('hide');
    $watchlistHeader.classList.add('hide');
  } else {
    $emptyWatchlistMessage.classList.add('hide');
    $movieWatchlistResults.classList.remove('hide');
    $watchlistHeader.classList.remove('hide');
  }
}

document.addEventListener('DOMContentLoaded', event => {
  for (let i = 0; i < data.watchlist.length; i++) {
    $movieWatchlistResults.append(renderMovie(data.watchlist[i]));
  }
});
