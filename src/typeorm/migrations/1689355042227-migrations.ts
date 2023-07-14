import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1689355042227 implements MigrationInterface {
    name = 'Migrations1689355042227'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`image\` (\`id\` int NOT NULL AUTO_INCREMENT, \`data\` longblob NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` int NOT NULL DEFAULT '1', \`imageId\` int NULL, UNIQUE INDEX \`REL_0b9cf86bd47b4393165e9bddf3\` (\`imageId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_0b9cf86bd47b4393165e9bddf3c\` FOREIGN KEY (\`imageId\`) REFERENCES \`image\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_0b9cf86bd47b4393165e9bddf3c\``);
        await queryRunner.query(`DROP INDEX \`REL_0b9cf86bd47b4393165e9bddf3\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`image\``);
    }

}
