import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingConsole } from './billing-console';

describe('BillingConsole', () => {
  let component: BillingConsole;
  let fixture: ComponentFixture<BillingConsole>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingConsole]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingConsole);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
