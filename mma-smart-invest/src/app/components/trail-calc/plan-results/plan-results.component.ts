import { Component, OnInit, HostListener, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { CommonInput, YieldData } from 'src/app/interfaces/plan.interfaces';
import { range, Observable } from 'rxjs';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-plan-results',
  templateUrl: './plan-results.component.html',
  styleUrls: ['./plan-results.component.scss']
})
export class PlanResultsComponent implements OnInit, AfterViewChecked {

  plan_name;
  init_input: CommonInput;
  target_amount;
  common_target;
  common_target_distance;
  common_target_distance_rate;
  common_target_equity_ratio;
  better_target;
  better_target_distance;
  better_target_distance_rate;
  better_target_equity_ratio;
  poor_target;
  poor_target_distance;
  poor_target_distance_rate;
  poor_target_equity_ratio;
  accu_amount;
  allocation: object;

  chart_block = 'pie';


  // Highcharts variables
  Highcharts = Highcharts;
  chartConstructor_pie = 'chart';
  chartOptions_pie = {};
  updateFlag_pie = false;
  oneToOneFlag_pie = true;

  series_pie = [];

  chartConstructor_area = 'chart';
  chartOptions_area = {};
  updateFlag_area = false;
  oneToOneFlag_area = true;
  assume_year_area;

  categories_area;
  series_area = [];
  // Highcharts variables

  constructor(
    public shared: SharedService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {
    this.plan_name = this.shared.plans[this.route.snapshot.routeConfig.path];
  }

  ngOnInit() {
    this.init_input = this.shared.init_input;
    this.HCOptionsPie();
    this.HCOptionsArea();
    this.getAllocation();
    switch (this.shared.activePlan) {
      case 'assets-grow':
        this.target_amount = this.shared.getTargetAmount();
        break;
      case 'retire-plan':
        this.target_amount = this.shared.target_amount_retire;
        break;
      case 'shop-funds':
      case 'buying-house':
      case 'childs-edu':
      case 'custom-plan':
        this.target_amount = this.shared.target_amount_custom;
        break;
    }
  }

  ngAfterViewChecked() {
    this.cd.detectChanges();
  }

  getAllocation() {
    const allocation = Object.assign({ 0: this.shared.yield_data.EquityRatio }, this.shared.getAllocation());
    this.allocation = allocation;
  }

  HCOptionsPie() {
    // tslint:disable-next-line:prefer-const
    let cmpScopePie = this;
    this.chartOptions_pie = {
      credits: {
        enabled: false
      },
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        margin: [0, 0, 0, 0],
        spacingTop: 0,
        spacingBottom: 0,
        spacingLeft: 0,
        spacingRight: 0,
        events: {
          load: function() {
            cmpScopePie.getSeriesUpdate_pie();
          }
        }
      },
      title: {
        text: ''
      },
      plotOptions: {
        pie: {
          size: '100%',
          allowPointSelect: true,
          cursor: 'pointer',
          innerSize: '90%',
          dataLabels: {
            enabled: false
          },
          showInLegend: true
        }
      },
      tooltip: {
        formatter: function() {
          return '<div class="custom-tooltip">'
                  + '<p>' + this.key + ': </p>'
                  + '<b>' + this.y + '%</b>'
               + '</div>';
        }
      },
      legend: {
        enabled: false,
        symbolPadding: 0,
        symbolWidth: 0,
        symbolHeight: 0.1,
        symbolRadius: 0,
        useHTML: true,
        lineHeight: 1,
        labelFormatter: function () {
          return '<div class="legend-flag">'
            + '<div style="background-color: ' + this.color + ';"></div>'
            + '<span>' + this.name + '</span>'
            + '</div>';
        },
        itemStyle: {
          fontWeight: 'bold',
          fontSize: '3.125vw',
        }
      },
      series: []
    };
  }

