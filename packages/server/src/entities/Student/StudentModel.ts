import type { RequiredExceptFor, RequireAtLeastOne } from '@usefaz/shared';
import type { Knex } from 'knex';

import type { DBConnector } from '~/database/dbConnector';
import type { IStudent } from '~/interfaces';
import callTrxOrKnexConnection from '~/utils/callTrxOrKnexConnection';
import UserModel from '../User/UserModel';

const StudentModel = (dbConnector: DBConnector) => {
  return {
    async insert(student: RequiredExceptFor<IStudent, 'id' | 'created_at' | 'updated_at'>, trx?: Knex.Transaction) {
      const [newStudent] = await callTrxOrKnexConnection<IStudent>('student', dbConnector, trx)
        .insert(student)
        .returning('*');

      return newStudent;
    },

    createStudent(student: RequiredExceptFor<IStudent, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
      return dbConnector.knexConnection.transaction(async (trx) => {
        const userEntity = UserModel(dbConnector);

        const newUser = await userEntity.insert({}, trx);

        const newStudent = await this.insert({ ...student, user_id: newUser.id }, trx);
        return newStudent;
      });
    },

    getStudentBy(student: RequireAtLeastOne<IStudent>) {
      return dbConnector.knexConnection<IStudent>('student').where(student).first();
    },

    getStudentByRM(RM: string) {
      return dbConnector.knexConnection<IStudent>('student').where('RM', RM).first();
    },
  };
};

export default StudentModel;
