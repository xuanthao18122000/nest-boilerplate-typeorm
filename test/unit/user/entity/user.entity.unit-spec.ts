import { User } from 'src/database/entities';

describe('User Entity', () => {
  let user: User;

  beforeEach(() => {
    user = new User({
      email: 'email',
      password: 'password',
      fullName: 'fullName',
      phoneNumber: 'phoneNumber',
      token: 'token',
      gender: User.GENDER.MALE,
      address: 'address',
      avatar: 'avatar',
      status: User.STATUS.ACTIVE,
    });
  });

  it('should be defined', () => {
    expect(user).toBeDefined();
  });

  it('should have properties', () => {
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('password');
    expect(user).toHaveProperty('fullName');
    expect(user).toHaveProperty('phoneNumber');
    expect(user).toHaveProperty('token');
    expect(user).toHaveProperty('gender');
    expect(user).toHaveProperty('address');
    expect(user).toHaveProperty('avatar');
    expect(user).toHaveProperty('status');
  });

  it('should have STATUS and GENDER properties', () => {
    expect(User.STATUS).toBeDefined();
    expect(User.GENDER).toBeDefined();
  });

  it('should have a serialize method', () => {
    expect(user.serialize).toBeDefined();
    expect(typeof user.serialize).toBe('function');
  });

  it('serialize method should return the expected properties', () => {
    const serializedData = user.serialize();

    expect(serializedData).toHaveProperty('id');
    expect(serializedData).toHaveProperty('email');
    expect(serializedData).toHaveProperty('fullName');
    expect(serializedData).toHaveProperty('phoneNumber');
    expect(serializedData).toHaveProperty('gender');
    expect(serializedData).toHaveProperty('status');
    expect(serializedData).toHaveProperty('createdAt');
    expect(serializedData).toHaveProperty('updatedAt');
  });
});
