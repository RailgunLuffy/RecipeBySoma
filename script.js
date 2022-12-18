const mealImgDiv = document.getElementById('image-of-meal')
const mealNameDiv = document.getElementById('name-of-meal')
const mealTagDiv = document.getElementById('meal-tag')
const searchInput = document.getElementById('search')
const searchBtn = document.getElementById('search-btn')
const favDiv = document.getElementById('fav-list')
const lovBtn = document.getElementById('love-btn')
const popupDiv = document.getElementById('popup_container')
const recipeDetailDiv = document.getElementById('recipe_detail')


let favMeals = []
let isLike = false

const showMeal = (image, name, tag) => {
    // if (!favMeals.length) {
    //     document.getElementById('fav-div').style.display = 'none'
    // }
    // else {
    //     document.getElementById('fav-div').style.display = 'block'
    // }

    lovBtn.style.color = '#ddd'
    favMeals.forEach((meal) => {
        if (name == meal.name) {
            lovBtn.style.color = 'rgb(240, 132, 150)'
            tag = 'Favourite'
            return
        }
    })
    mealTagDiv.innerText = `${tag} Recipe`
    mealImgDiv.innerHTML = `<img id="result-img" src="${image}" alt="" onclick="popupRcipe('${name}')" >`
    mealNameDiv.innerText = name
}

const randomRecipe = async () => {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    const data = await response.json()

    showMeal(data.meals[0].strMealThumb, data.meals[0].strMeal, 'Random')
}

const searchRecipe = async (recipe, tag = 'Searched') => {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipe}`)
    const data = await response.json()

    showMeal(data.meals[0].strMealThumb, data.meals[0].strMeal, tag)
}

const showFavMeal = (changeTag = true) => {
    if (!favMeals.length) {
        document.getElementById('fav-div').style.display = 'none'
    }
    else {
        document.getElementById('fav-div').style.display = 'block'
    }
    favDiv.innerHTML = ''

    if (changeTag) {
        if (isLike) {
            lovBtn.style.color = 'rgb(240, 132, 150)'
            mealTagDiv.innerText = 'Favourite Recipe'

        }
        else {
            lovBtn.style.color = '#ddd'
            mealTagDiv.innerText = 'Recipe'

        }
    }
    favMeals.forEach((meal) => {
        favDiv.innerHTML +=
            `<li>
                <button onclick="closeBtnFun('${meal.name}')" class="x-btn"><i class="fa-solid fa-xmark"></i></button>
                <img src="${meal.image}" alt="" onclick="searchRecipe('${meal.name}', 'Favourite')">
                <span id="${meal.name}">${meal.name}</span>
            </li>`
    })
}

randomRecipe()

searchBtn.addEventListener('click', (e) => {
    isLike = false
    searchRecipe(searchInput.value)
})

searchInput.addEventListener('keypress', (e) => {
    isLike = false
    if (e.key == "Enter")
        searchRecipe(searchInput.value)
})

lovBtn.addEventListener('click', (e) => {
    let isTrue = true
    favMeals.forEach((meal) => {
        if (mealNameDiv.innerText == meal.name) {
            isTrue = false
            return
        }
    })
    if (!isLike && isTrue) {
        isLike = true
        favMeals.push({ name: mealNameDiv.innerText, image: document.getElementById('result-img').src })
        showFavMeal()
    }
    else if (!isTrue) {
        isLike = false
        favMeals = favMeals.filter(meal => meal.name !== mealNameDiv.innerText)
        showFavMeal()
    }
    else {
        isLike = false
        favMeals.pop()
        showFavMeal()
    }
})

const closeBtnFun = (name) => {
    isLike = false

    favMeals = favMeals.filter(meal => meal.name !== document.getElementById(name).innerText)

    document.getElementById(name).innerText == mealNameDiv.innerText ? showFavMeal() : showFavMeal(false)
}

const popupRcipe = async (name) => {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
    const data = await response.json()

    popupDiv.style.display = 'block'

    let n = data.meals[0].strYoutube.lastIndexOf('=')
    const youtubeLink = data.meals[0].strYoutube.substring(n + 1)
    // console.log(data.meals[0].strYoutube, youtubeLink)

    const meal = data.meals[0]

    let ingredient = ''

    let k = 1

    while (meal['strIngredient' + k]) {
        ingredient += `<li>${meal['strIngredient' + k]}:    ${meal['strMeasure' + k]}</li>`
        k++
    }

    recipeDetailDiv.innerHTML = `
    <button class="x-btn-popup" onclick="closePopupBtn()"><i class="fa-solid fa-xmark"></i></button>
    <br>
    <div style="display:flex;justify-content:center;">
    <iframe src="https://www.youtube.com/embed/${youtubeLink}" frameborder="0" allowfullscreen></iframe></div> <br><br>

    <h4>Cuisine: ${data.meals[0].strArea}</h4><br>
    <h4>Category: ${data.meals[0].strCategory}</h4><br>

    <h4>Ingredients:</h4>
    <ol style="margin-left:20px;">
        ${ingredient}
    </ol>
    <br>

    <h4>Instructions:</h4>
    <p>
        ${data.meals[0].strInstructions}
    </p>
    `
}

const closePopupBtn = () => {
    popupDiv.style.display = 'none'
}