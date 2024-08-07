import { Router} from "express";


export const viewRouter = Router();
    
viewRouter
.get('',(req , res )=> res.render('index'))
.get('/about',(req , res )=> res.render('about.hbs'));
