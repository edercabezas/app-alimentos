import { Routes } from '@angular/router';
import {GuardsGuard} from "./tienda/guardian/auth.guard";


export const routes: Routes = [

  {
    path: '',
    loadComponent: () => import('./tienda/pages/home/home.component')
  },

  {
    path: 'list-products/:id/:category',
    loadComponent: () => import('./tienda/pages/home/home.component')
  },

  {
    path: 'products',
    loadComponent: () => import('./tienda/dashboard/list-product/list-product.component'),
    canActivate: [GuardsGuard]
  },

  {
    path: 'users',
    loadComponent: () => import('./tienda/dashboard/list-user/list-user.component') ,
    canActivate: [GuardsGuard]
  },

  {
    path: 'create-product',
    loadComponent: () => import('./tienda/dashboard/create-product/create-product.component'),
  canActivate: [GuardsGuard]
  },

  {
    path: 'edit-product/:id',
    loadComponent: () => import('./tienda/dashboard/create-product/create-product.component'),
    canActivate: [GuardsGuard]
  },

  {
    path: 'detail-product/:id/:name',
    loadComponent: () => import('./tienda/pages/detail-product/detail-product.component')
  },

  {
    path: 'cart',
    loadComponent: () => import('./tienda/pages/detail-cart/detail-cart.component')
  }
];
