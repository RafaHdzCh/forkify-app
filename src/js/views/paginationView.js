import View from "./view";
import icons from "url:../../img/icons.svg";

//Script encargado 

class PaginationView extends View
{
    _parentElement = document.querySelector(".pagination");

    //Adds the next/prev page functionality to the buttons
    AddHandlerClick(handler)
    {
      this._parentElement.addEventListener("click", function(event)
      {
        const btn = event.target.closest(".btn--inline");
        if(!btn) return;

        const goToPage = Number(btn.dataset.goto);

        //Go to that page
        handler(goToPage);
      })
    }


    //Creates pages and buttons to navigate those pages
    _GenerateMarkup()
    {
      const { results, resultsPerPage, page } = this._data;
      const numberOfPages = Math.ceil(results.length / resultsPerPage);
      if (numberOfPages === 1) return '';

      const CreateButton = (page, direction) => `
          <button data-goto="${page}" class="btn--inline pagination__btn--${direction}">
              <span>Page ${page}</span>
              <svg class="search__icon">
                  <use href="${icons}#icon-arrow-${direction === 'next' ? 'right' : 'left'}"></use>
              </svg>
          </button>
      `;

      const prevButton = CreateButton(page - 1, 'prev');
      const nextButton = CreateButton(page + 1, 'next');

      return page === 1 ? nextButton : page === numberOfPages ? prevButton : `${nextButton}${prevButton}`;
    }
}

export default new PaginationView();