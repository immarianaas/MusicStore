import { Component, OnInit } from '@angular/core';
import * as CanvasJS from './canvasjs.min';
import {AccountService} from '../account.service';
import {GrowthChart} from '../growthChart';

@Component({
  selector: 'app-growth',
  templateUrl: './growth.component.html',
  styleUrls: ['./growth.component.css']
})
export class GrowthComponent implements OnInit {

  constructor(
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.accountService.getUserAppGrowth().subscribe(data => this.makeChart(data));
  }

  makeChart(data: GrowthChart[]): void {
    const dataPoints = [];
    for (const val of data) {
      dataPoints.push({label : val.x, y : val.y});
    }

    const chart = new CanvasJS.Chart('chartContainer', {
      exportEnabled: true,
      title: {
        text: 'Newer customers joining the app'
      },
      axisY: {
        interval : 1,
        title : 'Accounts created'
      },
      axisX: {
        title : 'Day'
      },
      data: [{
        type: 'spline',
        dataPoints,
      }]
    });

    chart.render();
  }

}
