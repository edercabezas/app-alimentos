import { Component, OnInit, ViewChild} from '@angular/core';
import {CurrencyPipe} from "@angular/common";
import {
  MatCell,
  MatColumnDef,
  MatFooterCell,
  MatFooterRow,
  MatHeaderCell,
  MatHeaderRow, MatRow,
  MatTable, MatTableDataSource, MatTableModule
} from "@angular/material/table";
import {CrudService} from "../../services/crud/crud.service";
import {Router, RouterLink} from "@angular/router";
import {MatButton, MatFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {CATEGORY} from "../../const/category";
import {AlertService} from "../../services/alert/alert.service";
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';

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
    MatPaginatorModule
  ],
  templateUrl: './list-product.component.html',
  styleUrl: './list-product.component.scss'
})
export default class ListProductComponent implements OnInit {
  @ViewChild (MatPaginator) paginator!: MatPaginator;
  public tableproduct: any;
  public colectionID: any;
  tableConventionsColumns: string[];
  public selectIndexTable: number | undefined;
  totalProducts: number = 0;
  pageSize: number = 10; // Número de elementos por página
  pageSizeOptions: number[] = [5, 10, 25, 100];

  getCategorys = CATEGORY.data;
  constructor( private _crud: CrudService,
               private _router: Router,
               private _alert: AlertService,) {
    this.tableConventionsColumns = [];
  }
  ngOnInit(): void {
    this.listProduct();
    this._customerTableColumns();
  }


  listProduct(): void {

    this._crud.read('/products').then((response: any) => {

      response.subscribe((res: any) => {
        this.tableproduct = new MatTableDataSource<any>(res);
        this.tableproduct.paginator = this.paginator;

        //this.tableproduct = res;
        this.totalProducts = res.length;

      });


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
    this._crud.readGeneral('/products', 'id', id).then( ( response: any) => {
      response.subscribe(( res: any) => {
        this.colectionID  = res[0]?.payload.doc.id;

        this._crud.deleteColection('/products', this.colectionID ).then((response: any) => {
            this._alert.showToasterFull('El producto fue eliminado exitosamente');

        })


      });

    });
  }


  public selectRow(index: any): void {
    this._router.navigate([`edit-product/${index.id}`])
  }

  public async deleteRow(index: any): Promise<any> {
      this._getProduct(index.id);
  }

  filtreTypeProduct(category: number): string {
    const data = this.getCategorys.filter((item: any) => item.id === category);
    return data[0].name;
  }

}
