import {
  CurrencyPipe,
  JsonPipe,
  NgFor,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
  CommonModule
} from '@angular/common';

import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef
} from '@angular/core';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    JsonPipe,
    CurrencyPipe,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    NgFor,
    NgIf
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {

  @Input() columns: Array<{ key: string; label: string; width?: string; pipe?: string }> = [];
  @Input() data: any[] = [];
  @Input() showIndex = false;
  @Input() emptyMessage = 'No records found.';

  @ContentChild('actionsTemplate', { static: false }) actionsTemplate?: TemplateRef<any>;

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() action = new EventEmitter<{ type: string; row: any }>();

  trackByIndex(index: number, row: any) {
    return row?.id ?? index;
  }

  isPrimitive(val: any) {
    return typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean';
  }

  isArray(val: any) {
    return Array.isArray(val);
  }

  isObject(val: any) {
    return val && typeof val === 'object' && !Array.isArray(val);
  }

  onEdit(row: any) {
    this.edit.emit(row);
    this.action.emit({ type: 'edit', row });
  }

  onDelete(row: any) {
    this.delete.emit(row);
    this.action.emit({ type: 'delete', row });
  }
}
