import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class UserExerciseService {
    constructor(private http: HttpClient) {}

    saveResult(pageId: number, isCorrect: boolean){
        return this.http.post(`${environment.apiUrl}/user-exercises`, {
            id_page: pageId, 
            is_correct: isCorrect
        });
    }
}