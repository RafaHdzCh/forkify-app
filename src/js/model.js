import { API_URL, RESULTS_PER_PAGE, DEVELOPER_KEY } from "./config";
import { AJAX } from "./helper";

export const state = 
{
    recipe: {},
    search: 
    {
        query: "",
        results: [],
        resultsPerPage: RESULTS_PER_PAGE,
        page: 1,
    },
    bookmarks: [],
}

export async function LoadRecipe(id)
{
    try
    {
        const data = await AJAX(`${API_URL}${id}?key=${DEVELOPER_KEY}`);
        state.recipe = CreateRecipeObject(data);
        if(state.bookmarks.some(bookmark => bookmark.id === id))
        {
            state.recipe.bookmark = true;
        }
        else
        {
            state.recipe.bookmark = false;
        }
    }
    catch(error)
    {
        console.warn(error.message)
        throw error;
    }
}

function CreateRecipeObject(data)
{
    const recipe = data.data.recipe;

    return {
            title: recipe.title,
            source_url: recipe.sourceUrl,
            image_url: recipe.image,
            publisher: recipe.publisher,
            cooking_Time: Number(recipe.cookingTime),
            servings: Number(recipe.servings),
            ingredients: recipe.ingredients,
            ...(recipe.key && {key: recipe.key}),
        };
}

export async function LoadSearchResults(query)
{
    try
    {
        state.search.query = query;
        const data = await AJAX(`${API_URL}?search=${query}&key=${DEVELOPER_KEY}`);
        state.search.results = data.data.recipes.map(recipe => 
        {
            return{
                id: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher,
                image: recipe.image_url,
                ...(recipe.key && {key: recipe.key}),
            }
        });
        state.search.page = 1;
    }
    catch(error)
    {
        console.warn(error);
        throw error;
    }
}

export function GetSearchResultsPage(page = state.search.page)
{
    state.search.page = page;

    const start = (page-1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;

    return state.search.results.slice(start,end);
}

export function UpdateServings(newServings)
{
    state.recipe.ingredients.forEach(ingredient => 
    {
        ingredient.quantity = ingredient.quantity * newServings / state.recipe.servings;
    });    
    state.recipe.servings = newServings;
}

export function AddBookmark(recipe)
{
    state.bookmarks.push(recipe);
    
    //Mark current recipe as bookmark
    if(recipe.id === state.recipe.id)
    {
        //Creating attribute
        state.recipe.bookmark = true;
    }
    PersistBookmarks();
}

export function RemoveBookmark(id)
{
    //Remove from the bookmarks array
    const index = state.bookmarks.findIndex(element => element.id == id);
    state.bookmarks.splice(index, 1);

    //Mark recipe as not bookmarked
    if(id === state.recipe.id) state.recipe.bookmark = false;
    PersistBookmarks();
}

function PersistBookmarks()
{
    localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
}

function Init()
{
    const storage = localStorage.getItem("bookmarks");
    if(!storage) return;
    state.bookmarks = JSON.parse(storage);
}

Init();

export const UploadRecipe = async function (newRecipe) {
    try {
      const ingredients = Object.entries(newRecipe)
        .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
        .map(ing => {
          const ingArr = ing[1].split(',').map(el => el.trim());
          if (ingArr.length !== 3)
            throw new Error(
              'Wrong ingredient fromat! Please use the correct format :)'
            );
  
          const [quantity, unit, description] = ingArr;
  
          return { quantity: quantity ? +quantity : null, unit, description };
        });
  
      const recipe = {
        title: newRecipe.title,
        image_url: newRecipe.image,
        source_url: newRecipe.sourceUrl,
        publisher: newRecipe.publisher,
        cooking_time: Number(newRecipe.cookingTime),
        servings: Number(newRecipe.servings),
        ingredients,
      };
      const data = await AJAX(`${API_URL}?key=${DEVELOPER_KEY}`, recipe);
      state.recipe = CreateRecipeObject(data);
      console.log(state.recipe);
      AddBookmark(state.recipe);
    } 
    catch (error) 
    {
      throw error;
    }
  };