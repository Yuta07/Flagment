let cardadd_open = document.getElementById('cardadd-open');
let cardadd_modal = document.getElementById('cardadd-modal');
let proedit_open = document.getElementById('proedit-open');
let proadd_modal = document.getElementById('proadd-modal');
let cardadd_conceal = document.getElementById('conceal');

cardadd_open.addEventListener('click', function() {
  cardadd_modal.className = '';
  cardadd_conceal.className = '';
});

proedit_open.addEventListener('click', function() {
  proadd_modal.className = '';
  cardadd_conceal.className = '';
});

cardadd_conceal.addEventListener('click', function() {
  cardadd_modal.className = 'hidden';
  proadd_modal.className = 'hidden';
  cardadd_conceal.className = 'hidden';
});

console.log("bbb");
