/*
 * Copyright 2018 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as d3 from 'd3';
import {IRootElementService} from 'angular';

export const reportChartsComponent = {
  template: '<div class="d-flex" style="align-items: center"></div>',
  bindings: {
    report: '<'
  },
  controllerAs: 'vm',
  controller: class ReportChartsComponent {

    /** The test report. */
    public report: any;

    /**
     * Constructor.
     *
     * @param $element
     */
    /* @ngInject */
    constructor(private $element: IRootElementService) {
      this.report = null;
    }

    $onInit(): void {
      this.drawDonutChart();
      this.drawPercentage();
    }

    drawDonutChart(): void {
      const data = [
        {name: 'passed', count: this.report.numTestsPassed, color: '#5cb85c'},
        {name: 'failed', count: this.report.numTestsFailed, color: '#d9534f'}
      ];

      const width = 240;
      const height = 240;
      const radius = 100;

      const arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(55);

      const pie = d3.pie()
        .sort(null)
        .value(d => d.count);

      const svg = d3.select(this.$element[0].querySelector('div')).append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

      const g = svg.selectAll('.arc')
        .data(pie(data))
        .enter()
        .append('g');

      g.append('path')
        .attr('d', arc)
        .style('fill', d => d.data.color);

      g.append('text')
        .attr('transform', function (d) {
          const _d = arc.centroid(d);
          _d[0] *= 1.5;
          _d[1] *= 1.5;
          return 'translate(' + _d + ')';
        })
        .attr('dy', '.50em')
        .style('text-anchor', 'middle')
        .style('font-weight', '700')
        .text(d => d.data.count === 0 ? '' : d.data.count);

      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('font-weight', 700)
        .attr('font-size', '3rem')
        .attr('y', 5)
        .text(this.report.numTests);

      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', '1.5rem')
        .attr('y', 25)
        .text('Tests');
    }

    drawPercentage(): void {
      let percent = ((100 / this.report.numTests) * this.report.numTestsPassed);
      percent = Math.round(percent * 10) / 10;

      let color;
      if (percent >= 0 && percent < 30) {
        color = '#d05552';
      } else if (percent >= 30 && percent < 40) {
        color = '#ea8052';
      } else if (percent >= 40 && percent < 60) {
        color = '#eaad52';
      } else if (percent >= 60 && percent < 75) {
        color = '#dcf233';
      } else if (percent > 75 && percent < 90) {
        color = '#a8dd37';
      } else {
        color = '#68b75c';
      }

      const data = [{'x': 70, 'r': 70, 'label': percent + '%'}];

      const svg = d3.select(this.$element[0].querySelector('div')).append('svg')
        .attr('width', 140)
        .attr('height', 140);

      const el = svg.selectAll('g circleText')
        .data(data);

      const g = el.enter()
        .append('g')
        .attr('transform', d => 'translate(' + d.x + ', 70)');

      g.append('circle')
        .attr('r', d => d.r)
        .attr('fill', color);

      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', '3rem')
        .attr('y', 4)
        .attr('x', 4)
        .attr('fill', '#fff')
        .attr('font-weight', 700)
        .text(d => d.label);

      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', '1.5rem')
        .attr('y', 24)
        .attr('fill', '#fff')
        .text('Passed');
    }
  }
};
