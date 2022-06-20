import type { RequiredExceptFor } from '@usefaz/shared';
import type { Knex } from 'knex';

import type { DBConnector } from '~/database/dbConnector';
import usefazConnector from '~/database/usefazConnector';
import type { IStudentPasswordRecoveryRequest } from '~/interfaces';
import callTrxOrKnexConnection from '~/utils/callTrxOrKnexConnection';
import createPassword from '~/utils/createPassword';

const StudentPasswordRecoveryRequestModel = (dbConnector: DBConnector) => {
  return {
    async createRequest(
      request: RequiredExceptFor<IStudentPasswordRecoveryRequest, 'id' | 'status' | 'created_at' | 'updated_at'>,
      trx: Knex.Transaction
    ) {
      const [newRequest] = await callTrxOrKnexConnection<IStudentPasswordRecoveryRequest>(
        'student_password_recovery_request',
        usefazConnector,
        trx
      )
        .insert(request)
        .returning('*');

      return newRequest;
    },

    getRequest(id: string) {
      return dbConnector
        .knexConnection<IStudentPasswordRecoveryRequest>('student_password_recovery_request')
        .where('id', id)
        .first();
    },

    getAll() {
      return dbConnector
        .knexConnection<IStudentPasswordRecoveryRequest>('student_password_recovery_request')
        .orderByRaw("CASE WHEN status = 'PENDING' THEN 0 ELSE (CASE WHEN status = 'CHANGED' THEN 1 ELSE 2 END) END");
    },

    async cancelRequest(id: string) {
      const [canceledRequest] = await dbConnector
        .knexConnection('student_password_recovery_request')
        .update('status', 'REFUSED')
        .returning('*')
        .where('id', id);

      return canceledRequest;
    },

    finalizeRequest(id: string, { studentId, newPassword }: { studentId: string; newPassword: string }) {
      return dbConnector.knexConnection.transaction(async (trx) => {
        await trx('student').update('password', createPassword(newPassword)).where('id', studentId);

        const [updatedRequest] = await trx('student_password_recovery_request')
          .update('status', 'CHANGED')
          .where('id', id)
          .returning('*');

        return updatedRequest;
      });
    },
  };
};

export default StudentPasswordRecoveryRequestModel;
