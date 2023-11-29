import { UserController } from "@/controllers/user/user.controller";
import { DolphRouteHandler } from "@dolphjs/dolph/classes";
import { Dolph } from "@dolphjs/dolph/common";

export class UserRouter extends DolphRouteHandler<Dolph> {
    constructor() {
        super();
        this.initRoutes();
    }

    public readonly path: string = "/users";
    controller = new UserController();

    initRoutes(): void {
        // this.router.get(`${this.path}`, this.controller.defaultMethod);
        this.router.get(`${this.path}`, this.controller.getUsers);
        this.router.post(`${this.path}/register`, this.controller.register);
    }
}
