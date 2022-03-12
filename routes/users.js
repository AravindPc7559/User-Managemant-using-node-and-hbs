var express = require('express');
const { response } = require('../app');
var router = express.Router();
const userHelper = require('../Helper/User_helper');
const Products = require('../Fakeapi');


const mid = (req,res,next)=>{
  if(req.session.user){
    next()
  }else{
    res.redirect('/login')
  }
}

/* GET users listing. */
router.get('/', mid , function(req, res, next) {
    let user = req.session.user
    // console.log(user);
    // if(user){
      res.render('index',{product : Products})
    // }else{
    //   res.redirect('/login')
    // }
});

//Signup Route

router.get('/signup',(req,res)=>{
  if(req.session.user){
    res.redirect('/')
  }else{
    let emailerror =   req.session.EmailError;
    res.render('signUpForm',{Error:emailerror})
    req.session.EmailError=false;
  }
})

//Login route

router.get("/login",(req,res)=>{
  if(req.session.user){
    res.redirect('/')
  }else{
    res.render('loginForm',{Error:req.session.Error})
    req.session.Error = false;
  }
})

// Posting signup form

router.post('/submit',(req,res)=>{
  // console.log(req.body);
  userHelper.doSignUp(req.body).then((response)=>{

      res.redirect('/login')
  }).catch((error)=>{
    req.session.EmailError=error.data
    req.session.EmailError=true;
      res.redirect('/signup')
  })
  
})

// Posting Login Form

// router.use((req,res,next)=>{
//   console.log("hai");
// })

router.post('/loginForm',(req,res)=>{
  userHelper.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/')
    }else{
      req.session.Error = true;
      res.redirect('/')
    }
  })
})

// Logout Route
router.get('/logoutForm',(req,res)=>{
  req.session.destroy();
  res.redirect('/')
})





module.exports = router;
