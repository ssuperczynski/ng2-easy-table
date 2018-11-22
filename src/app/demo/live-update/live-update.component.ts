import { Component, OnInit } from '@angular/core';
import { ConfigService } from './configuration.service';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

interface Data {
  status: string;
  amount: number;
  company: string;
  limit: number;
  balance: number;
}

@Component({
  selector: 'app-live-update',
  templateUrl: './live-update.component.html',
  styleUrls: ['./live-update.component.css'],
  providers: [ConfigService],
})
export class LiveUpdateComponent implements OnInit {
  data: Data[] = [
    { status: 'ACTIVE', amount: 1, company: 'Foo', limit: 1000, balance: 2000 },
    { status: 'INACTIVE', amount: 2, company: 'Bar', limit: 1000, balance: 900 },
    { status: 'INACTIVE', amount: 22, company: 'Boo', limit: 10, balance: 2220 },
    { status: 'INACTIVE', amount: 212, company: 'Baz', limit: 4000, balance: 1900 },
    { status: 'ACTIVE', amount: 33, company: 'Saz', limit: 1600, balance: 4200 },
    { status: 'INACTIVE', amount: 23, company: 'Soo', limit: 2600, balance: 2200 },
    { status: 'ACTIVE', amount: 66, company: 'Lorem', limit: 6400, balance: 1700 },
    { status: 'INACTIVE', amount: 888, company: 'Ipsum', limit: 6060, balance: 1100 },
  ];
  columns = [
    { key: 'status', title: 'Is active' },
    { key: 'amount', title: 'Amount' },
    { key: 'company', title: 'Company' },
    { key: 'limit', title: 'Limit' },
    { key: 'balance', title: 'Balance' },
  ];
  configuration;

  constructor() {
    this.configuration = ConfigService.config;
  }

  static random(min, max) {
    return Math.floor(min + (Math.random() * (max - min + 1)));
  }

  ngOnInit() {
    interval(800)
      .pipe(
        map(() => {
          this.data[LiveUpdateComponent.random(0, 7)].limit = LiveUpdateComponent.random(500, 4000);
          this.data[LiveUpdateComponent.random(0, 7)].balance = LiveUpdateComponent.random(900, 1100);
          this.data[LiveUpdateComponent.random(0, 7)].amount = LiveUpdateComponent.random(100, 9100);
        }),
      )
      .subscribe();
  }
}
