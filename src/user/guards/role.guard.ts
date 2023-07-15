import {
	Injectable, CanActivate, ExecutionContext
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../enums/roles.enum";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";

@Injectable()
export class RolesGuard extends JwtAuthGuard implements CanActivate {
	constructor(private reflector: Reflector) {
		super();
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const requiredRole = this.reflector.getAllAndOverride<Role[]>(
			ROLES_KEY,
			[
				context.getHandler(),
				context.getClass(),
			]
		);
		if (!requiredRole) {
			return true;
		}
		await super.canActivate(context);
		const request = context.switchToHttp().getRequest();
		return requiredRole == request.user.role;
	}
}
