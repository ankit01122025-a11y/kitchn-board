import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
  HostListener
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, FormsModule],
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true
    }
  ]
})
export class MultiSelectComponent {
  @Input() label: string = 'Select';
  @Input() options: any[] = [];
  @Input() optionValue: string = 'id';
  @Input() optionLabel: string = 'name';

  searchTerm: string = '';
  isOpen: boolean = false;

  value: any[] = [];

  @Output() changed = new EventEmitter<any[]>();


  onChange = (_: any) => { };
  onTouched = () => { };

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.multi-select-container')) {
      this.isOpen = false;
    }
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  touched(): void {
    this.onTouched();
  }

  writeValue(val: any[]): void {
    this.value = val || [];
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // CHECK ITEM
  isChecked(id: any): boolean {
    return this.value.includes(id);
  }

  toggleValue(id: any): void {
    if (this.isChecked(id)) {
      this.value = this.value.filter(v => v !== id);
    } else {
      this.value.push(id);
    }

    this.onChange(this.value);
    this.changed.emit(this.value);
  }

  removeTag(id: any, event: MouseEvent) {
    event.stopPropagation(); // Prevent dropdown toggle
    this.value = this.value.filter(v => v !== id);
    this.onChange(this.value);
    this.changed.emit(this.value);
  }

  // Search filter
  filteredOptions(): any[] {
    const term = this.searchTerm.toLowerCase();
    return this.options.filter(o =>
      String(o[this.optionLabel]).toLowerCase().includes(term)
    );
  }

  // Return label of selected id
  labelFor(id: any): string {
    const found = this.options.find(o => o[this.optionValue] === id);
    return found ? found[this.optionLabel] : '';
  }
}
