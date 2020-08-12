const router = require('express').Router();
const User = require('../models/userModel');
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const jwtVerification = require('./jwtVerification');
const {registerValidation} = require('../validation');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');


router.post('/register', async (req, res) => {
    const email = req.body.email;
    const username = req.body.username;

    const isValid = registerValidation(req.body);
    if (isValid.error) return res.status(403).json(isValid.error.details[0].message)

    const emailExists = await User.findOne({
        email: email
    })
    if (emailExists) return res.status(403).json('Email already exists')

    const usernameExists = await User.findOne({
        username: username
        })
    if (usernameExists) return res.status(403).json('Username already exists')

    req.body.password = await bcrypt.hash(req.body.password, 10);

    
    const user = new User({
        email: email,
        username: username,
        password: req.body.password
    });

    user.save().then(doc => {
        res.status(200).json('Registration Sucessfull');
    }).catch(err => {
        res.status(500).json('Internal Server Error');
    })
})

router.post('/login', async (req, res) => {
    const email = req.body.email;

    const user = await User.findOne({
        email: email
    })
    if (!user) return res.status(403).json('Email/Password does not exists')


    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPassword) return res.status(403).json('Incorrect Password');
    

    jwt.sign({
        userId: user._id,
        email: user.email,
        username: user.username
    }, process.env.JWT_SECRET, (err, token) => {
        if (err) return res.status(500).json('Internal Server Error');
        res.status(200).json({
            accessToken: token,
            expiresIn: '1h',
            tokenType: 'Bearer'
        })
    })
})

router.get('/posts', jwtVerification,async (req, res) => {
    const user = await User.findOne({
        email: req.user.email
    })
    if (!user) return res.status(500).json('Internal Server Error');
    
    try {
        return res.status(200).json(user.posts); 
    } catch (err) {
        res.status(500).json('Internal Server Error')
    }
    
})

router.get('/', jwtVerification,async (req, res) => {
    const user = await User.findOne({
        email: req.user.email
    })
    if (!user) return res.status(500).json('Internal Server Error');
    
    try {
        res.status(200).json({
            email: user.email,
            username: user.username,
            posts: user.posts
        })
    } catch (err) {
        res.status(500).json('Internal Server Error')
    }
    
})


router.post('/forgotpwd', async(req, res) => {
    if (!req.body.email) return res.status(400).status.json('No Email Parameter Passed');

    const user = await User.findOne({
        email: req.body.email
    });

    if (!user) return res.status(500).json('Internal Server Error');
    
    const email = req.body.email;
    const token = uuidv4();

    async function main() {
      
        const transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          auth: {
              user: '',
              pass: ''
          }
      });
      
        let info = await transporter.sendMail({
          from: '', 
          to: '',
          subject: "Password reset",
          text: "Password Reset Email - REST API NODEJS", 
          html: `<b>Token: ${token}</b>`, 
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        
        user.pwdResetToken = token;
        user.save().then(doc => {
            res.status(200).json(`Password Reset Email sent to ${email}`)
        }).catch(err => {
            res.status(500).json('Internal Server Error');
        });
      }
      
      main().catch(console.error);
})


router.post('/reset/:token', async (req, res) => {
    const token = req.params.token;

    const user = await User.findOne({
        pwdResetToken: token
    });
    if (!user) return res.status(403).json('Token Expired');

    req.body.password = await bcrypt.hash(req.body.password, 10);

    user.password = req.body.password;
    user.pwdResetToken = null;

    user.save().then(doc => {
        res.status(200).json('Password Reset Successfull');
    }).catch(err => {
        res.status(500).json('Internal Server Error');
    })
})


module.exports = router;