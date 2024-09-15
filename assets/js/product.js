// assets/js/product.js

document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('product-form');
    const productsTable = document.getElementById('products-table').getElementsByTagName('tbody')[0];
    const uploadedImageDiv = document.getElementById('uploaded-image');

    // Load existing products
    loadProducts();

    // Handle product form submission
    productForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('product-name').value;
        const price = document.getElementById('product-price').value;
        const imageFile = document.getElementById('product-image').files[0];
        const imageUrl = URL.createObjectURL(imageFile);

        // Save product details to localStorage
        saveProduct(name, price, imageUrl);

        // Display the uploaded image
        uploadedImageDiv.innerHTML = `<img src="${imageUrl}" alt="${name}" width="100">`;

        // Reset form
        productForm.reset();

        // Reload products in table
        loadProducts();
    });

    function saveProduct(name, price, imageUrl) {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        products.push({ name, price, imageUrl });
        localStorage.setItem('products', JSON.stringify(products));
    }

    function loadProducts() {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        productsTable.innerHTML = products.map(product => `
            <tr>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td><img src="${product.imageUrl}" alt="${product.name}" width="100"></td>
                <td><button class="delete-product">Delete</button></td>
            </tr>
        `).join('');

        // Add event listener to delete buttons
        document.querySelectorAll('.delete-product').forEach((button, index) => {
            button.addEventListener('click', () => {
                deleteProduct(index);
            });
        });
    }

    function deleteProduct(index) {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        products.splice(index, 1);
        localStorage.setItem('products', JSON.stringify(products));
        loadProducts();
    }
});
