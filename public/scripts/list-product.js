
var currentPage = 1;
var itemsPerPage = 5; // Điều chỉnh số lượng sản phẩm mỗi trang nếu cần
var totalPages 
async function fetchProductList() {
    var startIndex = (currentPage - 1) * itemsPerPage;
    var endIndex = startIndex + itemsPerPage;

    try {
        var response = await fetch("/api/list-product");
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
            <td><img src="${product.data.thumb}" alt="Product Thumb" style="max-width: 100px;"></td>
            <td>${product.data.Name}</td>
            <td class="text-center">${product.data.Price}đ/giờ</td>
            <td class="text-center">${product.data.Seat}</td>
            <td class="text-center">${product.data.Gear}</td>
            <td class="text-center">${product.data.Fuel}</td>
            <td class="text-center">${product.data.Color}</td>
            <td class="text-start ">
  ${product.data.Status ? '<span class="text-danger"><i class="fas fa-circle"></i> Đã thuê</span>': '<span class="text-success"> <i class="fas fa-circle"></i> Chưa thuê</span>' }
</td>
            <td class="text-center">
                <button class="btn btn-outline-primary"  onclick="openUpdateProductModal('${product.id}')">Update</button>
                <button class="btn bg-gradient-primary"  onclick="deleteProduct('${product.id}')">Delete</button>
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
 function deleteProduct(productId) {
    var isConfirmed = confirm('Are you sure you want to delete this product?');

    // Nếu người dùng xác nhận, thực hiện xóa
    if (isConfirmed) {
        // Send a DELETE request to the API endpoint
        var xhr = new XMLHttpRequest();
        xhr.open("DELETE", "/api/delete-product", true);
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

        xhr.send(JSON.stringify({ id: productId }));
    }
}

function openAddProductModal() {
    document.getElementById('addProductModal').style.display = 'block';
    // var formne = document.getElementById('addProductModal');
    // formne.classList.toggle('mybg-blur');
}

// Function to close the modal for adding a new product
function closeAddProductModal() {
    document.getElementById('addProductModal').style.display = 'none';
}

function addProduct() {
    // Get the file input elements
    var fileInput = document.getElementById('thumbInput');
    var filesInput = document.getElementById('listImageInput');

    var name = document.getElementById('nameInput').value;
    var price = document.getElementById('priceInput').value;
    var seat = document.getElementById('seatInput').value;
    var fuel = document.getElementById('fuelInput').value;
    var color = document.getElementById('colorInput').value;
    var date = document.getElementById('dateInput').value;
    var statusInput = document.getElementById('statusInput');
    var status = statusInput.checked;
    var gear = document.getElementById('gearInput').value;

    // var productFormData = new FormData();
    // productFormData.append('title', title);
    // productFormData.append('price', price);
    // productFormData.append('description', description);
    var product = {
        Name: name,
        Price: price,
        Seat: seat,
        Fuel: fuel,
        Color: color,
        Date: date,
        Status: status,
        Gear:gear,
        listImage: null, // Set this to the image path after uploading
        thumb: null 
    };

    // Create an array to store promises from fetch calls
    var fetchPromises = [];

    // Check if list images are selected
    if (filesInput.files.length > 0) {
        var imagesPromise = uploadImages(filesInput.files)
            .then(imageUrls => {
                product.listImage = imageUrls;
            });
        fetchPromises.push(imagesPromise);
    }

    if (fileInput.files.length > 0) {
        var thumbPromise = uploadImage(fileInput.files[0])
            .then(thumbUrl => {
                product.thumb = thumbUrl;
            });
        fetchPromises.push(thumbPromise);
    }

    Promise.all(fetchPromises)
        .then(() => {
            makeAddProductAPICall(product);
        })
        .catch(error => {
            console.error('Error during fetch calls:', error.message);
        });
}
function makeAddProductAPICall(product) {
    console.log(product);

    // Thực hiện fetch API để gọi đến endpoint add-product
    fetch('/api/add-product', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
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

// Hàm tải lên danh sách ảnh và trả về một promise chứa mảng các đường dẫn của ảnh
function uploadImages(files) {
    var formData = new FormData();
    for (var i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }

    return fetch('/api/upload-images', {
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
        console.log('List images uploaded successfully:', data);
        return data.imageUrls;
    })
    .catch(error => {
        console.error('Error uploading images:', error.message);
        throw error;
    });
}

function openUpdateProductModal(productId) {
     // Gọi API để lấy thông tin sản phẩm dựa trên productId
     fetch(`/api/get-product?id=${productId}`)
     .then(response => {
         if (!response.ok) {
             throw new Error(`HTTP error! Status: ${response.status}`);
         }
         return response.json();
     })
     .then(productData => {
         // Điền thông tin sản phẩm vào form cập nhật
         document.getElementById('updateId').value = productId;
         document.getElementById('updateName').value = productData.Name;
         document.getElementById('updatePrice').value = productData.Price;
         document.getElementById('updateSeat').value = productData.Seat;
         document.getElementById('updateColor').value = productData.Color;
         document.getElementById('updateFuel').value = productData.Fuel;
         document.getElementById('updateDate').value = productData.Date;
         var updateStatusCheckbox = document.getElementById('updateStatus');
updateStatusCheckbox.checked = productData.Status;
         document.getElementById('updateGear').value = productData.Gear;
         document.getElementById('updateThumb').src = productData.thumb;

         const updateListImageContainer = document.getElementById('updateListImageContainer');
            updateListImageContainer.innerHTML = ''; // Xóa nội dung cũ trước khi thêm mới

            if (productData.listImage && productData.listImage.length > 0) {
                productData.listImage.forEach(image => {
                    const imgElement = document.createElement('img');
                    imgElement.src = image;
                    imgElement.alt = 'List Image';
                    imgElement.style.maxWidth = '100px';
                    updateListImageContainer.appendChild(imgElement);
                });
            }
     
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
    var filesInput = document.getElementById('updateListImageInput');
  
    const id = document.getElementById('updateId').value ;
    const name = document.getElementById('updateName').value;
    const price = document.getElementById('updatePrice').value;
    const seat = document.getElementById('updateSeat').value ;
    const fuel = document.getElementById('updateFuel').value ;
    const color = document.getElementById('updateColor').value ;
    const date = document.getElementById('updateDate').value ;
    const statusInput = document.getElementById('updateStatus') ;
    const status = statusInput.checked ;
    const gear = document.getElementById('updateGear').value ;


    // Prepare the data for the request
    const updatedUserData = {
        id: id,
        Name: name,
        Price: price,
        Seat: seat,
        Fuel: fuel,
        Color: color,
        Date: date,
        Status: status,
        Gear:gear,
    };
    var fetchPromises = [];
    // Check if list images are selected
    if (fileInput.files.length > 0) {
        var imagesPromise = uploadImage(fileInput.files[0])
            .then(thumbUrl => {

                const image = {
                    id: id,
                    thumb: thumbUrl 
                };

                fetch('/api/update-product', {
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
    if (filesInput.files.length > 0) {
        var thumbPromise = uploadImages(filesInput.files)
            .then(imageUrls => {
                const images = {
                    id: id,
                    listImage: imageUrls 
                };
                fetch('/api/update-product', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(images)
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
            fetchPromises.push(thumbPromise);
    }

    // Make the API call
    var apiPromise = fetch('/api/update-product', {
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