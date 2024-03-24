const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const firebase = require("../../../config/firebase");
const { route } = require("..");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post("/upload-images", upload.array("files", 5), firebase.uploadImages);
router.use("/upload-image",upload.single("file"), firebase.uploadImage );

router.post("/login", bodyParser.json(), async function(req, res) {
  const { email, password } = req.body;

  try {
    // Thực hiện đăng nhập bằng Firebase Authentication
    const userCredential = await firebase.Auth.getUserByEmail(email);

    if (password === "admin01") {
      // Lấy mã thông báo xác thực của người dùng
      const idToken = await firebase.Auth.createCustomToken(userCredential.uid);

      // Lưu trữ mã thông báo xác thực trong phiên
      req.session.idToken = idToken;

      // Gửi mã thông báo xác thực trong phản hồi
      res.json({ idToken });
    } else {
      throw new Error('Invalid password');
    }
  } catch (error) {
    console.error('Error logging in:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// async function authenticate(req, res, next) {
//   const idToken = req.headers.authorization;

//   try {
//     const decodedToken = await firebase.Auth.verifyIdToken(idToken);
//     req.user = decodedToken;
//     next();
//   } catch (error) {
//     console.error('Error authenticating user:', error.message);
//     res.redirect('/login'); // Chuyển hướng đến trang đăng nhập
//   }
// }

router.get('/get-category',bodyParser.json(), async (req, res) => {
    try {
      const productId = req.body.id;
  
      // Lấy thông tin người dùng từ Firestore
      const productDoc = await firebase.Categories.doc(productId).get();
      if (!productDoc.exists) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
  
      const productData = productDoc.data();
      res.json(productData);
    } catch (error) {
      console.error('Error getting product:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.delete('/delete-category', bodyParser.json(), async (req, res) => {
    try {
      const categoryId = req.params.id;
  
      await firebase.Categories.doc(categoryId).delete();
  
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Error deleting category:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.put('/update-category', bodyParser.json(), async (req, res) => {
    try {
      const categoryId = req.body.id;
      const updatedData = req.body; // Dữ liệu cập nhật của danh mục được gửi từ client
  
      await firebase.Categories.doc(categoryId).update(updatedData);
  
      res.json({ message: 'Category updated successfully' });
    } catch (error) {
      console.error('Error updating category:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.get('/list-category', async (req, res) => {
    try {
      const categoriesSnapshot = await firebase.Categories.get();
      const categoryList = [];
  
      categoriesSnapshot.forEach((doc) => {
        categoryList.push({
          id: doc.id,
          data: doc.data(),
        });
      });
  
      res.json(categoryList);
    } catch (error) {
      console.error('Error fetching category list:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.post('/create-category', bodyParser.json(), async (req, res) => {
    try {
      const categoryData = req.body; // Dữ liệu danh mục được gửi từ client
  
      // Thực hiện thêm danh mục vào cơ sở dữ liệu
      const docRef = await firebase.Categories.add(categoryData);
  
      res.json({ id: docRef.id, message: 'Category created successfully' });
    } catch (error) {
      console.error('Error creating category:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.get('/get-order',bodyParser.json(), async (req, res) => {
    try {
      const productId = req.query.id;
  
      // Lấy thông tin người dùng từ Firestore
      const productDoc = await firebase.Orders.doc(productId).get();
      if (!productDoc.exists) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
  
      const productData = productDoc.data();
      res.json(productData);
    } catch (error) {
      console.error('Error getting product:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.delete('/delete-order',bodyParser.json(), async (req, res) => {
    try {
      const orderId = req.body.id;
  
      await firebase.Orders.doc(orderId).delete();
  
      res.json({ message: 'Order deleted successfully' });
    } catch (error) {
      console.error('Error deleting order:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.put('/update-order', bodyParser.json(), async (req, res) => {
    try {
      const orderId = req.body.id;
      const updatedData = req.body; // Dữ liệu cập nhật của đơn hàng được gửi từ client
  
      await firebase.Orders.doc(orderId).update(updatedData);
  
      res.json({ message: 'Order updated successfully' });
    } catch (error) {
      console.error('Error updating order:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.get('/list-order', async (req, res) => {
    try {
      const ordersSnapshot = await firebase.Orders.get();
      const orderList = [];
  
      ordersSnapshot.forEach((doc) => {
        orderList.push({
          id: doc.id,
          data: doc.data(),
        });
      });
  
      res.json(orderList);
    } catch (error) {
      console.error('Error fetching order list:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// API để cập nhật thông tin người dùng
router.put('/update-product', bodyParser.json(), async (req, res) => {
    try {
      const productId = req.body.id;
      const updatedData = req.body; // Dữ liệu cập nhật của sản phẩm được gửi từ client
  
      await firebase.Cars.doc(productId).update(updatedData);
  
      res.json({ message: 'Product updated successfully' });
    } catch (error) {
      console.error('Error updating product:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.get('/get-product',bodyParser.json(), async (req, res) => {
  try {
    const productId = req.query.id;

    // Lấy thông tin người dùng từ Firestore
    const productDoc = await firebase.Cars.doc(productId).get();

    if (!productDoc.exists) {
        res.status(404).json({ error: 'Product not found' });
        return;
    }

    const productData = productDoc.data();
    res.json(productData);
} catch (error) {
    console.error('Error getting product:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
}
  });

router.post('/add-product', bodyParser.json(), async (req, res) => {
    try {
      const productData = req.body; // Dữ liệu sản phẩm được gửi từ client
  
      // Thực hiện thêm sản phẩm vào Firestore
      const docRef = await firebase.Cars.add(productData);
  
      res.json({ id: docRef.id, message: 'Product added successfully' });
    } catch (error) {
      console.error('Error adding product:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// API để xóa product
router.delete('/delete-product',bodyParser.json(), async (req, res) => {
    try {
      const productId = req.body.id;
  
      await firebase.Cars.doc(productId).delete();
  
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// API để lấy danh sách sản phẩm
router.get("/list-product", async (req, res) => {
    try {
      const usersSnapshot = await firebase.Cars.get();
      const productList = [];
  
      usersSnapshot.forEach((doc) => {
        productList.push({
          id: doc.id,
          data: doc.data(),
        });
      });
  
      res.json(productList);
    } catch (error) {
      console.error("Error fetching product list:", error);
      res.status(500).send("Internal Server Error");
    }
  });

// Api đăng ký tài khoản
router.post('/register-user',bodyParser.json(), async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Tạo người dùng mới trong Firebase Authentication
      const userCredential = await firebase.Auth.createUser(
        {email: email,
        password: password}
      );
  
      // Tạo tài liệu người dùng trong Firestore
      await firebase.Users.doc(userCredential.uid).set({
        displayName: null ,
        email: userCredential.email,
        password: password,
        phoneNumber: null,
        photoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpRGUcBVltEkFutN21fIqebRvrgP7fOv4CjcNwuka3BtXR_-jhpd7GheJ_RkvMtSsnsA8&usqp=CAU",
        roomNumber: null
        // Các thông tin khác về người dùng có thể được thêm vào đây
      });
  
      res.status(201).json({ message: 'User registered successfully', uid: userCredential.uid });
    } catch (error) {
      console.error('Error registering user:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// API để lấy danh sách người dùng
router.get("/list-user", async (req, res) => {
  try {
    const usersSnapshot = await firebase.Users.get();
    const userList = [];

    usersSnapshot.forEach((doc) => {
      userList.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    res.json(userList);
  } catch (error) {
    console.error("Error fetching user list:", error);
    res.status(500).send("Internal Server Error");
  }
});

// API để xóa người dùng và tài khoản có cùng ID
router.delete('/delete-user',bodyParser.json(), async (req, res) => {
    try {
      const userId = req.body.uid;
  
      // Xóa người dùng trong Firebase Authentication
      await firebase.Auth.deleteUser(userId);
  
      // Xóa tài liệu người dùng trong Firestore
      await firebase.Users.doc(userId).delete();
  
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // API để cập nhật thông tin người dùng
router.put('/update-user', bodyParser.json(), async (req, res) => {
    try {
      const userId = req.body.id;
      const { displayName, phoneNumber, roomNumber, photoUrl } = req.body;
  
      // Cập nhật thông tin người dùng trong Firestore
      await firebase.Users.doc(userId).update({
        displayName: displayName,
        phoneNumber: phoneNumber,
        roomNumber: roomNumber,
        photoUrl: photoUrl
      });
  
      res.json({ message: 'User updated successfully' });
    } catch (error) {
      console.error('Error updating user:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// API để lấy thông tin người dùng
router.get('/get-user',bodyParser.json(), async (req, res) => {
  try {
    const userId = req.query.id;

    // Lấy thông tin người dùng từ Firestore
    const userDoc = await firebase.Users.doc(userId).get();
    if (!userDoc.exists) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const userData = userDoc.data();
    res.json(userData);
  } catch (error) {
    console.error('Error getting user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;