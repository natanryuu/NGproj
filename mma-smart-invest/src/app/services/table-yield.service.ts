import { Injectable } from '@angular/core';
import { find } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TableYieldService {

  table_yield = [
    {
      Period: 1,
      EquityRatio: 0.0885,
      FR: 0.96
    },
    {
      Period: 2,
      EquityRatio: 0.115,
      FR: 0.91
    },
    {
      Period: 3,
      EquityRatio: 0.1485,
      FR: 0.85
    },
    {
      Period: 4,
      EquityRatio: 0.177,
      FR: 0.8
    },
    {
      Period: 5,
      EquityRatio: 0.209,
      FR: 0.75
    },
    {
      Period: 6,
      EquityRatio: 0.2325,
      FR: 0.71
    },
    {
      Period: 7,
      EquityRatio: 0.2735,
      FR: 0.66
    },
    {
      Period: 8,
      EquityRatio: 0.3205,
      FR: 0.61
    },
    {
      Period: 9,
      EquityRatio: 0.374,
      FR: 0.57
    },
    {
      Period: 10,
      EquityRatio: 0.391,
      FR: 0.53
    },
    {
      Period: 11,
      EquityRatio: 0.41,
      FR: 0.5
    },
    {
      Period: 12,
      EquityRatio: 0.431,
      FR: 0.47
    },
    {
      Period: 13,
      EquityRatio: 0.477,
      FR: 0.43
    },
    {
      Period: 14,
      EquityRatio: 0.5035,
      FR: 0.4
    },
    {
      Period: 15,
      EquityRatio: 0.5335,
      FR: 0.37
    },
    {
      Period: 16,
      EquityRatio: 0.542,
      FR: 0.35
    },
    {
      Period: 17,
      EquityRatio: 0.553,
      FR: 0.33
    },
    {
      Period: 18,
      EquityRatio: 0.592,
      FR: 0.3
    },
    {
      Period: 19,
      EquityRatio: 0.608,
      FR: 0.28
    },
    {
      Period: 20,
      EquityRatio: 0.627,
      FR: 0.26
    },
    {
      Period: 21,
      EquityRatio: 0.649,
      FR: 0.24
    },
    {
      Period: 22,
      EquityRatio: 0.6445,
      FR: 0.23
    },
    {
      Period: 23,
      EquityRatio: 0.6725,
      FR: 0.21
    },
    {
      Period: 24,
      EquityRatio: 0.676,
      FR: 0.2
    },
    {
      Period: 25,
      EquityRatio: 0.7125,
      FR: 0.18
    },
    {
      Period: 26,
      EquityRatio: 0.731,
      FR: 0.17
    },
    {
      Period: 27,
      EquityRatio: 0.766,
      FR: 0.16
    },
    {
      Period: 28,
      EquityRatio: 0.822,
      FR: 0.15
    },
    {
      Period: 29,
      EquityRatio: 0.8955,
      FR: 0.14
    },
    {
      Period: 30,
      EquityRatio: 0.9785,
      FR: 0.13
    },
    {
      Period: 31,
      EquityRatio: 1,
      FR: 0.13
    }
   ];

  constructor() { }

  getYieldData(period) {
    return this.table_yield.find(data => data.Period === period);
  }

  getYieldDataEachYear(period) {
    return this.table_yield.filter(data => data.Period <= period);
  }
}
