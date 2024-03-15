import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import bookmarksView from "./views/bookmarksView.js";
import paginationView from "./views/paginationView.js";
import addRecipeView from "./views/addRecipeView.js";

import "core-js/stable"; //Pollyfill everything else
import "regenerator-runtime/runtime";//Pollyfilling async/await
import bookmarksView from "./views/bookmarksView.js";
import { MODAL_CLOSE_SECONDS } from "./config.js";

if(module.hot)
{
  module.hot.accept();
}

//Displays the recipe if the id exists
async function ControlRecipes()
{
  try
  {
    const id = window.location.hash.slice(1);
    if(!id) return;

    recipeView.RenderSpinner();
    resultsView.Update(model.GetSearchResultsPage());
    await model.LoadRecipe(id);
    recipeView.Render(model.state.recipe);
    bookmarksView.Update(model.state.bookmarks);
  }
  catch(error)
  {
    console.warn(error.message);
    recipeView.RenderError();
  }
}

//Displays the users search, divided in pages if needed
async function ControlSearchResults()
{
  try
  {
    resultsView.RenderSpinner();

    const query = searchView.GetQuery();
    if(!query) return;

    await model.LoadSearchResults(query);

    resultsView.Render(model.GetSearchResultsPage());
    paginationView.Render(model.state.search);
  }
  catch(error)
  {
    console.warn(error)
  }
}

function ControlPagination(goToPage)
{
  resultsView.Render(model.GetSearchResultsPage(goToPage))
  paginationView.Render(model.state.search);
}

function ControlServings(newServings)
{
  model.UpdateServings(newServings);
  recipeView.Update(model.state.recipe);
}

function ControlAddBookMark()
{
  // 1) Add or remove a bookmark
  if(!model.state.recipe.bookmark)
  {
    model.AddBookmark(model.state.recipe);
  }
  else
  {
    model.RemoveBookmark(model.state.recipe.id);
  }

  // 2) Update recipe view
  recipeView.Update(model.state.recipe);

  //3) Render bookmarks
  bookmarksView.Render(model.state.bookmarks);
}

function ControlBookmarks()
{
  bookmarksView.Render(model.state.bookmarks);
}

async function ControlAddRecipe(newRecipe)
{
  try
  {
    addRecipeView.RenderSpinner();
    await model.UploadRecipe(newRecipe);
    recipeView.Render(model.state.recipe);
    addRecipeView.RenderMessage();
    bookmarksView.Render(model.state.bookmarks);
    window.history.pushState(null, "", `#${model.state.recipe.id}`);
    
    setTimeout(function()
    {
      addRecipeView.ToggleWindow();  
    }, MODAL_CLOSE_SECONDS * 1000);
  }
  catch(error)
  {
    console.log("Hello!");
    console.warn("WARNING! Error: " + error);
    addRecipeView.RenderError(error.message);
  }
}

function Init() 
{ 
  bookmarksView.AddHandlerRender(ControlBookmarks)
  recipeView.AddHandlerRender(ControlRecipes); 
  recipeView.AddHandlerUpdateServings(ControlServings);
  recipeView.AddHandlerAddBookmark(ControlAddBookMark);
  searchView.AddHandlerSearch(ControlSearchResults);
  paginationView.AddHandlerClick(ControlPagination);
  addRecipeView.AddHandlerUpload(ControlAddRecipe);
}
Init();