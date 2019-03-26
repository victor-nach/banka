
// Animated signup form
let showSignIn = document.querySelector('.show-signin');
let showLogIn = document.querySelector('.show-login');
let innerContainer = document.querySelector('.form-inner-container');

showSignIn.addEventListener('click', () => {
    innerContainer.classList.add('left');
    innerContainer.classList.remove('right');
});

showLogIn.addEventListener('click', () => {
    innerContainer.classList.add('right');
    innerContainer.classList.remove('left');
});

// show and hide modal
let signInBtn = document.querySelector('.signin');
let signUpBtn = document.querySelector('.signup');
let modal = document.querySelector('.modal');
let pageWrap = document.querySelector('.page-wrap');

signUpBtn.addEventListener('click', () => {
    modal.classList.add('show');
    modal.classList.remove('hide');
    pageWrap.classList.add('blur');
});

signInBtn.addEventListener('click', () => {
    modal.classList.add('show');
    modal.classList.remove('hide');
    pageWrap.classList.add('blur');
    innerContainer.classList.add('left');
    innerContainer.classList.remove('right');
});

modal.addEventListener('click', (evt) => {
    // if only the modal itself is clicked (outer space)
    if (evt.target === modal ) {
        modal.classList.remove('show');
        modal.classList.add('hide');
        pageWrap.classList.remove('blur');
        innerContainer.classList.remove('left');
        innerContainer.classList.add('right');
    }
});

