import {Component, HostListener} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-scroll-top',
  standalone: true,
  imports: [
    NgClass,
    MatIcon,
    NgIf
  ],
  templateUrl: './scroll-top.component.html',
  styleUrl: './scroll-top.component.scss'
})
export class ScrollTopComponent {

  @HostListener('window:scroll', ['$event'])
  scrolled: number = 0;

  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }


  @HostListener('window:scroll', ['$event'])  onWindowScroll(data: any) {
    this.scrolled  = window.scrollY;
  }

}
