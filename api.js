// Mengambil Id dari HTMl agar bisa dilakukan manipulasi DOM pada Javascript
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const mealList = document.getElementById('mealList');
const modalContainer = document.querySelector('.modal-container');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipeCloseBtn');

// Event Listener apabila tombol search di klik
searchButton.addEventListener('click', async () => {
    // trim untuk menghilangkan spasi diawal atau diakhir (menghindari pencarian yang tidak diinginkan atau kesalahan)
    const ingredient = searchInput.value.trim();
    // Pengecekkan inputan agar tidak kosong
    if (ingredient) {
        const meals = await searchMealsByIngredient(ingredient); // Memanggil function searchMealsByIngredient dengan argumen ingredient yang diisikan user dalam bidang input
        displayMeals(meals); // Menampilkan resep yang sesuai dengan ingredient
    }
});

// Event Listener apabila resep  atau id dengan mealList di klik
mealList.addEventListener('click', async (e) => {
    const card = e.target.closest('.meal-item'); // Mencari elemen terdekat yang memiliki class meal-item 
    // Memeriksa apakah class meal-item ada atau tidak 
    if (card) {
        const mealId = card.dataset.id; // Mengambil nilai dari atribut id pada elemen tersebut dan dataset digunakan untuk mengakses data dari atribut
        const meal = await getMealDetails(mealId); // Memanggil function getMealDetails dengan mealId yang berisikan data dari resep yang ditekan
        if (meal) {
            showMealDetailsPopup(meal); // Apabila ditemukan, maka memanggil function showMealDetailsPopup
        }
    }
});

// Function untuk fetch meals by ingredient
async function searchMealsByIngredient(ingredient) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`); // Menunggu proses fetch 
        const data = await response.json(); // Mengubah hasil fetch menjadi bentuk JSON
        return data.meals;
    } catch (error) {
        // Menampilkan error di console apabila ada error
        console.error('Error fetching data:', error);
    }
}

// Function untuk fetch meal details by ID
async function getMealDetails(mealId) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`); // Menunggu proses fetch 
        const data = await response.json(); // Mengubah hasil fetch menjadi bentuk JSON 
        return data.meals[0]; // Mengembalikan data dari resep, [0] diasumsikan hanya satu makanan yang diharapkan
    } catch (error) {
        // Menampilkan error di console apabila ada error
        console.error('Error fetching meal details:', error);
    }
}

// Function untuk menampilkan resep didalam list
function displayMeals(meals) {
    mealList.innerHTML = ''; // Membersihkan daftar makanan sebelum menambahkan elemen baru
    if (meals) { // Jika meals memiliki nilai maka code didalam if akan dijalankan
        meals.forEach((meal) => {
            const mealItem = document.createElement('div'); // Membuat elemen div saat menampilkan resep dengan class meal-item
            mealItem.classList.add('meal-item');
            mealItem.dataset.id = meal.idMeal; // Menyimpan id makanan pada meal.idMeal 
            mealItem.innerHTML = 
            // Menampilkan gambar dan nama resep
            `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
            `;
            mealList.appendChild(mealItem);
        });
    } else {
        // Jika meals tidak memiliki nilai maka code didalam else akan dijalankan
        mealList.innerHTML = '<p>No meals found. Try another ingredient.</p>';
    }
}

// Function untuk membuat dan menampilkan detail resep pada popup
function showMealDetailsPopup(meal) {
    mealDetailsContent.innerHTML = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-img">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        </div>
        <div class="recipe-video">
            <a href="${meal.strYoutube}" target="_blank">Video Tutorial</a>
        </div>
    `;
    // Mengatur tampilan modalContainer menjadi block
    modalContainer.style.display = 'block';
}

// Event listener untuk menutup popup
recipeCloseBtn.addEventListener('click', closeRecipeModal);

// Function untuk menutup popup
function closeRecipeModal() {
    modalContainer.style.display = 'none';
}

// EventListener untuk bagian search apabila enter juga melakukan hal yang demikian seperti saat tombol search ditekan
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// Function performSearch untuk melakukan pencarian saat tombol enter ditekan
async function performSearch() {
    const ingredient = searchInput.value.trim(); // trim untuk menghapus spasi diawal dan diakhir
    if (ingredient) { // Apabila ingredient ditemukan saat menunggu function searchMealsByIngredient berjalan
        const meals = await searchMealsByIngredient(ingredient);
        displayMeals(meals); // maka akan menampilkan resep 
    }
}