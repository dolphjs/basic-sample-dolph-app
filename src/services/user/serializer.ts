import { IUser } from "@/models/user/user.model";

export const serializeUser = (user: IUser) => {
    if (!user) return {};

    const { username, email, bio, img, createdAt, updatedAt, _id } = user;

    return { id: _id, username, email, bio, img, createdAt, updatedAt };
};

export const serializeUsers = (users: IUser[]) => {
    if (!users.length) return [];

    let usersArr = [];

    users.map((user) => {
        usersArr.push(serializeUser(user));
    });

    return usersArr;
};
