import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOptions } from 'src/submodule/common/builder';
import FilterBuilder from 'src/submodule/common/builder/filter.builder';
import UpdateBuilder from 'src/submodule/common/builder/update.builder';
import { ErrorHttpException } from 'src/submodule/common/exceptions/throw.exception';
import { listResponse } from 'src/submodule/common/response/response-list.response';
import { Survey, Task, Ticket, User } from 'src/submodule/database/entities';
import { Repository } from 'typeorm';
import { AreaService } from '../area/area.service';
import { LocationService } from '../location/location.service';
import { ROUService } from '../rou/rou.service';
import { StaffService } from '../staff/staff.service';
import {
  CreateQuestionsDto,
  CreateTaskDto,
  ListTaskDto,
  UpdateTaskDto,
} from './dto/task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,

    @InjectRepository(Survey)
    private surveyRepo: Repository<Survey>,

    @InjectRepository(Ticket)
    private ticketRepo: Repository<Ticket>,

    private readonly rouService: ROUService,

    private readonly areaService: AreaService,

    private readonly staffService: StaffService,

    private readonly locationService: LocationService,
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
      .addNumber('customerType')
      .addDate('createdAt', 'createdDateFrom', 'createdDateTo')
      .addPagination()
      .sortBy('id');

    const [tasks, total] = await filterBuilder.getManyAndCount();
    const list = [];

    for (const task of tasks) {
      const [provinces, rous] = await Promise.all([
        this.locationService.getProvincesByIds(task.provinceIds),
        this.rouService.getRousByIds(task.rouIds),
      ]);

      list.push({
        ...task,
        provinces,
        rous,
      });
    }

    return listResponse(list, total, query);
  }

  async getOne(id: number): Promise<Partial<Task>> {
    const task = await this.findTaskByPkRelation(id);
    return task;
  }

  async surveyResults(taskId: number, query: PaginationOptions) {
    const entity = {
      entityRepo: this.ticketRepo,
      alias: 'ticket',
    };

    const filterBuilder = new FilterBuilder(entity, query)
      .addNumber('taskId', taskId)
      .addPagination()
      .sortBy('id');

    const [list, total] = await filterBuilder.getManyAndCount();
    return listResponse(list, total, query);
  }

  async create(body: CreateTaskDto, creator: User): Promise<Task> {
    const {
      category,
      name,
      customerType,
      isRequired,
      endDate,
      startDate,
      survey,
      isAllRous,
      rouIds,
      isAllProvinces,
      provinceIds,
    } = body;

    let task = await this.createAndSaveTask({
      name,
      endDate,
      startDate,
      category,
      customerType,
      isRequired,
      isAllRous,
      rouIds,
      isAllProvinces,
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
        'customerType',
        'isRequired',
        'status',
        'startDate',
        'endDate',
        'isAllRous',
        'rouIds',
        'isAllProvinces',
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
