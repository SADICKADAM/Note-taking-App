
import express from "express";
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'


import notesRoutes from './routes/notesRoutes.js'
import {connectDB} from './config/db.js'
import rateLimiter from './middleware/rateLimiter.js'


dotenv.config()


const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve()

// Middlewares
if(process.env.NODE_ENV !== "protuction"){
   app.use(cors({
    origin:'http://localhost:5173',
   }));
}

app.use(express.json());
app.use(rateLimiter);



// Routes
app.use('/api/notes', notesRoutes);

if(process.env.NODE_ENV === "protuction"){
   app.use(express.static(path.join(__dirname,"../Frontend/dist")));

   app.get("*",(req, res)=>{
    res.sendFile(path.join(__dirname,"../Frontend","dist","index.html"))
   })
}


// Connect to DB and start the server
 connectDB().then(()=>{
       app.listen(PORT, () => {
       console.log('server is running on port:' + PORT)
    });
})




