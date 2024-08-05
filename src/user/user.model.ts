import { saveUser } from './user.db';

export type UserType = {
  name: string,
  email: string,
  password: string
}

export async function createUser({ name, password, email }: UserType): Promise<any> {
  try {
    const user: UserType = { name, password, email };
    return await saveUser(user, 'sp_create_user');
  } catch (error) {
    throw new Error();
  }
}