  getSeriesUpdate_pie() {
    this.series_pie = [{
      data: [
        {
          name: '短期債券',
          y: Math.round(( 1 - this.allocation[0] ) * 0.33 * 100),
          color: '#e62310'
        },
        {
          name: '中期債券',
          y: Math.round(( 1 - this.allocation[0] ) * 0.33 * 100),
          color: '#ed7777'
        },
        {
          name: '長期債券',
          y: Math.round(( 1 - this.allocation[0] ) * 0.33 * 100),
          color: '#eaa7a7'
        },
        {
          name: '美國股票',
          y: Math.round(this.allocation[0] * 0.5 * 100),
          color: '#002A5A'
        },
        {
          name: '歐洲股票',
          y: Math.round(this.allocation[0] * 0.25 * 100),
          color: '#00479A'
        },
        {
          name: '日本股票',
          y: Math.round(this.allocation[0] * 0.15 * 100),
          color: '#0059C0'
        },
        {
          name: '新興股票',
          y: Math.round(this.allocation[0] * 0.15 * 100),
          color: '#006BE7'
        },
      ]
    }];
    this.updateSeries_pie();
  }

  updateSeries_pie() {
    const chart = this.Highcharts.charts;
    chart[chart.length - 1].addSeries(this.series_pie[0]);
  }

  chartCallback_pie(chart) {
    // console.log('pie');
  }

  HCOptionsArea() {
    // tslint:disable-next-line:prefer-const
    let cmpScopeArea = this;
    this.chartOptions_area = {
      credits: {
        enabled: false
      },
      chart: {
        type: 'area',
        backgroundColor: 'transparent',
        events: {
          load: function() {
            cmpScopeArea.getSeriesUpdate_area();
          }
        }
      },
      title: {
        text: ''
      },
      xAxis: {
        // tickmarkPlacement: 'on',
        title: {
          enabled: false
        },
        crosshair: {
          width: 1,
          color: 'black',
          zIndex: 50
        },
        labels: {
          align: 'right'
        },
        categories: this.categories_area
      },
      yAxis: {
        title: {
          enabled: false
        },
        opposite: true,
        labels: {
          formatter: function () {
            return (this.value / 10000) + '萬';
          }
        },
        crosshair: {
          width: 1,
          color: 'black',
          dashStyle: 'shortdot',
          zIndex: 50
        },
      },
      legend: {
        enabled: false
      },
      tooltip: {
        enabled: false,
        split: false,
        valueSuffix: ' 萬'
      },
      plotOptions: {
        area: {
          // stacking: 'normal',
          lineWidth: 1,
          fillOpacity: 0.1,
          point: {
            events: {
              mouseOver: function (e) {
                cmpScopeArea.setAccuAsumeText(this.series.chart.series[3].yData, this.index); // must be the first
                cmpScopeArea.setTargetTextBetter(this.series.chart.series[0].yData, this.index);
                cmpScopeArea.setTargetTextCommon(this.series.chart.series[1].yData, this.index);
                cmpScopeArea.setTargetTextPoor(this.series.chart.series[2].yData, this.index);
              }
            }
          }
        }
      },
      series: this.series_area
    };
  }

  setTargetTextCommon(data, index) {
    this.common_target = data[index];
    // console.log('this.common_target: ' + this.common_target);
    this.common_target_distance = this.common_target - this.accu_amount;
    // console.log('this.common_target_distance: ' + this.common_target_distance);
    this.common_target_distance_rate = (this.common_target - this.accu_amount) / this.accu_amount * 100;
    // console.log('this.common_target_distance_rate: ' + this.common_target_distance_rate);
    if (index === 0) {
      this.common_target_equity_ratio = Math.round(this.allocation[index] * 100);
    } else if (index === (Object.keys(this.allocation).length)) { // last index get previous(index - 1) value
      this.common_target_equity_ratio = Math.round(this.allocation[index - 1][2] * 100);
    } else {
      this.common_target_equity_ratio = Math.round(this.allocation[index][2] * 100);
    }
  }

