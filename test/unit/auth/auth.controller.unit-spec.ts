import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../../src/modules/auth/auth.controller';
import { AuthService } from '../../../src/modules/auth/auth.service';
import { mockToken } from './mocks/tokens.mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/database/entities';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { SignInDto, SignUpDto } from 'src/modules/auth/dto/auth.dto';
import { createUserStub } from '../user/stubs/user.stub';
import { SendResponse } from 'src/common/response/send-response';

jest.mock('./mocks/auth.service.ts');
describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('AuthController: should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signUp', () => {
    it('should return user data upon successful sign-up', async () => {
      // Arrange
      const signUpDto: SignUpDto = {
        fullName: 'John Doe',
        email: 'johndoe@example.com',
        password: '1232@asdS',
        phoneNumber: '123456',
        gender: User.GENDER_USER.FEMALE,
      };
      const mockUser: User = createUserStub();

      // Mock the sign-up method of AuthService
      jest.spyOn(authService, 'signUp').mockResolvedValue(mockUser);

      // Action: Call the signUp method of AuthController
      const response = await authController.signUp(signUpDto);

      // Assertions
      expect(response).toEqual(
        SendResponse.success(mockUser.serialize(), 'Sign up user successful!'),
      );
    });
  });

  describe('signIn', () => {
    it('should sign in a user and return user data, token and expires in', async () => {
      const signInDto: SignInDto = {
        email: 'johndoe@example.com',
        password: '1232@asdS',
      };

      const mockUser: User = createUserStub();
      const mockResponse = {
        user: mockUser.serialize(),
        token: mockToken,
        expiresIn: process.env.JWT_EXPIRES_IN,
      };
      jest.spyOn(authService, 'signIn').mockResolvedValue(mockResponse);

      const response = await authController.signIn(signInDto);

      expect(response).toEqual(
        SendResponse.success(mockResponse, 'Sign in user successful!'),
      );
    });
  });
});
