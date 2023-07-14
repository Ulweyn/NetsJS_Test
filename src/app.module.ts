import { Module, ValidationPipe } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { APP_PIPE } from "@nestjs/core";
import { ImageModule } from "./image/image.module";
import { dataSourceOptions } from "./typeorm/data-source";

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: ".env",
		}),
		UserModule,
		TypeOrmModule.forRoot(dataSourceOptions),
		AuthModule,
		ImageModule,
	],
	providers: [
		{
			provide: APP_PIPE,
			useValue: new ValidationPipe({
				whitelist: true,
			}),
		},],
})
export class AppModule { }
