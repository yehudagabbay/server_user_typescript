import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User,db } from "../types/user.type";
import dotenv from 'dotenv';
import Db from '../user/db';


// Charger les variables d'environnement  
  dotenv.config();

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET!;

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { UserName, Email, Phone, Password, Birthday, AvatarUrl } = req.body;

        // Validation des champs (vous pouvez ajouter plus de validations)
        if (!UserName || !Email || !Password) {
            return res.status(400).json({ message: 'Tous les champs requis doivent être remplis.' });
        }

        // Hashing du mot de passe
        const hashedPassword = await bcrypt.hash(Password, SALT_ROUNDS);

        // Création de l'utilisateur
        const newUser: User = { UserID: 0, UserName, Email, Phone, Password: hashedPassword, Birthday, AvatarUrl};

        // Sauvegarde dans la base de données
        db.users.push(newUser);

        res.status(201).json({ message: 'Utilisateur enregistré avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { UserName, Password } = req.body;
  
    try {
      // Recherche de l'utilisateur par nom d'utilisateur
      const user = await Db.getUserByUserName( UserName );
  
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
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
