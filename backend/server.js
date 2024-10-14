const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin')

const cors = require('cors');


dotenv.config();
const app = express();

app.use(express.json());//-> for converting or parsing json request
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from your frontend running on localhost:5173
    credentials: true // Allow credentials like cookies and HTTP authentication
  }));


mongoose.connect(process.env.MONGO_URL
).then(()=>console.log("Mongo connected"))
    .catch((err)=>console.log(err))

    app.get('/',(req,res) => {
        res.json({
            admin:"server started"
        })
    })

    app.use('/api/auth', authRoutes); // Use the auth routes
    app.use('/api/admin', adminRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT,()=>console.log(`server running on port ${PORT}`));