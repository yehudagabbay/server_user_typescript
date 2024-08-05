import { UserType } from "./user.model";
import { connect } from "mssql";

/**
 * Saves a user to the database.
 *
 * @param {UserType} user - The user object to save.
 * @param {string} procName - The stored procedure name.
 * @return {Promise<any>} The result of the database operation.
 */
export async function saveUser(user: UserType, procName: string): Promise<any> {
  try {
    const pool = await connect(process.env.CONNECTION_STRING as string);
    const result = await pool.request()
      .input("name", user.name)
      .input("email", user.email)
      .input("password", user.password)
      .execute(procName);
    return result;
  } catch (error) {
    throw new Error();
  }
}
