import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartydComponent } from './partyd.component';

describe('PartydComponent', () => {
  let component: PartydComponent;
  let fixture: ComponentFixture<PartydComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartydComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartydComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
