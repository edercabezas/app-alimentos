import {Component, OnInit, ViewChild} from '@angular/core';
import {CurrencyPipe} from "@angular/common";
import {MatButton, MatFabButton} from "@angular/material/button";
import {
  MatCell,
  MatColumnDef, MatFooterCell, MatFooterRow,
  MatHeaderCell,
  MatHeaderRow,
  MatRow, MatTable, MatTableDataSource, MatTableModule
} from "@angular/material/table";
import {MatIcon} from "@angular/material/icon";
import {Router, RouterLink} from "@angular/router";
import {CATEGORY} from "../../const/category";
import {CrudService} from "../../services/crud/crud.service";
import {AlertService} from "../../services/alert/alert.service";
import {MatDialog} from "@angular/material/dialog";
import {CreateUserComponent} from "../../component/create-user/create-user.component";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-list-user',
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
  templateUrl: './list-user.component.html',
  styleUrl: './list-user.component.scss'
})
export default class ListUserComponent implements OnInit{
  @ViewChild (MatPaginator) paginator!: MatPaginator;

  public tableproduct: any;
  public colectionID: any;
  tableConventionsColumns: string[];
  public selectIndexTable: number | undefined;

  getCategorys = CATEGORY.data;
  constructor( private _crud: CrudService,
               private _alert: AlertService,
               public dialog: MatDialog,) {
    this.tableConventionsColumns = [];
  }
  ngOnInit(): void {
    this.listProduct();
    this._customerTableColumns();
  }

  listProduct(): void {

    this._crud.read('/users').then((response: any) => {

      response.subscribe((res: any) => {
        //this.tableproduct = res;
        this.tableproduct = new MatTableDataSource<any>(res);
        this.tableproduct.paginator = this.paginator;

      });


    })
  }

  private _customerTableColumns(): void {
    this.tableConventionsColumns = [
      'img',
      'userName',
      'email',
      'profile',
      'accion',

    ];
  }

  public openModalLogin(type: number, data: any): void {

    this.dialog.open(CreateUserComponent, {
      width: '700px',
      height: '350px',
      data: {
        item: {
          value: type,
          item: data
        }
      }
    });
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

}
