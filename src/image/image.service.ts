import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Image } from "../typeorm/entities/image.entity";
import { Repository } from "typeorm";

@Injectable()
export class ImageService {
	constructor(@InjectRepository(Image) private imageRepository: Repository<Image>) { }

	async uploadImage(imageData: Express.Multer.File): Promise<Image> {
		const image = new Image();
		
		image.data = Buffer.from(imageData.buffer);
		return await this.imageRepository.save(image);
	}

	async getImageById(id: number): Promise<Image> {
		const image = await this.imageRepository.findOne({ where: { id } });
		if (!image) {
			return null;
		}
		return image;
	}

	async updateImageById(
		id: number,
		imageData: Express.Multer.File
	): Promise<Image> {
		const image = await this.getImageById(id);
		if (!image) {
			throw new NotFoundException("Image not found");
		}
		image.data = Buffer.from(imageData.buffer);

		return await this.imageRepository.save(image);
	}

	async removeImageById(id: number): Promise<void> {
		const image = await this.imageRepository.findOne({ where: { id } });
		if (!image) {
			throw new NotFoundException("Image not found");
		}
		await this.imageRepository.delete(image);
	}
}
