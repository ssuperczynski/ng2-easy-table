import { Component } from '@angular/core';
import { Company, data } from '../../../assets/data';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  modal = false;
  selected;
  public columns: Columns[] = [
    { key: 'age', title: 'Age' },
    { key: 'company', title: 'Company' },
    { key: 'name', title: 'Name' },
    { key: 'isActive', title: 'STATUS' },
    { key: 'isActive', title: 'Edit' },
  ];
  data: Company[] = [];
  public configuration: Config;

  constructor() {
    this.configuration = { ...DefaultConfig };
    this.data = data;
  }

  onEvent(event: { event: string, value: any }): void {
    this.selected = JSON.stringify(event.value.row, null, 2);
  }

  showModal(): void {
    this.modal = true;
  }

  hideModal(): void {
    this.modal = false;
  }
}
