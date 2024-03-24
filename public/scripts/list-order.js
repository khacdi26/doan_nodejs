
var currentPage = 1;
var itemsPerPage = 5; // Điều chỉnh số lượng sản phẩm mỗi trang nếu cần
var totalPages 
async function fetchProductList() {
    var startIndex = (currentPage - 1) * itemsPerPage;
    var endIndex = startIndex + itemsPerPage;

    try {
        var response = await fetch("/api/list-order");
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        var productList = await response.json();
        totalPages = Math.ceil(productList.length / itemsPerPage);
        updateTable(productList.slice(startIndex, endIndex));
        updatePageNumbers(productList.length);
    } catch (error) {
        console.error("Lỗi khi fetch danh sách sản phẩm:", error.message);
    }

    var prevPageButton = document.getElementById("prevPage");
    var nextPageButton = document.getElementById("nextPage");

    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;
}

function updatePageNumbers(totalItems) {
    
    var pageNumbers = document.getElementById("pageNumbers");
    pageNumbers.innerHTML = `Trang ${currentPage} / ${totalPages}`;
}

function nextPage() {
    currentPage++;
    fetchProductList();
}

function prevPage() {
    currentPage--;
    fetchProductList();
}
// Function to make API request and update the table
// function fetchProductList() {
//     var xhr = new XMLHttpRequest();
//     xhr.open("GET", "/api/list-product", true);

//     xhr.onload = function () {
//         if (xhr.status === 200) {
//             var productList = JSON.parse(xhr.responseText);
//             updateTable(productList);
//         }
//     };

//     xhr.send();
//     var prevPageButton = document.getElementById("prevPage");
//     var nextPageButton = document.getElementById("nextPage");

//     prevPageButton.disabled = currentPage === 1;
//     nextPageButton.disabled = currentPage === totalPages;
// }

// Function to update the table with product list
function updateTable(productList) {
    var tbody = document.getElementById("product-list-body");

    // Clear existing rows
    tbody.innerHTML = "";

    // Iterate through the product list and append rows to the table
    productList.forEach(function (product) {
        var row = document.createElement("tr");

        // Assuming each product has properties: thumb, title, price, description
        row.innerHTML = `
            <td>${product.data.orderID}</td>
            <td class="text-center">${product.data.roomId}</td>
            <td class="text-center">${product.data.payment}</td>
            <td class="text-center">${product.data.status}</td>
            <td class="text-center">${product.data.totalPrice}</td>
            <td class="text-center">${product.data.dateTime}</td>
            
            <td class="text-center">
                <button class="btn btn-outline-primary"  onclick="openUpdateProductModal('${product.id}')">Update</button>
            </td>
            
        `;

        tbody.appendChild(row);
    });
}
// Function to truncate description to a specified length
function truncateDescription(description, maxLength) {
    return description.length > maxLength ? description.substring(0, maxLength) + '...' : description;
}

 // Function to handle the delete button click

function openUpdateProductModal(productId) {
     // Gọi API để lấy thông tin sản phẩm dựa trên productId
     fetch(`/api/get-order?id=${productId}`)
     .then(response => {
         if (!response.ok) {
             throw new Error(`HTTP error! Status: ${response.status}`);
         }
         return response.json();
     })
     .then(productData => {
         // Điền thông tin sản phẩm vào form cập nhật
         document.getElementById('updateId').value = productId;
         document.getElementById('updateStatus').value = productData.status;
     
         // Điền các trường khác tương ứng với cấu trúc dữ liệu thực tế của bạn

         // Mở modal cập nhật
         document.getElementById('overlay').style.display = 'block';
         document.getElementById('updateProductModal').style.display = 'block';
         var addProductLink = document.getElementById('addProduct');
         addProductLink.style.display = 'none';
     })
     .catch(error => {
         console.error('Lỗi khi gọi API để lấy thông tin sản phẩm:', error);
     });
}
function closeUpdateProductModal() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('updateProductModal').style.display = 'none';
    var addProductLink = document.getElementById('addProduct');
    addProductLink.style.display = 'block';
}
function updateProduct(){
// Đặt endpoint API cập nhật đơn hàng
var id = document.getElementById('updateId').value;
var status = document.getElementById('updateStatus').value;
// Dữ liệu mới bạn muốn cập nhật
const updatedData = {
    id: id, // ID đơn hàng cần cập nhật
    status: status, // Trạng thái mới của đơn hàng
    // ...Thêm thông tin cập nhật khác nếu cần
};

// Gọi API cập nhật đơn hàng bằng phương thức PUT hoặc PATCH
fetch('/api/update-order', {
    method: 'PUT', // Hoặc 'PATCH' tùy thuộc vào yêu cầu của API
    headers: {
        'Content-Type': 'application/json',
        // Các header khác nếu cần
    },
    body: JSON.stringify(updatedData),
})
.then(response => {
    if (!response.ok) {
        throw new Error('Có lỗi khi cập nhật đơn hàng');
    }
    return response.json();
})
.then(data => {
    console.log('Đã cập nhật đơn hàng:', data);
    fetchProductList();
            closeUpdateProductModal();
})
.catch(error => {
    console.error('Lỗi khi gọi API cập nhật đơn hàng:', error);
});
    
}
// Fetch the product list when the page loads
document.addEventListener("DOMContentLoaded", function () {
    fetchProductList();
    
});