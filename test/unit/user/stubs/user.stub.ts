import { User } from 'src/submodules/database/entities';

export const createUserStub = (): User => {
  const defaultUser: User = {
    id: 1,
    email: 'johndoe@example.com',
    fullName: 'John Doe',
    address: '123 Phan Van Tri',
    avatar: 'avatar.png',
    phoneNumber: '0938381732',
    status: User.STATUS.ACTIVE,
    token: null,
    createdAt: new Date(),
    updatedAt: new Date(),

    serialize: () => {
      return {
        id: defaultUser.id,
        email: defaultUser.email,
        fullName: defaultUser.fullName,
        status: defaultUser.status,
        createdAt: defaultUser.createdAt,
        updatedAt: defaultUser.updatedAt,
      };
    },
  } as User;

  return defaultUser;
};
