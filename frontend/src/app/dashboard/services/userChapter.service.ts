import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

export interface UserChapter {
    id_chapter: number;
    title: string;
    abstract: string;
    total: number;
    correct: number;
    percentage: number | null;
}

export interface UserChaptersResponse {
    chapters: UserChapter[];
}

@Injectable({
    providedIn: 'root'
})
export class UserChapterService {
    constructor(private http: HttpClient) {}

    getUserChapters() {
        return this.http.get<UserChaptersResponse>(`${environment.apiUrl}/user-chapters`);
    }
}