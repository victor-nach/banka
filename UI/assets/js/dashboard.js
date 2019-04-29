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

let userLinksHeader = document.querySelector('.user-links h4');
let staffLinks = document.querySelector('.staff-links');
let staffLinksHeader = document.querySelector('.staff-links h4');
let cashierLinks = document.querySelector('.cashier-links');
let cashierLinksHeader = document.querySelector('.cashier-links h4');
let adminLinks = document.querySelector('.admin-links');

userLinksHeader.addEventListener('click', () => {
    staffLinks.style.display==='none' ? staffLinks.style.display='block': staffLinks.style.display='none';
});

staffLinksHeader.addEventListener('click', () => {
    cashierLinks.style.display==='none' ? cashierLinks.style.display='block': cashierLinks.style.display='none';
});

cashierLinksHeader.addEventListener('click', () => {
    adminLinks.style.display==='none' ? adminLinks.style.display='block': adminLinks.style.display='none';
});