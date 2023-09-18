import { Column, Entity } from 'typeorm';
import { BaseEntity } from './';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column()
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'text', name: 'full_name' })
  fullName: string;

  @Column({ type: 'varchar', name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  token: string;

  @Column({ type: 'int', nullable: true })
  gender: number;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', nullable: true })
  avatar: string;

  @Column({ type: 'int', default: -1 })
  status: number;

  static STATUS_USER = {
    /** Đang hoạt động */
    ACTIVE: 1,
    /** Ngừng hoạt động */
    INACTIVE: -1,
    /** Khóa */
    LOCKED: -2,
  };

  static GENDER_USER = {
    /** Nam */
    MALE: 1,
    /** Nữ */
    FEMALE: 2,
  };

  serialize() {
    return {
      id: this.id,
      email: this.email,
      fullName: this.fullName,
      phoneNumber: this.phoneNumber,
      gender: this.gender,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
