import { Column, Entity } from 'typeorm';
import { UUIDIdentifiableEntity } from './base.entity';

@Entity({ name: 'media_files' })
export class MediaFile extends UUIDIdentifiableEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ name: 'physical_path', nullable: true })
  physicalPath: string;

  @Column({ nullable: true, name: 'mime_type' })
  mimeType: string;

  @Column({ nullable: true })
  size: number;

  @Column({ nullable: true })
  extension: string;

  @Column({ nullable: true, type: 'jsonb' })
  variants: object;

  @Column({ nullable: true, default: MediaFile.STATUS.ACTIVE })
  status: number;

  static STATUS = {
    ACTIVE: 1,
    INACTIVE: -1,
  };

  static SIZES = {
    THUMP: 240,
    RESOLUTIONS: [1080, 720, 480, 360, 240, 128, 'thumbnail'],
  };

  constructor(data: Partial<MediaFile>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }

  serialize() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
