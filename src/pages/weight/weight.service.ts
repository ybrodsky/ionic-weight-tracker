import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';

@Injectable()
export class WeightService {
	constructor (public storage: Storage) {
	}

	get () {
		return this.storage.get('weights');
	}

	save (newWeight: any) {
		return new Promise((resolve, reject) => {
			this.storage.get('weights').then((weights) => {
				if(!weights) weights = [];

				let date = moment(newWeight.date);
				newWeight.date = date.format('YYYY-MM-DD');
				newWeight.label = date.format('DD/MM');

				var index = this.isDateRepeated(weights, newWeight);

				if(index > -1) {
					weights[index] = newWeight;
				} else {
					weights.push(newWeight);
					weights = this.sortWeights(weights);
				}

				return resolve(this.storage.set('weights', weights));
			});
		});
	}

  getTotalVariation(records) {
    if(records.length < 2) {
      return ' - ';
    }

    return (records[0].weight - records[records.length - 1].weight) * -1;
  }

  getLastVariation(records) {
    if(records.length < 2) {
      return ' - ';
    }

    return (records[records.length - 2].weight - records[records.length - 1].weight) * -1;
  }

  getCurrentWeight(records) {
    return records.length ? records[records.length - 1].weight : ' - ';
  }

	private isDateRepeated(weights, weight) {
		return weights.findIndex((item) => {
			return item.date == weight.date;
		});
	}

	private sortWeights (weights) {
		return weights.sort((a, b) => {
			return moment(a.date, 'YYYY-MM-DD').isBefore(b.date) ? -1 : 1;
		});
	}
}