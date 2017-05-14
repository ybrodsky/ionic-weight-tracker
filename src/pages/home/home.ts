import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import {WeightService} from '../weight/weight.service';
import { AddPage } from '../weight/add';
import { Chart } from 'chart.js';
import 'chartjs-plugin-zoom';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [WeightService]
})
export class HomePage {
	@ViewChild('lineCanvas') lineCanvas;
	lineChart: any;

	records: any[] = [];
	lastVariation: any;
	totalVariation: any;
	currentWeight: any;
	unit: String = 'kg';

  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public weightService: WeightService) {

  }

  ionViewDidEnter() {console.log('ionViewEnter')
  	this.weightService.get().then((weights) => {
  		this.records = weights || [];

  		this.currentWeight = this.weightService.getCurrentWeight(this.records);
  		this.lastVariation = this.weightService.getLastVariation(this.records);
  		this.totalVariation = this.weightService.getTotalVariation(this.records);

  		this.setChartData();
  	});
  }

  add() {
    let addModal = this.modalCtrl.create(AddPage);
    addModal.onDidDismiss(data => {
      if(data.updated) this.ionViewDidEnter();
    });
    addModal.present();
  }

  private setChartData() {
  	if(this.records.length == 0) return false;

  	let data = [], labels = [];
  	this.records.forEach((weight) => {
  		labels.push(weight.label);
  		data.push(weight.weight);
  	});

  	this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      options: {
        events: ['click'],
        onClick: function() {
          console.log('aaaaa')
        },
      	legend: {
          display: false
       	},
       	scales: {
	        yAxes: [{
            ticks: {
              padding: 2,
              autoSkip: true,
              maxTicksLimit: 5
            },
	        }],
          xAxes: [{
            ticks: {
              padding: 2,
              autoSkip: true,
              maxTicksLimit: 5
            },
            gridLines: {
              color: "rgba(0, 0, 0, 0)",
            }
          }]
		    },
     	},
      data: {
        labels: labels,
        datasets: [
          {
            fill: false,
            lineTension: 0.4,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 2,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 5,
            pointHitRadius: 10,
            data: data,
            spanGaps: false,
          }
        ]
      }
    });
  }
}
