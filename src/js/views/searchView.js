import View from "./view";

class SearchView extends View
{
    _parentElement = document.querySelector(".search");

    //Adds the functionality of submit query to the input field
    AddHandlerSearch(Handler)
    {
        this._parentElement.addEventListener("submit", function(event)
        {
            event.preventDefault();
            Handler();
        })
    }

    GetQuery()
    {
        const query = this._parentElement.querySelector(".search__field").value;
        this._ClearInput();
        return query;
    }

    _ClearInput()
    {
        this._parentElement.querySelector(".search__field").value = "";
    }
}

export default new SearchView();