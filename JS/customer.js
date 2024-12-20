import { qlspServices } from "../Controller/Services.js";


// ================================================= Customer ==================================================
const cart = document.getElementById('cart');

// Hàm hiển thị giỏ hàng
document.getElementById('btn-Cart').onclick = () => {
    cart.style.transform = 'translateX(0px)';
    cart.style.boxShadow = '0 0 20px gray';
}

// Hàm ẩn giỏ hàng
document.getElementById('close-cart').onclick = () => {
    cart.style.transform = 'translateX(500px)';
    cart.style.boxShadow = 'none';
}

// Sự kiện lọc theo iphone
document.getElementById('iphone').addEventListener('click', () => {
    getProductByType('iphone');
})

// Sự kiện lọc theo samsung
document.getElementById('samsung').addEventListener('click', () => {
    getProductByType('samsung');
})

// Sự kiện khi nhấn button Pay money
document.getElementById('checkout').addEventListener('click', () => {
    clearCart();
})


// Hàm lấy danh sách sản phẩm
const getListProducts = async () => {
    try {
        const result = await qlspServices.getListProducts();
        renderListProducts(result.data);
    } catch (error) {
        console.log('Lỗi lấy danh sách sản phẩm!', error)
    }
}

// Hàm lấy danh sách sản phẩm theo type
window.getProductByType = async (type) => {
    try {
        const result = await qlspServices.getListProducts();
        const [...data] = result.data;
        const arrProduct = data.filter(product => product.type === type);
        renderListProducts(arrProduct);
    } catch (error) {
        console.log('Lỗi lấy danh sách sản phẩm!', error)
    }
}

// Hàm render danh sách sản phẩm lên UI
let content = '';
const renderListProducts = (arrProducts) => {
    const productsList = document.getElementById('productsList-content');
    arrProducts.forEach(item => {
        content += `
             <div class="productsList-Item">
                <div class="product-img">
                    <img src=${item.img}
                        alt="Product">
                </div>
                <div class="product-content">
                    <div class="product-tiltle">
                        <p class="product-name">${item.name}</p>
                        <p class="product-price">${item.price}$</p>
                    </div>
                    <div class="btn-Button">
                        <button id="product-btnAddtoCart" onclick="addToCart('${item.id}','${item.img}','${item.name}','${item.price}')">
                            <i class="fa-solid fa-cart-shopping"></i>
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    productsList.innerHTML = content;
    content = '';
}


// Hàm render giỏ hàng
let cartItem = '';
const renderCart = (arrCart) => {
    const productsList = document.getElementById('cart-Products');
    if (arrCart) {
        arrCart.forEach(item => {
            cartItem += `
                 <tr>
                    <td>
                        <img src=${item.img}
                        alt="Product">
                    </td>
                    <td>${item.name}</td>
                    <td>${item.price}$</td>
                    <td>
                        <span><i class="fa-solid fa-minus" onclick="setQuantity('${item.id}', 'subtrack')"></i></span>
                        <span id="quantity">${item.quantity}</span>
                        <span><i class="fa-solid fa-plus" onclick="setQuantity('${item.id}', 'equal')"></i></span>
                    </td>
                    <td><i class="fa-solid fa-trash-can" onclick="deleteCart('${item.id}')"></i></td>
                </tr>
            `;
        });
        productsList.innerHTML = cartItem;
        cartItem = '';
    }
}


// Hàm thêm sản phẩm vào Giỏ Hàng và lưu vào localstorage
window.addToCart = (id, img, name, price) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const index = cart.findIndex(product => product.id === id);

    if (index === -1) {
        cart.push({
            id: id,
            img: img,
            name: name,
            price: price,
            quantity: 1
        });
    } else {
        cart[index].quantity += 1;
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart(cart);
    showQuantityCart();
    totalPrice();
}

// Hàm hiển thị tống số lượng trong giỏ hàng
const showQuantityCart = () => {
    const arrCart = JSON.parse(localStorage.getItem('cart'));
    let sumQuantity = 0;
    arrCart.forEach(item => {
        sumQuantity += item.quantity;
    });
    document.getElementById('count-Quantity-Cart').innerHTML = sumQuantity;
}

// Hàm xóa giỏ hàng
window.deleteCart = (id) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(product => product.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart(cart);
    showQuantityCart();
    totalPrice();
}

// Hàm tăng giảm quantity trong giỏ hàng
window.setQuantity = (id, type) => {
    const cart = JSON.parse(localStorage.getItem('cart') || []);
    const index = cart.findIndex(product => product.id === id);
    if (index >= -1) {
        if (type === 'equal') cart[index].quantity += 1;
        if (type === 'subtrack') {
            if (cart[index].quantity === 0) {
                deleteCart(product.id);
            }
            else {
                cart[index].quantity -= 1;
            }
        }
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart(cart);
    showQuantityCart();
    totalPrice();
}

// Hàm tính tổng tiền
const totalPrice = () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
    });

    document.getElementById('total-price').innerHTML = `${total}$`;
}

// Hàm clear tất cả sản phẩm trong giỏ hàng
window.clearCart = () => {
    localStorage.removeItem('cart');
    document.getElementById('count-Quantity-Cart').innerHTML = '0';
    document.getElementById('cart-Products').innerHTML = '';
}

// Hiển thị giỏ hàng và danh sách sản phẩm khi loadPage
const arrCart = JSON.parse(localStorage.getItem('cart'));
renderCart(arrCart);
getListProducts();
showQuantityCart();

