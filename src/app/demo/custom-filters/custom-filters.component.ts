import { Component, OnInit } from '@angular/core';
import { ConfigService } from './configuration.service';
import { data } from '@assets/data';
@Component({
  selector: 'app-custom-filters',
  templateUrl: './custom-filters.component.html',
  styleUrls: ['./custom-filters.component.css']
})
export class CustomFiltersComponent {

  columns = [
    { key: 'phone', title: 'Phone' },
    { key: 'age', title: 'Age' },
    { key: 'company', title: 'Company' },
    { key: 'name', title: 'Name' },
    { key: 'isActive', title: 'Active' },
  ];
  data = [];
  rows = [];
  configuration;
  constructor() {
    this.configuration = ConfigService.config;
    this.data = data;
    this.rows = data;
  }

  onCompanySearch(value): void {
    this.rows = this.data.filter(_ => _.company.toLowerCase().indexOf(value) > -1);
  }

  onAgeSearch(value): void {
    this.rows = this.data.filter(_ => _.age > value);
  }

  onStatusChange(value): void {
    this.rows = this.data.filter(_ => _.isActive === (value === 'true'));
  }

  reset(): void {
    this.rows = this.data;
  }

}
