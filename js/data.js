/* exported data */
var data = {
  watchlist: [],
  clickedMovieId: null,
  view: 'search',
  title: null,
  currentPage: null,
  totalPages: null
};

window.addEventListener('beforeunload', event => {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('localStorage', dataJSON);
});

if (localStorage.getItem('localStorage') !== null) {
  data = JSON.parse(localStorage.getItem('localStorage'));
}
