import { Component, OnInit } from '@angular/core';
import {GrowthChart} from '../growthChart';

import * as CanvasJS from '../growth/canvasjs.min';
import {AccountService} from '../account.service';

@Component({
  selector: 'app-capital-chart',
  templateUrl: './capital-chart.component.html',
  styleUrls: ['./capital-chart.component.css']
})
export class CapitalChartComponent implements OnInit {

  constructor(
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.accountService.getCapitalChart().subscribe(data => this.makeChart(data));
  }

  makeChart(data: GrowthChart[]): void {
    const dataPoints = [];
    for (const val of data) {
      dataPoints.push({label : val.x, y : val.y});
    }

    const chart = new CanvasJS.Chart('chartContainer', {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: 'Money spent by day'
      },
      axisY: {
        interval : 500.01,
        title : '$',
        maximum : Math.max.apply(Math, data.map(value => value.y)) + 300
      },
      axisX: {
        title : 'Day'
      },
      data: [{
        type: 'column',
        dataPoints,
      }]
    });

    chart.render();
  }

}
