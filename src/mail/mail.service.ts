import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createTransport, Transporter } from "nodemailer";
import { MailData } from "./interfaces/mail.interface";

@Injectable()
export class MailService {

	private transport: Transporter;

	constructor(public readonly configService: ConfigService) {
		this.transport = createTransport({
			host: configService.get<string>("MAIL_HOST"),
			port: configService.get<number>("MAIL_PORT"),
			auth: {
				user: configService.get<string>("MAIL_USER"),
				pass: configService.get<string>("MAIL_PASS")
			}
		});
	}

	async send(mailOptions: MailData): Promise<void> {
		await this.transport.sendMail(
			mailOptions,
			(
				error, info
			) => {
				if (error) {
					return console.log(error);
				}
				// Just to show that it works
				console.log(
					"Message sent: %s",
					info.messageId
				);
			}
		);
	}
}
