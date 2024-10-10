import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumDetailComponent } from './forum-detail.component';

describe('ForumDetailComponent', () => {
  let component: ForumDetailComponent;
  let fixture: ComponentFixture<ForumDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForumDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForumDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
