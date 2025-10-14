import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospedajesDestacados } from './hospedajes-destacados';

describe('HospedajesDestacados', () => {
  let component: HospedajesDestacados;
  let fixture: ComponentFixture<HospedajesDestacados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospedajesDestacados]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospedajesDestacados);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
