import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TrendsPage } from './trends.page';

describe('TrendsPage', () => {
  let component: TrendsPage;
  let fixture: ComponentFixture<TrendsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrendsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TrendsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
