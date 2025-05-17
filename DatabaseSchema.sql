-- USUARIOS
drop table if exists users cascade;
drop type if exists user_role;

create type user_role as enum ('USER', 'INSTRUCTOR', 'ADMINISTRATOR');

create table if not exists users (
	user_id varchar(32) primary key not null,
	first_name varchar(32) not null,
	last_name varchar(32) not null,
	
	email varchar(128) not null,
	password text not null,
	role user_role default 'USER'::user_role,
	
	created_at timestamp not null,
	last_login timestamp not null
);

-- CURSOS
drop table if exists course_attachment_data cascade; 
drop table if exists course_attachments cascade; -- TABLA PARA MANEJAR ARCHIVOS (METODO DE FRAGMENTACION CADA 5MB)
drop table if exists course_members cascade;
drop table if exists courses cascade;

create table if not exists courses (
	course_id varchar(32) primary key not null,
	name varchar(128) not null,
	description text not null,
	instructor_id varchar(32) not null references users(user_id) on delete cascade,

	created_at timestamp not null
);

create table if not exists course_members (
	user_id varchar(32) not null references users(user_id) on delete cascade,
	name text not null,
	email varchar(128) not null,
	role user_role not null default 'USER',
	course_id varchar(32) not null references courses(course_id) on delete cascade,
	joined_at timestamp not null
);

create table if not exists course_attachments (
	attachment_id varchar(256) primary key not null,
	name text not null,
	mimetype varchar(64) not null,
	course_id varchar(18) not null references courses(course_id) on delete cascade
);

create table if not exists course_attachment_data (
	attachment_id varchar(256) not null references course_attachments(attachment_id) on delete cascade,
	chunk_index int not null,
	buffer bytea not null
);

-- ACTIVIDADES
drop table if exists activity_attachment_data cascade;
drop table if exists activity_attachments cascade; -- TABLA PARA MANEJAR ARCHIVOS (METODO DE FRAGMENTACION CADA 5MB)
drop table if exists activities cascade;

create table if not exists activities (
	activity_id varchar(32) primary key not null,
	title varchar(64) not null,
	description text not null,
	course_id varchar(32) not null references courses(course_id) on delete cascade,

	created_at timestamp not null,
	deadline timestamp not null
);

create table if not exists activity_attachments (
	attachment_id varchar(256) primary key not null,
	name text not null,
	mimetype varchar(64) not null,
	activity_id varchar(32) not null references activities(activity_id) on delete cascade
);

create table if not exists activity_attachment_data (
	attachment_id varchar(256) not null references activity_attachments(attachment_id) on delete cascade,
	chunk_index int not null,
	buffer bytea not null
);

select * from activities;

-- ENTREGAS
drop table if exists submission_attachment_data cascade;
drop table if exists submission_attachments cascade; -- TABLA PARA MANEJAR ARCHIVOS (METODO DE FRAGMENTACION CADA 5MB)
drop table if exists submissions cascade;

create table if not exists submissions (
	submission_id varchar(32) primary key not null,
	activity_id varchar(32) not null references activities(activity_id) on delete cascade,
	user_id varchar(32) not null references users(user_id) on delete cascade,
	score int not null,
	comment text not null,

	created_at timestamp not null
);

create table if not exists submission_attachments (
	attachment_id varchar(256) primary key not null,
	name text not null,
	mimetype varchar(64) not null,
	submission_id varchar(18) not null references submissions(submission_id) on delete cascade
);

create table if not exists submission_attachment_data (
	attachment_id varchar(256) not null references submission_attachments(attachment_id) on delete cascade,
	chunk_index int not null,
	buffer bytea not null
);

select * from course_attachments a join course_attachment_data ad on ad.attachment_id = a.attachment_id where a.attachment_id = '196C1700CD0' order by ad.chunk_index asc;
select * from course_attachment_data;
select * from course_attachments;

select * from course_members;

select * from activity_attachments;
select * from activity_attachment_data;

delete * from activity_attachments;
delete * from course_attachments;

select * from submission_attachments;
select * from submissions;

select * from users;
select * from courses;
