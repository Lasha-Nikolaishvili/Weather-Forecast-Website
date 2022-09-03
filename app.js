const navLinks = document.querySelector('.navLinks');
const toggleButton = document.querySelector('.toggleButton');

toggleButton.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    toggleButton.classList.toggle('pressed');
})
