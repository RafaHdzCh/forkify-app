import View from "./view";
import icons from "url:../../img/icons.svg";

//Script encargado 

class AddRecipeView extends View
{
    _parentElement = document.querySelector(".upload");
    _message = "Recipe was successfully uploaded.";
    _window = document.querySelector(".add-recipe-window");
    _overlay = document.querySelector(".overlay");
    _btnOpen = document.querySelector(".nav__btn--add-recipe");
    _btnClose = document.querySelector(".btn--close-modal");
    
    constructor()
    {
      super();
      this._AddHandlerShowWindow();
      this._AddHandlerHideWindow();
    }

    ToggleWindow()
    {
      this._window.classList.toggle("hidden");
      this._overlay.classList.toggle("hidden");
    }

    _AddHandlerShowWindow()
    {
      this._btnOpen.addEventListener("click", this.ToggleWindow.bind(this));
    }

    _AddHandlerHideWindow()
    {
      this._btnClose.addEventListener("click", this.ToggleWindow.bind(this));
      this._overlay.addEventListener("click", this.ToggleWindow.bind(this));
    }

    AddHandlerUpload(handler)
    {
      this._parentElement.addEventListener("submit", function(event)
      {
        event.preventDefault();
        const dataArr = [...new FormData(this)];
        const data = Object.fromEntries(dataArr);
        handler(data);
      })
    }
}

export default new AddRecipeView();