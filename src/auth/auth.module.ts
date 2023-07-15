import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { AuthController } from "./auth.controller";
import { ConfigModule } from "@nestjs/config";
import { MailModule } from "../mail/mail.module";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "../user/guards/role.guard";

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: ".env"
		}),
		UserModule,
		PassportModule.register({ defaultStrategy: "jwt" }),
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: process.env.SESSION_EXPIRE },
		}),
		MailModule
	],
	providers: [
		AuthService,
		LocalStrategy,
		JwtStrategy, {
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
	],
	controllers: [AuthController]
})
export class AuthModule {
}
