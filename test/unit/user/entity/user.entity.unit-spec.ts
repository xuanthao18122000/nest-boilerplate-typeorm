import { User } from 'src/database/entities';

describe('User Entity', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
    user.email = 'email';
    user.password = 'password';
    user.fullName = 'fullName';
    user.phoneNumber = 'phoneNumber';
    user.token = 'token';
    user.gender = User.GENDER_USER.MALE;
    user.address = 'address';
    user.avatar = 'avatar';
    user.status = User.STATUS_USER.ACTIVE;
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

  it('should have STATUS_USER and GENDER_USER properties', () => {
    expect(User.STATUS_USER).toBeDefined();
    expect(User.GENDER_USER).toBeDefined();
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
