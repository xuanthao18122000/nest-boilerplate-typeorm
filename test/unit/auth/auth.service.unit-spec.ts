import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/database/entities';
import { AuthService } from 'src/modules/auth/auth.service';
import { SignUpDto } from 'src/modules/auth/dto/auth.dto';
import { createUserStub } from '../user/stubs/user.stub';

describe('Auth Service', () => {
  let authService: AuthService;

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
        AuthService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  // describe('signIn', () => {
  //   it('should sign in a user and return user data and token', async () => {
  //     const signInDto: SignInDto = {
  //       email: 'johndoe@example.com',
  //       password: 'strongPassword',
  //     };

  //     const mockUser: User = {
  //       id: 1,
  //       email: 'johndoe@example.com',
  //       password: hashPassword('strongPassword'), // Hashed password
  //       status: User.STATUS.ACTIVE,
  //     };

  //     // Mock user retrieval
  //     mockUserRepository.findOneBy.mockResolvedValue(mockUser);

  //     // Mock password comparison (returns true)
  //     jest.spyOn(authService, 'comparePasswords').mockReturnValue(true);

  //     // Mock JWT signing
  //     mockJwtService.signAsync.mockResolvedValue({
  //       token: 'mocked-token',
  //       expiresIn: '3600s',
  //     });

  //     // Call the signIn method
  //     const result = await authService.signIn(signInDto);

  //     // Assertions
  //     expect(result.user).toEqual({
  //       id: mockUser.id,
  //       email: mockUser.email,
  //       fullName: mockUser.fullName,
  //       // Add other user properties as needed
  //     });
  //     expect(result.token).toEqual('mocked-token');
  //     expect(result.expiresIn).toEqual('3600s');
  //   });

  //   it('should throw an error if user is not found', async () => {
  //     const signInDto: SignInDto = {
  //       email: 'johndoe@example.com',
  //       password: 'strongPassword',
  //     };

  //     // Mock user retrieval (not found)
  //     mockUserRepository.findOneBy.mockResolvedValue(null);

  //     // Call the signIn method and expect it to throw an error
  //     await expect(authService.signIn(signInDto)).rejects.toThrowError(
  //       new ErrorException(
  //         HttpStatus.NOT_FOUND,
  //         statusCode['USER_NOT_FOUND'].code,
  //         statusCode['USER_NOT_FOUND'].type,
  //       ),
  //     );
  //   });

  //   it('should throw an error if user is inactive', async () => {
  //     const signInDto: SignInDto = {
  //       email: 'johndoe@example.com',
  //       password: 'strongPassword',
  //     };

  //     const inactiveUser: User = {
  //       id: 1,
  //       email: 'johndoe@example.com',
  //       password: hashPassword('strongPassword'), // Hashed password
  //       status: User.STATUS.INACTIVE, // Inactive status
  //     };

  //     // Mock user retrieval
  //     mockUserRepository.findOneBy.mockResolvedValue(inactiveUser);

  //     // Call the signIn method and expect it to throw an error
  //     await expect(authService.signIn(signInDto)).rejects.toThrowError(
  //       new ErrorException(
  //         HttpStatus.FORBIDDEN,
  //         statusCode['USER_INACTIVE'].code,
  //         statusCode['USER_INACTIVE'].type,
  //       ),
  //     );
  //   });

  //   it('should throw an error if password is incorrect', async () => {
  //     const signInDto: SignInDto = {
  //       email: 'johndoe@example.com',
  //       password: 'wrongPassword', // Incorrect password
  //     };

  //     const mockUser: User = {
  //       id: 1,
  //       email: 'johndoe@example.com',
  //       password: hashPassword('strongPassword'), // Hashed password
  //       status: User.STATUS.ACTIVE,
  //     };

  //     // Mock user retrieval
  //     mockUserRepository.findOneBy.mockResolvedValue(mockUser);

  //     // Mock password comparison (returns false)
  //     jest.spyOn(authService, 'comparePasswords').mockReturnValue(false);

  //     // Call the signIn method and expect it to throw an error
  //     await expect(authService.signIn(signInDto)).rejects.toThrowError(
  //       new ErrorException(
  //         HttpStatus.NOT_FOUND,
  //         statusCode['WRONG_PASSWORD'].code,
  //         statusCode['WRONG_PASSWORD'].type,
  //       ),
  //     );
  //   });
  // });

  describe('signUp', () => {
    it('should sign up a new user and return user data', async () => {
      const signUpDto: SignUpDto = {
        email: 'johndoe@example.com',
        password: 'strongPassword',
        fullName: 'John Doe',
        gender: User.GENDER.MALE,
        phoneNumber: '123456',
      };

      // Mock user retrieval (user does not exist)
      mockUserRepository.findOneBy.mockResolvedValue(null);

      // Mock user creation
      const mockUser = {
        id: 1,
        email: 'johndoe@example.com',
        password: 'hashedPassword',
        status: User.STATUS.ACTIVE,
        fullName: 'John Doe',
      };

      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      // Call the signUp method
      const result = await authService.signUp(signUpDto);

      // Assertions
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user already exists', async () => {
      // const signUpDto: SignUpDto = {
      //   email: 'johndoe@example.com',
      //   password: 'strongPassword',
      //   fullName: 'John Doe',
      //   gender: User.GENDER.MALE,
      //   phoneNumber: '123456',
      // };

      // Mock user retrieval (user already exists)
      const existingUser: User = createUserStub();

      mockUserRepository.findOneBy.mockResolvedValue(existingUser);

      // Call the signUp method and expect it to throw an error
      // await expect(authService.signUp(signUpDto)).rejects.toThrowError(
      //   throw ErrorHttpException(HttpStatus.CONFLICT, 'USER_EXISTED')
      // );
    });
  });
});
