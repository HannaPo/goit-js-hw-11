export function markupPhotos(
  { webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads }
) {
    return `<li class="gallery__item">
    <a class="gallery__link" href="${largeImageURL}">
      <img class="gallery__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
    </li>`;
  }
