import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchedProfileComponent } from './matched-profile.component';

describe('MatchedProfileComponent', () => {
  let component: MatchedProfileComponent;
  let fixture: ComponentFixture<MatchedProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchedProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchedProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
