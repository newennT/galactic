import { ComponentFixture } from "@angular/core/testing";
import { MainLayoutComponent } from "./main-layout.component";
import { TestBed } from "@angular/core/testing";

describe('MainLayoutComponent', () => {
    let component: MainLayoutComponent;
    let fixture: ComponentFixture<MainLayoutComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MainLayoutComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(MainLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    })
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});