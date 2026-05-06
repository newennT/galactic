import { ComponentFixture } from "@angular/core/testing";
import { LogoutComponent } from "./logout.component";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { By } from "@angular/platform-browser";

describe('LogoutComponent', () => {
    let component: LogoutComponent;
    let fixture: ComponentFixture<LogoutComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LogoutComponent],
            imports: [RouterTestingModule]
        }).compileComponents();
        fixture = TestBed.createComponent(LogoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should display title', () => {
        const title = fixture.nativeElement.querySelector('h1');
        expect(title).toBeTruthy();
    });

    it('should display the chapters management link', () => {
        const link = fixture.debugElement.query(By.css('a'));
        expect(link).toBeTruthy();
        expect(link.attributes['ng-reflect-router-link']).toBe('/auth/login');
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});