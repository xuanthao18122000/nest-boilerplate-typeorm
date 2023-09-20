import { createUserStub } from '../../user/stubs/user.stub';

export const AuthServiceMocks = jest.fn().mockReturnValue({
  signIn: jest.fn().mockResolvedValue({
    access_token: null,
    refresh_token: null,
  }),
  getAuthenticatedUser: jest.fn().mockResolvedValue(createUserStub()),
  getUserIfRefreshTokenMatched: jest.fn().mockRejectedValue(createUserStub()),
});
