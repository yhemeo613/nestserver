import { MigrationInterface, QueryRunner } from "typeorm";

export class ManualChangeTokenToText1769054733167 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`refresh_tokens\` MODIFY \`token\` TEXT NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`refresh_tokens\` MODIFY \`token\` VARCHAR(255) NOT NULL`);
    }

}
