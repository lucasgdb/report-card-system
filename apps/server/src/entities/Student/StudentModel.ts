import type { RequiredExceptFor, RequireAtLeastOne } from '@usefaz/shared';
import type { Knex } from 'knex';

import type { DBConnector } from '~/database/dbConnector';
import { IStudent, IUser } from '~/interfaces';
import callTrxOrKnexConnection from '~/utils/callTrxOrKnexConnection';
import UserModel from '../User/UserModel';

const StudentModel = (dbConnector: DBConnector) => {
  return {
    getAll() {
      return dbConnector.knexConnection<IStudent>('student').select('*');
    },

    async insert(
      student: RequiredExceptFor<IStudent, 'id' | 'avatar_url' | 'created_at' | 'updated_at'>,
      trx?: Knex.Transaction
    ) {
      const [newStudent] = await callTrxOrKnexConnection<IStudent>('student', dbConnector, trx)
        .insert(student)
        .returning('*');

      return newStudent;
    },

    createStudent(student: RequiredExceptFor<IStudent, 'id' | 'user_id' | 'avatar_url' | 'created_at' | 'updated_at'>) {
      return dbConnector.knexConnection.transaction(async (trx) => {
        const userEntity = UserModel(dbConnector);

        const newUser = await userEntity.insert({}, trx);

        const newStudent = await this.insert({ ...student, user_id: newUser.id }, trx);
        return newStudent;
      });
    },

    async removeStudent(studentId: string) {
      const [removedStudent] = await dbConnector
        .knexConnection<IStudent>('student')
        .where('id', studentId)
        .delete()
        .returning('*');

      return removedStudent;
    },

    getStudentBy(student: RequireAtLeastOne<IStudent>) {
      return dbConnector.knexConnection<IStudent>('student').where(student).first();
    },

    getStudentByRM(RM: string) {
      return dbConnector.knexConnection<IStudent>('student').where('RM', RM).first();
    },

    async getStudentByRMOrInsertOne(
      student: RequiredExceptFor<IStudent, 'id' | 'user_id' | 'avatar_url' | 'created_at' | 'updated_at'>,
      trx?: Knex.Transaction
    ) {
      const oldStudent = await callTrxOrKnexConnection<IStudent>('student', dbConnector, trx)
        .where('RM', student.RM)
        .first();

      if (oldStudent) {
        return oldStudent;
      }

      const [newUser] = await callTrxOrKnexConnection<IUser>('user', dbConnector, trx).insert({}).returning('id');

      const [newStudent] = await callTrxOrKnexConnection<IStudent>('student', dbConnector, trx)
        .insert({ ...student, user_id: newUser.id })
        .returning('*');

      return newStudent;
    },

    insertAvatarURL(id: string, avatarURL: string) {
      return dbConnector
        .knexConnection<IStudent>('student')
        .update({ avatar_url: avatarURL })
        .where('id', id)
        .returning('*');
    },

    removeAvatarURL(id: string) {
      return dbConnector
        .knexConnection<IStudent>('student')
        .update({ avatar_url: null })
        .where('id', id)
        .returning('*');
    },

    async update(id: string, student: RequireAtLeastOne<IStudent>) {
      const [updatedStudent] = await dbConnector
        .knexConnection('student')
        .update(student)
        .where('id', id)
        .returning('*');

      return updatedStudent;
    },
  };
};

export default StudentModel;
