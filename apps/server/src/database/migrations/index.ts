import type { Migration } from 'kysely/migration';

import * as initial from './20261102000000_initial.ts';
import * as optionalGrades from './20261103000000_optional_grades.ts';

/** Every migration, in order. Listed here (not read from disk) so the production bundle includes them. */
const migrations: Record<string, Migration> = {
  '20261102000000_initial': initial,
  '20261103000000_optional_grades': optionalGrades,
};

export default migrations;
