const API_KEY = 'api_key=aee2516ca6612aadf15632f702d7bf65';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const SEARCH_URL = `${BASE_URL}/search/movie?${API_KEY}&include_adult=false&language=en-US&region=us&query=`;

// Application state
const resultPage = 1;

// Views
const $searchView = document.querySelector('[data-view="search-view"]');
const $upcomingView = document.querySelector('[data-view="upcoming-view"]');
const $watchlistView = document.querySelector('[data-view="watchlist-view"]');

// Header
const $header = document.querySelector('header');
const $navbar = document.querySelector('nav');

// Search button
const $searchBtn = document.querySelector('.search-button');
const $searchInput = document.querySelector('.search-input');

// Movie containers
const $movieSearchResults = document.querySelector('.movie-results');
const $movieUpcomingResults = document.querySelector('.movie-upcoming-list');
const $movieWatchlistResults = document.querySelector('.movie-watchlist');

// Upcoming
const $upcomingListHeader = document.querySelector('.upcoming-list-header');

// Watchlist
const $emptyWatchlistMessage = document.querySelector('.empty-watchlist-message');
const $watchlistHeader = document.querySelector('.watchlist-header');

// Modal
const $modal = document.querySelector('#background');
const $cancelButton = document.querySelector('#cancel-button');
const $deleteButton = document.querySelector('#delete-button');

// Search function
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

// Search upcoming movies
function searchUpcomingMovies() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.themoviedb.org/3/movie/upcoming?api_key=aee2516ca6612aadf15632f702d7bf65&language=en-US&page=1&region=us');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    const results = xhr.response.results;
    $movieUpcomingResults.replaceChildren();
    for (let i = 0; i < results.length; i++) {
      $movieUpcomingResults.append(renderMovie(results[i]));
    }
  });
  xhr.send(data);
}

// Render movie function
function renderMovie(result) {

  const $movie = document.createElement('div');
  $movie.classList.add('movie');
  $movie.setAttribute('data-movie-id', result.id);

  const $moviePoster = document.createElement('img');
  $moviePoster.classList.add('movie-poster');
  const $bookmarkIcon = document.createElement('i');
  $bookmarkIcon.classList.add('fa-solid', 'fa-bookmark');

  if (result.poster_path === null) {
    $moviePoster.setAttribute('src', 'https://placehold.jp/DDDDDD/ffffff/500x750.jpg?text=No%20image%20available');
    $moviePoster.setAttribute('alt', 'No image available');
  } else {
    $moviePoster.setAttribute('src', `${IMG_URL}${result.poster_path}`);
    $moviePoster.setAttribute('alt', `Movie poster of ${result.title}`);
  }
  for (let i = 0; i < data.watchlist.length; i++) {
    if (data.watchlist[i].id === result.id) {
      $moviePoster.setAttribute('src', data.watchlist[i].poster_path);
      $moviePoster.setAttribute('alt', data.watchlist[i].alt);
      $bookmarkIcon.classList.add('icon-yellow');
    }
  }

  const $movieTitle = document.createElement('h3');
  $movieTitle.classList.add('movie-title');
  $movieTitle.textContent = result.title;
  const $movieInfo = document.createElement('div');
  $movieInfo.classList.add('movie-info', 'row');
  const $movieInfoCol = document.createElement('div');
  $movieInfoCol.classList.add('column-full', 'space-between');
  const $movieRating = document.createElement('p');
  $movieRating.classList.add('movie-rating');
  const $ratingIcon = document.createElement('i');
  $ratingIcon.classList.add('fa-solid', 'fa-star');
  $movieRating.append($ratingIcon, Number(result.vote_average).toFixed(2));
  const $movieYear = document.createElement('p');
  $movieYear.classList.add('movie-year');
  $movieYear.textContent = result.release_date.substring(0, 4);

  $movie.append($moviePoster);
  $movie.append($bookmarkIcon);
  $movie.append($movieTitle);
  $movie.append($movieInfo);
  $movieInfo.append($movieInfoCol);
  $movieInfoCol.append($movieRating);
  $movieInfoCol.append($movieYear);

  return $movie;
}

// View swap
function viewSwap(event) {
  if (event.target.matches('#navSearch')) {
    $searchView.classList.remove('hide');
    $upcomingView.classList.add('hide');
    $watchlistView.classList.add('hide');
  } else if (event.target.matches('#navUpcoming')) {
    $searchView.classList.add('hide');
    $upcomingView.classList.remove('hide');
    $watchlistView.classList.add('hide');
    $upcomingListHeader.classList.remove('hide');
    $movieUpcomingResults.classList.remove('hide');
    searchUpcomingMovies();
  } else if (event.target.matches('#navWatchlist')) {
    toggleEmptyWatchlist();
    $searchView.classList.add('hide');
    $upcomingView.classList.add('hide');
    $watchlistView.classList.remove('hide');
  }
}

// Toggle empty watchlist message and watchlist header
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

$navbar.addEventListener('click', viewSwap);

// Search view
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

// Bookmark functionality
function bookmark(event) {
  if (event.target.tagName === 'I' && !event.target.classList.contains('icon-yellow')) {
    event.target.classList.add('icon-yellow');
    const watchListMovie = {};
    watchListMovie.poster_path = event.target.closest('.movie').querySelector('img').src;
    watchListMovie.alt = event.target.closest('.movie').querySelector('img').alt;
    watchListMovie.title = event.target.closest('.movie').querySelector('.movie-title').textContent;
    watchListMovie.vote_average = event.target.closest('.movie').querySelector('.movie-rating').textContent;
    watchListMovie.release_date = event.target.closest('.movie').querySelector('.movie-year').textContent;
    watchListMovie.id = Number(event.target.closest('.movie').getAttribute('data-movie-id'));

    data.watchlist.unshift(watchListMovie);
    $movieWatchlistResults.prepend(renderMovie(watchListMovie));
  }
}

$movieSearchResults.addEventListener('click', bookmark);
$movieUpcomingResults.addEventListener('click', bookmark);

// Watchlist view
$movieWatchlistResults.addEventListener('click', event => {
  if (event.target.tagName === 'I') {
    $header.classList.remove('sticky');
    $modal.classList.remove('hide');
    data.clickedMovieId = Number(event.target.closest('.movie').getAttribute('data-movie-id'));
  }
});

$cancelButton.addEventListener('click', () => {
  $header.classList.add('sticky');
  $modal.classList.add('hide');
  data.clickedMovieId = null;
});

$deleteButton.addEventListener('click', () => {
  for (let i = 0; i < data.watchlist.length; i++) {
    if (data.watchlist[i].id === data.clickedMovieId) {
      data.watchlist.splice(i, 1);
      break;
    }
  }

  const $deletedMovie = $movieWatchlistResults.querySelector(`[data-movie-id="${data.clickedMovieId}"]`);
  $deletedMovie.remove();
  if (typeof ($movieSearchResults.querySelector(`[data-movie-id="${data.clickedMovieId}"]`)) !== 'undefined' && $movieSearchResults.querySelector(`[data-movie-id="${data.clickedMovieId}"]`) !== null) {
    const $unfavoriteMovie = $movieSearchResults.querySelector(`[data-movie-id="${data.clickedMovieId}"]`);
    $unfavoriteMovie.querySelector('i').classList.remove('icon-yellow');
  }

  toggleEmptyWatchlist();
  $header.classList.add('sticky');
  $modal.classList.add('hide');
  data.clickedMovieId = null;
});

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', event => {
  for (let i = 0; i < data.watchlist.length; i++) {
    $movieWatchlistResults.append(renderMovie(data.watchlist[i]));
  }
});
