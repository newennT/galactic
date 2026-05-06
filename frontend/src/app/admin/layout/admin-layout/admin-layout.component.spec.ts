import { ComponentFixture } from "@angular/core/testing";
import { AdminLayoutComponent } from "./admin-layout.component";
import { TestBed } from "@angular/core/testing";

describe('AdminLayoutComponent', () => {
    let component: AdminLayoutComponent;
    let fixture: ComponentFixture<AdminLayoutComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdminLayoutComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(AdminLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});