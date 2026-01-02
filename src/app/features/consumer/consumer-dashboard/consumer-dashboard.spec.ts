import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerDashboardComponent } from './consumer-dashboard';

describe('ConsumerDashboard', () => {
  let component: ConsumerDashboardComponent;
  let fixture: ComponentFixture<ConsumerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumerDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumerDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
