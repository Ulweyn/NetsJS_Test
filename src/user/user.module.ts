import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../typeorm/entities/user.entity";
import { UserController } from "./user.controller";
import { ConfigModule } from "@nestjs/config";
import { ImageModule } from "../image/image.module";
import { MulterModule } from "@nestjs/platform-express";

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		ConfigModule.forRoot({
			envFilePath: ".env"
		}),
		ImageModule,
		MulterModule.register()
	],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService]
})
export class UserModule { }
