import icons from "url:../../img/icons.svg"; //Parcel 2

//Parent class of the views with general functions for all of them

export default class View
{
    _data;

    //Receives data and generates an HTML which inserts to display a new element in the page
    Render(data, render = true)
    {
        if(!data || (Array.isArray(data) && data.length === 0)) 
        {
          return this.RenderError();
        }
        this._data = data;
        const markup = this._GenerateMarkup();
        if(!render)return markup;
        this._Clear();
        this._parentElement.insertAdjacentHTML("afterbegin", markup);
    }

    //Receives an error message so it can be displayed to the user
    RenderError(message = this._errorMessage)
    {
      const errorHTML = 
      `
        <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
      `;
      this._Clear();
      this._parentElement.insertAdjacentHTML("afterbegin", errorHTML);
    }

    //Receives a message so it can be displayed to the user
    RenderMessage(message = this._message)
    {
      const messageHTML = 
      `
        <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
      `;
      this._Clear();
      this._parentElement.insertAdjacentHTML("afterbegin", messageHTML);
    }

    //Displays an spinner when the page is loading
    RenderSpinner()
    {
        const spinnerHTML =
        `
            <div class="spinner">
            <svg>
                <use href="${icons}'#icon-loader"></use>
            </svg>
            </div>
        `;
        this._Clear();
        this._parentElement.insertAdjacentHTML("afterbegin", spinnerHTML);
    }

    //Updates specific information in the page. It avoids reload everything again.
    Update(data)
    {
      this._data = data;
      const newMarkup = this._GenerateMarkup();

      const newDOM = document.createRange().createContextualFragment(newMarkup);
      const newElements = Array.from(newDOM.querySelectorAll("*"));
      const currentElements = Array.from(this._parentElement.querySelectorAll("*"));
      
      newElements.forEach((newElement, index) => 
      {
        const currentElement = currentElements[index];

        //Updates changed TEXT
        if(!newElement.isEqualNode(currentElement) &&
            newElement.firstChild?.nodeValue.trim() !== "")
        {
          currentElement.textContent = newElement.textContent;
        }

        //Updates changed ATTRIBUTES
        if(!newElement.isEqualNode(currentElement))
        {
          Array.from(newElement.attributes).forEach(attribute => currentElement.setAttribute(attribute.name, attribute.value));
        }
      });
    }

    //Cleans the container of previous data
    _Clear()
    {
        this._parentElement.innerHTML = "";
    }
}