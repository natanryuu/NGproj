import { Component, OnInit, ChangeDetectorRef, AfterViewChecked, OnDestroy, HostListener } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { ModalService } from '../../../services/modal.service';
import { Router } from '@angular/router';
import { CommonInput } from 'src/app/interfaces/plan.interfaces';
import { FormBuilder } from '@angular/forms';
import { delay } from 'q';
import * as Highcharts from 'highcharts';
import * as $ from 'jquery';

@Component({
  selector: 'app-plan-results',
  templateUrl: './plan-results.component.html',
  styleUrls: ['./plan-results.component.scss']
})
export class PlanResultsComponent implements OnInit, AfterViewChecked, OnDestroy {

  plan_name;
  init_input: CommonInput;
  chart_block = 'title-block';

  show_finger = false;

  situation = 'generally';
  situation_name = {
    'generally': '一般表現',
    'poor': '較差表現',
    'better': '較佳表現'
  };
  stock_ratio;
  bond_ratio;
  stock_ratio_history;
  bond_ratio_history;

  show_initial_dollar;
  show_RSP;
  show_period;
  show_history_lists;
  show_history_lists_index = 0;

  irr_year;
  irr;

  irr_history_start_year: Number;
  irr_history_year: Number;
  irr_history;

  ngForm = this.fb.group({
    formStartYear: [this.shared.back_proj_history_year_max - this.shared.period_range, { updateOn: 'blur' }],
    formHistoryList: [0]
  });

  /* Highcharts variables */
  // 股債比 pie
  Highcharts = Highcharts;
  Highcharts_equityexpo_index;
  Highcharts_equityexpo_class = 'pie-chart';
  chartConstructor_pie = 'chart';
  chartOptions_pie = {};
  updateFlag_pie = false;
  oneToOneFlag_pie = true;

  series_pie = [];

  // 資產展望&投資配置 area
  Highcharts_projection_index;
  Highcharts_projection_class = 'area-chart';
  chartConstructor_area = 'chart';
  chartOptions_area = {};
  updateFlag_area = false;
  oneToOneFlag_area = true;

  categories_area;
  series_area = [];

  // 歷史模擬 area
  Highcharts_historical_index;
  Highcharts_historical_class = 'history-chart';
  chartConstructor_history = 'chart';
  chartOptions_history = {};
  updateFlag_history = false;
  oneToOneFlag_history = true;

  categories_history;
  series_history = [];
  /* Highcharts variables */

  listen_adjusts;
  last_index;
  last_index_history;

  show_readme = false;
  show_readme_info = false;
  show_readme_history = false;
  h_tabGroupOriginalHeight;
  h_header;
  h_footer;
  h_tabGroup;
  h_headerHeight;
  h_tabGroupOffsetTop;
  h_windowScrollTop;
  h_windowHeight;
  h_tabGroupOffset;
  h_actionBtn;
  el_tab1Offset;
  el_tab2Offset;
  el_tab3Offset;

  $this;

  @HostListener('window:resize', ['$event'])
  onresize(event) {
    setTimeout(() => {
      this.fixedTab();
    }, 300);

    this.detPieChartSize($(window).width());
  }

  @HostListener('window:scroll', ['$event'])
  onscroll(event) {

    this.fixedTab();
  }


  constructor(
    public shared: SharedService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private modalsvc: ModalService,
    private fb: FormBuilder
  ) {
    this.listen_adjusts = this.shared.adjust_in_result_event.subscribe(val => {
      this.router.navigate(['/trailcalc/process']);
    });
    this.$this = this;
    Highcharts.setOptions({ lang: { thousandsSep: ',' } });
  }

  async ngOnInit() {
    this.shared.current_route = 'plan-results';
    if (!this.shared.value_adjusts_changed) {
      this.modalsvc.modal_trigger_close.emit(true);
      this.router.navigate(['/']);
    }
    this.init();

    this.ngForm.controls.formHistoryList.valueChanges.subscribe(value => {
      let year_val;
      this.show_history_lists_index = value;
      if (value === '0') {
        return true;
      }
      year_val = this.checkYearValue(this.show_history_lists[value].Years);
      this.ngForm.controls.formStartYear.setValue(year_val, { emitEvent: false });
    });

    this.ngForm.controls.formStartYear.valueChanges.subscribe(value => {
      const year_val = this.checkYearValue(value);
      this.ngForm.controls.formStartYear.setValue(year_val, { emitEvent: false });
      this.ngForm.controls.formHistoryList.setValue('0');
    });

    this.renderCharts();
  }

