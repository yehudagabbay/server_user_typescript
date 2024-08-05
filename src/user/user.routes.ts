import { Router} from "express";
import { getAllUsers, getUserById, addUser,deleteUser,updateUser } from "./user.controller";


//create router
const userRouter = Router();

//defined verbs
userRouter
  .get('/', getAllUsers) /// ok 
  .get('/:name', getUserById)// ok
  .put('/', updateUser) // ok  // Add this line to enable PUT request to update user
  .post('/', addUser)//ok
  .delete('/:id', deleteUser)//ok

//export
export default userRouter;