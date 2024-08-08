import { connect, IResult } from 'mssql';
import { User } from '../types/user.type';

// Import environment variables from.env file
import * as dotenv from 'dotenv';
dotenv.config();


export default class Db {
    private static connectionString: string = process.env.CONNECTION_STRING as string;

    static async getUsers(): Promise<User[] | undefined> {
        try {
            console.log('fff');
            const pool = await connect(Db.connectionString);
            const result = await pool.request().query('SELECT * FROM Users');
            return result.recordset.map((element: any) => ({
                UserID: element.UserID,
                UserName: element.UserName,
                Email: element.Email,
                Phone: element.Phone,
                Password: element.Password,
                Birthday: new Date(element.Birthday),
                AvatarUrl: element.AvatarUrl
            }));
        } catch (err) {
            console.error('Error fetching users:', err);
            return undefined;
        }
    }

    static async getUserByUserEmail(Email: string): Promise<User | undefined> {
        console.log(Email + ' function get user by mail ');
        try {
            const pool = await connect(Db.connectionString);
            const result: IResult<any> = await pool.request()
                .input('Email', Email)
                .query('SELECT * FROM Users WHERE Email = @Email');
            if (result.recordset.length > 0) {
                const element = result.recordset[0];
                return {
                    UserID: element.UserID,
                    UserName: element.UserName,
                    Email: element.Email,
                    Phone: element.Phone,
                    Password: element.Password,
                    Birthday: new Date(element.Birthday),
                    AvatarUrl: element.AvatarUrl
                };
            } else {
                return undefined;
            }
        } catch (err) {
            console.error('Error fetching user:', err);
            return undefined;
        }
    }

    static async createUser(user: User): Promise<any> {
        try {
            console.log(user.UserName);
            const pool = await connect(Db.connectionString);
            await pool.request()
                .input('UserName', user.UserName)
                .input('Email', user.Email)
                .input('Phone', user.Phone)
                .input('Password', user.Password)
                .input('Birthday', user.Birthday)
                .input('AvatarUrl', user.AvatarUrl)
                .query(`INSERT INTO Users (UserName, Email, Phone, Password, Birthday, AvatarUrl)
                        VALUES (@UserName, @Email, @Phone, @Password, @Birthday, @AvatarUrl)`);
        } catch (err) {
            console.error('Error creating user:', err);
        }
    }

    static async updateUser(user: User): Promise<void> {
        try {
            const pool = await connect(Db.connectionString);
            console.log(user.UserName);
            await pool.request()
                .input('UserID', user.UserID)
                .input('UserName', user.UserName)
                .input('Email', user.Email)
                .input('Phone', user.Phone)
                .input('Password', user.Password)
                .input('Birthday', user.Birthday)
                .input('AvatarUrl', user.AvatarUrl)
                .query(`UPDATE Users
                        SET UserName = @UserName,
                            Email = @Email,
                            Phone = @Phone,
                            Password = @Password,
                            Birthday = @Birthday,
                            AvatarUrl = @AvatarUrl
                        WHERE UserID = @UserID`);
        } catch (err) {
            console.error('Error updating user:', err);
        }
    }

    static async deleteUser(UserID: string): Promise<boolean> {
        try {
            const pool = await connect(Db.connectionString);
            const result: IResult<any> = await pool.request().input('UserID', UserID).query('SELECT * FROM Users WHERE UserID = @UserID');
            console.log(result);
            if (result.recordset.length > 0) {
                await pool.request().input('UserID', UserID).query('DELETE FROM Users WHERE UserID = @UserID');
                return true;
            } else {
                console.log('Cannot delete user. User not exists in the database.');
                return false;
            }
        } catch (err) {
            console.error('Error deleting user:', err);
            return false;
        }
    }
}