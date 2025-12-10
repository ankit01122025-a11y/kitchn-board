import { Injectable } from '@angular/core';
import { ToastComponent } from '../../components/toast/toast.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private toast!: ToastComponent;

  register(toast: ToastComponent) {
    this.toast = toast;
  }

  success(msg: string) {
    this.toast.showToast(msg, 'success');
  }

  warning(msg: string) {
    this.toast.showToast(msg, 'warning');
  }

  error(msg: string) {
    this.toast.showToast(msg, 'error');
  }
}
