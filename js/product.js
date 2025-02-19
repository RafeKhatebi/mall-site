let productImage = document.querySelector('.product-image');
let productTitle = document.querySelector('.product-title');
let productPrice = document.querySelector('.product-price');
let productDescription = document.querySelector('.product-description');
let addToCartButton = document.querySelector('.add-to-cart');
let backButton = document.querySelector('.back-button');
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];

// بارگذاری محصولات از API
const fetchProducts = async () => {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) throw new Error('Network Error');
        products = await response.json();
        displayProduct();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

// نمایش اطلاعات محصول
const displayProduct = () => {
    let productId = new URLSearchParams(window.location.search).get('id');
    let product = products.find(p => p.id == productId);

    if (product) {
        productImage.src = product.image;
        productTitle.textContent = product.title;
        productPrice.textContent = `$${product.price}`;
        productDescription.textContent = product.description;

        addToCartButton.addEventListener('click', () => addToCart(productId));
    }
};



// برگشت به صفحه محصولات
backButton.addEventListener('click', () => {
    window.location.href = 'index.html'; // آدرس صفحه محصولات
});

fetchProducts();


