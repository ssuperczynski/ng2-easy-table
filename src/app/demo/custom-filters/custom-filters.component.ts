import { Component } from '@angular/core';
import { Company, data } from '../../../assets/data';
import { ConfigService } from './configuration.service';
import { Columns } from 'ngx-easy-table';

@Component({
  selector: 'app-custom-filters',
  templateUrl: './custom-filters.component.html',
  styleUrls: ['./custom-filters.component.css'],
})
export class CustomFiltersComponent {

  public columns: Columns[] = [
    { key: 'phone', title: 'Phone' },
    { key: 'age', title: 'Age' },
    { key: 'company', title: 'Company' },
    { key: 'name', title: 'Name' },
    { key: 'isActive', title: 'Active' },
  ];
  data: Company[] = [];
  rows: Company[] = [];
  configuration;

  constructor() {
    this.configuration = ConfigService.config;
    this.data = data;
    this.rows = data;
  }

  onCompanySearch(value: string): void {
    this.rows = this.data.filter((_) => _.company.toLowerCase().indexOf(value) > -1);
  }

  onAgeSearch(value: number): void {
    this.rows = this.data.filter((_) => _.age > value);
  }

  onStatusChange(value: string): void {
    this.rows = this.data.filter((_) => _.isActive === (value === 'true'));
  }

  reset(): void {
    this.rows = this.data;
  }

}
