var express = require("express");
var router = express.Router();

router.use("/", function(req,res){
    res.render("login.ejs");
    console.log("logout");

    console.log(req.session);

});
module.exports = router;
