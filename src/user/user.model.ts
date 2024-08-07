
import Db  from './db';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// Charger les variables d'environnement  
dotenv.config();

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS as string) ;

export const findUserByCredentials = async (UserName: string, Password: string) => {
  return Db.getUsers().then(users => {
    const user = users?.find(u => u.UserName === UserName && u.Password === Password);
    console.log(user);
    return user ?? null;
  });
};



/**
 * Hash a password using bcrypt.
 * @param password - The password to hash.
 * @returns A promise that resolves to the hashed password.
 */
export const cryptPassword = async (password: string ): Promise<string>  => {
  
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
};


