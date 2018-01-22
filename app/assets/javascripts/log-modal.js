let log_open = document.getElementById('log-open');
let log_modal = document.getElementById('log-modal');
let log_mask = document.getElementById('mask');

log_open.addEventListener('click', function() {
  log_modal.className = '';
  log_mask.className = '';
});

log_mask.addEventListener('click', function() {
  log_modal.className = 'hidden';
  log_mask.className = 'hidden';
});

console.log("aaa");
