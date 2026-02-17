import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Level } from "src/app/core/models/level.model";

@Injectable({
    providedIn: "root",
})
export class AdminLevelService {
    constructor(private http: HttpClient) {}

    getLevels(): Observable<{ message: string; data: Level[] }> {
        return this.http.get<{ message: string; data: Level[] }>(`${environment.apiUrl}/levels`
        );
    }
}