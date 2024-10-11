import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimgComponent } from './reimg.component';

describe('ReemailComponent', () => {
  let component: ReimgComponent;
  let fixture: ComponentFixture<ReimgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReimgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReimgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
