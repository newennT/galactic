
import { Level } from "./level.model";

export class Chapter {
    id_chapter!: number;
    title!: string;
    title_fr!: string;
    abstract!: string;
    order!: number;
    isPublished!: boolean;

    createdAt?: string;
    updatedAt?: string;

    Levels?: Level[];
}