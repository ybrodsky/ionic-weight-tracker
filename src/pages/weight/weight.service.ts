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

        newWeight.date = moment(newWeight.date).format('YYYY-MM-DD');

				var index = this.isDateRepeated(weights, newWeight);

				if(index > -1) {
					weights[index] = newWeight;
				} else {
					weights.push(newWeight);
					weights = this.sortWeights(weights);
				}

        weights = this.calculateVariation(weights);

				return resolve(this.storage.set('weights', weights));
			});
		});
	}

  delete (weight) {
    return new Promise((resolve, reject) => {
      this.storage.get('weights').then((weights) => {
        var index = this.isDateRepeated(weights, weight);

        if(index == -1) return resolve();

        weights.splice(index, 1);
        weights = this.calculateVariation(weights);

        return resolve(this.storage.set('weights', weights));
      })
    });
  }

  getTotalVariation(records) {
    if(records.length < 2) {
      return 0;
    }

    return (records[records.length - 1].weight - records[0].weight) * (-1);
  }

  getCurrentWeight(records) {
    return records.length ? records[0].weight : 0;
  }

  private calculateVariation(weights) {
    return weights.map((weight, index) => {
      if(index == weights.length - 1) return weight;

      weight.variation = (parseFloat(weights[index + 1].weight) - parseFloat(weight.weight)) * (-1);
      return weight;
    });
  }

	private isDateRepeated(weights, weight) {
		return weights.findIndex((item) => {
			return item.date == weight.date;
		});
	}

	private sortWeights (weights) {
		return weights.sort((a, b) => {
			return moment(a.date, 'YYYY-MM-DD').isBefore(b.date) ? 1 : -1;
		});
	}
}