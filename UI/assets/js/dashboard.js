// show and hide side bar on small screens
let toggleOpen = document.querySelector('.toggle-open');
let toggleClose = document.querySelector('.toggle-close');
let sideBar = document.querySelector('.side-bar');

toggleOpen.addEventListener('click', () => {
    sideBar.classList.add('show');
});
toggleClose.addEventListener('click', () => {
    sideBar.classList.remove('show');
});