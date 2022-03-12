var express = require('express');
const req = require('express/lib/request');
const async = require('hbs/lib/async');
const { response } = require('../app');
const User_helper = require('../Helper/User_helper');
var router = express.Router();
const userHelper = require('../Helper/User_helper');
const adminUsername = "admin";
const adminPassword = "admin";

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.admin){
    res.redirect('/admin/adminHomepage');
  }else{
    res.redirect('/admin/adminLogin')
  }
});


//loginPage route

router.get('/adminLogin',(req,res)=>{
  if(req.session.admin){
    res.redirect('/admin/adminHomepage');
  }else{
  res.render('adminLogin',{Error : req.session.adminError})
  req.session.adminError = false;
  }
})

// admin homepage route

router.get('/adminHomepage',(req,res)=>{
  if(req.session.admin){
    userHelper.getAllData().then((datas)=>{
      console.log(datas);
      res.render('adminHomepage',{Datas:datas})
    })
}else{
  res.redirect('/admin/adminLogin')
}
})

// login form submission.
router.post('/adminloginForm',function(req,res){
 if(adminUsername === req.body.uname && adminPassword === req.body.password){
   req.session.admin=true;
   req.session.admin=req.body;
    res.redirect('/admin/adminHomepage');
 }else{
   req.session.adminError = true;
   res.redirect('/admin')
 }
})

//Admin Logout
router.get("/adminlogoutForm",(req,res)=>{
  req.session.destroy();
  res.redirect('/admin/adminLogin')
})


//admin Create
router.get('/createAdmin',(req,res)=>{
  if(req.session.admin){
    res.render('adminCreate')
  }else{
    res.redirect('/admin/adminLogin')
  }
  
})

router.post('/Adminsubmit',(req,res)=>{
  // console.log(req.body);
  userHelper.doSignUp(req.body).then((response)=>{
    console.log(response);
    res.redirect('/admin/adminHomepage')
  })
  
})

//delete route
router.get('/delete-product/:id',(req,res)=>{
  let proId = req.params.id
  console.log(proId);
  User_helper.deleteData(proId).then((response)=>{
    res.redirect('/admin/adminHomepage')
  })
})


//update route
router.get('/UpdateForm/:id',async(req,res)=>{
  let values =await User_helper.getAllDataUpdate(req.params.id)
  console.log(values);
  res.render('adminUpdateForm',{values})
})

router.post('/UpdateForm/:id',(req,res)=>{
  User_helper.UpdateDetails(req.params.id,req.body).then(()=>{
    res.redirect('/admin/adminHomepage')
  })

})

module.exports = router;
