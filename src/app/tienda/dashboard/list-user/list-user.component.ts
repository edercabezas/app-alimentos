import {Component, OnInit} from '@angular/core';
import {CurrencyPipe} from "@angular/common";
import {MatButton, MatFabButton} from "@angular/material/button";
import {
  MatCell,
  MatCellDef,
  MatColumnDef, MatFooterCell, MatFooterRow,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableModule
} from "@angular/material/table";
import {MatIcon} from "@angular/material/icon";
import {Router, RouterLink} from "@angular/router";
import {CATEGORY} from "../../const/category";
import {CrudService} from "../../services/crud/crud.service";
import {AlertService} from "../../services/alert/alert.service";
import {MatDialog} from "@angular/material/dialog";
import {CreateUserComponent} from "../../component/create-user/create-user.component";

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
  ],
  templateUrl: './list-user.component.html',
  styleUrl: './list-user.component.scss'
})
export default class ListUserComponent implements OnInit{


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

    this.crud.read('/users').then((response: any) => {

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
    console.log(index);
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
