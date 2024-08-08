import { Request, Response } from "express";
import { User } from "../types/user.type";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // ייבוא jwt ליצירת טוקן
import Db from "./db";
import dotenv from 'dotenv'; // ייבוא dotenv לטעינת משתני סביבה

// טעינת משתני הסביבה
dotenv.config();

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS as string); // הגדרת מספר סבבי ההצפנה

const JWT_SECRET = process.env.JWT_SECRET!; // הגדרת המפתח הסודי ליצירת טוקן JWT



export async function getAllUsers(req: Request, res: Response) {
  try {
    console.log(res);
    let users: User[] | undefined = await Db.getUsers();// כל המשתמשים מבסיס נתונים
    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users);  // קבלת רשימת המשתמשים ךJSON
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
}

// Récupérer un utilisateur par nom d'utilisateur
export async function getUserById(req: Request, res: Response) {
  try {
    
    let userName = req.params.name;  // Change to userName based on User type
    let user = await Db.getUserByUserEmail(userName);
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
    let {UserName, Email, Phone, Password, Birthday } = req.body;
      console.log(UserName);
    if (!UserName || !Email || !Password) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }
    
    Password = await bcrypt.hash(Password, 10);
    
    // Assurez-vous que Birthday est converti en Date et AvatarUrl est une URL valide si nécessaire
    let user: User = {
      UserID:0, // Placeholder pour l'ID de l'utilisateur (pour un exemple, il est toujours 0)
      UserName,
      Email,
      Phone,
      Password ,
      Birthday,
      AvatarUrl:'None'
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

export const loginUser = async (req: Request, res: Response) => {
  let { Email, Password } = req.body;

  console.log(req.body + " login user ");

  try {
    
    // Recherche de l'utilisateur par nom d'utilisateur
    const user = await Db.getUserByUserEmail(Email)
    
   
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérification du mot de passe
    const isMatch = await bcrypt.compare(Password, user.Password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // Création du token JWT
    const token = jwt.sign({ UserID: user.UserID, UserName: user.UserName }, JWT_SECRET, {
      expiresIn: '1h', // Expiration du token
    });

    // Réponse avec le token
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer un utilisateur
export async function deleteUserC(req: Request, res: Response): Promise<void> {

  const userId = req.params.id; // Utilisation d'un nom de paramètre plus clair

  console.log(userId);
  if (!userId) {
    // Validation : Assure-toi que userId est fourni
    res.status(400).json({ message: 'User ID is required' });
    return;
  }

  try {

   let resulte =  await Db.deleteUser(userId);

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