  setTargetTextBetter(data, index) {
    this.better_target = data[index];
    // console.log('this.better_target: ' + this.better_target);
    this.better_target_distance = this.better_target - this.accu_amount;
    // console.log('this.better_target_distance: ' + this.better_target_distance);
    this.better_target_distance_rate = (this.better_target - this.accu_amount) / this.accu_amount * 100;
    // console.log('this.better_target_distance_rate: ' + this.better_target_distance_rate);
    if (index === 0) {
      this.better_target_equity_ratio = Math.round(this.allocation[index] * 100);
    } else if (index === (Object.keys(this.allocation).length)) { // last index get previous(index - 1) value
      this.better_target_equity_ratio = Math.round(this.allocation[index - 1][4] * 100);
    } else {
      this.better_target_equity_ratio = Math.round(this.allocation[index][4] * 100);
    }
  }

  setTargetTextPoor(data, index) {
    this.poor_target = data[index];
    // console.log('this.poor_target: ' + this.poor_target);
    this.poor_target_distance = this.poor_target - this.accu_amount;
    // console.log('this.poor_target_distance: ' + this.poor_target_distance);
    this.poor_target_distance_rate = (this.poor_target - this.accu_amount) / this.accu_amount * 100;
    // console.log('this.poor_target_distance_rate: ' + this.poor_target_distance_rate);
    if (index === 0) {
      this.poor_target_equity_ratio = Math.round(this.allocation[index] * 100);
    } else if (index === (Object.keys(this.allocation).length)) { // last index get previous(index - 1) value
      this.poor_target_equity_ratio = Math.round(this.allocation[index - 1][0] * 100);
    } else {
      this.poor_target_equity_ratio = Math.round(this.allocation[index][0] * 100);
    }
  }

  setAccuAsumeText(data, index) {
    this.accu_amount = data[index];
    // console.log('this.accu_amount: ' + this.accu_amount);
    this.assume_year_area = this.categories_area[index];
    // console.log('this.assume_year_area: ' + this.assume_year_area);
  }

  getSeriesUpdate_area() {
    const projection = this.shared.getProjection();
    // console.log(projection);
    this.categories_area = this.shared.period_range;
    this.series_area = [
      {
        name: '較佳表現',
        data: projection[2],
        color: '#2d8eb8',
        lineColor: '#2d8eb8'
      }, {
        name: '一般表現',
        data: projection[1],
        color: '#006a96',
        lineColor: '#006a96'
      }, {
        name: '較差表現',
        data: projection[0],
        color: '#79afd5',
        lineColor: '#79afd5'
      }, {
        name: '累積投入本金',
        data: projection[3],
        color: '#d30f25',
        lineColor: '#d30f25',
      }];

    this.setAccuAsumeText(projection[3], this.categories_area.length - 1); // must be the first
    this.setTargetTextBetter(projection[2], this.categories_area.length - 1);
    this.setTargetTextCommon(projection[1], this.categories_area.length - 1);
    this.setTargetTextPoor(projection[0], this.categories_area.length - 1);
    this.updateSeries_area();
  }

  // getProjectionAdapterForChart() {
  //   const projection = this.shared.getProjection();
  //   return projection.map(data => {
  //     return {
  //       yData: data
  //     };
  //   });
  // }

  updateSeries_area () {
    const chart = this.Highcharts.charts;
    chart[chart.length - 1].update({
      xAxis: {
        categories: this.categories_area
      }
    });
    chart[chart.length - 1].addSeries(this.series_area[0]);
    chart[chart.length - 1].addSeries(this.series_area[1]);
    chart[chart.length - 1].addSeries(this.series_area[2]);
    chart[chart.length - 1].addSeries(this.series_area[3]);
  }

  chartCallback_area(chart) {
    // console.log('area');
  }

  reTrail() {
    // this.shared.page_progress.emit('init-input');
  }

  openModal() {

    switch (this.shared.activePlan) {
      case 'assets-grow':
        this.shared.componentName.emit('modalAdjusts');
        break;
      case 'retire-plan':
        this.shared.componentName.emit('modalAdjustsRetire');
        break;
      case 'shop-funds':
      case 'buying-house':
      case 'childs-edu':
      case 'custom-plan':
        this.shared.componentName.emit('modalAdjustsCustom');
        break;
    }
  }

}
