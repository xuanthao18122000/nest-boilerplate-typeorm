import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import FilterBuilderService from "src/common/filter-builder/filter-builder.service";
import { User } from "src/database/entities";
import { UserController } from "src/modules/user/user.controller"
import { UserService } from "src/modules/user/user.service";
import { Repository } from "typeorm";

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        FilterBuilderService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('UserController: should be defined', () => {
    expect(userController).toBeDefined();
  });

})