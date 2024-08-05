import { Request, Response } from "express";
import { User } from "../types/user.type";
import Db from "../utils/db";


// Récupérer tous les utilisateurs
export async function getAllUsers(req: Request, res: Response) {
  try {
    let users: User[] | undefined = await Db.getUsers();
    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users);  // Correction ici pour envoyer un tableau JSON
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
}

// Récupérer un utilisateur par nom d'utilisateur
export async function getUserById(req: Request, res: Response) {
  try {
    let userName = req.params.name;  // Change to userName based on User type
    let user = await Db.getUserByUserName(userName);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
}

// Ajouter un utilisateur
export async function addUser(req: Request, res: Response) {
  try {
    let {UserID, UserName, Email, Phone, Password, Birthday, AvatarUrl } = req.body;

    if (!UserName || !Email || !Password) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Assurez-vous que Birthday est converti en Date et AvatarUrl est une URL valide si nécessaire
    let user: User = {
      UserID, // Placeholder pour l'ID de l'utilisateur (pour un exemple, il est toujours 0)
      UserName,
      Email,
      Phone,
      Password,
      Birthday: new Date(Birthday),
      AvatarUrl
    };

    await Db.createUser(user);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
}

// Mettre à jour un utilisateur
export async function updateUser(req: Request, res: Response) {
  try {

    let { UserID, UserName, Email, Phone, Password, Birthday, AvatarUrl } = req.body;

    if (!Email || !Password) {
      return res.status(400).json({ message: "Email and Password are required" });
    }

    // Construire l'objet User avec les nouvelles données
    let user: User = {
      UserID, // Placeholder pour l'ID de l'utilisateur (pour un exemple, il est toujours 0)
      UserName,
      Email,
      Phone,
      Password,
      Birthday: new Date(Birthday),
      AvatarUrl
    };

    await Db.updateUser(user);
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
}

// Supprimer un utilisateur
export async function deleteUser(req: Request, res: Response): Promise<void> {

  const userId = req.params.id; // Utilisation d'un nom de paramètre plus clair

  console.log(userId);
  if (!userId) {
    // Validation : Assure-toi que userId est fourni
    res.status(400).json({ message: 'User ID is required' });
    return;
  }

  try {

   let resulte =  await Db.deleteUser(userId);
   console .log(resulte);
   if (!resulte) {
    // Validation : Assure-toi que le utilisateur existe
     res.status(404).json({ message: 'User not found' });
   }

    res.status(200).json({ message: 'User deleted successfully' });

  } catch (error) {

    console.error('Error deleting user:', error);
    res.status(500).json();
  }
}
