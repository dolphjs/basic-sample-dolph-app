import { INewUser } from "@/interfaces/users.interfaces";
import { IUser, UserModel } from "@/models/user/user.model";
import { DolphServiceHandler } from "@dolphjs/dolph/classes";
import { Dolph } from "@dolphjs/dolph/common";
import { InjectMongo } from "@dolphjs/dolph/decorators";
import { Model } from "mongoose";

@InjectMongo("userModel", UserModel)
export class UserService extends DolphServiceHandler<Dolph> {
    userModel!: Model<IUser>;

    constructor() {
        super("userservice");
    }

    public readonly create = async (data: INewUser) => {
        return this.userModel.create(data);
    };

    public readonly find = async (query: any) => {
        return this.userModel.find(query);
    };

    public readonly findByEmail = async (email: string) => {
        return this.userModel.findOne({ email });
    };
}
