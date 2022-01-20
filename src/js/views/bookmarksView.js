import icons from 'url:../../img/icons.svg';
import View from './View';
import PreviewView from './previewView.js';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');

  _errorMessage = 'No bookmarks yet, find a recipe you like and bookmark it :)';
  _successMessage = "That's correct";

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    return this._data
      .map(bookmark => PreviewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
