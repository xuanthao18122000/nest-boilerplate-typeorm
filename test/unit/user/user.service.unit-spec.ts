import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/modules/user/dto/user.dto';
import { User } from '../../../src/database/entities';
import { UserService } from '../../../src/modules/user/user.service';

describe('User Service', () => {
  let userService: UserService;

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
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  describe('Create user', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'johndoe@example.com',
        password: 'strongestP@ssword',
        fullName: 'John Doe',
        gender: User.GENDER.MALE,
        phoneNumber: '0938381732',
      };

      mockUserRepository.findOneBy.mockResolvedValue(null);

      const createdUser: CreateUserDto = {
        email: 'johndoe@example.com',
        password: 'strongPassword',
        fullName: 'John Doe',
        gender: User.GENDER.MALE,
        phoneNumber: '123456',
      };
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
        status: User.STATUS.ACTIVE,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(createdUser);
    });

    it('should throw an error if the user with the same email exists', async () => {
      // Mock user data
      const userData: CreateUserDto = {
        email: 'johndoe@example.com',
        password: 'strongestP@ssword',
        fullName: 'John Doe',
        gender: User.GENDER.MALE,
        phoneNumber: '0938381732',
      };

      // Mock that a user with the same email already exists
      const existingUser = new User({});
      mockUserRepository.findOneBy.mockResolvedValue(existingUser);

      // Call the create method and expect it to throw an error
      await expect(userService.create(userData)).rejects.toThrowError();
    });
  });
});
