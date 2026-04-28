const galleryContainer = document.querySelector('.gallery-container');
const galleryControlsContainer = document.querySelector('.gallery-controls');
const galleryControls = ['previous', 'next'];
const galleryItems = document.querySelectorAll('.gallery-item');
class Carousel {
    constructor(container, items, controls) {
        this.carouselContainer = container;
        this.carouselControls = controls;
        this.carouselArray = [...items];
    }
    setInitialState() {
        this.carouselArray[0].classList.add('gallery-item-previous');
        this.carouselArray[1].classList.add('gallery-item-selected');
        this.carouselArray[2].classList.add('gallery-item-next');
        // console.log(document.querySelector('.gallery-nav').childNodes[1]);
        document.querySelector('.gallery-nav').childNodes[1].className = 'gallery-nav-item gallery-item-previous';
        document.querySelector('.gallery-nav').childNodes[2].className = 'gallery-nav-item gallery-item-selected';
        document.querySelector('.gallery-nav').childNodes[3].className = 'gallery-nav-item gallery-item-next';
    }
    setCurrentState(target, selected, previous, next) {
        selected.forEach(el => {
            el.classList.remove('gallery-item-selected');
            if (target.className == 'gallery-controls-previous') {
                el.classList.add('gallery-item-next');
            } else {
                el.classList.add('gallery-item-previous');
            }
        });
        previous.forEach(el => {
            el.classList.remove('gallery-item-previous');
            if (target.className == 'gallery-controls-previous') {
                el.classList.add('gallery-item-selected');
            } else {
                el.classList.add('gallery-item-next');
            }
        });
        next.forEach(el => {
            el.classList.remove('gallery-item-next');
            if (target.className == 'gallery-controls-previous') {
                el.classList.add('gallery-item-previous');
            } else {
                el.classList.add('gallery-item-selected');
            }
        });
    }
    setNav() {
        galleryContainer.appendChild(document.createElement('ul')).className = 'gallery-nav';
        this.carouselArray.forEach(item => {
            const nav = galleryContainer.lastElementChild;
            nav.appendChild(document.createElement('li'));
        });
    }
    setControls() {
        this.carouselControls.forEach(control => {
            galleryControlsContainer.appendChild(document.createElement('button')).className = `gallery-controls-${control}`;
        });
        !!galleryControlsContainer.childNodes[0] ? galleryControlsContainer.childNodes[0].innerHTML = this.carouselControls[0] : null;
        !!galleryControlsContainer.childNodes[1] ? galleryControlsContainer.childNodes[1].innerHTML = this.carouselControls[1] : null;
    }
    useControls() {
        const triggers = [...galleryControlsContainer.childNodes];
        triggers.forEach(control => {
            control.addEventListener('click', () => {
                const target = control;
                const selectedItem = document.querySelectorAll('.gallery-item-selected');
                const previousSelectedItem = document.querySelectorAll('.gallery-item-previous');
                const nextSelectedItem = document.querySelectorAll('.gallery-item-next');
                // const firstCarouselItem = document.querySelectorAll('.gallery-item-first');
                // const lastCarouselItem = document.querySelectorAll('.gallery-item-last');
                this.setCurrentState(target, selectedItem, previousSelectedItem, nextSelectedItem);
            });
        });
    }
}
const exampleCarousel = new Carousel(galleryContainer, galleryItems, galleryControls);
exampleCarousel.setControls();
exampleCarousel.setNav();
exampleCarousel.setInitialState();
exampleCarousel.useControls();