import {
	Injectable,
	NotFoundException
} from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "../typeorm/entities/user.entity";
import { Image } from "../typeorm/entities/image.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UserInterface } from "../user/interfaces/user.interface";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UpdateUserProfileByAdminDto } from "./dtos/update-user-profile-by-admin.dto";
import { Helper } from "src/helper/helper";
import { ConfigService } from "@nestjs/config";
import { ImageService } from "src/image/image.service";

@Injectable()
export class UserService {
	private readonly helper: Helper;
	private readonly saltRounds: number;

	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		private readonly configService: ConfigService,
		private readonly imageService: ImageService
	) {
		this.helper = new Helper();
		this.saltRounds = parseInt(this.configService.get<string>("SALT_ROUNDS"));
	}

	public async create(createUserDto: CreateUserDto): Promise<UserInterface> {
		const user = this.userRepository.create(createUserDto);

		return await this.userRepository.save(user);
	}

	public async update(
		id: number, updateUserDto: Partial<UpdateUserDto>
	): Promise<UserInterface> {
		const user = await this.userRepository.findOne({ where: { id } });
		if (!user) {
			throw new NotFoundException("User not found");
		}
		Object.assign(
			user,
			updateUserDto
		);
		await this.userRepository.save(user);
		return await this.findById(user.id);
	}

	public async findAll(): Promise<UserInterface[]> {
		const users = await this.userRepository.find();
		return users;
	}

	public async findById(id: number): Promise<User | null> {
		const user = await this.userRepository.findOne({ where: { id }, relations: ["image"] });
		if (!user) {
			return null;
		}
		return user;
	}

	public async findByEmail(email: string): Promise<User | null> {
		const user = await this.userRepository.findOne({ where: { email } });
		if (!user) {
			return null;
		}
		return user;
	}

	public async removeById(id: number): Promise<void> {
		const user = await this.findById(id);
		if (!user) {
			throw new NotFoundException("User not found");
		}
		await this.userRepository.remove(user);
	}

	public async getProfile(id: number): Promise<Partial<UserInterface>> {
		const user = await this.findById(id);
		if (!user) {
			throw new NotFoundException("User not found");
		}
		return { name: user.name, email: user.email };
	}

	public async updateUserProfileByAdmin(updateUser: UpdateUserProfileByAdminDto): Promise<UserInterface> {
		const user = await this.findById(updateUser.id);
		if (!user) {
			throw new NotFoundException("User not found");
		}
		user.name = updateUser.name ? updateUser.name : user.name;
		user.email = updateUser.email ? updateUser.email : user.email;
		if (updateUser.password) {
			user.password = await this.helper.hashPassword(
				updateUser.password,
				this.saltRounds
			);
		}

		await this.userRepository.save(user);
		return user;
	}

	public async setAvatar(
		id: number,
		file: Express.Multer.File
	): Promise<boolean> {
		const user = await this.findById(id);
		if (!user) {
			throw new NotFoundException("User not found");
		}

		if (!user.image) {
			const avatar = await this.imageService.uploadImage(file);
			user.image = avatar;
			await this.userRepository.save(user);

		} else {
			await this.imageService.updateImageById(
				user.image.id,
				file
			);
		}
		return true;
	}

	public async getAvatar(id: number): Promise<Buffer | null> {
		const user = await this.findById(id);
		if (!user) {
			throw new NotFoundException("User not found");
		}
		if (user.image) {
			const image = await this.imageService.getImageById(user.image.id);
			return image.data;
		}
		return null;
	}

	public async removeAvatar(id: number): Promise<void> {
		const user = await this.findById(id);
		if (!user) {
			throw new NotFoundException("User not found");
		}
		if (user.image) {
			const imageId = user.image.id;
			user.image = null;
			await this.userRepository.save(user);
			await this.imageService.removeImageById(imageId);
		}
	}
}
