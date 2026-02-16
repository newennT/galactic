import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Chapter } from 'src/app/core/models/chapter.model';
import { AdminChaptersService } from '../../services/admin-chapters.service';

@Component({
  selector: 'app-admin-list-chapters',
  templateUrl: './admin-list-chapters.component.html',
  styleUrls: ['./admin-list-chapters.component.scss']
})
export class AdminListChaptersComponent implements OnInit {
  adminChapters$!: Observable<Chapter[]>;

  constructor(private route: ActivatedRoute, private adminChaptersService: AdminChaptersService){}

  ngOnInit(): void {
    this.adminChapters$ = this.route.data.pipe(
      map(data => data['adminChapters'])
    );
  }
}
