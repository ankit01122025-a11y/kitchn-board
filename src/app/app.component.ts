import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ChefBoardComponent } from './modules/chef-board/chef-board.component';
import { ManagementBoardComponent } from './modules/management-board/management-board.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ToastService } from './shared/services/toast/toast.service';
import { LoaderComponent } from './shared/components/loader/loader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ManagementBoardComponent,
    ChefBoardComponent,
    ToastComponent,
    LoaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  title = 'kitchn_board_app';

  @ViewChild('globalToast') toast!: ToastComponent;

  constructor(private toastService: ToastService) { }

  ngAfterViewInit(): void {
    this.toastService.register(this.toast);
  }
}
