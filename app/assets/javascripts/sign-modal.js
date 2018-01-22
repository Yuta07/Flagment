let sign_open = document.getElementById('sign-open');
let sign_modal = document.getElementById('sign-modal');
let sign_mask = document.getElementById('mask');

sign_open.addEventListener('click', function() {
  sign_modal.className = '';
  sign_mask.className = '';
});

sign_mask.addEventListener('click', function() {
  sign_modal.className = 'hidden';
  sign_mask.className = 'hidden';
});

console.log("aaa");
