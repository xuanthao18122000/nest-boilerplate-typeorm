import { User } from 'src/submodule/database/entities';

jest.mock('./mocks/auth.service.ts');
describe('AuthController', () => {
  // let authController: AuthController;
  // let authService: AuthService;

  it('should have STATUS properties', () => {
    expect(User.STATUS).toBeDefined();
  });
  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     imports: [ROUModule],
  //     controllers: [AuthController],
  //     providers: [
  //       AuthService,
  //       JwtService,
  //       ActivityLogService,
  //       {
  //         provide: getRepositoryToken(User),
  //         useClass: Repository,
  //       },
  //     ],
  //   }).compile();

  //   authController = module.get<AuthController>(AuthController);
  //   authService = module.get<AuthService>(AuthService);
  // });

  // it('AuthController: should be defined', () => {
  //   expect(authController).toBeDefined();
  // });

  // describe('signUp', () => {
  //   it('should return user data upon successful sign-up', async () => {
  //     // Arrange
  //     const signUpDto: SignUpDto = {
  //       fullName: 'John Doe',
  //       email: 'johndoe@example.com',
  //       phoneNumber: '123456',
  //     };
  //     const mockUser: User = createUserStub();

  //     // Mock the sign-up method of AuthService
  //     jest.spyOn(authService, 'signUp').mockResolvedValue(mockUser);

  //     // Action: Call the signUp method of AuthController
  //     const response = await authController.signUp(signUpDto);

  //     // Assertions
  //     expect(response).toEqual(
  //       SendResponse.success(mockUser.serialize(), 'Sign up user successful!'),
  //     );
  //   });
  // });

  // describe('signIn', () => {
  //   it('should sign in a user and return user data, token and expires in', async () => {
  //     const signInDto: SignInDto = {
  //       email: 'johndoe@example.com',
  //     };

  //     const mockUser: User = createUserStub();
  //     const permissions: string[] = [];
  //     const mockResponse = {
  //       user: {
  //         ...mockUser.serialize(),
  //         permissions,
  //       },
  //       token: mockToken,
  //       expiresIn: getEnv('ATK_DB_HOST'),
  //     };
  //     jest.spyOn(authService, 'signIn').mockResolvedValue(mockResponse);

  //     const response = await authController.signIn(signInDto);

  //     expect(response).toEqual(
  //       SendResponse.success(mockResponse, 'Sign in user successful!'),
  //     );
  //   });
  // });
});
