import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';

import { ConfigService } from '@core/ngx-easy-table/services/config-service';
import { Event } from '@core/ngx-easy-table/model/event.enum';
import { Config } from '@core/ngx-easy-table/model/config';
import { Columns } from '@core/ngx-easy-table/model/columns';
import { UtilsService } from '@core/ngx-easy-table/services/utils-service';

import { flatMap, groupBy, reduce } from 'rxjs/operators';
import { from } from 'rxjs';

@Component({
  selector: 'ngx-table',
  providers: [ConfigService, UtilsService],
  templateUrl: './base.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseComponent implements OnInit, OnChanges, AfterViewInit {
  public selectedRow: number;
  public selectedCol: number;
  public term;
  public config: Config;
  public globalSearchTerm;
  grouped = [];
  menuActive = false;
  isSelected = false;
  page = 1;
  count = null;
  limit;
  sortBy = {
    key: '',
    order: 'asc',
  };
  selectedDetailsTemplateRowId = new Set();
  id;
  th = undefined;
  startOffset;
  loadingHeight = '30px';
  @Input() configuration: Config;
  @Input() data: Array<Object>;
  @Input() pagination;
  @Input() groupRowsBy;
  @Input() detailsTemplate: TemplateRef<any>;
  @Input() summaryTemplate: TemplateRef<any>;
  @Input() columns: Columns[];
  @Output() event = new EventEmitter();
  @ContentChild(TemplateRef) public rowTemplate: TemplateRef<any>;

  constructor(private cdr: ChangeDetectorRef) {
    this.id = UtilsService.randomId();
  }

  ngOnInit() {
    if (!this.columns) {
      console.error('[columns] property required!');
    }
    if (this.configuration) {
      ConfigService.config = this.configuration;
    }
    this.config = ConfigService.config;
    this.limit = this.config.rows;
    if (this.groupRowsBy) {
      this.doGroupRows();
    }
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    const data: SimpleChange = changes.data;
    const pagination: SimpleChange = changes.pagination;
    const configuration: SimpleChange = changes.configuration;
    const groupRowsBy: SimpleChange = changes.groupRowsBy;
    if (data && data.currentValue) {
      this.data = [...data.currentValue];
    }
    if (pagination && pagination.currentValue) {
      this.count = pagination.currentValue.count;
    }
    if (configuration && configuration.currentValue) {
      this.config = configuration.currentValue;
      this.cdr.markForCheck();
    }
    if (groupRowsBy && groupRowsBy.currentValue) {
      this.doGroupRows();
    }
  }

  orderBy(key: string): void {
    if (!ConfigService.config.orderEnabled) {
      return;
    }
    this.sortBy.key = key;
    if (this.sortBy.order === 'asc') {
      this.sortBy.order = 'desc';
    } else {
      this.sortBy.order = 'asc';
    }
    const value = {
      key,
      order: this.sortBy.order,
    };
    if (!ConfigService.config.serverPagination) {
      this.data = [...this.data];
    }
    this.emitEvent(Event.onOrder, value);
  }

  onClick($event: object, row: object, key: string | number | boolean, colIndex: number, rowIndex: number): void {
    if (ConfigService.config.selectRow) {
      this.selectedRow = rowIndex;
    }
    if (ConfigService.config.selectCol) {
      this.selectedCol = colIndex;
    }
    if (ConfigService.config.selectCell) {
      this.selectedRow = rowIndex;
      this.selectedCol = colIndex;
    }
    if (ConfigService.config.clickEvent) {
      const value = {
        event: $event,
        row: row,
        key: key,
        rowId: rowIndex,
        colId: colIndex,
      };
      this.emitEvent(Event.onClick, value);
    }
  }

  onDoubleClick($event: object, row: object, key: string | number | boolean, colIndex: number, rowIndex: number): void {
    const value = {
      event: $event,
      row: row,
      key: key,
      rowId: rowIndex,
      colId: colIndex,
    };
    this.emitEvent(Event.onDoubleClick, value);
  }

  onCheckboxSelect($event: object, row: object, rowIndex: number): void {
    const value = {
      event: $event,
      row: row,
      rowId: rowIndex,
    };
    this.emitEvent(Event.onCheckboxSelect, value);
  }

  onSelectAll() {
    this.isSelected = !this.isSelected;
    this.emitEvent(Event.onSelectAll, this.isSelected);
  }

  onSearch($event): void {
    if (!ConfigService.config.serverPagination) {
      this.term = $event;
    }
    this.emitEvent(Event.onSearch, $event);
  }

  onGlobalSearch($event): void {
    if (!ConfigService.config.serverPagination) {
      this.globalSearchTerm = $event;
    }
    this.emitEvent(Event.onGlobalSearch, $event);
  }

  onPagination($event): void {
    this.page = $event.page;
    this.limit = $event.limit;
    this.emitEvent(Event.onPagination, $event);
  }

  private emitEvent(event, value: Object): void {
    this.event.emit({ event: Event[event], value });
    if (this.config.logger) {
      console.log({ event: Event[event], value });
    }
  }

  collapseRow(rowIndex: number): void {
    if (this.selectedDetailsTemplateRowId.has(rowIndex)) {
      this.selectedDetailsTemplateRowId.delete(rowIndex);
      this.emitEvent(Event.onRowCollapsedHide, rowIndex);
    } else {
      this.selectedDetailsTemplateRowId.add(rowIndex);
      this.emitEvent(Event.onRowCollapsedShow, rowIndex);
    }
  }

  private doGroupRows() {
    this.grouped = [];
    from(this.data).pipe(
      groupBy(row => row[this.groupRowsBy]),
      flatMap(group => group.pipe(
        reduce((acc: Array<Object>, curr) => [...acc, curr], []),
      )),
    ).subscribe(row => this.grouped.push(row));
  }

  isRowCollapsed(rowIndex: number): boolean {
    if (this.config.collapseAllRows) {
      return true;
    }
    return this.selectedDetailsTemplateRowId.has(rowIndex);
  }

  onMouseDown(event, th) {
    if (!this.config.resizeColumn) {
      return;
    }
    this.th = th;
    this.startOffset = th.offsetWidth - event.pageX;
    this.emitEvent(Event.onColumnResizeMouseDown, event);
  }

  onMouseMove(event) {
    if (!this.config.resizeColumn) {
      return;
    }
    if (this.th) {
      this.th.style.width = this.startOffset + event.pageX + 'px';
      this.th.style.cursor = 'col-resize';
      this.th.style['user-select'] = 'none';
    }
  }

  onMouseUp(event) {
    if (!this.config.resizeColumn) {
      return;
    }
    this.emitEvent(Event.onColumnResizeMouseUp, event);
    this.th.style.cursor = 'default';
    this.th = undefined;
  }

  get isLoading(): boolean {
    const rows = document.getElementById('table')['rows'];
    if (rows.length > 3) {
      this.getLoadingHeight(rows);
    }
    return this.config.isLoading;
  }

  getLoadingHeight(rows: any): void {
    const searchEnabled = this.config.searchEnabled ? 1 : 0;
    const headerEnabled = this.config.headerEnabled ? 1 : 0;
    const borderTrHeight = 1;
    const borderDivHeight = 2;
    this.loadingHeight = (rows.length - searchEnabled - headerEnabled) * (rows[3].offsetHeight - borderTrHeight) - borderDivHeight + 'px';
  }

  getColumnWidth(column: any): string {
    if (column.width) {
      return column.width;
    }
    return this.config.fixedColumnWidth ? 100 / this.columns.length + '%' : null;
  }

  onRowDrag(event) {
    this.emitEvent(Event.onRowDrag, event);
  }

  onRowDrop(event) {
    this.emitEvent(Event.onRowDrop, event);
  }
}
