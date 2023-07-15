import {
	Body, Request, Controller, Get, Patch, UseGuards, Post, UploadedFile, UseInterceptors, Res, Param, Delete
} from "@nestjs/common";
import { Response } from "express";
import { UserService } from "./user.service";
import { Role } from "./enums/roles.enum";
import { Roles } from "./decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UserInterface } from "./interfaces/user.interface";
import { RequestWithUser } from "./interfaces/requestWithUser.interface";
import { UpdateUserProfileByAdminDto } from "./dtos/update-user-profile-by-admin.dto";
import {
	ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiConsumes, ApiBody
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags("User")
@ApiBearerAuth()
@Controller("user")
export class UserController {
	constructor(private readonly userService: UserService) { }

	@ApiOperation({ summary: "Get user profile" })
	@ApiResponse({
		status: 200,
		description: "Success"
	})
	@ApiResponse({
		status: 401,
		description: "Unauthorized"
	})
	@UseGuards(JwtAuthGuard)
	@Get("profile")
	public async getProfile(@Request() req: RequestWithUser): Promise<UserInterface> {
		return await this.userService.findById(req.user.id);
	}

	@ApiOperation({ summary: "Get users list by admin" })
	@ApiResponse({
		status: 200,
		description: "Success"
	})
	@ApiResponse({
		status: 401,
		description: "Unauthorized"
	})
	@ApiResponse({
		status: 403,
		description: "Forbidden"
	})
	@Roles(Role.Admin)
	@Get("user-list")
	public async getUserList() {
		return await this.userService.findAll();
	}

	@ApiOperation({ summary: "Update user profile by admin" })
	@ApiResponse({
		status: 200,
		description: "Success"
	})
	@ApiResponse({
		status: 401,
		description: "Unauthorized"
	})
	@ApiResponse({
		status: 403,
		description: "Forbidden"
	})
	@Roles(Role.Admin)
	@Patch("updateProfile")
	public async updateBuyerProfile(@Body() updateUserDto: UpdateUserProfileByAdminDto): Promise<UserInterface> {
		return await this.userService.updateUserProfileByAdmin(updateUserDto);
	}

	@ApiOperation({ summary: "Set avatar" })
	@ApiResponse({
		status: 200,
		description: "Success"
	})
	@ApiResponse({
		status: 401,
		description: "Unauthorized"
	})
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor("image"))
	@ApiConsumes("multipart/form-data")
	@ApiBody({
		description: "Image file",
		schema: {
			type: "object",
			properties: {
				image: {
					type: "string",
					format: "binary",
				},
			},
		},
	})
	@Post("avatar")
	public async setAvatar(
		@UploadedFile() file: Express.Multer.File, @Request() req: RequestWithUser,
	): Promise<boolean> {
		return await this.userService.setAvatar(
			req.user.id,
			file.buffer
		);
	}

	@ApiOperation({ summary: "Get avatar" })
	@ApiResponse({
		status: 200,
		description: "Success"
	})
	@ApiResponse({
		status: 404,
		description: "Not found"
	})
	@Get("avatar/:id")
	public async getAvatarByUserId(
		@Param("id") id: number, @Res() res: Response
	): Promise<void> {
		const image = await this.userService.getAvatar(id);
		res.type("image/jpeg"); // Set the appropriate content type for your image

		res.send(image);
	}

	@ApiOperation({ summary: "Delete avatar" })
	@ApiResponse({
		status: 200,
		description: "Success"
	})
	@ApiResponse({
		status: 401,
		description: "Unauthorized"
	})
	@UseGuards(JwtAuthGuard)
	@Delete("avatar")
	public async removeAvatar(@Request() req: RequestWithUser): Promise<void> {
		await this.userService.removeAvatar(req.user.id);
	}
}
