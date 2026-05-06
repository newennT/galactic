import { ComponentFixture } from "@angular/core/testing";
import { FooterComponent } from "./footer.component";
import { RouterTestingModule } from "@angular/router/testing";
import { TestBed } from "@angular/core/testing";

describe('FooterComponent', () => {

    let component: FooterComponent;
    let fixture: ComponentFixture<FooterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FooterComponent],
            imports: [RouterTestingModule]
        }).compileComponents();
        fixture = TestBed.createComponent(FooterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});