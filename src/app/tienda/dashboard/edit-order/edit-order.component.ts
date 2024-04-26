import {Component, OnInit, ViewChild} from '@angular/core';
import {CrudService} from "../../services/crud/crud.service";
import {AlertService} from "../../services/alert/alert.service";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Products} from "../../interface/products";
import {Order} from "../../interface/order";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {MatButton, MatFabButton} from "@angular/material/button";
import {
  MatCell,
  MatCellDef,
  MatColumnDef, MatFooterCell, MatFooterRow,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource, MatTableModule
} from "@angular/material/table";
import {MatIcon} from "@angular/material/icon";
import {MatPaginator} from "@angular/material/paginator";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {MatCard} from "@angular/material/card";
import Swal from "sweetalert2";

@Component({
  selector: 'app-edit-order',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    FormsModule,
    MatButton,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatTable,
    MatFooterCell,
    CurrencyPipe,
    MatFooterRow,
    MatTableModule,
    MatFabButton,
    RouterLink,
    MatCard,
    NgIf,
    NgForOf,
  ],
  templateUrl: './edit-order.component.html',
  styleUrl: './edit-order.component.scss'
})
export default class EditOrderComponent  implements OnInit{


  @ViewChild (MatPaginator) paginator!: MatPaginator;




  idUrlProduct: any;
  colectionID: any;
  setDetail: any;
  getOrder!: Order;
  constructor(private crud: CrudService,
              private alert: AlertService,
              private imgFir: AngularFireStorage,
              private router: Router,
              private activatedRoute: ActivatedRoute) {

    this.getOrder = {} as any;

    this.activatedRoute.params.subscribe((value: any) => {

      console.log(value)
      if (value.id) {
        this.idUrlProduct = value.id;
        this.colectionID = value.coletion;
        this.getOrderData(value.id);
        this.getDetailOrder(value.id);
      }

    });
  }
  ngOnInit(): void {
  }


  getOrderData(order: any): void {

    this.crud.readGeneral('/order', 'id', order).then( ( response: any) => {
      response.subscribe(( res: any) => {
        const dataProduct = res[0].payload.doc.data();
        this.colectionID  = res[0].payload.doc.id;
        this.getOrder= dataProduct;

      });

    });
  }


  async getDetailOrder(id_order: any): Promise<any> {

    const data = this.crud.readDetailOrder('/detailOrder', 'order_id',  id_order);

    data.subscribe(async ( res: any) => {
      console.log(res)
      this.setDetail = res;
    });

  }

  public updateOrder(): void {

    this.crud.update('/order', this.colectionID, this.getOrder).then(() => {

      Swal.fire({
        title: "Muy bien!",
        text: `El estado del pedido fue cambiado a: ${this.getOrder.status}`,
        icon: "success"
      });
    })


    console.log('ksajdb', this.getOrder.status)
  }

  public backButton(): void {
    this.router.navigate(['/list-order']);
  }

}
