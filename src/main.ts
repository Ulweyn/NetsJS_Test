import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ClassSerializerInterceptor } from "@nestjs/common";

async function bootstrap() {
		const app = await NestFactory.create(AppModule);
		app.useGlobalPipes();
		app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
		const config = new DocumentBuilder().addBearerAuth()
			.setTitle("Test app")
			.setDescription("Tesr Rest API description")
			.setVersion("1.0")
			.build();
		const document = SwaggerModule.createDocument(
			app,
			config
		);
		SwaggerModule.setup(
			"api",
			app,
			document
		);
		await app.listen(Number(process.env.PORT) | 3000);
}
bootstrap();
