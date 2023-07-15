import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { Role } from "./enums/roles.enum";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../typeorm/entities/user.entity";
import { ConfigService } from "@nestjs/config";
import { ImageService } from "../image/image.service";
import { Image } from "../typeorm/entities/image.entity";

describe(
	"UsersService",
	() => {
		let service: UserService;

		beforeEach(async () => {
			const module: TestingModule = await Test.createTestingModule({
				providers: [
					ConfigService,
					UserService,
					ImageService,
					{
						provide: getRepositoryToken(User),
						useValue: {
							// Mock the methods of the repository as needed
						}
					},
					{
						provide: getRepositoryToken(Image),
						useValue: {
							// Mock the methods of the repository as needed
						}
					}
				],
			}).compile();

			service = module.get<UserService>(UserService);
		});

		describe(
			"Test UsersService method update",
			() => {

				it(
					"should return mocked data",
					async () => {
						const mockedUserId = 1;
						const mockedUser = {
							name: "username",
							email: "email@user.com",
							password: "pasword",
							role: Role.User
						};
						const updatedUser = {
							id: 1,
							name: "username",
							email: "email@user.com",
							password: "password",
							role: Role.User
						};

						jest.spyOn(
							service,
							"update"
						).mockResolvedValue(updatedUser);

						const result = await service.update(
							mockedUserId,
							mockedUser
						);

						expect(result).toBe(updatedUser);
						expect(service.update).toBeCalled();
						expect(service.update).toBeCalledTimes(1);

					}
				);

				it(
					"should reject if data is invalid",
					async () => {
						const mockedUserId = 1;
						const mockedUser = {
							name: "username",
							email: "wrongEmail",
							password: "password",
							role: 1,
						};

						const errorMessage = "Invalid email format";
						jest.spyOn(
							service,
							"update"
						).mockRejectedValue(new Error(errorMessage));

						await expect(service.update(
							mockedUserId,
							mockedUser
						)).rejects.toThrow(errorMessage);
					}
				);
			}

		);

		describe(
			"Test UsersService method create",
			() => {

				it(
					"should return array of user objects",
					async () => {
						const mockedUser = {
							name: "username",
							email: "email@user.com",
							password: "pasword",
							role: 1
						};
						const createdUser = {
							id: 1,
							name: "username",
							email: "email@user.com",
							password: "pasword",
							role: 1
						};

						jest.spyOn(
							service,
							"create"
						).mockResolvedValue(createdUser);

						const result = await service.create(mockedUser);

						expect(result).toBe(createdUser);
						expect(service.create).toBeCalled();
						expect(service.create).toBeCalledTimes(1);
					}
				);
			}
		);

		describe(
			"Test UsersService method findOne",
			() => {

				it(
					"should return mocked data",
					async () => {

						const userId = 1;
						const foundUser = {
							id: 1,
							name: "username",
							email: "email@user.com",
							password: "password",
							role: 1,
							image: null
						};

						jest.spyOn(
							service,
							"findById"
						).mockResolvedValue(foundUser);

						const result = await service.findById(userId);

						expect(result).toBe(foundUser);
						expect(service.findById).toBeCalled();
						expect(service.findById).toBeCalledTimes(1);
					}
				);
			}

		);

		describe(
			"Test UsersService method findByEmail",
			() => {

				it(
					"should return mocked data",
					async () => {

						const userEmail = "someEmail@test.com";
						const foundUser = {
							id: 1,
							name: "username",
							email: "someEmail@test.com",
							password: "pasword",
							role: 1,
							image: null
						};

						jest.spyOn(
							service,
							"findByEmail"
						).mockResolvedValue(foundUser);

						const result = await service.findByEmail(userEmail);

						expect(result).toBe(foundUser);
						expect(service.findByEmail).toBeCalled();
						expect(service.findByEmail).toBeCalledTimes(1);
					}
				);
			}
		);

		describe(
			"Test UsersService method findAll",
			() => {

				it(
					"should return mocked data",
					async () => {

						const foundUsers = [
							{
								id: 1,
								name: "username",
								email: "someEmail@test.com",
								password: "pasword",
								role: 1
							},
						];

						jest.spyOn(
							service,
							"findAll"
						).mockResolvedValue(foundUsers);

						const result = await service.findAll();

						expect(result).toBe(foundUsers);
						expect(service.findAll).toBeCalled();
						expect(service.findAll).toBeCalledTimes(1);
					}
				);
			}
		);

		describe(
			"Test UsersService method removeById",
			() => {
				it(
					"should return mocked data",
					async () => {
						const userId = 1;

						jest.spyOn(
							service,
							"removeById"
						).mockImplementation();

						await service.removeById(userId);

						expect(service.removeById).toBeCalled();
						expect(service.removeById).toBeCalledTimes(1);
					}
				);

				it(
					"should reject if id is invalid",
					async () => {
						const userId = 2;

						const errorMessage = "User not found";
						jest.spyOn(
							service,
							"removeById"
						).mockRejectedValue(new Error(errorMessage));

						await expect(service.removeById(userId)).rejects.toThrow(errorMessage);
					}
				);
			}
		);

		describe(
			"Test UsersService method getProfile",
			() => {

				it(
					"should return mocked data",
					async () => {

						const id = 1;
						const foundUser = {
							name: "username",
							email: "someEmail@test.com"
						};
						jest.spyOn(
							service,
							"getProfile"
						).mockResolvedValue(foundUser);

						const result = await service.getProfile(id);

						expect(result).toBe(foundUser);
						expect(service.getProfile).toBeCalled();
						expect(service.getProfile).toBeCalledTimes(1);
					}
				);

				it(
					"should reject if user email is invalid",
					async () => {
						const id = 2;

						const errorMessage = "User not found";
						jest.spyOn(
							service,
							"getProfile"
						).mockRejectedValue(new Error(errorMessage));

						await expect(service.getProfile(id)).rejects.toThrow(errorMessage);
					}
				);
			}
		);

		describe(
			"Test UsersService method updateUserProfileByAdmin",
			() => {
				it(
					"should return mocked data",
					async () => {
						const mockedUser = {
							id: 1,
							name: "username",
							email: "email@user.com",
							password: "pasword",
							role: 1
						};
						const updatedUser = {
							id: 1,
							name: "username",
							email: "email@user.com",
							password: "pasword",
							role: 1
						};

						jest.spyOn(
							service,
							"updateUserProfileByAdmin"
						).mockResolvedValue(updatedUser);

						const result = await service.updateUserProfileByAdmin(mockedUser);

						expect(result).toBe(updatedUser);
						expect(service.updateUserProfileByAdmin).toBeCalled();
						expect(service.updateUserProfileByAdmin).toBeCalledTimes(1);
					}
				);

				it(
					"should reject if data is invalid",
					async () => {
						const mockedUser = {
							id: 2,
							name: "username",
							email: "wrongEmail",
							password: "pasword",
							role: 1
						};

						const errorMessage = "User not found";
						jest.spyOn(
							service,
							"updateUserProfileByAdmin"
						).mockRejectedValue(new Error(errorMessage));

						await expect(service.updateUserProfileByAdmin(mockedUser)).rejects.toThrow(errorMessage);
					}
				);
			}
		);

		describe(
			"Test UsersService method setAvatar",
			() => {

				it(
					"should return mocked data",
					async () => {
						const id = 1;
						const file = Buffer.from("ss");
						const success = true;
						jest.spyOn(
							service,
							"setAvatar"
						).mockResolvedValue(success);

						const result = await service.setAvatar(
							id,
							file
						);

						expect(result).toBe(success);
						expect(service.setAvatar).toBeCalled();
						expect(service.setAvatar).toBeCalledTimes(1);
					}
				);

				it(
					"should reject if data is invalid",
					async () => {
						const id = 1;
						const file = Buffer.from("ss");
						const errorMessage = "User not found";
						jest.spyOn(
							service,
							"setAvatar"
						).mockRejectedValue(new Error(errorMessage));

						await expect(service.setAvatar(
							id,
							file
						)).rejects.toThrow(errorMessage);
					}
				);
			}
		);

		describe(
			"Test UsersService method getAvatar",
			() => {

				it(
					"should return mocked data",
					async () => {
						const id = 1;
						const file = Buffer.from("ss");

						jest.spyOn(
							service,
							"getAvatar"
						).mockResolvedValue(file);

						const result = await service.getAvatar(id);

						expect(result).toBe(file);
						expect(service.getAvatar).toBeCalled();
						expect(service.getAvatar).toBeCalledTimes(1);
					}
				);

				it(
					"should reject if data is invalid",
					async () => {
						const id = 1;
						const errorMessage = "User not found";
						jest.spyOn(
							service,
							"getAvatar"
						).mockRejectedValue(new Error(errorMessage));

						await expect(service.getAvatar(id)).rejects.toThrow(errorMessage);
					}
				);
			}
		);

		describe(
			"Test UsersService method removeAvatar",
			() => {

				it(
					"should return mocked data",
					async () => {
						const id = 1;
						
						jest.spyOn(
							service,
							"removeAvatar"
						).mockImplementation();

						await service.removeAvatar(id);

						expect(service.removeAvatar).toBeCalled();
						expect(service.removeAvatar).toBeCalledTimes(1);
					}
				);

				it(
					"should reject if data is invalid",
					async () => {
						const id = 1;
						const errorMessage = "User not found";
						jest.spyOn(
							service,
							"removeAvatar"
						).mockRejectedValue(new Error(errorMessage));

						await expect(service.removeAvatar(id)).rejects.toThrow(errorMessage);
					}
				);
			}
		);
	}
);
