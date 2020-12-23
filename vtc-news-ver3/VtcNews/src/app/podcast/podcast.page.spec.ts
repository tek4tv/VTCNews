import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PodcastPage } from './podcast.page';

describe('PodcastPage', () => {
  let component: PodcastPage;
  let fixture: ComponentFixture<PodcastPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PodcastPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PodcastPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
