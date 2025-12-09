import { Component } from '@angular/core';
import { OrderComponent } from './order/order.component';
import { CategoryComponent } from './category/category.component';
import { ItemComponent } from './item/item.component';

@Component({
  selector: 'app-management-board',
  standalone: true,
  imports: [
    OrderComponent,
    CategoryComponent,
    ItemComponent
  ],
  templateUrl: './management-board.component.html',
  styleUrl: './management-board.component.scss'
})
export class ManagementBoardComponent {

}
