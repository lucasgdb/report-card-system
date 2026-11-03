import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>) {
  const timestamps = sql`created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()`;

  await sql`CREATE TABLE "user" (id serial PRIMARY KEY, ${timestamps})`.execute(db);

  /** Signed-in sessions; the cookie holds the token, the table only its SHA-256. */
  await sql`CREATE TABLE session (
    id serial PRIMARY KEY,
    user_id integer NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    token_hash char(64) NOT NULL UNIQUE,
    expires_at timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`.execute(db);
  await sql`CREATE INDEX session_user_id_idx ON session (user_id)`.execute(db);

  await sql`CREATE TABLE student (
    id serial PRIMARY KEY,
    user_id integer NOT NULL UNIQUE REFERENCES "user"(id) ON DELETE CASCADE,
    rm varchar(50) NOT NULL UNIQUE,
    fullname varchar(255) NOT NULL,
    password_hash varchar(255) NOT NULL,
    avatar_url varchar(512),
    ${timestamps}
  )`.execute(db);

  await sql`CREATE TABLE admin (
    id serial PRIMARY KEY,
    user_id integer NOT NULL UNIQUE REFERENCES "user"(id) ON DELETE CASCADE,
    fullname varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    password_hash varchar(255) NOT NULL,
    avatar_url varchar(512),
    ${timestamps}
  )`.execute(db);
  await sql`CREATE UNIQUE INDEX admin_email_idx ON admin (lower(email))`.execute(db);

  await sql`CREATE TABLE discipline (id serial PRIMARY KEY, name varchar(255) NOT NULL UNIQUE)`.execute(db);

  await sql`CREATE TABLE school_report (
    id serial PRIMARY KEY,
    student_id integer NOT NULL REFERENCES student(id) ON DELETE CASCADE,
    year smallint NOT NULL,
    ${timestamps},
    UNIQUE (student_id, year)
  )`.execute(db);

  await sql`CREATE TABLE school_report_discipline (
    id serial PRIMARY KEY,
    school_report_id integer NOT NULL REFERENCES school_report(id) ON DELETE CASCADE,
    discipline_id integer NOT NULL REFERENCES discipline(id),
    UNIQUE (school_report_id, discipline_id)
  )`.execute(db);

  await sql`CREATE TABLE bimester (
    id serial PRIMARY KEY,
    school_report_discipline_id integer NOT NULL REFERENCES school_report_discipline(id) ON DELETE CASCADE,
    number smallint NOT NULL CHECK (number BETWEEN 1 AND 4),
    grade numeric(3, 1) NOT NULL CHECK (grade BETWEEN 0 AND 10),
    rec_grade numeric(3, 1) CHECK (rec_grade BETWEEN 0 AND 10),
    absences smallint NOT NULL DEFAULT 0 CHECK (absences >= 0),
    ${timestamps},
    UNIQUE (school_report_discipline_id, number)
  )`.execute(db);

  /** An admin's "forgot my password" link. Usable while unused and unexpired. */
  await sql`CREATE TABLE admin_password_reset (
    id serial PRIMARY KEY,
    admin_id integer NOT NULL REFERENCES admin(id) ON DELETE CASCADE,
    token_hash char(64) NOT NULL UNIQUE,
    expires_at timestamptz NOT NULL,
    used_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
  )`.execute(db);

  await sql`CREATE TYPE student_password_recovery_request_status AS ENUM ('PENDING', 'LINK_SENT', 'CHANGED', 'REFUSED')`.execute(
    db
  );

  /**
   * A student's "forgot my password" request: an admin approves it, which e-mails the student a link
   * to choose a new password (`LINK_SENT`), or refuses it.
   */
  await sql`CREATE TABLE student_password_recovery_request (
    id serial PRIMARY KEY,
    rm varchar(50) NOT NULL,
    email varchar(255) NOT NULL,
    status student_password_recovery_request_status NOT NULL DEFAULT 'PENDING',
    token_hash char(64) UNIQUE,
    expires_at timestamptz,
    ${timestamps}
  )`.execute(db);

  await sql`CREATE TABLE notification (
    id serial PRIMARY KEY,
    title varchar(255) NOT NULL,
    message varchar(500) NOT NULL,
    viewed boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
  )`.execute(db);
}

export async function down(db: Kysely<unknown>) {
  for (const table of [
    'notification',
    'student_password_recovery_request',
    'admin_password_reset',
    'bimester',
    'school_report_discipline',
    'school_report',
    'discipline',
    'admin',
    'student',
    'session',
    'user',
  ]) {
    await db.schema.dropTable(table).ifExists().execute();
  }
  await sql`DROP TYPE IF EXISTS student_password_recovery_request_status`.execute(db);
}
