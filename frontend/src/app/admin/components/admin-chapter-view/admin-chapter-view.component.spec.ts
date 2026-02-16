import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminChapterViewComponent } from './admin-chapter-view.component';

describe('AdminChapterViewComponent', () => {
  let component: AdminChapterViewComponent;
  let fixture: ComponentFixture<AdminChapterViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminChapterViewComponent]
    });
    fixture = TestBed.createComponent(AdminChapterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
