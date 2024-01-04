import { serializeUser, serializeUsers } from "@/services/user/serializer";
import { UserService } from "@/services/user/user.service";
import { DolphControllerHandler } from "@dolphjs/dolph/classes";
import {
    Dolph,
    SuccessResponse,
    TryCatchAsyncDec,
    DRequest,
    DResponse,
    BadRequestException,
    InternalServerErrorException,
    NotFoundException,
} from "@dolphjs/dolph/common";
import { generateJWTwithHMAC, hashWithBcrypt } from "@dolphjs/dolph/utilities";
import moment from "moment";

const userService = new UserService();

export class UserController extends DolphControllerHandler<Dolph> {
    constructor() {
        super();
    }

    @TryCatchAsyncDec
    public async defaultMethod(req: DRequest, res: DResponse) {
        SuccessResponse({
            res,
            body: { message: "user endpoint has been reached" },
        });
    }

    @TryCatchAsyncDec
    public async register(req: DRequest, res: DResponse) {
        const { email, password, username } = req.body;

        const user = await userService.find({ $or: [{ email }, { username }] });

        if (user.length)
            throw new BadRequestException(
                "a user with this account already exists"
            );

        const newUser = await userService.create({
            email,
            username,
            password: await hashWithBcrypt({ pureString: password, salt: 10 }),
        });

        if (!newUser)
            throw new InternalServerErrorException(
                "an error occurred while creating user's account"
            );

        SuccessResponse({
            res,
            status: 201,
            body: { data: serializeUser(newUser) },
        });
    }

    @TryCatchAsyncDec
    public async login(req: DRequest, res: DResponse) {
        const { email, password } = req.body;

        const user = await userService.findByEmail(email);

        if (!user) throw new BadRequestException("incorrect login details");

        if (!user.doesPasswordMatch(password))
            throw new BadRequestException("password does not match");

        const token = generateJWTwithHMAC({
            payload: {
                exp: moment().add(1000, "seconds").unix(),
                iat: moment().unix(),
                sub: user.id,
            },
            secret: "random_secret",
        });

        SuccessResponse({
            res,
            status: 200,
            body: { data: { token, user } },
        });
    }

    public async getUsers(req: DRequest, res: DResponse) {
        const users = await userService.find({});

        if (!users.length)
            throw new NotFoundException("there are no registered users");

        SuccessResponse({ res, body: { data: serializeUsers(users) } });
    }
}
