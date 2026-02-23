import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Chapter } from "src/app/core/models/chapter.model";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class AdminChaptersService {
    constructor(private http: HttpClient) {}

    getChapters(): Observable<Chapter[]>{
        return this.http
        .get<{ message: string; data: Chapter[]}>(`${environment.apiUrl}/chapters`)
        .pipe(map(res => res.data));
    }

    getChapterById(id: number): Observable<Chapter> {
        return this.http
        .get<{ message: string; data: Chapter}>(`${environment.apiUrl}/chapters/${id}`)
        .pipe(map(res => res.data));
    }

    reorder(chapters: { id_chapter: number; order: number }[]) {
        return this.http.patch(
            `${environment.apiUrl}/chapters/reorder`,
            chapters
        );
    }
}