import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RephoneComponent } from './rephone.component';

describe('RephoneComponent', () => {
  let component: RephoneComponent;
  let fixture: ComponentFixture<RephoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RephoneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RephoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
