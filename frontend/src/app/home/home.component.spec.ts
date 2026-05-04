import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HomeComponent } from "./home.component";
import { RouterTestingModule } from "@angular/router/testing";
import { AuthService } from "../core/services/auth.service";
import { By } from "@angular/platform-browser";

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;
    let authServiceMock: any;

    beforeEach(async () => {
        authServiceMock = {
            isLogged: jest.fn(),
            isAdmin: jest.fn()
        };

        await TestBed.configureTestingModule({
            declarations: [HomeComponent],
            imports: [RouterTestingModule],
            providers: [
                { provide: AuthService, useValue: authServiceMock }
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show admin link when user is admin', () => {
        authServiceMock.isLogged.mockReturnValue(true);
        authServiceMock.isAdmin.mockReturnValue(true);
        fixture.detectChanges();
        const adminLink = fixture.nativeElement.querySelector('a[routerLink="/admin"]');
        expect(adminLink).toBeTruthy();
    });

    it('should hide admin link when user is not admin', () => {
        authServiceMock.isLogged.mockReturnValue(true);
        authServiceMock.isAdmin.mockReturnValue(false);
        fixture.detectChanges();
        const adminLink = fixture.nativeElement.querySelector('a[routerLink="/admin"]');
        expect(adminLink).toBeFalsy();
    });

    it('should show login buttons when user is not logged', () => {
        authServiceMock.isLogged.mockReturnValue(false);
        authServiceMock.isAdmin.mockReturnValue(false);
        fixture.detectChanges();
        const loginButtons = fixture.debugElement.query(By.css('#btn-login'));
        expect(loginButtons).toBeTruthy();
    });

    it('should show dashboard button when user is logged', () => {
        authServiceMock.isLogged.mockReturnValue(true);
        authServiceMock.isAdmin.mockReturnValue(false);
        fixture.detectChanges();
        const dashboardButton = fixture.debugElement.query(By.css('a[routerLink="/dashboard"]'));
        expect(dashboardButton).toBeTruthy();
    });

    it('should call isAdmin from AuthService', () => {
        authServiceMock.isLogged.mockReturnValue(true);
        authServiceMock.isAdmin.mockReturnValue(true);
        fixture.detectChanges();
        expect(authServiceMock.isAdmin).toHaveBeenCalled();
    });

    it('should call isLogged from AuthService', () => {
        authServiceMock.isLogged.mockReturnValue(true);
        authServiceMock.isAdmin.mockReturnValue(false);
        fixture.detectChanges();
        expect(authServiceMock.isLogged).toHaveBeenCalled();
    });
});