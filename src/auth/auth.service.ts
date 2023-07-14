import {
	BadRequestException,
	ConflictException,
	Injectable,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ForgotPasswordDto } from "./dtos/forgot-password.dto";
import { ConfigService } from "@nestjs/config";
import { MailService } from "../mail/mail.service";
import * as bcrypt from "bcrypt";
import { ChangePasswordDto } from "./dtos/change-password.dto";
import TokenPayloadInterface from "./interfaces/tokenPayload.interface";
import { LoginDto } from "./dtos/login.dto";
import { RegisterDto } from "./dtos/register.dto";
import { UserService } from "src/user/user.service";
import { UserInterface } from "../user/interfaces/user.interface";
import { TokenInterface } from "../auth/interfaces/tokenInterface.interface";
import { Helper } from "src/helper/helper";

@Injectable()
export class AuthService {
	private readonly clientAppUrl: string;
	private readonly saltRounds: number;
	private readonly helper: Helper;

	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly mailService: MailService,
	) {
		this.clientAppUrl = this.configService.get<string>("URL");
		this.saltRounds = parseInt(this.configService.get<string>("SALT_ROUNDS"));
		this.helper = new Helper();
	}

	public async validateUser(
		email: string, pass: string
	): Promise<Partial<UserInterface> | null> {
		try {
			const user = await this.userService.findByEmail(email);
			const { password, ...result } = user;
			if (user && (await bcrypt.compare(
				pass,
				password
			))) {
				return result;
			}
			return null;
		} catch (error) {
			throw new Error(error);
		}
	}

	private createToken(payload: TokenPayloadInterface): TokenInterface {
		return {
			access_token: this.jwtService.sign(payload),
		};
	}

	public async login(user: LoginDto): Promise<TokenInterface> {
		try {
			const loginUser = await this.userService.findByEmail(user.email);
			if (!loginUser) {
				throw new BadRequestException("Invalid email");
			}
			const { id, role } = loginUser;
			const payload = { email: user.email, id: id, role: role };
			return this.createToken(payload);
		} catch (error) {
			throw new Error(error);
		}
	}

	public async register(dataValues: RegisterDto): Promise<TokenInterface> {
		const { name, email, role } = dataValues;
		const user = await this.userService.findByEmail(email);
		if (user) {
			throw new ConflictException("User already exists");
		}
		const password = await this.helper.hashPassword(
			dataValues.password,
			this.saltRounds
		);

		const createdUser = await this.userService.create({ name, email, password, role });

		return this.createToken({ email: createdUser.email, id: createdUser.id, role: createdUser.role });
	}

	public async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
		try {
			const user = await this.userService.findByEmail(forgotPasswordDto.email);
			if (!user) {
				throw new BadRequestException("Invalid email");
			}
			const token = this.createToken({ email: user.email, id: user.id, role: user.role });
			const forgotLink = `${this.clientAppUrl}/auth/forgotPassword?token=${token.access_token}`;
			await this.mailService.send({
				from: this.configService.get<string>("MAIL"),
				to: user.email,
				subject: "Forgot Password",
				html: `
                <h3>Hello ${user.name}!</h3>
                <p>Please use this <a href="${forgotLink}">link</a> to reset your password.</p>
            `,
			});
		} catch (error) {
			throw new Error(error);
		}
	}

	public async changePassword(
		userEmail: string,
		changePasswordDto: ChangePasswordDto
	): Promise<boolean> {
		try {
			const password = await this.helper.hashPassword(
				changePasswordDto.password,
				this.saltRounds
			);
			const user = await this.userService.findByEmail(userEmail);
			await this.userService.update(
				user.id,
				{ password }
			);
			return true;
		} catch (error) {
			throw new Error(error);
		}
	}
}