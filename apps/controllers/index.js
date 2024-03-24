var express = require("express");
const session = require("express-session");
var router = express.Router();
const firebase = require("../../config/firebase");

router.use(session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true
  }));
  router.post('/session/delete', (req, res) => {
    // Xóa session ở đây
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ success: true });
      }
    });
  });
  // Middleware để ngăn trang được lưu trữ trong cache
  router.use((req, res, next) => {
  // Tắt caching cho mọi request
  res.header('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});

router.use("/login", require(__dirname + "/logincontroller"));

async function checkAuth(req, res, next) {
    const idToken = req.session.idToken; // Lấy mã thông báo xác thực từ phiên
    console.log(req.session);
    if (!idToken) {
      res.redirect('/login'); // Chuyển hướng đến trang đăng nhập nếu không có mã thông báo xác thực trong phiên
      return;
    }
  
    next();
  }


// router.use("/home", require(__dirname + "/homecontroller"));

router.use("/product", require(__dirname + "/productcontroller"));
router.use("/user", require(__dirname + "/usercontroller"));
router.use("/order", require(__dirname + "/ordercontroller"));
router.use("/api", require(__dirname + "/api/apicontroller"));


router.get("/", function(req,res){
    res.render("home.ejs");
});
module.exports = router;