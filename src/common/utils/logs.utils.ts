import { User } from 'src/database/entities';

export const generateLogsUpdateString = (
  id: number,
  fieldName: string,
  oldData: string,
  newData: string,
  user: User,
) => {
  return {
    action: 'edit',
    infoUser: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phoneNumber,
    },
    infoUpdate: {
      id,
      fieldName,
      oldData,
      newData,
    },
    updateAt: new Date(),
  };
};
