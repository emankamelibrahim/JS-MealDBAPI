let loadingInterval

function getCookie (name) {
  var nameEQ = name + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

function showLoading () {
  const el = document.getElementById('detailsContainer')
  loadingInterval = setInterval(function () {
    el.innerHTML = '<div class="loading">loading </div>'
  }, 400)
}

function hideLoading () {
  if (loadingInterval) {
    clearInterval(loadingInterval)
    loadingInterval = null
  }
}

function getMealDetails () {
  var mealId = getCookie('selectedMealId')

  if (!mealId) {
    document.getElementById('detailsContainer').innerHTML =
      "<div class='error'>No meal selected. <a href='home.html'>Go back to home</a></div>"
    return
  }

  showLoading()

  fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + mealId)
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      hideLoading()

      if (!data.meals || data.meals.length === 0) {
        document.getElementById('detailsContainer').innerHTML =
          "<div class='error'>Meal details not found.</div>"
        return
      }

      displayMealDetails(data.meals[0])
    })
    .catch(function (error) {
      hideLoading()
      console.error('Error:', error)
      document.getElementById('detailsContainer').innerHTML =
        "<div class='error'>Error loading meal details.</div>"
    })
}

function displayMealDetails (meal) {
  const el = document.getElementById('detailsContainer')
  var ingredients = []
  for (var i = 1; i <= 20; i++) {
    var ingredient = meal['strIngredient' + i]
    var measure = meal['strMeasure' + i]
    if (ingredient && ingredient.trim() !== '') {
      ingredients.push(
        '<div class="ingredient-item">' + measure + ' ' + ingredient + '</div>'
      )
    }
  }

  el.innerHTML =
    '<div class="details-page">' +
      '<button class="back-button" onclick="goBack()">Back</button>' +
      '<img src="' + meal.strMealThumb +'" alt="' +meal.strMeal +'">' +
      '<h2>' + meal.strMeal + '</h2>' +
      
      '<div class="info-section">' +
        '<h3>Ingredients</h3>' +
        '<div class="ingredients">' +
          ingredients.join('') +
        '</div>' +
      '</div>' +
      '<div class="info-section">' +
        '<h3>Instructions</h3>' +
        '<p>' + meal.strInstructions +  '</p>' +
      '</div>' +
    '</div>'
}

function goBack () {
  window.location.href = 'home.html'
}

document.addEventListener('DOMContentLoaded', getMealDetails)
