/* exported data */
var data = {
  watchlist: []
};

window.addEventListener('beforeunload', event => {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('localStorage', dataJSON);
});

if (localStorage.getItem('localStorage') !== null) {
  data = JSON.parse(localStorage.getItem('localStorage'));
}