  init() {
    this.fixedTab();

    this.plan_name = this.shared.plans[this.shared.activePlan];
    this.show_initial_dollar = parseInt(this.shared.ini_rsp_dollar[this.shared.default_ini_rsp_index].InitialDollar, 0);
    this.show_initial_dollar = this.show_initial_dollar === 0 ? '--' : '$' + Intl.NumberFormat().format(this.show_initial_dollar / 10000);
    this.show_RSP = parseInt(this.shared.ini_rsp_dollar[this.shared.default_ini_rsp_index].RSPDollar, 0);
    this.show_RSP = this.show_RSP === 0 ? '--' : '$' + Intl.NumberFormat().format(this.show_RSP / 10000);
    this.show_period = this.shared.period_range;
    this.show_history_lists = [].concat({ Years: '0', EventName: '請選擇' }, this.shared.return_back_projection_histories);
    this.irr_year = Number(this.shared.current_year) + Number(this.shared.period_range);
    this.irr = this.shared.situation_generally_irr;
    this.updateIRRHistory();

    this.init_input = this.shared.init_input;
  }

  fixedTab() {
    this.h_tabGroupOriginalHeight = $('.tab-group li').outerHeight();
    this.h_header = $('header');
    this.h_footer = $('footer');
    this.h_tabGroup = $('.tab-group');
    this.h_actionBtn = $('.action-btn');

    this.h_windowScrollTop = $(window).scrollTop();
    this.h_windowHeight = $(window).height();

    this.h_headerHeight = this.h_header.outerHeight() || 0;
    this.h_tabGroupOffsetTop = this.h_tabGroup.offset().top;
    this.h_tabGroupOffset = this.h_tabGroupOffsetTop - this.h_headerHeight - 20;

    this.el_tab1Offset = $('.tab-content.tab1').offset().top;
    this.el_tab2Offset = $('.tab-content.tab2').offset().top;
    this.el_tab3Offset = $('.tab-content.tab3').offset().top;

    if (this.h_windowScrollTop <= 50) {
      this.chart_block = 'title-block';
      this.show_finger = false;
    } else if (this.h_windowScrollTop + this.h_headerHeight + 50 > this.el_tab3Offset) {
      this.chart_block = 'history';
      this.show_finger = false;

    } else if (this.h_windowScrollTop + this.h_headerHeight + 50 > this.el_tab2Offset) {
      this.chart_block = 'area';
      this.show_finger = true;
    } else if (this.h_windowScrollTop + this.h_headerHeight + 50 > this.el_tab1Offset) {
      this.chart_block = 'pie';
      this.show_finger = true;
    }


    if (this.h_tabGroupOffset < this.h_windowScrollTop) {
      this.h_tabGroup.addClass('fixed').height(this.h_tabGroupOriginalHeight);
    } else {
      this.h_tabGroup.removeClass('fixed').height('');
    }
    if (($(document).height() - this.h_actionBtn.height() - this.h_windowHeight - this.h_footer.height()) < this.h_windowScrollTop) {
      this.h_actionBtn.removeClass('fixed').height('');
    } else if (this.h_tabGroupOffset < this.h_windowScrollTop) {
      this.h_actionBtn.addClass('fixed').height(this.h_actionBtn.find('.btn-wrapper').height());
    }

  }

  checkYearValue(value) {
    value = parseInt(value, 0);
    if (value < this.shared.back_proj_history_year_min) {
      return this.shared.back_proj_history_year_min;
    } else if (this.shared.back_proj_history_year_max - value < this.shared.period_range) {
      return this.shared.back_proj_history_year_max - this.shared.period_range;
    } else {
      return value;
    }
  }

  ngOnDestroy() {
    this.listen_adjusts.unsubscribe();
  }

  ngAfterViewChecked() {
    this.cd.detectChanges();
  }

