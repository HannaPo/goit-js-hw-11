import axios from 'axios';

export default class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '34887920-69520c8eb03b7d32c829f5519';

  constructor() {
    this.page = 1;
    this.query = '';
    this.per_page = 40;
  }

  async fetchPhotos() {
    const response = await axios.get(`${this.#BASE_URL}`, {
      params: {
        key: this.#API_KEY,
        q: this.query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.page,
        per_page: this.per_page,
      },
    });
    return response.data;
  }
  
  resetPage() {
    this.page = 1;
  }
}