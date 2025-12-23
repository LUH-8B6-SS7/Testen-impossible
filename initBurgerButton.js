const burgerBtn = document.getElementById('burger');
const burgerMenu = document.getElementById('burgermenu');

burgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    burgerMenu.classList.toggle('open');
});

document.addEventListener('click', () => {
    burgerMenu.classList.remove('open');
});