  switchChart(chart_type) {
    let offsets;
    this.fixedTab();
    switch (chart_type) {
      case 'title-block':
        offsets = 0;

        break;
      case 'pie':
        offsets = this.el_tab1Offset - this.h_headerHeight - 40;

        break;
      case 'area':
        offsets = this.el_tab2Offset - this.h_headerHeight - 40;
        break;
      case 'history':
        offsets = this.el_tab3Offset - this.h_headerHeight - 40;
        break;
    }


    $('html, body').animate({
      scrollTop: offsets
    }, 500, function () {

      // $('.right-finger')
    });
  }

  renderCharts() {
    this.HCOptionsPie();
    this.HCOptionsArea();
    this.HCOptionsHistory();
  }

  /**
    #######                                #######                       #     ######               #####
    #        ####  #    # # ##### #   #    #       #    # #####   ####  ###    #     # # ######    #     # #    #   ##   #####  #####
    #       #    # #    # #   #    # #     #        #  #  #    # #    #  #     #     # # #         #       #    #  #  #  #    #   #
    #####   #    # #    # #   #     #      #####     ##   #    # #    #        ######  # #####     #       ###### #    # #    #   #
    #       #  # # #    # #   #     #      #         ##   #####  #    #  #     #       # #         #       #    # ###### #####    #
    #       #   #  #    # #   #     #      #        #  #  #      #    # ###    #       # #         #     # #    # #    # #   #    #
    #######  ### #  ####  #   #     #      ####### #    # #       ####   #     #       # ######     #####  #    # #    # #    #   #
  */
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
          load: function () {
            cmpScopePie.getSeriesUpdate_pie();
          }
        }
      },
      title: {
        text: ''
      },
      plotOptions: {
        pie: {
          size: '75%',
          allowPointSelect: true,
          cursor: 'pointer',
          innerSize: '85%',
          dataLabels: {
            enabled: false
          },
          showInLegend: true
        }
      },
      tooltip: {
        formatter: function () {
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
    const charts = this.Highcharts.charts;
    this.series_pie = [{
      data: [
        {
          name: this.shared.return_equity_expo.InitialBondL,
          y: this.shared.return_equity_expo.InitialBondLRatio,
          color: '#d84653'
        },
        {
          name: this.shared.return_equity_expo.InitialBondM,
          y: this.shared.return_equity_expo.InitialBondMRatio,
          color: '#f56c6c'
        },
        {
          name: this.shared.return_equity_expo.InitialBondS,
          y: this.shared.return_equity_expo.InitialBondSRatio,
          color: '#f8a9a9'
        },
        {
          name: this.shared.return_equity_expo.InitialStockA,
          y: this.shared.return_equity_expo.InitialStockARatio,
          color: '#005572'
        },
        {
          name: this.shared.return_equity_expo.InitialStockB,
          y: this.shared.return_equity_expo.InitialStockBRatio,
          color: '#0083a4'
        },
        // {
        //   name: '新興市場股市',
        //   y: this.shared.return_equity_expo.InitialStockCRatio,
        //   color: '#5aa1bf'
        // },
      ]
    }];
    this.updateSeries_pie();
  }

  updateSeries_pie() {
    const chart = this.Highcharts.charts;
    const current_chart = chart.find((data) => {
      if (data) {
        return data['renderTo']['className'] === this.Highcharts_equityexpo_class;
      }
    });
    this.Highcharts_equityexpo_index = current_chart['index'];

    const win_size = window.innerWidth;
    if (win_size <= 768) {
      chart[this.Highcharts_equityexpo_index].setSize(win_size, win_size);
    } else if (win_size <= 1200) {
      chart[this.Highcharts_equityexpo_index].setSize(480, 400);
    } else {
      chart[this.Highcharts_equityexpo_index].setSize(480, 400);
    }
    chart[this.Highcharts_equityexpo_index].addSeries(this.series_pie[0]);
    this.detPieChartSize($(window).width());
  }

  chartCallback_pie(chart) {
  }

  /**
    ######                                                            #        #                             #####
    #     # #####   ####       # ######  ####  ##### #  ####  #    # ###      # #   #####  ######   ##      #     # #    #   ##   #####  #####
    #     # #    # #    #      # #      #    #   #   # #    # ##   #  #      #   #  #    # #       #  #     #       #    #  #  #  #    #   #
    ######  #    # #    #      # #####  #        #   # #    # # #  #        #     # #    # #####  #    #    #       ###### #    # #    #   #
    #       #####  #    #      # #      #        #   # #    # #  # #  #     ####### #####  #      ######    #       #    # ###### #####    #
    #       #   #  #    # #    # #      #    #   #   # #    # #   ## ###    #     # #   #  #      #    #    #     # #    # #    # #   #    #
    #       #    #  ####   ####  ######  ####    #   #  ####  #    #  #     #     # #    # ###### #    #     #####  #    # #    # #    #   #
  */
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
          load: function () {
            cmpScopeArea.getSeriesUpdate_area();
            const p = this.series[0].points;
            const lastindex = (p.length > 0) ? p.length - 1 : 0;
            this.tooltip.refresh([p[lastindex]]);
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
          color: '#777',
          dashStyle: 'shortdot',
          zIndex: 0
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
        plotLines: [{
          value: this.shared.target_dollar,
          color: '#333',
          width: 1,
          zIndex: 2,
          label: {
            text: '目標金額<br>' + Highcharts.numberFormat(this.shared.target_dollar / 10000, 0) + ' 萬'
          }
        }],
        opposite: true,
        labels: {
          formatter: function () {
            return Highcharts.numberFormat(this.value / 10000, 0) + ' 萬';
          }
        },
        crosshair: {
          width: 1,
          color: '#777',
          dashStyle: 'shortdot',
          zIndex: 0
        },
      },
      legend: {
        enabled: true,
        reversed: true,
        verticalAlign: 'top',
        align: 'left',
        zIndex: -1,
        useHTML: true,
        labelFormatter: function () {
          const legendItem = document.createElement('div'),
            symbol = document.createElement('span'),
            label = document.createElement('span');


          symbol.innerText = '';
          symbol.style.borderColor = this.color;
          symbol.style.backgroundColor = this.color;
          symbol.classList.add('legend-line');
          let text;

          if (this.name === '累積投入本金') { text = '投入本金'; } else { text = '帳戶金額'; }
          label.innerText = text;
          legendItem.appendChild(symbol);
          legendItem.appendChild(label);

          return legendItem.outerHTML;
        }
      },
      tooltip: {

        enabled: true,
        split: false,
        valueSuffix: ' 元',
        zIndex: 51,
        hideDelay: 99999,
        shared: true,
        crosshairs: [true, true],
        formatter: function () {
          let html = '<b>' + this.x + '</b><br>';
          if (this.points[0].point.index === Number(cmpScopeArea.shared.period_range)) {
            html += '<span style="color: #d30f25">已到期</span>';
          } else {
            html += '<span style="color: #006a96">' + this.points[0].point.stockratio + '%股票 </span>'
              + '<span style="color: #d30f25">' + this.points[0].point.bondratio + '%債券</span>';
          }

          html += this.points.reduce(function (s, point) {
            return s + '<br>' + '<i style="color: ' + point.color + '">● </i>' + point.series.name + '：'
              + '<span style="font-weight: bold;">' + Highcharts.numberFormat(point.y, 0) + '元</span>';
          }, '');
          return html;
        },
        style: {
          fontSize: '14px'
        }
      },
      plotOptions: {
        area: {
          // stacking: 'normal',
          lineWidth: 1,
          fillOpacity: 0.1,
          point: {
            events: {
              mouseOver: function (e) {
                cmpScopeArea.showStockBondRatio(this.index);

              }
            }
          }
        }
      },
      series: this.series_area
    };
  }

  getSeriesUpdate_area() {
    const charts = this.Highcharts.charts;
    this.categories_area = this.shared.getRangeForAreaChart();
    this.series_area = [
      {
        events: {
          legendItemClick: function (e) {
            return false;
          }
        },
        // enableMouseTracking: false,
        name: this.situation_name[this.situation],
        data: this.shared['situation_' + this.situation].map(
          value => {
            return {
              y: Number(value.TargetDollar),
              stockratio: Number(value.StockRatio),
              bondratio: Number(value.BondRatio)
            };
          }
        ),
        color: '#7cb5ec',
        lineColor: '#7cb5ec'
      }, {
        // enableMouseTracking: false,
        events: {
          legendItemClick: function (e) {
            return false;
          }
        },

        name: '累積投入本金',
        data: this.shared['situation_' + this.situation].map(value => Number(value.ActualDollar)),
        color: '#434348',
        lineColor: '#434348',
      }
    ];
    this.updateSeries_area();
    this.showStockBondRatio(0);

  }

  updateSeries_area() {
    const chart = this.Highcharts.charts;
    const current_chart = chart.find((data) => {
      if (data) {
        return data['renderTo']['className'] === this.Highcharts_projection_class;
      }
    });
    this.Highcharts_projection_index = current_chart['index'];

    while (chart[this.Highcharts_projection_index].series.length > 0) {
      chart[this.Highcharts_projection_index].series[0].remove(true);
    }
    chart[this.Highcharts_projection_index].update({
      xAxis: {
        categories: this.categories_area
      }
    });
    chart[this.Highcharts_projection_index].addSeries(this.series_area[0]);
    chart[this.Highcharts_projection_index].addSeries(this.series_area[1]);

  }

  chartCallback_area(chart) {
  }



  /**
    #     #                                                      #        #                             #####
    #     # #  ####  #####  ####  #####  #  ####    ##   #      ###      # #   #####  ######   ##      #     # #    #   ##   #####  #####
    #     # # #        #   #    # #    # # #    #  #  #  #       #      #   #  #    # #       #  #     #       #    #  #  #  #    #   #
    ####### #  ####    #   #    # #    # # #      #    # #             #     # #    # #####  #    #    #       ###### #    # #    #   #
    #     # #      #   #   #    # #####  # #      ###### #       #     ####### #####  #      ######    #       #    # ###### #####    #
    #     # # #    #   #   #    # #   #  # #    # #    # #      ###    #     # #   #  #      #    #    #     # #    # #    # #   #    #
    #     # #  ####    #    ####  #    # #  ####  #    # ######  #     #     # #    # ###### #    #     #####  #    # #    # #    #   #
  */
  HCOptionsHistory() {
    // tslint:disable-next-line:prefer-const
    let cmpScopeHistory = this;
    this.chartOptions_history = {
      credits: {
        enabled: false
      },
      chart: {
        type: 'area',
        backgroundColor: 'transparent',
        events: {
          load: function () {
            cmpScopeHistory.getSeriesUpdate_history();
            const p = this.series[0].points;
            const lastindex = (p.length > 0) ? p.length - 1 : 0;
            this.tooltip.refresh([p[lastindex]]);


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
          color: '#777',
          dashStyle: 'shortdot',
          zIndex: 0
        },
        labels: {
          align: 'right'
        },
        categories: this.categories_history
      },
      yAxis: {
        title: {
          enabled: false
        },
        plotLines: [{
          value: this.shared.target_dollar,
          color: '#333',
          width: 1,
          zIndex: 2,
          label: {
            text: '目標金額<br>' + Highcharts.numberFormat(this.shared.target_dollar / 10000, 0) + ' 萬'
          }
        }],
        opposite: true,
        labels: {
          formatter: function () {
            return Highcharts.numberFormat(this.value / 10000, 0) + ' 萬';
          }
        },
        crosshair: {
          width: 1,
          color: '#777',
          dashStyle: 'shortdot',
          zIndex: 0
        },
      },
      legend: {
        enabled: true,
        reversed: true,
        verticalAlign: 'top',
        align: 'left',
        useHTML: true,
        zIndex: 41,
        labelFormatter: function () {
          const legendItem = document.createElement('div'),
            symbol = document.createElement('span'),
            label = document.createElement('span');


          symbol.innerText = '';
          symbol.style.borderColor = this.color;
          symbol.style.backgroundColor = this.color;
          symbol.classList.add('legend-line');
          let text;

          if (this.name === '累積投入本金') { text = '投入本金'; } else { text = '帳戶金額'; }
          label.innerText = text;
          legendItem.appendChild(symbol);
          legendItem.appendChild(label);

          return legendItem.outerHTML;
        }
      },
      tooltip: {
        // enableMouseTracking : false,
        hideDelay: 99999,
        enabled: true,
        split: false,
        valueSuffix: ' 元',
        zIndex: 51,
        shared: true,
        crosshairs: [true, true],
        formatter: function () {
          const filter_event = cmpScopeHistory.show_history_lists.find(val => parseInt(val.Years, 0) === this.x);
          let html = '<b>' + this.x + ' </b>';
          if (filter_event) {
            html += '<b>' + filter_event.EventName + '</b><br>';
          } else {
            html += '<br>';
          }
          if (this.points[0].point.index === Number(cmpScopeHistory.shared.period_range)) {
            html += '<span style="color: #d30f25">已到期</span>';
          } else {
            html += '<span style="color: #006a96">' + this.points[0].point.stockratio + '%股票 </span>'
              + '<span style="color: #d30f25">' + this.points[0].point.bondratio + '%債券</span>';
          }
          html += this.points.reduce(function (s, point) {
            return s + '<br>' + '<i style="color: ' + point.color + '">● </i>' + point.series.name + '：'
              + '<span style="font-weight: bold;">' + Highcharts.numberFormat(point.y, 0) + '元</span>';
          }, '');
          return html;
        },
        style: {
          fontSize: '14px'
        }
      },
      plotOptions: {
        area: {
          // stacking: 'normal',
          lineWidth: 1,
          fillOpacity: 0.1,
          point: {
            events: {
              mouseOver: function (e) {
                cmpScopeHistory.showStockBondRatio_history(this.index);
              }
            }
          }
        }
      },
      series: this.series_history
    };
  }

  getSeriesUpdate_history() {
    const charts = this.Highcharts.charts;
    this.categories_history = this.shared.return_back_projections.map(value => Number(value.Years));
    this.series_history = [
      {
        events: {
          legendItemClick: function (e) {
            return false;
          }
        },
        name: '帳戶資產',
        data: this.shared.return_back_projections.map(value => {
          return {
            y: Number(value.TotalPV),
            stockratio: Number(value.StockRatio),
            bondratio: Number(value.BondRatio)
          };
        }),
        color: '#7cb5ec',
        lineColor: '#7cb5ec',

      }, {
        events: {
          legendItemClick: function (e) {
            return false;
          }
        },
        name: '累積投入本金',
        data: this.shared.return_back_projections.map(value => Number(value.TotalInvestDollar)),
        color: '#434348',
        lineColor: '#434348',

      }
    ];
    this.updateSeries_history();
    this.showStockBondRatio_history(0);

  }

  updateSeries_history() {
    const chart = this.Highcharts.charts;
    const current_chart = chart.find((data) => {
      if (data) {
        return data['renderTo']['className'] === this.Highcharts_historical_class;
      }
    });
    this.Highcharts_historical_index = current_chart['index'];
    while (chart[this.Highcharts_historical_index].series.length > 0) {
      chart[this.Highcharts_historical_index].series[0].remove(true);
    }
    chart[this.Highcharts_historical_index].update({
      xAxis: {
        categories: this.categories_history
      }
    });
    chart[this.Highcharts_historical_index].addSeries(this.series_history[0]);
    chart[this.Highcharts_historical_index].addSeries(this.series_history[1]);

  }

  chartCallback_history(chart) {
  }

  /**
   * ********************************************************************************************************************
   * ********************************************************************************************************************
   * ********************************************************************************************************************
   * ********************************************************************************************************************
   * ********************************************************************************************************************
   * ********************************************************************************************************************
   * ********************************************************************************************************************
   * ********************************************************************************************************************
   * ********************************************************************************************************************
   * ********************************************************************************************************************
   * ********************************************************************************************************************
   */

  reTrail() {
    // this.shared.page_progress.emit('init-input');
  }

  detPieChartSize(width) {
    if (width <= 768) {
      this.setPieChartSize(width, width);
    } else if (width <= 1000) {
      this.setPieChartSize((480 / 1000) * width, (400 / 1000) * width);
    } else {
      this.setPieChartSize(480, 400);
    }
  }
  setPieChartSize(width, height) {
    const chart = this.Highcharts.charts;
    chart[this.Highcharts_equityexpo_index].setSize(width, height);
  }

  changeSituation(situation) {
    this.situation = situation;
    this.irr = this.shared['situation_' + situation + '_irr'];
    this.getSeriesUpdate_area();
  }

  showStockBondRatio(index) {

    this.stock_ratio = this.shared['situation_' + this.situation][index].StockRatio;
    this.bond_ratio = this.shared['situation_' + this.situation][index].BondRatio;
    if (this.shared['situation_' + this.situation].length - 1 === index) {
      this.last_index = true;


    } else {
      this.last_index = false;
    }


  }

  showStockBondRatio_history(index) {
    this.stock_ratio_history = this.shared.return_back_projections[index].StockRatio;
    this.bond_ratio_history = this.shared.return_back_projections[index].BondRatio;
    if (this.shared.return_back_projections.length - 1 === index) {
      this.last_index_history = true;

    } else {
      this.last_index_history = false;
    }
  }

  async adjustPlan() {
    this.shared.in_result_adjusts_plan = true;
    await this.shared.showValueAdjusts();
  }

  applyNow(scope) {

    this.modalsvc.componentName.emit('loading');

    this.shared.setCalSeqNoCookie();

    setTimeout(() => {
      switch (scope) {
        case 'pc':
          location.href = 'http://10.11.36.36/AI/AIQuery/AI_Helper.aspx';
          this.modalsvc.modal_trigger_close.emit(true);
          break;
        case 'mobile':
          if (this.shared.isDawho) {
            // alert('dawho');
            location.href = 'http://10.11.36.66/m/ai/aiquery/m_AI_Helper.aspx?sinopac_aiCalSeqNo=' + this.shared.CalSeqNo;
          } else {
            if (this.shared.isSinopacApp()) {
              // alert('sinopacaction:' + this.shared.CalSeqNo);
              location.href = 'sinopacaction:' + encodeURIComponent('{maihelper}{?sinopac_aiCalSeqNo=' + this.shared.CalSeqNo + '}');
            } else {
              // alert('mmaiphone://sinopacaction:' + this.shared.CalSeqNo);
              // tslint:disable-next-line: max-line-length
              location.href = 'mmaiphone://' + encodeURIComponent('sinopacaction:{maihelper}{?sinopac_aiCalSeqNo=' + this.shared.CalSeqNo + '}');
              setTimeout(() => {
                // alert('timeout-mweb '+ this.shared.CalSeqNo);
                location.href = 'http://10.11.36.66/m/ai/aiquery/m_AI_Helper.aspx?sinopac_aiCalSeqNo=' + this.shared.CalSeqNo;
              }, 2000);
            }
          }
          break;
      }
    }, 1000);
    // console.log('applyNow')
  }

  onSubmitGetBackProj(form) {
    this.callBackProj();
    if (parseInt(this.ngForm.controls['formHistoryList'].value, 0) !== 0) {
      // tslint:disable-next-line: max-line-length
      this.shared.setSimulateInsertDataLayer(this.show_history_lists[this.ngForm.controls['formHistoryList'].value].Years + ' ' + this.show_history_lists[this.ngForm.controls['formHistoryList'].value].EventName);
    }
  }

  async callBackProj() {
    const post_data_pj_bak = this.shared.getBackProjPostData();
    const history_list_value = parseInt(this.show_history_lists[this.ngForm.controls['formHistoryList'].value].Years, 0);
    const start_year_value = parseInt(this.ngForm.controls['formStartYear'].value, 0);
    const limit_start_year = this.shared.back_proj_history_year_max - this.shared.period_range;
    const selected_start_year = history_list_value === 0 ? start_year_value : history_list_value;
    post_data_pj_bak.InvestStYear = limit_start_year;
    if (selected_start_year < limit_start_year) {
      post_data_pj_bak.InvestStYear = selected_start_year;
    }

    await delay(300);
    this.modalsvc.componentName.emit('loading');
    this.shared.value_adjusts_changed = true;

    await this.shared.callBackProj(post_data_pj_bak);
    this.modalsvc.modal_trigger_close.emit(true);

    this.getSeriesUpdate_history();
    this.updateIRRHistory();

  }

  updateIRRHistory() {
    this.irr_history_start_year = this.shared.invest_start_year;
    this.irr_history_year = Number(this.shared.invest_start_year) + Number(this.shared.period_range);
    this.irr_history = this.shared.return_back_projections_irr;
  }

  setOperations(formName, operator, limit) {
    const old_value = parseInt(this.ngForm.controls[formName].value, 0);
    let new_value;
    if (operator === 'plus') {
      new_value = old_value + 1;
      if (new_value > limit) {
        new_value = old_value;
      }
    } else if (operator === 'minus') {
      new_value = old_value - 1;
      if (new_value < limit) {
        new_value = old_value;
      }
    }
    this.ngForm.controls[formName].setValue(new_value);
  }

}
