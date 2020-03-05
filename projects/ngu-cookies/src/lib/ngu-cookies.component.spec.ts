import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NguCookiesComponent } from './ngu-cookies.component';

describe('NguCookiesComponent', () => {
  let component: NguCookiesComponent;
  let fixture: ComponentFixture<NguCookiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NguCookiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NguCookiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
