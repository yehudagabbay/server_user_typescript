import { getAllUsers, getUserById, addUser,deleteUserC,updateUser, loginUser } from "./user.controller";
import { Router } from 'express';

import dotenv from 'dotenv';


// Charger les variables d'environnement  
  dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;



//create router
const userRouter = Router();

//defined verbs
userRouter
  .get('/', getAllUsers) /// ok 
  .get('/:name', getUserById)// ok
  .put('/', updateUser) // ok  // Add this line to enable PUT request to update user
  .post('/', addUser)//ok
  .delete('/:id', deleteUserC)//ok
  .post('/log',loginUser )
//   .post('/login', authenticateToken, (req, res) => {
    
//     // Cette route est protégée, l'utilisateur doit être authentifié
//     res.json({ message: 'Voici les informations de votre profil.', user: (req as any).user });
// });


//export
export default userRouter;