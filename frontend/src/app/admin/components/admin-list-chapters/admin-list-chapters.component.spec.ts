import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListChaptersComponent } from './admin-list-chapters.component';

describe('AdminListChaptersComponent', () => {
  let component: AdminListChaptersComponent;
  let fixture: ComponentFixture<AdminListChaptersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminListChaptersComponent]
    });
    fixture = TestBed.createComponent(AdminListChaptersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
