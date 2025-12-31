import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyConnections } from './my-connections';

describe('MyConnections', () => {
  let component: MyConnections;
  let fixture: ComponentFixture<MyConnections>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyConnections]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyConnections);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
