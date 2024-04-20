import {Component, Input} from '@angular/core';
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-reload',
  standalone: true,
  imports: [
    MatProgressSpinner
  ],
  templateUrl: './reload.component.html',
  styleUrl: './reload.component.scss'
})
export class ReloadComponent {

  @Input() title: any;

}
