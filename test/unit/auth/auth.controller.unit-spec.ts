import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../../src/modules/auth/auth.controller';
import { AuthService } from '../../../src/modules/auth/auth.service';

// MOCK
import { mock_token } from './mocks/tokens.mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/database/entities';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

// jest.mock('./__mocks__/auth.service.ts');
describe('AuthController', () => {
  let authController: AuthController;

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
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  // describe('signUp', () => {
  //   it('should create a new user and return an access token and refresh token', async () => {
  //     // Arrange
  //     const signUpDto = {
  //       first_name: 'John',
  //       last_name: 'Doe',
  //       email: 'johndoe@example.com',
  //       password: '1232@asdS',
  //     };

  //     // Act
  //     const response = await authController.signUp(signUpDto);

  //     // Assert
  //     expect(response).toEqual({
  //       token: mock_token,
  //     });
  //   });
  // });

  // describe('signIn', () => {
  //   it('should sign in a user and return an access token', async () => {
  //     // Arrange
  //     const signInDto = {
  //       first_name: 'John',
  //       last_name: 'Doe',
  //       email: 'johndoe@example.com',
  //       password: '1232@asdS',
  //     };
  //     // Act
  //     const response = await authController.signIn(signInDto);

  //     // Assert
  //     expect(response).toEqual({
  //       token: mock_token,
  //     });
  //   });
  // });
});
