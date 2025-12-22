let loadingInterval
let sliderInterval
let mealsData = []

function setCookie (name, value, days) {
  var expires = ''
  if (days) {
    var date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = name + '=' + value + expires + '; path=/'
}

function showLoading () {
  const el = document.getElementById('mealList')
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

function startSlider (meals) {
  const sliderEl = document.getElementById('slider')

  sliderEl.innerHTML = meals
    .map(function (meal, index) {
      return (
        '<img src="' +
        meal.strMealThumb +
        '" alt="' +
        meal.strMeal +
        '" class="' +
        (index === 0 ? 'active' : '') +
        '">'
      )
    })
    .join('')

  let currentIndex = 0
  const images = sliderEl.querySelectorAll('img')

  if (sliderInterval) {
    clearInterval(sliderInterval)
  }

  sliderInterval = setInterval(function () {
    images[currentIndex].classList.remove('active')
    currentIndex = (currentIndex + 1) % 4
    images[currentIndex].classList.add('active')
  }, 1500)
}

function GetMeals () {
  showLoading()

  fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood')
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      hideLoading()

      if (!data.meals || data.meals.length === 0) {
        document.getElementById('mealList').innerHTML =
          "<div class='error'>no meals found.</div>"
        return
      }

      mealsData = data.meals.slice(0, 4)
      startSlider(mealsData)
      displayMeals(mealsData)
    })
    .catch(function (error) {
      hideLoading()
      console.error('Error:', error)
      document.getElementById('mealList').innerHTML =
        "<div class='error'>error loading meals.</div>"
    })
}

function displayMeals (meals) {
  const el = document.getElementById('mealList')
  if (!el) return

  el.innerHTML =
    '<div class="meals">' +
    meals
      .map(function (meal) {
        return (
          '<div class="meal-card" onclick="goToDetails(\'' +
          meal.idMeal +
          '\')">' +
          '<img src="' +
          meal.strMealThumb +
          '" alt="' +
          meal.strMeal +
          '">' +
          '<h3>' +
          meal.strMeal +
          '</h3>' +
          '</div>'
        )
      })
      .join('') +
    '</div>'
}

function goToDetails (mealId) {
  setCookie('selectedMealId', mealId, 1)
  window.location.href = 'details.html'
}

document.addEventListener('DOMContentLoaded', GetMeals)
