import { Component, ViewChild } from '@angular/core';
import { Company, data } from '../../../assets/data';
import { Columns, DefaultConfig } from 'ngx-easy-table';
import { API, APIDefinition } from 'ngx-easy-table';

@Component({
  selector: 'app-nested-table',
  templateUrl: './nested-table.component.html',
  styleUrls: ['./nested-table.component.css'],
})
export class NestedTableComponent {
  @ViewChild('table', { static: true }) table: APIDefinition;
  public toggledRows = new Set<number>();
  public columns: Columns[] = [
    { key: 'name', title: 'Name', width: '15%' },
    { key: 'age', title: 'Age', width: '15%' },
    { key: 'company', title: 'Company', width: '15%' },
    { key: 'name', title: 'Name', width: '15%' },
    { key: 'phone', title: 'Phone', width: '15%' },
    { key: 'address.street', title: 'Address', width: '15%' },
    { key: '', title: 'Action', width: '5%' },
  ];
  public data: Company[] = [];
  public configuration;

  public nestedData: Company[] = [];
  public nestedConfiguration;
  public nestedColumns: Columns[] = [
    { key: 'name', title: 'Name', width: '15%' },
    { key: 'age', title: 'Age', width: '15%' },
    { key: 'company', title: 'Company', width: '15%' },
    { key: 'name', title: 'Name', width: '15%' },
    { key: 'phone', title: 'Phone', width: '15%' },
    { key: 'address.street', title: 'Address', width: '15%' },
  ];

  constructor() {
    this.configuration = DefaultConfig;
    this.configuration.detailsTemplate = true;
    this.configuration.tableLayout.hover = true;
    this.data = data;

    this.nestedConfiguration = { ...DefaultConfig };
    this.nestedConfiguration.detailsTemplate = true;
    this.nestedConfiguration.rows = 5;
    this.nestedData = data;
  }

  onRowClickEvent($event: MouseEvent, index: number): void {
    $event.preventDefault();
    this.table.apiEvent({
      type: API.toggleRowIndex,
      value: index,
    });
    if (this.toggledRows.has(index)) {
      this.toggledRows.delete(index);
    } else {
      this.toggledRows.add(index);
    }
  }
}
