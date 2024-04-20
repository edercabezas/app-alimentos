import {Component, OnInit} from '@angular/core';
import {CurrencyPipe} from "@angular/common";
import {
  MatCell,
  MatColumnDef,
  MatFooterCell,
  MatFooterRow,
  MatHeaderCell,
  MatHeaderRow, MatRow,
  MatTable, MatTableModule
} from "@angular/material/table";
import {CrudService} from "../../services/crud/crud.service";
import {Router, RouterLink} from "@angular/router";
import {MatButton, MatFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {filter} from "rxjs";
import {CATEGORY} from "../../const/category";
import {Products} from "../../interface/products";
import {AlertService} from "../../services/alert/alert.service";

@Component({
  selector: 'app-list-product',
  standalone: true,
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatFooterCell,
    CurrencyPipe,
    MatHeaderRow,
    MatFooterRow,
    MatRow,
    MatTableModule,
    MatButton,
    MatIcon,
    MatFabButton,
    RouterLink,
  ],
  templateUrl: './list-product.component.html',
  styleUrl: './list-product.component.scss'
})
export default class ListProductComponent implements OnInit{

  public tableproduct: any;
  public colectionID: any;
  tableConventionsColumns: string[];
  public selectIndexTable: number | undefined;

  getCategorys = CATEGORY.data;
  constructor( private crud: CrudService,
               private router: Router,
               private alert: AlertService,) {
    this.tableConventionsColumns = [];
  }
  ngOnInit(): void {
    this.listProduct();
    this._customerTableColumns();
  }

  listProduct(): void {

    this.crud.read('/products').then((response: any) => {

      response.subscribe((res: any) => {
        this.tableproduct = res;

      });


    }).catch((error: any) => {
      console.log(error);
    })
  }

  private _customerTableColumns(): void {
    this.tableConventionsColumns = [
      'img',
      'nameProduct',
      'size',
      'price',
      'prefijo',
      'category',
      'status',
      'accion',

    ];
  }



  async _getProduct(id: any): Promise<any>  {
    this.crud.readGeneral('/products', 'id', id).then( ( response: any) => {
      response.subscribe(( res: any) => {
        this.colectionID  = res[0]?.payload.doc.id;

        this.crud.deleteColection('/products', this.colectionID ).then((response: any) => {
            this.alert.showToasterFull('El producto fue eliminado exitosamente');

        })


      });

    }).catch((error: any) => {
      console.log(error);
    });
  }


  public selectRow(index: any): void {
    this.router.navigate([`edit-product/${index.id}`])
  }

  public async deleteRow(index: any): Promise<any> {
      this._getProduct(index.id);
  }

  filtreTypeProduct(category: number): string {
    const data = this.getCategorys.filter((item: any) => item.id === category);
    return data[0].name;
  }

}
