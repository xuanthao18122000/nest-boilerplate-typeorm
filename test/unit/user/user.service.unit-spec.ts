import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../../../src/modules/user/user.service';
import { Repository } from 'typeorm';
import { User } from '../../../src/database/entities';
import FilterBuilderService from 'src/common/filter-builder/filter-builder.service';

describe('User Service', () => {
  let userService: UserService;
  let filterBuilderService: FilterBuilderService;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        FilterBuilderService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    filterBuilderService =
      module.get<FilterBuilderService>(FilterBuilderService);
  });

  describe('Create user', () => {
    it('should create a new user', async () => {
      // Mock user data
      const userData = {
        email: 'johndoe@example.com',
        password: 'strongestP@ssword',
        fullName: 'John Doe',
        gender: User.GENDER_USER.MALE,
        phoneNumber: '0938381732',
      };

      // Mock that no user with the same email exists
      mockUserRepository.findOneBy.mockResolvedValue(null);

      // Mock the user creation
      const createdUser = new User();
      (createdUser.email = 'johndoe@example.com'),
        (createdUser.password = 'strongestP@ssword'),
        (createdUser.fullName = 'John Doe'),
        (createdUser.gender = User.GENDER_USER.MALE),
        (createdUser.phoneNumber = '0938381732'),
        mockUserRepository.create.mockReturnValue(createdUser);
      mockUserRepository.save.mockResolvedValue(createdUser);

      // Call the create method
      const result = await userService.create(userData);

      // Assertions
      expect(result).toEqual(createdUser);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        email: userData.email,
      });

      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: userData.email,
        password: expect.any(String),
        fullName: userData.fullName,
        gender: userData.gender,
        phoneNumber: userData.phoneNumber,
        status: User.STATUS_USER.ACTIVE,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(createdUser);
    });

    it('should throw an error if the user with the same email exists', async () => {
      // Mock user data
      const userData = {
        email: 'johndoe@example.com',
        password: 'strongestP@ssword',
        fullName: 'John Doe',
        gender: User.GENDER_USER.MALE,
        phoneNumber: '0938381732',
      };

      // Mock that a user with the same email already exists
      const existingUser = new User();
      mockUserRepository.findOneBy.mockResolvedValue(existingUser);

      // Call the create method and expect it to throw an error
      await expect(userService.create(userData)).rejects.toThrowError();
    });
  });
});
