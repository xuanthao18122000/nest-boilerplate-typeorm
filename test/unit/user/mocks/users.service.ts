import { createUserStub } from '../stubs/user.stub';

export const UsersServiceMocks = jest.fn().mockReturnValue({
  findAll: jest.fn().mockResolvedValue([createUserStub()]),
  create: jest.fn().mockResolvedValue(createUserStub()),
  update: jest.fn().mockResolvedValue(createUserStub()),
});
