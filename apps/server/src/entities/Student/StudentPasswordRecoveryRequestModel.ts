import type { RequiredExceptFor } from '@usefaz/shared';

import type { DBConnector } from '~/database/dbConnector';
import type { IStudentPasswordRecoveryRequest } from '~/interfaces';

const StudentPasswordRecoveryRequestModel = (dbConnector: DBConnector) => {
  return {
    async createRequest(
      request: RequiredExceptFor<IStudentPasswordRecoveryRequest, 'id' | 'status' | 'created_at' | 'updated_at'>
    ) {
      const [newRequest] = await dbConnector
        .knexConnection<IStudentPasswordRecoveryRequest>('student_password_recovery_request')
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
        .orderBy('created_at', 'ASC');
    },

    canceRequest(id: string) {
      return dbConnector
        .knexConnection('student_password_recovery_request')
        .update('status', 'REFUSED')
        .where('id', id);
    },

    finalizeRequest(id: string, { studentId, newPassword }: { studentId: string; newPassword: string }) {
      return dbConnector.knexConnection.transaction(async (trx) => {
        await trx('student_password_recovery_request').update('status', 'CHANGED').where('id', id);
        await trx('student').update('password', newPassword).where('id', studentId);
      });
    },
  };
};

export default StudentPasswordRecoveryRequestModel;
