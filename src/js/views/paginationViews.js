import View from './view';
import icons from 'url:../../img/icons.svg';
class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  _generateMarkupButtonNext(currPage) {
    return `<button data-goto="${
      currPage + 1
    }" class="btn--inline pagination__btn--next">
    <span>Page ${currPage + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button>`;
  }
  _generateMarkupButtonPrev(currPage) {
    return `<button data-goto="${
      currPage - 1
    }" class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${currPage - 1}</span>
  </button>`;
  }

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const gotoPage = +btn.dataset.goto;
      handler(gotoPage);
    });
  }
  _generateMarkup() {
    const currPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    if (currPage === 1 && numPages > 1) {
      return this._generateMarkupButtonNext(currPage);
    }

    if (currPage === numPages && numPages > 1) {
      return this._generateMarkupButtonPrev(currPage);
    }

    if (currPage < numPages) {
      return (
        this._generateMarkupButtonNext(currPage) +
        this._generateMarkupButtonPrev(currPage)
      );
    }

    return '';
  }
}
export default new PaginationView();
