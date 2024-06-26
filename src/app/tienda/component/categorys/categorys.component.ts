import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {CATEGORY} from "../../const/category";
import {MatList, MatListItem} from "@angular/material/list";
import {MatButton} from "@angular/material/button";
import {JsonPipe, NgFor, NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {Router} from "@angular/router";

@Component({
  selector: 'app-categorys',
  standalone: true,
  imports: [
    MatList,
    MatListItem,
    MatButton,
    NgIf,
    NgFor,
    JsonPipe,
    MatIcon
  ],
  templateUrl: './categorys.component.html',
  styleUrl: './categorys.component.scss'
})
export class CategorysComponent implements OnInit{
  @Output() optionSelect: EventEmitter<any>;
  categorys: any = CATEGORY.data;
  constructor( private _router: Router) {
    this.optionSelect = new EventEmitter();
  }
  ngOnInit(): void {
  }

  setOptionCategory(item: any): void {
    this.optionSelect.emit(item.id);

    const url = item.name.toLowerCase().replaceAll(" ", '-').replaceAll(",", '');

    this._router.navigate([`/list-products/${item.id}/${url}`]);


  }


}
