import { connect,IResult } from 'mssql';
import { User } from '../types/user.type';

export default class Db {

    static connectionString = "workstation id=En_chanter_Karaoke.mssql.somee.com;packet size=4096;user id=Elya_Amram_SQLLogin_5;pwd=qvrs6xc9y2;data source=En_chanter_Karaoke.mssql.somee.com;persist security info=False;initial catalog=En_chanter_Karaoke;TrustServerCertificate=True";

    /**
     * Retrieve all users from the database.
     * @returns A promise resolving to an array of User objects.
     */
    static async getUsers(): Promise<User[] | undefined> {
        try {
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

    /**
     * Retrieve a specific user by username.
     * @param userName - The username of the user to retrieve.
     * @returns A promise resolving to a User object or undefined if not found.
     */
    static async getUserByUserName(userName: string): Promise<User | undefined> {
        try {
            const pool = await connect(Db.connectionString);
            const result: IResult<any> = await pool.request()
                .input('UserName', userName)
                .query('SELECT * FROM Users WHERE UserName = @UserName');
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
                } ;
            } else {
                return undefined;
            }
        } catch (err) {
            console.error('Error fetching user:', err);
            return undefined;
        }
    }

    /**
     * Insert a new user into the database.
     * @param user - The User object to insert.
     */
    static async createUser(user: User): Promise<any> {
        try {
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

    /**
     * Update an existing user in the database.
     * @param user - The User object with updated data.
     */
    static async updateUser(user: User ): Promise<void> {
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

    /**
     * Delete a user from the database by username.
     * @param userName - The username of the user to delete.
     */
    static async deleteUser(userName: string): Promise<boolean> {
        try {
            const pool = await connect(Db.connectionString);
            const result: IResult<any> = await pool.request().input('UserName', userName).query('SELECT * FROM Users WHERE UserID = @UserName');
            console.log(result);
            if (result.recordset.length > 0) {
                await pool.request().input('UserName', userName).query('DELETE FROM Users WHERE UserID = @UserName');
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
