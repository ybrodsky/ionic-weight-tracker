import { Component } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HomePage } from '../home/home';
import {WeightService} from '../weight/weight.service';

@Component({
  selector: 'page-edit',
  templateUrl: 'edit.html',
  providers: [WeightService]
})
export class EditPage {
	weight: any = {
		unit: 'kg'
	}
	myForm:FormGroup;

  constructor(public viewCtrl: ViewController, public navParams: NavParams, public weightService: WeightService, public formBuilder: FormBuilder) {
  	this.weight = Object.assign({}, navParams.get('record'));
    if(!this.weight) this.close();

    this.myForm = formBuilder.group({
  		weight: [this.weight.weight, Validators.compose([Validators.required])],
  		date: [{value: this.weight.date, disabled: true}, Validators.compose([Validators.required])]
  	});
  }

  update () {
    if(parseFloat(this.weight.weight) === parseFloat(this.navParams.get('record').weight)) {
      return this.close();
    }
  	this.weightService.save(this.weight).then(() => {
  		this.viewCtrl.dismiss({updated: true});
  	});
  }

  close () {
    this.viewCtrl.dismiss({updated: false});
  }

  delete () {
    this.weightService.delete(this.weight).then(() => {
      this.viewCtrl.dismiss({updated: true});
    });
  }

}