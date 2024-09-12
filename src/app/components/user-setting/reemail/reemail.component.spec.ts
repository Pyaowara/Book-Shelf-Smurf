import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReemailComponent } from './reemail.component';

describe('ReemailComponent', () => {
  let component: ReemailComponent;
  let fixture: ComponentFixture<ReemailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReemailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
