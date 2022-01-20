import icons from 'url:../../img/icons.svg';
import View from './View';
import PreviewView from './previewView';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _markupUserGen = `
    <div class="preview__user-generated">
        <svg>
        <use href="${icons}#icon-user"></use>
        </svg>
    </div>
    `;

  _errorMessage =
    'No recipes found for your search. Please try again with another term';
  _successMessage = "That's correct";

  _generateMarkup() {
    return this._data.map(result => PreviewView.render(result, false)).join('');
  }
}

export default new ResultsView();
