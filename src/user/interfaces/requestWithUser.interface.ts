import { Request } from "express";
import { User } from "../../typeorm/entities/user.entity";

export interface RequestWithUser extends Request {
	user: User;
}