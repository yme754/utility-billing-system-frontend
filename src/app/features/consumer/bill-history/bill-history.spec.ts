import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillHistory } from './bill-history';

describe('BillHistory', () => {
  let component: BillHistory;
  let fixture: ComponentFixture<BillHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
