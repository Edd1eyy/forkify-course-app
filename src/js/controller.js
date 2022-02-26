import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeViews.js';
import searchView from './views/searchViews.js';
import resultsView from './views/resultsViews.js';
import bookmarksView from './views/bookmarksViews.js';
import paginationView from './views/paginationViews.js';
import addRecipeView from './views/addRecipeViews.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.loadSpinner();
    // 0: update results view to mark chosen
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1: loading recipe:
    await model.loadRecipe(id);

    // 2: rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.loadSpinner();

    const query = searchView.getQuery();
    if (!query) return;

    await model.loadSerchResults(query);

    resultsView.render(model.getSearchResultsPage());

    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (gotoPage) {
  resultsView.render(model.getSearchResultsPage(gotoPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // add bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // update bookmarks
  recipeView.update(model.state.recipe);
  // render bookmarks view
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecpe) {
  try {
    addRecipeView.loadSpinner();

    // 1: upload recipe
    await model.uploadRecipe(newRecpe);
    console.log(model.state.recipe);

    // 2: rendering recipe
    recipeView.render(model.state.recipe);

    addRecipeView.rendersuccess();

    bookmarksView.render(model.state.bookmarks);

    // change id un url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // 3: close uploading form
    setTimeout(function () {
      addRecipeView.toggleView();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmak(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
