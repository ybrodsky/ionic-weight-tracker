import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController, LoadingController } from 'ionic-angular';
import {WeightService} from '../weight/weight.service';
import { AddPage } from '../weight/add';
import { EditPage } from '../weight/edit';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [WeightService]
})
export class HomePage {
	records: any[] = [];
	lastVariation: any;
	totalVariation: any;
	currentWeight: any;
	unit: String = 'kg';

  constructor(public loadingCtrl: LoadingController, public modalCtrl: ModalController, public navCtrl: NavController, public weightService: WeightService) {

  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter')
    let loader = this.loadingCtrl.create({
      content: "Cargando...",
      duration: 20000
    });
    loader.present();

  	this.weightService.get().then((weights) => {
  		this.records = weights || [];

  		this.currentWeight = this.weightService.getCurrentWeight(this.records);
  		this.totalVariation = this.weightService.getTotalVariation(this.records);

      loader.dismiss();
  	});
  }

  add() {
    let addModal = this.modalCtrl.create(AddPage);
    addModal.onDidDismiss(data => {
      if(data.updated) this.ionViewDidEnter();
    });
    addModal.present();
  }

  edit (record) {
    let editModal = this.modalCtrl.create(EditPage, {record: record});
    editModal.onDidDismiss(data => {
      if(data.updated) this.ionViewDidEnter();
    });
    editModal.present();
  }

}
