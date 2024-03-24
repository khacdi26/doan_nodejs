const admin = require('firebase-admin');
const serviceAccount = require('./firebase.json'); // Đường dẫn tới tệp JSON chứa thông tin tài khoản dịch vụ


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "dacn-1b8f8.appspot.com",
  databaseURL: 'https://dacn-1b8f8-default-rtdb.firebaseio.com',
});

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }

    const bucket = admin.storage().bucket();
    const imageBuffer = req.file.buffer;

    // Tạo tên duy nhất cho ảnh
    const uniqueFileName = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const fileName = `images/${uniqueFileName}`;

    // Upload ảnh lên Firebase Storage
    const file = bucket.file(fileName);
    await file.save(imageBuffer, {
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    // Lấy đường dẫn tới ảnh sau khi upload
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;

    res.json({ imageUrl });
  } catch (error) {
    console.error("Error uploading image:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No images provided" });
    }

    const bucket = admin.storage().bucket();
    const imageUrls = [];

    for (const file of req.files) {
      const imageBuffer = file.buffer;

      // Tạo tên duy nhất cho ảnh
      const uniqueFileName = Date.now() + "-" + Math.round(Math.random() * 1E9);
      const fileName = `images/${uniqueFileName}`;

      // Upload ảnh lên Firebase Storage
      const storageFile = bucket.file(fileName);
      await storageFile.save(imageBuffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });

      // Lấy đường dẫn tới ảnh sau khi upload
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;
      imageUrls.push(imageUrl);
    }

    res.json({ imageUrls });
  } catch (error) {
    console.error("Error uploading images:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const db = admin.firestore();
const auth = admin.auth();

const User = db.collection('Users');
const Products = db.collection('Products');
const Orders = db.collection('Orders');
const Categories = db.collection('Categories');
const Cars = db.collection('Cars');

module.exports = {
  Users: User,
  Products: Products,
  Orders: Orders,
  Categories: Categories,
  Auth: auth,
  Cars: Cars,
  uploadImage,
  uploadImages

};