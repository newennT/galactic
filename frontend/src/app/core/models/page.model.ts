
import { Exercise } from "./exercise.model";
import { Lesson } from "./lesson.model";
export class Page {
    id_page!: number;
    order_index!: number;
    type!: string;
    id_chapter!: number;
    
    createdAt?: string;
    updatedAt?: string;

    Lesson?: Lesson;
    Exercise?: Exercise;
}