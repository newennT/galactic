import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { AuthService } from '../../core/services/auth.service';

@Injectable({
    providedIn: "root",
})
export class UserExerciseService {
    constructor(private http: HttpClient, public authService: AuthService) {}

    saveResult(pageId: number, isCorrect: boolean){
        return this.http.post(`${environment.apiUrl}/user-exercises`, {
            id_page: pageId, 
            is_correct: isCorrect
        });
    }

    getChapterScore(id_chapter: number){
        const token = this.authService.getToken();
        console.log("token depuis userExercise.service", token);
      return this.http.get<{
        total: number,
        correct: number,
        percentage: number;
      }>(`${environment.apiUrl}/user-exercises/chapter/${id_chapter}/score`);
    }
}