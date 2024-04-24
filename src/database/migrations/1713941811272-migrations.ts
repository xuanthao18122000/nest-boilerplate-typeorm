import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1713941811272 implements MigrationInterface {
  name = 'Migrations1713941811272';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ff52efd2c70fcbf7481bb919ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "price-breakdowns" DROP COLUMN "discount"`,
    );
    await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "is_required"`);
    await queryRunner.query(`ALTER TABLE "prices" DROP COLUMN "discount"`);
    await queryRunner.query(`ALTER TABLE "prices" DROP COLUMN "keys"`);
    await queryRunner.query(`ALTER TABLE "prices" DROP COLUMN "pick_up_type"`);
    await queryRunner.query(`ALTER TABLE "staffs" DROP COLUMN "provinceIds"`);
    await queryRunner.query(`ALTER TABLE "staffs" DROP COLUMN "areaIds"`);
    await queryRunner.query(`ALTER TABLE "staffs" DROP COLUMN "districtIds"`);
    await queryRunner.query(`ALTER TABLE "staffs" DROP COLUMN "sale_head_id"`);
    await queryRunner.query(`ALTER TABLE "staffs" DROP COLUMN "is_all_rous"`);
    await queryRunner.query(`ALTER TABLE "staffs" DROP COLUMN "rou_ids"`);
    await queryRunner.query(`ALTER TABLE "promotions" DROP COLUMN "areaIds"`);
    await queryRunner.query(
      `ALTER TABLE "promotions" DROP COLUMN "provinceIds"`,
    );
    await queryRunner.query(`ALTER TABLE "ORPs" DROP COLUMN "type_category"`);
    await queryRunner.query(
      `ALTER TABLE "kpi-registration-dates" DROP COLUMN "start_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kpi-registration-dates" DROP COLUMN "end_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "provinceIds"`,
    );
    await queryRunner.query(
      `ALTER TABLE "price-policies" DROP COLUMN "discount"`,
    );
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "provinceIds"`);
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP COLUMN "price_customer_type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "potentials" DROP COLUMN "type_category"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "potentials" ADD "type_category" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD "price_customer_type" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD "provinceIds" integer array NOT NULL DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "price-policies" ADD "discount" numeric NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "provinceIds" integer array NOT NULL DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "kpi-registration-dates" ADD "end_date" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "kpi-registration-dates" ADD "start_date" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(`ALTER TABLE "ORPs" ADD "type_category" integer`);
    await queryRunner.query(
      `ALTER TABLE "promotions" ADD "provinceIds" integer array NOT NULL DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "promotions" ADD "areaIds" integer array NOT NULL DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "staffs" ADD "rou_ids" integer array NOT NULL DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "staffs" ADD "is_all_rous" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "staffs" ADD "sale_head_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "staffs" ADD "districtIds" integer array NOT NULL DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "staffs" ADD "areaIds" integer array NOT NULL DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "staffs" ADD "provinceIds" integer array NOT NULL DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "prices" ADD "pick_up_type" character varying NOT NULL DEFAULT 'normal'`,
    );
    await queryRunner.query(
      `ALTER TABLE "prices" ADD "keys" jsonb NOT NULL DEFAULT '[]'`,
    );
    await queryRunner.query(
      `ALTER TABLE "prices" ADD "discount" numeric NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "tickets" ADD "is_required" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "price-breakdowns" ADD "discount" numeric NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ff52efd2c70fcbf7481bb919ec" ON "ORPs" ("phone_number") `,
    );
  }
}
