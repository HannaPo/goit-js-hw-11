import './sass/index.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { lightbox } from './js/lightbox';
import { markupPhotos } from './js/markupPhotos';
import PixabayAPI from './js/pixabayAPI';

const searchFormEl = document.querySelector('.search-form');
const galleryListEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

const pixabayAPI = new PixabayAPI();

async function handleSearchPhotos(e) {
  e.preventDefault();
  removeMarkup();
  pixabayAPI.resetPage();
  
  const searchQuery = e.target.elements['searchQuery'].value.trim();
  pixabayAPI.query = searchQuery;

  loadMoreBtnEl.classList.add('is-hidden');

  if (searchQuery === '') {
    Notify.warning('Please enter search query');
    return;
  }

  try {
    const { data } = await pixabayAPI.fetchPhotos();

    pixabayAPI.fetchPhotos().then(data => {
      if (!data.hits.length) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      createGallery(data.hits);
      Notify.success(`Hooray! We found ${data.total} images.`);
      if (data.hits.length === pixabayAPI.per_page) {
        loadMoreBtnEl.classList.remove('is-hidden');
      }
    });
  } catch {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

const handleLoadMoreBtnClick = () => {
  pixabayAPI.page += 1;

  pixabayAPI.fetchPhotos().then(data => {
    if (data.totalHits < pixabayAPI.page * pixabayAPI.per_page) {
      loadMoreBtnEl.classList.add('is-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
    createGallery(data.hits);
  });
};

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
