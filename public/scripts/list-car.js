    // Gọi API để lấy danh sách sản phẩm
  fetch('/api/list-product')
  .then(response => response.json())
  .then(productList => {
    const productListContainer = document.getElementById('productListContainer');
    
    // Tạo các phần tử HTML cho từng sản phẩm và thêm vào container
    productList.forEach(product => {
      const cardColumn = document.createElement('div');
      cardColumn.className = 'col-xl-3 col-md-6 mb-xl-0 mb-4';

      const card = document.createElement('div');
      card.className = 'card card-blog card-plain';
      if (product.data.Status === true) {
        return;
      }


      const cardHeader = document.createElement('div');
      cardHeader.className = 'card-header p-0 mt-n4 mx-3';

      const imageLink = document.createElement('a');
      imageLink.className = 'd-block shadow-xl border-radius-xl';

      const productImage = document.createElement('img');
      productImage.src = product.data.thumb;
      productImage.alt = 'img-blur-shadow';
      productImage.className = 'img-fluid shadow border-radius-xl';

      imageLink.appendChild(productImage);
      cardHeader.appendChild(imageLink);
      card.appendChild(cardHeader);

      const cardBody = document.createElement('div');
      cardBody.className = 'card-body p-3';

      const productNameLink = document.createElement('a');
      productNameLink.href = 'javascript:;';
      const productName = document.createElement('h5');
      productName.textContent = product.data.Name;
      productNameLink.appendChild(productName);
      cardBody.appendChild(productNameLink);

      const color = document.createElement('p');
      color.className = 'mb-0 text-sm';
      color.textContent = 'Color: ' + product.data.Color;
      cardBody.appendChild(color);

      const seat = document.createElement('p');
      seat.className = 'mb-4 text-sm';
      seat.textContent = 'Seat: ' + product.data.Seat;
      cardBody.appendChild(seat);

      const buttonDiv = document.createElement('div');
      buttonDiv.className = 'd-flex align-items-center justify-content-between mb-4';

      const rentButton = document.createElement('button');
      rentButton.type = 'button';
      rentButton.className = 'btn btn-outline-primary btn-sm mb-0';
      rentButton.textContent = 'Thuê xe';
      rentButton.addEventListener('click', () => openPopup(product));
      buttonDiv.appendChild(rentButton);

      const priceDiv = document.createElement('div');
      const priceSpan = document.createElement('span');
      const price = parseInt(product.data.Price);
if (!isNaN(price)) {
  priceSpan.textContent = 'Giá: ' + price.toLocaleString() + 'đ/giờ';
} else {
  // Xử lý khi giá không phải là một số hợp lệ
  priceSpan.textContent = 'Giá: ' + product.data.Price + 'đ/giờ';
}
      priceDiv.appendChild(priceSpan);
      buttonDiv.appendChild(priceDiv);

      

      cardBody.appendChild(buttonDiv);
      card.appendChild(cardBody);
      cardColumn.appendChild(card);
      productListContainer.appendChild(cardColumn);
    });
  })
  .catch(error => {
    console.error('Error fetching product list:', error);
  });

   // Mở popup và hiển thị thông tin sản phẩm
   function openPopup(product) {
    const modalTitle = document.getElementById('productModalLabel');

    // "Fuel": "xăng",
    // "Date": "2020",
    // "Status": false,
    // "Gear": "số tự động",
    // "listImage":"",
    // "thumb":""
    
    const popupColor = document.getElementById('popupColor');
    const popupSeat = document.getElementById('popupSeat');
    const popupPrice = document.getElementById('popupPrice');
    const popupFuel = document.getElementById('popupFuel');
    const popupDate = document.getElementById('popupDate');
    const popupGear = document.getElementById('popupGear');
    const popupThumb = document.getElementById('popupThumb');
    const popupComfirm = document.getElementById('popupComfirm');

    
    popupComfirm.onclick = function() {
        // Đoạn mã xử lý khi nút "popupConfirm" được nhấp
// Gửi yêu cầu PUT để cập nhật sản phẩm
fetch('/api/update-product', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    id: product.id,
    Status: true // ID của sản phẩm cần cập nhật
    // Các trường dữ liệu cần cập nhật
    // Ví dụ: price, quantity, name, description, ...
  }),
})
  .then(response => response.json())
  .then(data => {
    console.log(data.message); // Hiển thị thông báo thành công từ server
    $('#productModal').modal('hide');location.reload();
  })
  .catch(error => {
    console.error('Error updating product:', error); // Hiển thị thông báo lỗi
  });
        
      };

    modalTitle.textContent = product.data.Name;
    popupThumb.src = product.data.thumb;
    popupThumb.style.maxWidth = '100%';
    popupThumb.style.height = 'auto';
    popupColor.textContent = 'Màu sắc: ' + product.data.Color;
    popupSeat.textContent = 'Số ghế: ' + product.data.Seat;
    const price = parseInt(product.data.Price);
if (!isNaN(price)) {
    popupPrice.textContent = 'Giá: ' + price.toLocaleString() + 'đ/giờ';
} else {
  // Xử lý khi giá không phải là một số hợp lệ
  popupPrice.textContent = 'Giá: ' + product.data.Price + 'đ/giờ';
}
    popupFuel.textContent = 'Nhiên liệu: '+ product.data.Fuel;
    popupDate.textContent = 'Năm sản xuất: '+ product.data.Date;
    popupGear.textContent = 'Hộp số: ' + product.data.Gear;

    $('#productModal').modal('show');
  }
  function closePopup() {
    $('#productModal').modal('hide');
  }
