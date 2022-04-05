import type { Knex } from 'knex';

import type { DBConnector } from '~/database/dbConnector';
import type { IStudent } from '~/interfaces';
import callTrxOrKnexConnection from '~/utils/callTrxOrKnexConnection';
import UserModel from '../User/UserModel';

const StudentModel = (dbConnector: DBConnector) => {
  return {
    async insert(student: IStudent, trx?: Knex.Transaction) {
      const [newStudent] = await callTrxOrKnexConnection<IStudent>('student', dbConnector, trx)
        .insert(student)
        .returning('*');

      return newStudent;
    },

    createStudent(student: IStudent) {
      return dbConnector.knexConnection.transaction(async (trx) => {
        const userEntity = UserModel(dbConnector);

        const newUser = await userEntity.insert({}, trx);
        const newStudent = await this.insert({ ...student, user_id: newUser.id }, trx);

        return newStudent;
      });
    },

    getStudentByRM(RM: string) {
      return dbConnector.knexConnection<IStudent>('student').where('RM', RM).first();
    },

    getStudentById(id: string) {
      return dbConnector.knexConnection<IStudent>('student').where('id', id).first();
    },

    getStudentByUserId(userId: string) {
      return dbConnector.knexConnection<IStudent>('student').where('user_id', userId).first();
    },
  };
};

export default StudentModel;
