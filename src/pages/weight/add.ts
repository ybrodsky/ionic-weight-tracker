import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HomePage } from '../home/home';
import {WeightService} from '../weight/weight.service';

@Component({
  selector: 'page-add',
  templateUrl: 'add.html',
  providers: [WeightService]
})
export class AddPage {
	weight: any = {
		unit: 'kg',
		date: new Date().toISOString(),
		weight: null
	}
	myForm:FormGroup;

  constructor(public viewCtrl: ViewController, public weightService: WeightService, public formBuilder: FormBuilder) {
  	this.myForm = formBuilder.group({
  		weight: ['', Validators.compose([Validators.required])],
  		date: ['', Validators.compose([Validators.required])]
  	});
  }

  addWeight () {
  	this.weightService.save(this.weight).then(() => {
  		this.viewCtrl.dismiss({updated: true});
  	});
  }

  close () {
    this.viewCtrl.dismiss({updated: false});
  }

}