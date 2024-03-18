import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { IQuestionsSurvey } from '../../common/interfaces';
import { IntIdEntity } from './base.entity';
import { Task } from './task.entity';
import { User } from './user.entity';

@Entity({ name: 'surveys' })
export class Survey extends IntIdEntity {
  @Column({ name: 'questions', type: 'jsonb', default: [] })
  questions: IQuestionsSurvey[];

  @Column({ name: 'task_id', type: 'int', nullable: true })
  taskId: number;

  @OneToOne(() => Task, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @Column({ name: 'creator_id', type: 'int', nullable: true })
  creatorId: number;

  @ManyToOne(() => User, (creator) => creator.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  static TYPE_QUESTION = {
    TEXT: 1,
    SINGLE_CHOICE: 2,
    MULTIPLE_CHOICE: 3,
    RATING: 4,
  };

  constructor(partial: Partial<Survey>) {
    super();
    Object.assign(this, partial);
  }
}
