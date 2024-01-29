// Mengambil Id dari HTMl agar bisa dilakukan manipulasi DOM pada Javascript
const recipes = [];
let editingIndex = null; // editingIndex untuk mengecek apakah dalam mode edit atau tidak
const recipeName = document.getElementById('recipeName')
const ingredients = document.getElementById('ingredients');
const steps = document.getElementById('steps')
const imageInput = document.getElementById('image');
const recipeList = document.getElementById('recipeList');
const addRecipeModalForm = document.getElementById('addRecipeModal');
const recipeDetailsModal = document.getElementById('recipeDetailsModal')
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const imageDisplay = document.getElementById('imageDisplay');
const addRecipeButton = document.getElementById('addRecipeButton');
const recipeCloseFormButton = document.getElementById('recipeCloseFormButton');
const recipeCloseDetailsButton = document.getElementById('recipeCloseDetailsButton');

// Function untuk menyimpan resep yang akan di tambahkan atau di perbaharui
function saveRecipe() {
  // Mengambil value dari inputan
  const recipeNameValue = recipeName.value;
  const ingredientsValue = ingredients.value;
  const stepsValue = steps.value;
  const imageFile = imageInput.files[0];

  // Pengecekkan apabila semua inputan kosong, maka akan alert('Formulir Tidak Boleh Kosong')
  if (recipeNameValue === "" && ingredientsValue === "" && stepsValue === "" && (!imageFile || imageFile.size === 0)) {
    alert("Formulir Tidak Boleh Kosong")
    return; // Lalu di return 
  }
  
  // editingIndex untuk mengecek apakah dalam mode edit atau tidak 
  if (editingIndex !== null) { // apabila editingIndex tidak null, maka akan dianggap sedang dalam mode edit
    // Jika sedang dalam mode edit, perbarui resep yang ada
    recipes[editingIndex] = {
      name: recipeNameValue,
      ingredients: ingredientsValue,
      steps: stepsValue,
      image: imageFile ? URL.createObjectURL(imageFile) : '' 
    };
    // setelah memperbarui resep yang ada, setelah itu mengubah editingIndex menjadi null lagi agar keluar dari mode edit
    editingIndex = null;
  } else {
    // Jika tidak dalam mode edit / editingIndex == null maka tambahkan resep baru
    const newRecipe = {
      name: recipeNameValue,
      ingredients: ingredientsValue,
      steps: stepsValue,
      image: imageFile ? URL.createObjectURL(imageFile) : '' 
    };
    recipes.push(newRecipe); // Menambahkan array of object yang disimpan oleh newRecipe ke dalam array dari recipes
  }
  
  // Menampilkan resep setelah penambahan atau pembaharuan
  renderRecipeList();
  // Mengosongkan form pengisian
  clearForm();
  // Lalu menutup form pengisian
  closeRecipeForm();
}

// Function untuk menampilkan list dari resep 
function renderRecipeList() {
  recipeList.innerHTML = ''; // Membersihkan daftar resep sebelum menambahkan elemen baru
  
  // Menampilkan setiap elemen didalam array dari recipes
  recipes.forEach((recipe, index) => {
    const listItem = document.createElement('div'); // saat menampilkan membuat elemen div yang disimpan didalam listItem
    listItem.classList.add('meal-item') // lalu menambahkan class meal-item
    listItem.innerHTML = `
    <img src="${recipe.image}" alt="${recipe.name}">
    <h3>${recipe.name}</h3>
    <div class="button-group">
      <button type="button" onclick="editRecipe(${index})">Edit</button>
      <button type="button" onclick="deleteRecipe(${index})">Delete</button>
    </div>
    `;
    recipeList.appendChild(listItem); // setelah semua elemen dibuat, maka elemen tersebut akan ditambahkan kedalam recipeList menggunakan metode appendChild 
    // metode appendChild digunakan pada DOM untuk menambahkan elemen sebagai anak dari elemen lain
  });
}

// Function untuk menampilkan detail dari resep 
function displayRecipeDetails(index) {
  const recipe = recipes[index];

  recipeDetailsContent.innerHTML = `
    <h2 class="recipe-title">${recipe.name}</h2>
    <p class="recipe-category">Ingredients:</p>
    <p class="recipe-ingredients">${recipe.ingredients}</p>
    <div class="recipe-instructions">
      <h3>Steps:</h3>
      <p>${recipe.steps}</p>
    <div class="recipe-img">
        <img src="${recipe.image}" alt="${recipe.name}">
    </div>
  `;

  // form detail dari resep ditampilkan 
  recipeDetailsModal.style.display = 'block';
}


// Function untuk menghapus resep dengan method splice
function deleteRecipe(index) {
  recipes.splice(index, 1);
  // lalu menampilkan lagi list dari resep setelah proses penghapusan 
  renderRecipeList();
}

// function untuk mengedit resep
function editRecipe(index) {
  const recipe = recipes[index];
  recipeName.value = recipe.name;
  ingredients.value = recipe.ingredients;
  steps.value = recipe.steps;
  
  // Inputan image / gambar dikosongkan
  imageInput.value = '';
  
  // Apabila resep sebelumnnya ada gambar, maka tampilkan 
  if (recipe.image) {
    imageInput.previousValue = recipe.image;
    imageDisplay.src = recipe.image;
  }
  
  // editingIndex mendapatkan index saat tombol edit di tekan 
  editingIndex = index;
  // Menampilkan form pengisian informasi resep
  showRecipeForm();
}

// function untuk menampilkan form pengisian informasi resep
function showRecipeForm() {
  clearForm();
  imageDisplay.src = ''; 
  addRecipeModalForm.style.display = 'block'
}

// function untuk menutup form pengisian informasi resep
function closeRecipeForm() {
  addRecipeModalForm.style.display = 'none'

}

// function untuk menutup form detail dari resep
function closeRecipeDetailsForm() {
  recipeDetailsModal.style.display = 'none'
}

// function untuk mengosongkan inputan pada form pengisian informasi resep
function clearForm() {
    document.getElementById('recipeName').value = '';
    document.getElementById('ingredients').value = '';
    document.getElementById('steps').value = '';
    document.getElementById('image').value = '';
}

// Event Listener apabila resep ditekan 
recipeList.addEventListener('click', function (event) {
  // Memastikan bahwa yang diklik adalah elemen dengan class 'meal-item'
  if (event.target.classList.contains('meal-item')) {
    // Mendapatkan index resep dari elemen parent (meal-item)
    const index = Array.from(event.target.parentNode.children).indexOf(event.target);
    displayRecipeDetails(index);
  }
});

// Event Listener apabila tombol close pada form pengisian informasi resep di klik 
recipeCloseFormButton.addEventListener('click', closeRecipeForm);
// Event Listener apabila tombol close pada form detail dari resep di klik 
recipeCloseDetailsButton.addEventListener('click', closeRecipeDetailsForm);
// Event Listener apabila tombol "Add Your Own Recipe" di klik 
addRecipeButton.addEventListener('click', showRecipeForm);

// Dimulai dengan menampilkan list dari resep (jika ada)
renderRecipeList();

