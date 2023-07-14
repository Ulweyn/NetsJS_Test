import { DataSource, DataSourceOptions } from "typeorm";
import { config } from "dotenv";

config();
export const dataSourceOptions: DataSourceOptions = {
	type: "mysql",
	host: process.env.DB_HOST,
	port: Number(process.env.MYSQL_PORT),
	username: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
	entities: ["dist/typeorm/entities/*.entity.js"],
	migrations: ["dist/typeorm/migrations/*.js"]
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;