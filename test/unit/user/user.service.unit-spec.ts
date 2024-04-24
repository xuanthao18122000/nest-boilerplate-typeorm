import { CreateUserDto } from 'src/modules/user/dto/user.dto';

describe('User Service', () => {
  // let userService: UserService;

  const mockUserRepository = {
    getAll: jest.fn().mockResolvedValue([
      { id: 1, fullName: 'User 1' },
      { id: 2, fullName: 'User 2' },
    ]),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  // const mockRoleRepository = {
  //   getAll: jest.fn().mockResolvedValue([]),
  //   create: jest.fn(),
  //   save: jest.fn(),
  //   findOne: jest.fn(),
  //   findOneBy: jest.fn(),
  //   update: jest.fn(),
  //   delete: jest.fn(),
  // };
  // const mockROURepository = {
  //   getAll: jest.fn().mockResolvedValue([]),
  //   create: jest.fn(),
  //   save: jest.fn(),
  //   findOne: jest.fn(),
  //   findOneBy: jest.fn(),
  //   update: jest.fn(),
  //   delete: jest.fn(),
  // };
  // const mockRbacModuleRepository = {
  //   getAll: jest.fn().mockResolvedValue([]),
  //   create: jest.fn(),
  //   save: jest.fn(),
  //   findOne: jest.fn(),
  //   findOneBy: jest.fn(),
  //   update: jest.fn(),
  //   delete: jest.fn(),
  // };
  // const mockRbacActionRepository = {
  //   getAll: jest.fn().mockResolvedValue([]),
  //   create: jest.fn(),
  //   save: jest.fn(),
  //   findOne: jest.fn(),
  //   findOneBy: jest.fn(),
  //   update: jest.fn(),
  //   delete: jest.fn(),
  // };
  // const mockUserActionRepository = {
  //   getAll: jest.fn().mockResolvedValue([]),
  //   create: jest.fn(),
  //   save: jest.fn(),
  //   findOne: jest.fn(),
  //   findOneBy: jest.fn(),
  //   update: jest.fn(),
  //   delete: jest.fn(),
  // };

  // const mockActivityLogService = {};
  // const mockRbacModuleService = {};
  // const mockLocationService = {
  //   getProvince: jest.fn().mockResolvedValue([]),
  // };

  beforeEach(async () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   providers: [
    //     UserService,
    //     {
    //       provide: getRepositoryToken(User),
    //       useValue: mockUserRepository,
    //     },
    //     {
    //       provide: getRepositoryToken(Role),
    //       useValue: mockRoleRepository,
    //     },
    //     {
    //       provide: getRepositoryToken(ROU),
    //       useValue: mockROURepository,
    //     },
    //     {
    //       provide: getRepositoryToken(Location),
    //       useValue: mockROURepository,
    //     },
    //     {
    //       provide: getRepositoryToken(RbacModule),
    //       useValue: mockRbacModuleRepository,
    //     },
    //     {
    //       provide: getRepositoryToken(RbacAction),
    //       useValue: mockRbacActionRepository,
    //     },
    //     {
    //       provide: getRepositoryToken(UserAction),
    //       useValue: mockUserActionRepository,
    //     },
    //     {
    //       provide: ActivityLogService,
    //       useValue: mockActivityLogService,
    //     },
    //     {
    //       provide: LocationService,
    //       useValue: mockLocationService,
    //     },
    //     {
    //       provide: RbacModuleService,
    //       useValue: mockRbacModuleService,
    //     },
    //   ],
    // }).compile();
    // userService = module.get<UserService>(UserService);
  });

  describe('Create user', () => {
    it('should create a new user', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      const createdUser: CreateUserDto = {
        email: 'johndoe@example.com',
        fullName: 'John Doe',
        phoneNumber: '0938381732',
        address: '',
        avatar: '',
        roleId: 1,
        rouId: 1,
        permissions: [],
      };
      mockUserRepository.create.mockReturnValue(createdUser);
      mockUserRepository.save.mockResolvedValue(createdUser);

      // Call the create method
      // const result = await userService.create(createdUser, userData);

      // // Assertions
      // expect(result).toEqual(createdUser);
      // expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
      //   email: userData.email,
      // });

      // expect(mockUserRepository.create).toHaveBeenCalledWith({
      //   email: userData.email,
      //   fullName: userData.fullName,
      //   phoneNumber: userData.phoneNumber,
      //   // status: User.STATUS.ACTIVE,
      // });
      // expect(mockUserRepository.save).toHaveBeenCalledWith(createdUser);
    });

    it('should throw an error if the user with the same email exists', async () => {
      // Mock user data
      // const mockDto: CreateUserDto = {
      //   email: 'johndoe@example.com',
      //   fullName: 'John Doe',
      //   phoneNumber: '0938381732',
      //   address: undefined,
      //   avatar: undefined,
      //   provinceId: undefined,
      //   roleId: undefined,
      //   rouId: undefined,
      //   permissions: [],
      // };
      // const mockUser = {
      //   email: 'johndoe@example.com',
      //   fullName: 'John Doe',
      //   phoneNumber: '0938381732',
      // } as User;
      // // Mock that a user with the same email already exists
      // const existingUser = new User({});
      // mockUserRepository.findOneBy.mockResolvedValue(existingUser);
      // Call the create method and expect it to throw an error
      // await expect(userService.create(mockDto, mockUser));
      // .rejects.toThrow()
    });
  });
});
