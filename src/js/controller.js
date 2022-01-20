import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2
// /////////////////////////////////////
/* Improvements to implement

- Display number of pages between pagination buttons;
- Ability to sort search results by duration or number of ingredients (Easier to implement by changing the API, otherwise it's a lot of work)
- Perform validation of ingredients in view, before submitting
- Improve input of ingredients by adding fields for each characteristics

Adittional Features:
- Shopping list features: Button on recipe to add ingredients to a list
- Weekly meal planning feature: Assign recipes to the next 7 days and show on weekly calendar
- Get nutrition data from an API (recommended: spoonacular API) and calculate total calories of recipe

*/

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    // Loader Spinner
    recipeView.renderSpinner();
    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    // Update bookmarks view
    bookmarksView.update(model.state.bookmarks);
    // Load recipe data
    await model.loadRecipe(id);
    // Render recipe
    recipeView.render(model.state.recipe);
    console.log(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // Get search query
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();
    // Load search results
    await model.loadSearchResults(query);
    // Render results
    resultsView.render(model.getSearchResultsPage());

    // Render pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServing = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // Update the recipe view (Only the ingredients)
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // Update recipe view
  recipeView.update(model.state.recipe);
  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();
    // Upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Display Success Message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in url: History API
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, 1000 * MODAL_CLOSE_SEC);
  } catch (err) {
    console.log(err, '🚩🚩');
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServing);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
