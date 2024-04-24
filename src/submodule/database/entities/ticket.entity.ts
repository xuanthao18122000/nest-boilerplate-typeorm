import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Price, Survey, Task } from '.';
import { IQADataSurvey } from '../../common/interfaces';
import { BigintIdEntity } from './base.entity';
import { VisitingHistory } from './visiting-history.entity';

@Entity('tickets', { schema: 'public' })
export class Ticket extends BigintIdEntity {
  @Column('integer', { name: 'type', default: Ticket.CATEGORY.TEXT })
  type: number;

  @Column('text', { name: 'name', nullable: true })
  name: string;

  @Column('text', { name: 'note', nullable: true })
  note: string;

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: true })
  result: string;

  @Column('jsonb', { name: 'images', nullable: true })
  images: string[];

  @Column({ name: 'is_complete', default: false })
  isComplete: boolean;

  @Column('boolean', { name: 'is_enable', default: false })
  isEnable: boolean;

  @Column('integer', { name: 'staff_id', nullable: true })
  staffId: number;

  @Column('integer', { name: 'survey_id', nullable: true })
  surveyId: number;

  @Column('integer', { name: 'task_id', nullable: true })
  taskId: number;

  @ManyToOne(() => Survey, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'survey_id' })
  survey: Survey;

  @Column({ name: 'qa_data', type: 'jsonb', default: [] })
  qaData: IQADataSurvey[];

  @Column({ default: false })
  status: boolean;

  @ManyToOne(() => Task, (task) => task.tickets, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn([{ name: 'task_id' }])
  task: Task;

  @ManyToOne(
    () => VisitingHistory,
    (visitingHistories) => visitingHistories.tickets,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'visiting_history_id', referencedColumnName: 'id' }])
  visitingHistory: VisitingHistory;

  @Column({ name: 'visiting_history_id' })
  visitingHistoryId: number;

  @OneToMany(() => Price, (price) => price.ticket)
  prices: Price[];

  static CATEGORY = {
    PRICE_REPORT: 1,
    SURVEY: 2,
    TEXT: 3,
  };

  constructor(data: Partial<Ticket>) {
    super();
    if (data) {
      this.type = data.type;
      this.name = data.name;
      this.note = data.note;
      this.images = data.images;
      this.isComplete = data.isComplete;
      this.isEnable = data.isEnable;
      this.staffId = data.staffId;
      this.task = data.task;
      this.status = data.status;
      this.visitingHistory = data.visitingHistory;
    }
  }
}
