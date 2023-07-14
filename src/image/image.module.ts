import { Module } from "@nestjs/common";
import { ImageService } from "./image.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import Image from "../typeorm/entities/image.entity";
import { MulterModule } from "@nestjs/platform-express";

@Module({
	imports: [
		TypeOrmModule.forFeature([Image]),
		MulterModule.register()
	],
	providers: [ImageService],
	exports: [ImageService]
})
export class ImageModule { }
