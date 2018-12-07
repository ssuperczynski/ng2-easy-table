import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ConfigService } from './configuration.service';

@Component({
  selector: 'app-dynamic-row',
  templateUrl: './dynamic-row.component.html',
  styleUrls: ['./dynamic-row.component.css'],
  providers: [ConfigService],
})
export class DynamicRowComponent implements OnInit {
  @ViewChild('actionTpl') actionTpl: TemplateRef<any>;
  public data;
  public columns;
  public configuration;

  ngOnInit(): void {
    this.configuration = ConfigService.config;
    this.columns = [
      { key: 'status', title: 'Status' },
      { key: 'amount', title: 'Amount' },
      { key: 'company', title: 'Company' },
      { key: 'limit', title: 'Limit' },
      { key: 'balance', title: 'Balance' },
      { key: 'action', title: 'Actions', cellTemplate: this.actionTpl },
    ];

    this.data = [
      { status: 'ACTIVE', amount: 1, company: 'foo', limit: 1000, balance: 2000 },
      { status: 'INACTIVE', amount: 2, company: 'bar', limit: 1000, balance: 900 },
      { status: 'INACTIVE', amount: 22, company: 'boo', limit: 10, balance: 2220 },
      { status: 'INACTIVE', amount: 212, company: 'baa', limit: 4000, balance: 1900 },
      { status: 'ACTIVE', amount: 33, company: 'Some', limit: 600, balance: 1200 },
    ];
  }

  randNumber(min, max) {
    return ~~(Math.random() * (max - min) + min);
  }

  addRow() {
    this.data.push(
      {
        status: 'ACTIVE',
        amount: this.randNumber(1, 5),
        company: 'foo',
        limit: this.randNumber(800, 1200),
        balance: this.randNumber(800, 3000),
      },
    );
    this.data = [...this.data];
  }

  remove(rowIndex: number): void {
    this.data.splice(rowIndex, 1);
    this.data = [...this.data];
  }
}
