import {Component, OnInit} from '@angular/core';
import {Products} from "../../interface/products";
import {CrudService} from "../../services/crud/crud.service";
import {AlertService} from "../../services/alert/alert.service";
import {CATEGORY} from "../../const/category";
import {PREFIJOS} from "../../const/prefijos";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatSelect, MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [
    MatFormField,
    MatSelect,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInput,
    NgIf,
    MatButton
  ],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss'
})
export default class CreateProductComponent implements OnInit {

  setProduct!: Products;
  getCategorys = CATEGORY.data;
  prefijos =  PREFIJOS.data;
  routerIMG: string = '';
  colectionID: any;
  routerFinish: any;
  idUrlProduct: any;
  codeProduct: any;
  constructor(
    private _crud: CrudService,
    private _alert: AlertService,
    private _imgFir: AngularFireStorage,
    private _activatedRoute: ActivatedRoute
  ) {
  }
  ngOnInit(): void {
    this._setCreateProduct();



    this._activatedRoute.params.subscribe((value: any) => {
      if (value.id) {
        this.idUrlProduct = value.id;
        this._getProduct(value.id);
      }

    });

  }





  async _getProduct(id: any): Promise<any>  {
    this._crud.readGeneral('/products', 'id', id).then( ( response: any) => {
      response.subscribe(( res: any) => {
        const dataProduct = res[0].payload.doc.data();
        this.colectionID  = res[0].payload.doc.id;
        this.setProduct = dataProduct as Products;

      });

    });
  }


  public createRegister(): void {
    this.setProduct.id = this.codeProduct;

    this._crud.setProduct('/products', this.setProduct).then((response: any) => {

      if (response) {
        this._setCreateProduct();
        this._alert.showToasterFull('El Producto se creo exitosamente');

      }


    });

  }


  selectPhoto(): void {

    const dataFile: any = document.getElementById('upload-product');
    dataFile.click();

  }


  public upload(data: any): void {
    this.codeProduct = this.getCodigoVerificacion();
    const imgProductOne = data.target.files[0];
    this.routerIMG = `products/${this.codeProduct }`;
    const ref = this._imgFir.ref(this.routerIMG);
    const task = this._imgFir.upload(this.routerIMG, imgProductOne);
    const percentage = task.percentageChanges();

    task.snapshotChanges().subscribe(() => {
      this.routerFinish = ref.getDownloadURL();
      this.routerFinish.subscribe((url: string) => {
        this.setProduct.img = url;
      });
    });

  }


  public updateProduct(): void {

    this._crud.update('/products', this.colectionID, this.setProduct).then((response: any) => {

        this._alert.showToasterFull('El producto fue actualizado exitosamente');

    }).catch(() => {
      this._alert.showToasterError('Hubo un error al actualizar el producto');
    });
  }


  private _setCreateProduct(): void {

    this.setProduct = {
      img: '',
      category: 0,
      price: 0,
      size: 0,
      nameProduct: '',
      prefijo: '',
      description: '',
      code: '',
      value_prefijo: '',
      id: '',
      status: true,
      colection: ''
    };
  }


  public getCodigoVerificacion(): any {

    let getDay = new Date().getDay().toString();
    const constGetMonth = new Date().getMonth() + 1;
    let getHours = new Date().getHours().toString();
    let getMinutes = new Date().getMinutes().toString();
    const getFullYear =new Date().getFullYear().toString();
    let getMonth = constGetMonth.toString()

    if (getDay.length === 1) {
      getDay = '0'+getDay;
    }

    if (getMonth.length === 1) {
      getMonth = '0'+getMonth;
    }

    if (getMonth.length === 1) {
      getHours = '0'+getHours;
    }

    if (getMinutes.length === 1) {
      getMinutes = '0'+getMinutes;
    }

    if ( this.setProduct.id ) {
        return this.codeProduct;
    }

    const dataFinish = `${getDay}${getMonth}${getFullYear}${getHours}${getMinutes}`;
    this.codeProduct = dataFinish.toString();

    return dataFinish.toString();

  }


}
