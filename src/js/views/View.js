import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  //Writing documentation: jsdoc.app
  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string insted of rendering to the DOM
   * @returns {undefined | string } A markup string is returned if render is set to false
   * @this {Object} View instance
   * @author Jonas Schmedtmann
   * @todo Finish implementation
   */

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newmarkup = this._generateMarkup();
    // Creating a new virtual DOM created with the new markup
    const newDOM = document.createRange().createContextualFragment(newmarkup);
    // Selecting all the elements from that virtual DOM
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    // Selecting all the current elements from the DOM
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // This method will update only the elements that have any changes between the two DOMs
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // Change only TEXT values
      // if (!newEl.firstChild) return;
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        console.log(curEl);
        curEl.textContent = newEl.textContent;
      }

      // Change attributes: Updating the dataset of the buttons
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  renderSpinner() {
    const markup = `
          <div class="spinner">
            <svg>
              <use href="${icons}.svg#icon-loader"></use>
            </svg>
          </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
          <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
          </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._successMessage) {
    const markup = `
          <div class="message">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
          </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
}
