
import { Role } from "src/user/enums/roles.enum";
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	JoinColumn,
	OneToOne
} from "typeorm";
import Image from "./image.entity";
import { Exclude } from "class-transformer";

@Entity({ name: "users" })
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	email: string;

	@Exclude()
	@Column()
	password: string;

	@Column({ default: 1 })
	role: Role;

	@OneToOne(
		() => Image,
		{ cascade: true }
	)
	@JoinColumn()
	image: Image;

}
