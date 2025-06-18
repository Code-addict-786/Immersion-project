// Get references to DOM elements
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const errorMsg = document.getElementById('errorMsg');
const productList = document.getElementById('productList');
const sortSelect = document.getElementById('sortSelect');

// Global variable to store current products
let currentProducts = [];

// Function to validate input (not empty or whitespace)
function isValidInput(value) {
  return value && value.trim().length > 0;
}

// Function to render products
function renderProducts(products) {
  productList.innerHTML = ''; // Clear previous results
  if (products.length === 0) {
    productList.innerHTML = '<p>No products found.</p>';
    return;
  }
  
  // Get current sort selection
  const sortOrder = sortSelect.value;
  
  // Sort products based on selection
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === 'low-to-high') {
      return a.price - b.price; // Ascending order
    } else {
      return b.price - a.price; // Descending order
    }
  });
  
  sortedProducts.forEach(product => {
    // Create product card
    const card = document.createElement('div');
    card.className = 'product-card';

    // Product image
    const img = document.createElement('img');
    img.src = product.thumbnail || product.images[0] || '';
    img.alt = product.title;

    // Product name/title
    const title = document.createElement('div');
    title.className = 'product-title';
    title.textContent = product.title;

    // Product price
    const price = document.createElement('div');
    price.className = 'product-price';
    price.textContent = '$' + product.price;

    // Append elements to card
    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(price);

    // Append card to product list
    productList.appendChild(card);
  });
}

// Function to fetch and display all products
function fetchAllProducts() {
  fetch('https://dummyjson.com/products')
    .then(res => res.json())
    .then(data => {
      currentProducts = data.products;
      renderProducts(currentProducts);
    })
    .catch(() => {
      productList.innerHTML = '<p>Error loading products.</p>';
    });
}

// Function to search products
function searchProducts(query) {
  fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      currentProducts = data.products;
      renderProducts(currentProducts);
    })
    .catch(() => {
      productList.innerHTML = '<p>Error searching products.</p>';
    });
}

// Handle form submission
searchForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent page reload
  const query = searchInput.value;
  if (!isValidInput(query)) {
    errorMsg.textContent = 'Please enter a valid search term.';
    return;
  }
  errorMsg.textContent = '';
  searchProducts(query);
});

// Handle sort selection change
sortSelect.addEventListener('change', function() {
  if (currentProducts.length > 0) {
    renderProducts(currentProducts);
  }
});

// On page load, fetch all products
window.onload = fetchAllProducts;