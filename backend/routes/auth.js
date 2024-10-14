const bcryptjs = require('bcryptjs');
const express = require('express');
const router = express.Router();    
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const sign = require('jsonwebtoken/sign');

//Signup

// Signup Route
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
  
    // Check if all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }
  
    try {
      // Check if the user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }
  
      // Create a new user
      user = new User({ name, email, password });
  
      // Save the user
      await user.save();
  
      // Respond with success message (you can also return a JWT token here if needed)
      res.json({ msg: 'Admin registered successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  

router.post('/signin',async(req,res)=>{
    const {email , password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user||user.role!=='admin'){
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload  =  {userId:user._id, role:user.role};
        const token = sign(payload,process.env.JWT_SECRET,  { expiresIn: '1h' });
        res.json({token});
        }catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
          }
})

module.exports = router;