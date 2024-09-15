// assets/js/public-products.js

document.addEventListener('DOMContentLoaded', () => {
    const productListContent = document.getElementById('product-list-content');

    function loadProducts() {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        productListContent.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.imageUrl}" alt="${product.name}" width="200">
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
            </div>
        `).join('');
    }

    loadProducts();
});
