import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ActivityLogService } from 'src/modules/activity-log/activity-log.service';
import { LocationService } from 'src/modules/location/location.service';
import { RbacModuleService } from 'src/modules/rbac-module/rbac-module.service';
import { UserController } from 'src/modules/user/user.controller';
import { UserService } from 'src/modules/user/user.service';
import {
  Location,
  ROU,
  RbacAction,
  RbacModule,
  Role,
  User,
  UserAction,
} from 'src/submodules/database/entities';
import { Repository } from 'typeorm';

describe('UserController', () => {
  let userController: UserController;
  const mockActivityLogService = {};
  const mockLocationService = {};
  const mockRbacModuleService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Role),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Location),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ROU),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(RbacModule),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(RbacAction),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserAction),
          useClass: Repository,
        },
        {
          provide: ActivityLogService,
          useValue: mockActivityLogService,
        },
        {
          provide: LocationService,
          useValue: mockLocationService,
        },
        {
          provide: RbacModuleService,
          useValue: mockRbacModuleService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });
});
