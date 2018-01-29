let proadd_open = document.getElementById('proadd-open');
let proadd_modal = document.getElementById('proadd-modal');
let proadd_mantle = document.getElementById('mantle');

proadd_open.addEventListener('click', function() {
  proadd_modal.className = '';
  proadd_mantle.className = '';
});

proadd_mantle.addEventListener('click', function() {
  proadd_modal.className = 'hidden';
  proadd_mantle.className = 'hidden';
});

console.log("bbb");
