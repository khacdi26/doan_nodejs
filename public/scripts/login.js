document.getElementById('btnLogin').addEventListener('click', async function () {
    try {
      // Lấy giá trị từ các trường input
      var username = document.getElementById('email').value;
      var password = document.getElementById('password').value;
  
      // Tạo đối tượng Fetch Request
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password: password }),
      });
  
      // Kiểm tra mã trạng thái HTTP
      if (response.ok) {
        // Xử lý phản hồi thành công từ server
        const responseData = await response.json();
        console.log('Login successful. Token:', responseData.idToken);
        window.location.href = '/';
      } else {
        // Xử lý phản hồi lỗi từ server
        const errorData = await response.json();
        console.error('Login failed. Error:', errorData.error);
      }
    } catch (error) {
      // Xử lý lỗi khi thực hiện yêu cầu
      console.error('Request failed. Error:', error);
    }
  });