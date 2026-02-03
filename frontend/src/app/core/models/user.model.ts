import { Exercise } from './exercise.model';
import { Chapter } from './chapter.model';

export class User{
    id_user!: number;
    password!: string;
    username!: string;
    email!: string;
    is_admin!: boolean;
    last_login!: Date;

    createdAt?: string;
    updatedAt?: string;

    Chapters?: Chapter[];
    Exercises?: Exercise[]
}