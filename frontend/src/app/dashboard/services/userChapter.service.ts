import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "src/app/core/models/user.model";
import { environment } from "src/environments/environment";

export interface UserExercise {
    id_page: number;
    is_correct: boolean;
    status: string;
    question: string;
}

export interface UserChapter {
    id_chapter: number;
    title: string;
    abstract: string;
    total: number;
    correct: number;
    percentage: number | null;
    exercises: UserExercise[];
}

export interface UserChaptersResponse {
    chapters: UserChapter[];
    user: User;
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