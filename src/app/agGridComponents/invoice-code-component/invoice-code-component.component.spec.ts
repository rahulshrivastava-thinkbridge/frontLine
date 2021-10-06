import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceCodeComponentComponent } from './invoice-code-component.component';

describe('InvoiceCodeComponentComponent', () => {
  let component: InvoiceCodeComponentComponent;
  let fixture: ComponentFixture<InvoiceCodeComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceCodeComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceCodeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
