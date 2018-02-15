const albox = document.getElementById("alert-box");
const cabox = document.getElementById("fa-cancel");

cabox.addEventListener('click', function() {
  albox.className = 'hidden';
  cabox.className = '';
});
