const navMenu= document.getElementById('nav-menu')
const navToggle=document.getElementById('nav-toggle')
const navClose=document.getElementById('nav-close')


//header-toggle 

navToggle.addEventListener('click',()=>{
 navMenu.classList.add('show-menu')
})

navClose.addEventListener('click',()=>{
 navMenu.classList.remove('show-menu')
})

//carousel-slider

const slider = document.getElementById('slider');

function activate(e) {
    const items = document.querySelectorAll('.slider-item');
    e.target.matches('.next') && slider.append(items[0])
    e.target.matches('.prev') && slider.prepend(items[items.length - 1]);
}

document.addEventListener('click', activate);


//carousel

let navLinks = document.querySelectorAll(".carousel .nav-link");
let slides = document.querySelectorAll(".carousel .slides img");
let overlays = document.querySelectorAll(".carousel .bar");
let maxZIndex = navLinks.length;
let easeInOutQuart = "cubic-bezier(0.77, 0, 0.175, 1)";
slides[0].classList.add("active");
navLinks[0].classList.add("active");
navLinks.forEach((navLink, activeIndex) => {
  (overlays[activeIndex]).style.zIndex = `${navLinks.length -
    activeIndex}`;
  navLink.addEventListener("click", () => {
    // nav-link
    navLinks.forEach(navLink => navLink.classList.remove("active"));
    navLink.classList.add("active");
    // slide
    let currentSlide = document.querySelector(".carousel .slides img.active");
    let slideFadeOut = currentSlide.animate(
      [
        { transform: "translateX(0)", opacity: 1 },
        { transform: "translateX(5%)", opacity: 0 }
      ],
      {
        duration: 600,
        easing: "ease-in",
        fill: "forwards"
      }
    );
    slideFadeOut.onfinish = () => {
      slides.forEach(slide => slide.classList.remove("active"));
      let activeSlide = slides[activeIndex];
      activeSlide.classList.add("active");
      activeSlide.animate(
        [
          {
            transform: "translateX(-5%)",
            opacity: 0
          },
          {
            transform: "translateX(0)",
            opacity: 1
          }
        ],
        { duration: 600, easing: "ease-out", fill: "forwards" }
      );
    };
    // overlay
    maxZIndex += 1;
    let activeOverlay = overlays[activeIndex];
    (activeOverlay).style.zIndex = `${maxZIndex}`;
    activeOverlay.animate(
      [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
      { duration: 1200, fill: "forwards", easing: easeInOutQuart }
    );
  });
});


//  Api and Add to card  //

const closeCart = document.querySelector('.close');
const iconCart = document.querySelector('.icon-card');
const body = document.querySelector('body');

const slidesWrapper = document.querySelector('.slides-wrapper');
const listCartHTML = document.querySelector('.listCart');
const iconCartSpan = document.querySelector('.icon-card span');

let cart = [];
let products = [];
let currentSlide = 0;

// Toggle cart visibility
iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

// Fetch products from API
const fetchProducts = async () => {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) throw new Error('Network response was not ok');
        products = await response.json();
        addDataToHTML();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

// Add product data to HTML
const addDataToHTML = () => {
    slidesWrapper.innerHTML = '';

    if (products.length > 0) {
        let slideItem;
        products.forEach((product, index) => {
            // هر 6 محصول یک اسلاید جدید
            if (index % 6 === 0) {
                slideItem = document.createElement('div');
                slideItem.classList.add('slide-item');
                slidesWrapper.appendChild(slideItem);
            }

            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('product-item');
            newProduct.innerHTML = `
                <a href="product.html?id=${product.id}">
                    <img src="${product.image}" alt="">
                    <h2>${product.title}</h2>
                    <div class="price">$${product.price}</div>
                </a>
                <button class="addCart">Add To Cart</button>
            `;
            slideItem.appendChild(newProduct);
        });
    }
};

// اضافه کردن عملکرد دکمه‌های قبلی و بعدی
document.querySelector('.slide-next').addEventListener('click', () => {
    const totalSlides = document.querySelectorAll('.slide-item').length;
    if (currentSlide < totalSlides - 1) {
        currentSlide++;
        slidesWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
});

document.querySelector('.slide-prev').addEventListener('click', () => {
    if (currentSlide > 0) {
        currentSlide--;
        slidesWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
});

fetchProducts();

// Handle Add to Cart button click using event delegation
slidesWrapper.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addCart')) {
        let id_product = positionClick.parentElement.dataset.id;
        addToCart(id_product);
    }
});

// Add product to cart
const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if (cart.length <= 0) {
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    } else if (positionThisProductInCart < 0) {
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
    }
    addCartToHTML();
    addCartToMemory();
};

// Save cart to local storage
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

// Add cart data to HTML
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    let totalPrice = 0;

    if (cart.length > 0) {
        cart.forEach(item => {
            totalQuantity += item.quantity;
            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];

            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;
            newItem.innerHTML = `
            <div class="image">
                <img src="${info.image}">
            </div>
            <div class="name">
                ${info.title}
            </div>
            <div class="totalPrice">$${info.price * item.quantity}</div>
            <div class="quantity">
                <span class="minus"><</span>
                <span>${item.quantity}</span>
                <span class="plus">></span>
            </div>
            `;
            listCartHTML.appendChild(newItem);

            totalPrice += info.price * item.quantity;
        });
    }

    iconCartSpan.innerText = totalQuantity;

    let totalPriceDiv = document.createElement('div');
    totalPriceDiv.classList.add('total-price');
    totalPriceDiv.innerHTML = `<strong>Total Price: $${totalPrice.toFixed(2)}</strong>`;
    listCartHTML.appendChild(totalPriceDiv);
};

// Handle quantity change in cart
listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = positionClick.classList.contains('plus') ? 'plus' : 'minus';
        changeQuantityCart(product_id, type);
    }
});

// Change quantity of product in cart
const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
                break;
            default:
                let changeQuantity = cart[positionItemInCart].quantity - 1;
                if (changeQuantity > 0) {
                    cart[positionItemInCart].quantity = changeQuantity;
                } else {
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
};

// Initialize the app
const initApp = () => {
    fetchProducts();

    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
        addCartToHTML();
    }
};

initApp();
