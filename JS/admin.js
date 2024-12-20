import { qlspServices } from "../Controller/Services.js";
import { Validation } from "../Controller/Validation.js";
import { Product } from "../Model/Products.js";
// =================================================== Admin ====================================================
const addPhone = document.getElementById('add-Phone');
const popup = document.getElementById('popup');
const productForm = document.getElementById('productForm');
const btnClose = document.getElementById('btnClose');

let productID;

// Xử lý sự kiện submit form
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Xử lý trạng thái form Thêm hay Sửa
    try {
        //lấy dữ liệu từ modal
        const product = getData_fromModal();
        const action = productForm.getAttribute('action');
        if (action === 'add') {
            if (checkValidation(product)) {
                await qlspServices.addNewProduct(product);
                popup.style.display = 'none';
            }
        }
        if (action === 'update') {
            if (checkValidation(product)) {
                await qlspServices.upadteProduct(productID, product);
                popup.style.display = 'none';
            }
        }
        getListProducts();
    } catch (error) {
        console.log('Lỗi cập nhật sản phẩm.', error);
    }
})

// Hàm check validation
const checkValidation = (product) => {
    const validation = new Validation();
    let isValid = true;

    isValid &= validation.required(product.name, '*Please enter product name!', 'errorName');
    // isValid &= validation.required(product.price, '*Please enter product price!', 'errorPrice');
    isValid &= validation.required(product.screen, '*Please enter product screen!', 'errorScreen');
    isValid &= validation.required(product.backCamera, '*Please enter backcamera!', 'errorBack');
    isValid &= validation.required(product.frontCamera, '*Please enter fontcamera!', 'errorFront');
    isValid &= validation.required(product.img, '*Please enter product image!', 'errorImg');
    isValid &= validation.required(product.desc, '*Please enter product description!', 'errorDesc');

    isValid &= validation.checkPrice(parseInt(product.price), '*Price must be greater than 0!', 'errorPrice');

    return isValid;
}


//Hàm hiển thị popup khi nhấn vào button AddPhone
addPhone.addEventListener('click', () => {
    popup.style.display = 'block';
    productForm.setAttribute('action', 'add');

    const modal = document.querySelectorAll('#productForm input, #productForm textarea')
    modal.forEach((element) => {
        element.value = '';
    })
})

//Hàm đóng popup khi nhấn vào button Close
btnClose.addEventListener('click', () => {
    productForm.setAttribute('action', '');
    popup.style.display = 'none';
})

// Sự kiện tìm kiếm khi nhập tên sản phẩm vào input
document.getElementById('txtSearch').addEventListener('change', () => {
    const value = document.getElementById('txtSearch').value.trim();
    getProductByName(value);
})
// Sự kiện tìm kiếm khi nhấn vào button Tìm Kiếm
document.getElementById('btnSearch').addEventListener('click', () => {
    const value = document.getElementById('txtSearch').value.trim();
    getProductByName(value);
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
getListProducts();

// Hàm lấy thông tin sản phẩm theo ID
window.getProductByID = async (id) => {
    try {
        // gán id vào biến để chỉnh sửa
        productID = id;
        // lấy nhân viên theo id
        const result = await qlspServices.getProductByID(id);
        renderModal(result.data);
        popup.style.display = 'block';
        productForm.setAttribute('action', 'update');
    } catch (error) {
        console.log('Lỗi lấy thông tin sản phẩm.', error);
    }
}

// Hàm xóa sản phẩm
window.deleteProduct = async (id) => {
    try {
        await qlspServices.deleteProduct(id);
        getListProducts();
    } catch (error) {
        console.log('Lỗi xóa sản phẩm.', error);
    }
}

// Hàm tìm kiếm sản phẩm theo name
const getProductByName = async (name) => {
    try {
        const result = await qlspServices.getProductByName(name);
        if (result) renderListProducts(result.data);
    } catch (error) {
        console.log('Lỗi lấy danh sách sản phẩm!', error)
    }
}

// Sắp xếp sản phẩm theo giá
const sortProducts = () => {
    // renderListProducts(copyProducts.sort('price'));
}

// Hàm render danh sách sản phẩm lên UI
let content = '';
const renderListProducts = (arrProducts) => {
    const productsList = document.getElementById('productList-tbody');
    if (arrProducts) {
        arrProducts.forEach(item => {
            content += `
                 <tr>
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.price}$</td>
                    <td>${item.screen}</td>
                    <td>${item.backCamera}</td>
                    <td>${item.frontCamera}</td>
                    <td>
                        <img src=${item.img} alt=${item.desc}>
                    </td>
                    <td>${item.desc}</td>
                    <td>
                        <div>
                            <button class="btn-Update" onclick='getProductByID(${item.id})'>Update</button>
                            <button class="btn-Delete" onclick='deleteProduct(${item.id})'>Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        });
    }
    else {
        content = 'Không có dữ liệu!'
    }
    productsList.innerHTML = content;
    content = '';
}

// Hàm render sản phẩm lên modal
const renderModal = (product) => {
    const { name, price, screen, backCamera, frontCamera, img, desc, type } = product;
    const modal = document.querySelectorAll('#productForm input, #productForm textarea,#productForm select')

    modal.forEach((element, index) => {
        switch (index) {
            case 0: element.value = name; break;
            case 1: element.value = price; break;
            case 2: element.value = screen; break;
            case 3: element.value = backCamera; break;
            case 4: element.value = frontCamera; break;
            case 5: element.value = img; break;
            case 6: element.value = desc; break;
            // kiểm tra type
            case 7:
                const option = element.querySelectorAll('#productForm option');
                if (type === 'iphone') {
                    option[0].selected = true;
                    break;
                }
                if (type === 'samsung') {
                    option[1].selected = true;
                    break;
                }
        }
    })

    // Block hết thông báo lỗi
    const messageError = document.querySelectorAll('#productForm p');
    messageError.forEach(element => {
        element.style.display = 'none';
    });
}

// Hàm lấy thông tin sản phẩm từ modal
const getData_fromModal = () => {
    const product = {};
    const modal = document.querySelectorAll('#productForm input, #productForm textarea,#productForm select')
    modal.forEach(element => {
        const { id, value } = element;
        product[id] = value;
    })

    return new Product(product.productName, parseInt(product.productPrice), product.productScreen, product.productBackCamera, product.productFontCamera, product.productImage, product.productDescription, product.productType);
}