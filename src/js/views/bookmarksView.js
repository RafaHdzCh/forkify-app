import View from "./view";
import previewView from "./previewView";
import icons from "url:../../img/icons.svg";

class BookmarksView extends View
{
    _parentElement = document.querySelector(".bookmarks__list");
    _errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it!";
    _message = "";

    AddHandlerRender(handler)
    {
        window.addEventListener("load", handler);
    }

    //Creates all the needed results for the search
    _GenerateMarkup()
    {
        return this._data
          .map(bookmark => previewView.Render(bookmark, false))
          .join("");
    }
}

export default new BookmarksView();