import { ResolveFn } from "@angular/router";
import { Chapter } from "src/app/core/models/chapter.model";
import { inject } from "@angular/core";
import { AdminChaptersService } from "../services/admin-chapters.service";

export const adminChaptersResolver: ResolveFn<Chapter[]> = () => {
    const adminChaptersService = inject(AdminChaptersService);
    return adminChaptersService.getChapters();
};