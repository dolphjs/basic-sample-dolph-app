import { transformDoc } from "@dolphjs/dolph/packages";
import { compareWithBcryptHash } from "@dolphjs/dolph/utilities";
import { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    bio: string;
    img: string;
    createdAt: Date;
    updatedAt: Date;
    doesPasswordMatch: (password: string) => Promise<boolean>;
}

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        bio: {
            type: String,
            maxlength: 300,
        },
        img: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

UserSchema.plugin(transformDoc);

UserSchema.methods.doesPasswordMatch = async function (
    password: string
): Promise<boolean> {
    const user = this as IUser;
    return compareWithBcryptHash({
        pureString: password,
        hashString: user.password,
    });
};

export const UserModel = model<IUser>("users", UserSchema);
