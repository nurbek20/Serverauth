import mongoose from 'mongoose';
import express from 'express';
import fs from 'fs';
import bodyParser from "body-parser"
import multer from 'multer';
import cors from 'cors';
import UserModel from "./models/User.js"

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';
import { checkAuth, handleValidationErrors } from "./utils/index.js"
import { UserController, PostController } from './controllers/index.js';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json({ extended: true })) // ?
app.use(cors())
mongoose
    .connect('mongodb+srv://admin:admin@cluster0.jrcwbjz.mongodb.net/post?retryWrites=true&w=majority')
    .then(() => console.log("DB ok"))
    .catch(() => console.log("DB error"))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // if (!fs.existsSync("uploads")) {
        //     fs.mkdirSync("uploads");
        // }
        cb(null,'./uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + '-' + Date.now());
    }
})

const upload = multer({ storage: storage, limits: { fileSize: 1000000 }, })
app.use('/uploads', express.static("uploads"))


//?  register
app.post('/api/auth/register',
    registerValidation,
    handleValidationErrors,
    UserController.register
)
//? login
app.post('/api/auth/login',
    loginValidation,
    handleValidationErrors,
    UserController.login
)
//? token  
app.get('/api/auth/me',
    checkAuth,
    UserController.getMe
)


app.post('/upload', upload.single("file"), (req, res) => {
    if (req.file) 
        res.send("Single file uploaded successfully")
     else 
        res.status(400).send("Please upload a valid image");
    
    // const image = new UserModel({
    //     imageUrl: {
    //         data: fs.readFileSync("uploads/" + req.file.filename),
    //         contentType: "image/png"
    //     }
    // })
    // image.save()
    // res.end(image)
    // let filedata = req.file
    // if (!filedata)
    //     res.end("error creating file")
    // else
    //     res.end(filedata)
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
});

//? Create Post model
app.post("/posts/add",
    checkAuth,
    postCreateValidation,
    handleValidationErrors,
    PostController.create)
app.patch("/posts/:id",
    checkAuth,
    postCreateValidation,
    handleValidationErrors,
    PostController.update)
app.delete("/posts/:id", checkAuth, PostController.remove)
app.get("/posts", PostController.getAll)
app.get("/posts/:id", PostController.getOne)


const port = 5556
app.listen(process.env.PORT||port, () => {
    console.log(`Server started on PORT ${port}`);
})  