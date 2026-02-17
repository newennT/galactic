
import { Level } from './level.model';
import { Page } from "./page.model";

export class Chapter {
    id_chapter!: number;
    title!: string;
    title_fr!: string;
    abstract!: string;
    order!: number;
    isPublished!: boolean;
    id_level!: number;

    createdAt?: string;
    updatedAt?: string;

    Pages?: Page[];
    Level?: Level;
}