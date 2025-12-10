import { Component } from '@angular/core';
import { LoaderService } from '../../services/loader/loader.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [NgIf],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {

  constructor(public loader: LoaderService) { }
}
