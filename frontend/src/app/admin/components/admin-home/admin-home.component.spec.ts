import { RouterTestingModule } from "@angular/router/testing";
import { AdminHomeComponent } from "./admin-home.component";
import { ComponentFixture } from "@angular/core/testing";
import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

describe('AdminHomeComponent', () => {

    let component: AdminHomeComponent;
    let fixture: ComponentFixture<AdminHomeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdminHomeComponent],
            imports: [RouterTestingModule]
        }).compileComponents();
        fixture = TestBed.createComponent(AdminHomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display title', () => {
        const title = fixture.nativeElement.querySelector('h1');
        expect(title).toBeTruthy();
    });

    it('should display the chapters management link', () => {
        const links = fixture.debugElement.queryAll(By.css('a'));
        const chaptersLink = links[0];
        expect(chaptersLink.attributes['ng-reflect-router-link']).toBe('/admin/chapters');
    });

    it('should display the users management link', () => {
        const links = fixture.debugElement.queryAll(By.css('a'));
        const usersLink = links[1];
        expect(usersLink.attributes['ng-reflect-router-link']).toBe('/admin/users');
    });


});