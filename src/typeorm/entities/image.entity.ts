import {
	Column, Entity, OneToOne, PrimaryGeneratedColumn
} from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Image {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "longblob", nullable: false })
	data: Buffer;

	@OneToOne(
		() => User,
		(user: User) => user.image
	)
	user: User;
}