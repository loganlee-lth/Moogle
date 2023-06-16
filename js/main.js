const API_KEY = 'api_key=60a54b0f57e84cfed7f03d9b54cc4177';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const SEARCH_URL = `${BASE_URL}/search/movie?${API_KEY}&include_adult=false&language=en-US&query=`;

// App state
const resultPage = 1;

// Search button
const $searchInput = document.querySelector('.search-input');
const $movieResults = document.querySelector('.movie-results');

function searchMovies() {

  const xhr = new XMLHttpRequest();
  xhr.open('GET', `${SEARCH_URL}${$searchInput.value}&language=us-US&page=${resultPage}`);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {

    const results = xhr.response.results;
    // console.log(xhr.response);
    // console.log(results);

    showMovies(results);
  });
  xhr.send();
}

function showMovies(array) {
  $movieResults.classList.remove('hide');

  while ($movieResults.firstChild) {
    $movieResults.removeChild($movieResults.firstChild);
  }

  for (let i = 0; i < array.length; i++) {

    const $movie = document.createElement('div');
    $movie.classList.add('movie');
    const $moviePoster = document.createElement('img');
    $moviePoster.classList.add('movie-poster');

    if (array[i].poster_path === null) {
      // console.log('null');
    } else {
      $moviePoster.setAttribute('src', `${IMG_URL}${array[i].poster_path}`);
    }

    const $bookmarkIcon = document.createElement('i');
    $bookmarkIcon.classList.add('fa-regular', 'fa-plus');
    const $movieTitle = document.createElement('h3');
    $movieTitle.classList.add('movie-title');
    $movieTitle.textContent = array[i].title;
    const $movieInfo = document.createElement('div');
    $movieInfo.classList.add('movie-info', 'row');

    const $movieInfoCol = document.createElement('div');
    $movieInfoCol.classList.add('column-full', 'space-between');
    const $movieRating = document.createElement('p');
    $movieRating.classList.add('movie-rating');
    const $ratingIcon = document.createElement('i');
    $ratingIcon.classList.add('fa-solid', 'fa-star');

    $movieRating.append($ratingIcon, array[i].vote_average.toFixed(2));
    const $movieYear = document.createElement('p');
    $movieYear.classList.add('movie-year');
    // if date = null then return '-'
    $movieYear.textContent = array[i].release_date.substring(0, 4);
    $movie.append($moviePoster);
    $movie.append($bookmarkIcon);
    $movie.append($movieTitle);
    $movie.append($movieInfo);
    $movieInfo.append($movieInfoCol);
    $movieInfoCol.append($movieRating);
    $movieInfoCol.append($movieYear);
    $movieResults.append($movie);
  }
}

searchMovies();
