import './sass/index.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { lightbox } from './js/lightbox';
import { markupPhotos } from './js/markupPhotos';
import PixabayAPI from './js/pixabayAPI'

const searchFormEl = document.querySelector('.search-form');
const galleryListEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

const pixabayAPI = new PixabayAPI();

async function handleSearchPhotos(e) {
  e.preventDefault();

 removeMarkup();
  const searchQuery = e.target.elements['searchQuery'].value.trim();
  pixabayAPI.query = searchQuery;
  

  if (searchQuery === '') {
    loadMoreBtnEl.classList.add('is-hidden');
    Notify.info('Please enter search query');
    return; 
  };

  try {
    const { data } = await pixabayAPI.fetchPhotos();

    pixabayAPI.fetchPhotos().then(data => {
      if (!data.hits.length) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.');
        loadMoreBtnEl.classList.add('is-hidden');
        return;
      }
      createGallery(data.hits);
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
      if (data.hits.length === pixabayAPI.per_page) {
        loadMoreBtnEl.classList.add('is-hidden');
         } else {
        loadMoreBtnEl.classList.remove('is-hidden');
      }
    });
  }
  catch {
    loadMoreBtnEl.classList.add('is-hidden');
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
     );
  };
};

const handleLoadMoreBtnClick = () => {
  pixabayAPI.page += 1;
  pixabayAPI.fetchPhotos().then(data => {
    if (data.totalHits < pixabayAPI.per_page) {
      Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreBtnEl.classList.add('is-hidden');
    }
    createGallery(data.hits);
    
  });
}

searchFormEl.addEventListener('submit', handleSearchPhotos);
loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);

function createGallery(data) {
  const markup = data.map(markupPhotos).join('');
  galleryListEl.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function removeMarkup() {
  galleryListEl.innerHTML = '';
}