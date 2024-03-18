import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import FilterBuilder from 'src/submodules/common/builder/filter.builder';
import UpdateBuilder from 'src/submodules/common/builder/update.builder';
import { ErrorHttpException } from 'src/submodules/common/exceptions/throw.exception';
import { listResponse } from 'src/submodules/common/response/response-list.response';
import { Survey, Task, User } from 'src/submodules/database/entities';
import { Repository } from 'typeorm';
import {
  CreateQuestionsDto,
  CreateTaskDto,
  ListTaskDto,
  StatisticsTasksDto,
  UpdateTaskDto,
} from './dto/task.dto';
@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,

    @InjectRepository(Survey)
    private surveyRepo: Repository<Survey>,
  ) {}

  async getAll(query: ListTaskDto) {
    const entity = {
      entityRepo: this.taskRepo,
      alias: 'task',
    };

    const filterBuilder = new FilterBuilder(entity, query)
      .addLeftJoinAndSelect(['id', 'fullName', 'email'], 'creator')
      .addUnAccentString('name')
      .addNumber('id')
      .addNumber('status')
      .addNumber('category')
      .addNumber('creatorId')
      .addNumber('provinceId')
      .addDate('createdAt', 'createdDateFrom', 'createdDateTo')
      .addPagination()
      .sortBy('id');

    const [list, total] = await filterBuilder.getManyAndCount();
    return listResponse(list, total, query);
  }

  async statisticsTasks({ provinceId, month, year }: StatisticsTasksDto) {
    console.log({ provinceId, month, year });
  }

  async getOne(id: number): Promise<Partial<Task>> {
    const task = await this.findTaskByPkRelation(id);
    return task;
  }

  async create(body: CreateTaskDto, creator: User): Promise<Task> {
    const { category, name, endDate, startDate, survey, provinceIds } = body;
    let task = await this.createAndSaveTask({
      name,
      endDate,
      startDate,
      category,
      provinceIds,
      creatorId: creator.id,
    });

    if (category === Task.CATEGORY.SURVEY) {
      const newSurvey = await this.saveSurveysTask(
        task.id,
        survey.questions,
        creator.id,
      );
      task.surveyId = newSurvey.id;
      task = await this.taskRepo.save(task);
    }

    return task;
  }

  private async saveSurveysTask(
    taskId: number,
    questions: CreateQuestionsDto[],
    creatorId: number,
  ) {
    const survey = this.surveyRepo.create({
      questions: [],
      taskId,
      creatorId,
    });

    for (const item of questions) {
      const { type, isRequired, question, images, answers } = item;

      survey.questions.push({
        type,
        question,
        isRequired,
        answers,
        images,
      });
    }

    return await this.surveyRepo.save(survey);
  }

  private async createAndSaveTask(data: Partial<Task>) {
    const task = this.taskRepo.create(data);
    return await this.taskRepo.save(task);
  }

  async update(
    id: number,
    { survey, ...body }: UpdateTaskDto,
    updater: User,
  ): Promise<Task> {
    const task = await this.taskRepo.findOneBy({ id });

    const dataUpdate = new UpdateBuilder(task, body)
      .updateColumns([
        'name',
        'category',
        'status',
        'startDate',
        'endDate',
        'provinceIds',
      ])
      .getNewData();

    if (body.category) {
      if (body.category === Task.CATEGORY.SURVEY) {
        const newSurvey = await this.surveyRepo.save({
          questions: survey.questions,
          taskId: id,
          creatorId: updater.id,
        });

        dataUpdate.surveyId = newSurvey.id;
      } else {
        await this.surveyRepo.delete({ id: task.surveyId });
        task.surveyId = null;
      }
    }

    if (!body.category && survey?.questions) {
      const surveyTask = await this.surveyRepo.findOneBy({ id: task.surveyId });
      surveyTask.questions = survey.questions;
      await this.surveyRepo.save(surveyTask);
    }

    return await this.taskRepo.save(dataUpdate);
  }

  async findTaskByPkRelation(id: number): Promise<Task> {
    const task = await this.taskRepo
      .createQueryBuilder('task')
      .leftJoin('task.creator', 'creator')
      .leftJoin('task.survey', 'survey')
      .select([
        'task',
        'creator.id',
        'creator.fullName',
        'creator.email',
        'survey',
      ])
      .where('task.id = :id', { id })
      .getOne();

    if (!task) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'TASK_NOT_FOUND');
    }

    return task;
  }
}
