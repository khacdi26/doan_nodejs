document.getElementById('btnLogout').addEventListener('click', async function () {
    console.log("logout ádhasidjiasjdasd");
    try {
        const response = await fetch('/session/delete', { method: 'POST' });
    
        if (response.ok) {
          // Nếu xóa session thành công, chuyển hướng người dùng đến trang đăng nhập
          window.location.href = '/login';
        } else {
          console.error('Failed to logout:', response.statusText);
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
  });