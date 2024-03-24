
var currentPage = 1;
var itemsPerPage = 5; // Điều chỉnh số lượng sản phẩm mỗi trang nếu cần
var totalPages 
async function fetchProductList() {
    var startIndex = (currentPage - 1) * itemsPerPage;
    var endIndex = startIndex + itemsPerPage;

    try {
        var response = await fetch("/api/list-user");
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
            <td><img src="${product.data.photoUrl}" alt="Product Thumb" style="max-width: 100px;"></td>
            <td>${product.data.displayName}</td>
            <td class="text-center">${product.data.email}</td>
            <td class="text-center">${product.data.phoneNumber}</td>
            <td class="text-center">${product.data.roomNumber}</td>
            <td class="text-center">
                <button class="btn btn-outline-primary"  onclick="openUpdateProductModal('${product.id}')">Update</button>
                <button class="btn bg-gradient-primary"  onclick="deleteProduct('${product.id}')">Delete</button>
            </td>
            
        `;

        tbody.appendChild(row);
    });
}


 // Function to handle the delete button click
 function deleteProduct(productId) {
    var isConfirmed = confirm('Are you sure you want to delete this user?');

    // Nếu người dùng xác nhận, thực hiện xóa
    if (isConfirmed) {
        // Send a DELETE request to the API endpoint
        var xhr = new XMLHttpRequest();
        xhr.open("DELETE", "/api/delete-user", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onload = function () {
            if (xhr.status === 200) {
                console.log('Product deleted successfully');
                // Fetch the updated product list after deletion
                fetchProductList();
            } else {
                console.error('Error deleting product:', xhr.responseText);
            }
        };

        xhr.send(JSON.stringify({ uid: productId }));
    }
}

function openAddProductModal() {
    document.getElementById('addProductModal').style.display = 'block';
}

// Function to close the modal for adding a new product
function closeAddProductModal() {
    document.getElementById('addProductModal').style.display = 'none';
}

function addProduct() {
    var email = document.getElementById('emailInput').value;
    var password = document.getElementById('passwordInput').value;

   
    var user = {
        email: email,
        password: password
    };
    fetch('/api/register-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(data => {
        // Xử lý dữ liệu response nếu cần
        fetchProductList();
        closeAddProductModal();
        console.log('Thêm sản phẩm thành công:', data);
    })
    .catch(error => {
        console.error('Lỗi khi thêm sản phẩm:', error.message);
    });
    
}


// Hàm tải lên một ảnh và trả về một promise chứa đường dẫn của ảnh
function uploadImage(file) {
    var formData = new FormData();
    formData.append('file', file);

    return fetch('/api/upload-image', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Image uploaded successfully:', data);
        return data.imageUrl;
    })
    .catch(error => {
        console.error('Error uploading image:', error.message);
        throw error;
    });
}


function openUpdateProductModal(productId) {
     // Gọi API để lấy thông tin sản phẩm dựa trên productId
     fetch(`/api/get-user?id=${productId}`)
     .then(response => {
         if (!response.ok) {
             throw new Error(`HTTP error! Status: ${response.status}`);
         }
         return response.json();
     })
     .then(userData => {
         // Điền thông tin sản phẩm vào form cập nhật
         document.getElementById('updateId').value = productId;
         document.getElementById('updateTitleInput').value = userData.displayName;
         document.getElementById('updatePriceInput').value = userData.email;
         document.getElementById('updateDescriptionInput').value = userData.phoneNumber;
         document.getElementById('updateRoomNumber').value = userData.roomNumber;

         document.getElementById('updateThumb').src = userData.photoUrl;
     
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
    var fileInput = document.getElementById('updateThumbInput');
  
    const id = document.getElementById('updateId').value ;
    const title = document.getElementById('updateTitleInput').value;
    const price = document.getElementById('updatePriceInput').value;
    const description = document.getElementById('updateDescriptionInput').value ;
    const roomNumber = document.getElementById('updateRoomNumber').value ;
    const photoUrl = document.getElementById('updateThumb').src ;



    // Prepare the data for the request
    const updatedUserData = {
        id: id,
        displayName: title,
        email: price,
        phoneNumber: description,
        roomNumber: roomNumber,
        photoUrl:photoUrl
    };
    var fetchPromises = [];
    // Check if list images are selected
    if (fileInput.files.length > 0) {
        var imagesPromise = uploadImage(fileInput.files[0])
            .then(thumbUrl => {

                const image = {
                    id: id,
                displayName: title,
        email: price,
        phoneNumber: description,
        roomNumber: roomNumber,
        photoUrl:thumbUrl
                };

                fetch('/api/update-user', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(image)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(updatedUser => {
                    // Handle success (e.g., display a success message)
                    console.log('User updated successfully:', updatedUser);
                    
                })
                .catch(error => {
                    // Handle errors (e.g., display an error message)
                    console.error('Error updating user:', error);
                });
            });
        fetchPromises.push(imagesPromise);
    }
    

    // Make the API call
    var apiPromise = fetch('/api/update-user', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUserData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(updatedUser => {
        // Handle success (e.g., display a success message)
        console.log('User updated successfully:', updatedUser);
        
    })
    .catch(error => {
        // Handle errors (e.g., display an error message)
        console.error('Error updating user:', error);
    });
    fetchPromises.push(apiPromise);


    Promise.all(fetchPromises)
        .then(() => {
        
            fetchProductList();
            closeUpdateProductModal();
            
        })
        .catch(error => {
            console.error('Error during fetch calls:', error.message);
        });

    
}
// Fetch the product list when the page loads
document.addEventListener("DOMContentLoaded", function () {
    fetchProductList();
    
});