import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {CATEGORY} from "../../const/category";
import {CrudService} from "../../services/crud/crud.service";
import {Router, RouterLink} from "@angular/router";
import {AlertService} from "../../services/alert/alert.service";
import {MatDialog} from "@angular/material/dialog";
import {
  MatCell,
  MatCellDef,
  MatColumnDef, MatFooterCell, MatFooterRow,
  MatHeaderCell,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable,
  MatTableDataSource, MatTableModule
} from "@angular/material/table";
import {CreateUserComponent} from "../../component/create-user/create-user.component";
import {MatButton, MatFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {CurrencyPipe} from "@angular/common";

@Component({
  selector: 'app-list-pedidos',
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
    MatPaginator,
  ],
  templateUrl: './list-pedidos.component.html',
  styleUrl: './list-pedidos.component.scss'
})
export default class ListPedidosComponent implements  OnInit{

  @ViewChild (MatPaginator) paginator!: MatPaginator;

  public tableproduct: any;
  public colectionID: any;
  tableConventionsColumns: string[];
  public selectIndexTable: number | undefined;

  getCategorys = CATEGORY.data;
  constructor( private crud: CrudService,
               private router: Router,
               private alert: AlertService,
               public dialog: MatDialog,) {
    this.tableConventionsColumns = [];
  }
  ngOnInit(): void {
    this.listProduct();
    this._customerTableColumns();
  }

  listProduct(): void {

    this.crud.read('/order').then((response: any) => {

      response.subscribe((res: any) => {
        //this.tableproduct = res;
        this.tableproduct = new MatTableDataSource<any>(res);
        this.tableproduct.paginator = this.paginator;

      });


    })
  }

  private _customerTableColumns(): void {
    this.tableConventionsColumns = [
      'id',
      'status',
      'date_order',
      'accion',

    ];
  }


showEditOrder(item: any): void {

    console.log(item)
  this.router.navigate([`/edit-order/${item.id}/${item._id}`])

}




  async _getProduct(id: any): Promise<any>  {
    this.crud.readGeneral('/products', 'id', id).then( ( response: any) => {
      response.subscribe(( res: any) => {
        this.colectionID  = res[0]?.payload.doc.id;

        this.crud.deleteColection('/products', this.colectionID ).then((response: any) => {
          this.alert.showToasterFull('El producto fue eliminado exitosamente');

        })


      });

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
