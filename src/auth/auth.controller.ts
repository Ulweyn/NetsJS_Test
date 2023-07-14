import {
	Body, Controller, Patch, Post, Request, UseGuards
} from "@nestjs/common";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { AuthService } from "./auth.service";
import { ForgotPasswordDto } from "./dtos/forgot-password.dto";
import { ChangePasswordDto } from "./dtos/change-password.dto";
import {
	ApiBearerAuth, ApiOperation, ApiResponse, ApiTags
} from "@nestjs/swagger";
import { LoginDto } from "./dtos/login.dto";
import { RegisterDto } from "./dtos/register.dto";
import { TokenInterface } from "../auth/interfaces/tokenInterface.interface";

@ApiTags("Authentification")
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {
	}

	@ApiOperation({ summary: "Sign up" })
	@ApiResponse({
		status: 200,
		description: "Registered successfully"
	})
	@ApiResponse({
		status: 400,
		description: "Bad request"
	})
	@ApiResponse({
		status: 409,
		description: "User already exists"
	})
	@Post("register")
	public async register(@Body() req: RegisterDto): Promise<TokenInterface> {
		return await this.authService.register(req);
	}

	@ApiOperation({ summary: "Login" })
	@ApiResponse({
		status: 200,
		description: "Logged in successfully"
	})
	@ApiResponse({
		status: 401,
		description: "Unauthorized"
	})
	@ApiResponse({
		status: 400,
		description: "Invalid email"
	})
	@Post("login")
	public async login(@Body() req: LoginDto): Promise<TokenInterface> {
		return await this.authService.login(req);
	}

	@ApiOperation({ summary: "Forgot password" })
	@ApiResponse({
		status: 201,
		description: "Email with link has been sent"
	})
	@ApiResponse({
		status: 400,
		description: "Bad request"
	})
	@Post("forgotPassword")
	public async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<void> {
		return await this.authService.forgotPassword(forgotPasswordDto);
	}

	@ApiBearerAuth()
	@ApiOperation({ summary: "Change password" })
	@ApiResponse({
		status: 200,
		description: "Password changed successfully"
	})
	@ApiResponse({
		status: 401,
		description: "Unauthorized"
	})
	@UseGuards(JwtAuthGuard)
	@Patch("changePassword")
	public async changePassword(
		@Request() req,
		@Body() changePasswordDto: ChangePasswordDto
	): Promise<boolean> {
		return await this.authService.changePassword(
			req.user.email,
			changePasswordDto
		);
	}
}
