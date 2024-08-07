export type User = {
    UserID: any;
    UserName: string,
    Email: string,
    Phone: string,
    Password: string,
    Birthday: Date,
    AvatarUrl: string
};

export type UserType = {
   
    UserName: string,
    Password: string,
};

export const db = {
    users: [] as User[]
};
