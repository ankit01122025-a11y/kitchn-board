import { Component } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {

  show = false;
  message = '';
  type: 'success' | 'warning' | 'error' = 'success';

  showToast(msg: string, type: 'success' | 'warning' | 'error') {
    this.message = msg;
    this.type = type;
    this.show = true;

    setTimeout(() => this.show = false, 2500);
  }
}
