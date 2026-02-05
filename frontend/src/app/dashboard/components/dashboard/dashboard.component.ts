import { Component, OnInit } from '@angular/core';
import { UserChapter,UserChapterService } from '../../services/userChapter.service';
import { User } from 'src/app/core/models/user.model';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  chapters: UserChapter[] = [];
  loading = true;
  user?: User;

  constructor(private userChapterService: UserChapterService) { }


  ngOnInit(): void {
    this.userChapterService.getUserChapters().subscribe({
      next: (data) => {
        this.chapters = data.chapters;
        this.user = data.user;
        this.loading = false;
        console.log('Chapitres', this.chapters);
      },
      error: (err) => {
        console.log('Erreur récupération chapitres', err);
        this.loading = false;
      }
    });
  }

}
