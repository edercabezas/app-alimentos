import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {User} from "../../interface/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private _auth: AngularFireAuth, private db: AngularFirestore,  private fireDatabase: AngularFireDatabase) { }


  async registerUSerFirebase(user: User): Promise<any> {
    return await this._auth.createUserWithEmailAndPassword(user.email, user.password);
  }

  async setUser(table: string, user: User): Promise<any> {

    return this.db.collection(`${table}`).add(user);
  }

  async login(email: string, password: string): Promise<any> {
    return await this._auth.signInWithEmailAndPassword(email, password)

  }

  async redUser(table: string, id: any) {

    return this.db.collection(`${table}`, ref => ref
      .where('code', '==', `${id}`)).snapshotChanges();

  }

}
