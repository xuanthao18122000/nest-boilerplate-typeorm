import { User } from 'src/submodule/database/entities';

describe('User Entity', () => {
  let user: User;

  beforeEach(() => {
    user = new User({
      email: 'email',
      fullName: 'fullName',
      phoneNumber: 'phoneNumber',
      token: 'token',
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
    expect(user).toHaveProperty('fullName');
    expect(user).toHaveProperty('phoneNumber');
    expect(user).toHaveProperty('token');
    expect(user).toHaveProperty('address');
    expect(user).toHaveProperty('avatar');
    expect(user).toHaveProperty('status');
  });

  it('should have STATUS properties', () => {
    expect(User.STATUS).toBeDefined();
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
    expect(serializedData).toHaveProperty('status');
    expect(serializedData).toHaveProperty('createdAt');
    expect(serializedData).toHaveProperty('updatedAt');
  });
});
