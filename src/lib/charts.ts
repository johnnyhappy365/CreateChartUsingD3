import * as d3 from 'd3'
import moment from 'moment'

enum Colors {
  grey = 'lightgrey',
  primary = '#42b983',
  secondary = '#e96900',
  text = '#212121',
  axis = '#757575'
}

export interface DataItem {
  x: string | number | Date
  y: string | number
}

export interface ChartMargin {
  left: number
  right: number
  top: number
  bottom: number
}

export interface IChartConfig {
  selector: string
  width?: number | 300
  height?: number | 500
  data: DataItem[]
  margin?: ChartMargin
  onClick?: (d: DataItem) => void
}

export interface BarChartConfig extends IChartConfig {
  showMidLine?: boolean
}
export interface LineChartConfig extends IChartConfig {}

class BaseChart {
  protected config: BarChartConfig
  svg: any
  x: any
  y: any
  xAxis: any
  yAxis: any
  series: any
  seriesLabel: any

  protected initSvg() {
    const { selector, width, height } = this.config

    this.svg = d3
      .select(selector)
      .append('div')
      .classed('chart-wrapper', true)
      .style('display', 'inline-block')
      .style('position', 'relative')
      .style('width', '100%')
      .style('padding-bottom', '100%')
      .style('vertical-align', 'top')
      .style('overflow', 'hidden')
      // Container class to make it responsive.
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('display', 'inline-block')
      .style('position', 'absolute')
      .style('top', '0')
      .style('left', '0')
    // .style('background-color', Colors.grey)
  }
}

export class LineChart extends BaseChart {
  constructor(config: LineChartConfig) {
    super()
    this.config = {
      width: 500,
      height: 300,
      margin: {
        bottom: 20,
        top: 20,
        left: 20,
        right: 20
      },
      showMidLine: true,
      ...config
    }
    this.init()
  }

  init() {
    this.initSvg()
    this.initAxis()
    this.addAxis()
  }

  protected initAxis() {
    const { data, width, height, margin } = this.config
    const maxDomainValue = d3.max(data, (d: DataItem) => d.y as number)
    this.x = d3
      .scaleTime()
      .domain([data[0].x as Date, data[data.length - 1].x as Date])
      .range([margin.left, width - margin.right])

    this.xAxis = d3
      .axisBottom(this.x)
      // @ts-ignore
      .tickFormat((d: DataItem) => moment(d).format('M-D'))
      .ticks(d3.timeDay.every(2))

    this.y = d3
      .scaleLinear()
      .domain([0, maxDomainValue])
      .range([height - margin.bottom, margin.top])
    this.yAxis = d3.axisLeft(this.y)
  }

  // TODO: double check wether duplicate
  private addAxis() {
    const { height, margin } = this.config
    this.xAxis = this.svg
      .append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(this.xAxis)

    this.xAxis.selectAll('text').attr('fill', Colors.axis)
    this.xAxis.selectAll('path').attr('stroke', Colors.axis)
    this.xAxis.selectAll('line').attr('stroke', Colors.axis)

    this.yAxis = this.svg
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(this.yAxis)

    this.yAxis.selectAll('text').attr('fill', Colors.axis)
    this.yAxis.selectAll('path').attr('stroke', Colors.axis)
    this.yAxis.selectAll('line').attr('stroke', Colors.axis)
  }
}

export class BarChart extends BaseChart {
  constructor(config: BarChartConfig) {
    super()
    this.config = {
      width: 500,
      height: 300,
      margin: {
        bottom: 20,
        top: 20,
        left: 160,
        right: 20
      },
      showMidLine: true,
      ...config
    }
    this.init()
  }

  init() {
    this.initSvg()
    this.initAxis()
    this.initGridlines()
    this.addAxis()
    this.initSeries()
    if (this.config.showMidLine) {
      this.initMidLine()
    }
  }

  protected initMidLine() {
    const { data, margin, height } = this.config
    const midValue = d3.median(data.map((d: DataItem) => d.x as number))

    this.svg
      .append('line')
      .classed('mid', true)
      .attr('stroke', Colors.secondary)
      .attr('stroke-width', 2)
      .attr('x1', this.x(midValue))
      .attr('x2', this.x(midValue))
      .attr('y1', margin.top)
      .attr('y2', height - margin.bottom)

    // add text
    this.svg
      .append('text')
      .classed('mid-text', true)
      .attr('x', this.x(midValue) + 2)
      .attr('y', margin.top)
      .attr('width', 20)
      .attr('height', 10)
      .attr('font-size', '10px')
      .attr('font-family', 'sans-serif')
      .style('fill', Colors.secondary)
      .text(`mid: ${midValue}`)
  }

  protected initGridlines() {
    const { height, margin } = this.config
    const gridX = d3
      .axisBottom(this.x)
      .ticks(5)
      .tickSize(-height + margin.top + margin.bottom)
      .tickFormat(() => '')
    this.svg
      .append('g')
      .call(gridX)
      .classed('grid', true)
      .attr('color', Colors.grey)
      .attr('stroke-width', 0.1)
      .attr('stroke-dasharray', '3,3')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
  }

  protected initSeries() {
    const { data, margin, onClick } = this.config
    const that = this
    this.series = this.svg
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .classed('bar', true)
      .attr('fill', Colors.primary)
      .attr('x', margin.left + 1) // forbiden overlay by series
      .attr('y', (d: DataItem) => this.y(d.y))
      .attr('width', (d: DataItem) => this.x(d.x) - margin.left)
      .attr('height', this.y.bandwidth())
      .style('cursor', 'pointer')
      .on('click', (d: DataItem) => {
        if (onClick) {
          onClick(d)
        }
      })
      .on('mouseover.bar', function(d: DataItem, i: number) {
        that.setSeriesColor(Colors.grey)
        d3.select(this)
          .transition()
          .duration(200)
          .attr('fill', Colors.primary)

        that.seriesLabel
          .filter((d: DataItem, index: number) => index === i)
          .transition()
          .duration(200)
          .attr('opacity', 0.9)
      })
      .on('mouseout.bar', function(d: DataItem, i: number) {
        that.setSeriesColor(Colors.primary)
        that.seriesLabel
          .transition()
          .duration(200)
          .attr('opacity', 0)
      })

    this.seriesLabel = this.svg
      .selectAll('.series-label')
      .data(data)
      .enter()
      .append('text')
      .classed('series-label', true)
      .text((d: DataItem) => d.x)
      .attr('fill', Colors.text)
      .attr('x', (d: DataItem) => this.x(d.x) + 4) // forbiden overlay by series
      .attr('y', (d: DataItem) => this.y(d.y) + this.y.bandwidth() / 2)
      .attr('width', (d: DataItem) => this.x(d.x) - margin.left)
      .attr('dominant-baseline', 'central')
      .attr('height', this.y.bandwidth())
      .attr('font-size', '8px')
      .attr('font-family', 'sans-serif')
      .attr('opacity', 0)
  }

  protected setSeriesColor(color: Colors) {
    this.series
      .transition()
      .duration(200)
      .attr('fill', color)
  }

  protected initAxis() {
    const { data, width, height, margin } = this.config
    const maxDomainValue = d3.max(data, (d: DataItem) => d.x as number)
    this.x = d3
      .scaleLinear()
      .domain([0, maxDomainValue])
      .range([margin.left, width - margin.right])

    this.xAxis = d3.axisBottom(this.x)

    this.y = d3
      .scaleBand()
      .domain(data.map((d: DataItem) => d.y) as string[])
      .range([margin.top, height - margin.bottom])
      .padding(0.3)

    this.yAxis = d3.axisLeft(this.y)
  }

  private addAxis() {
    const { height, margin } = this.config
    this.xAxis = this.svg
      .append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(this.xAxis)

    this.xAxis.selectAll('text').attr('fill', Colors.axis)
    this.xAxis.selectAll('path').attr('stroke', Colors.axis)
    this.xAxis.selectAll('line').attr('stroke', Colors.axis)

    this.yAxis = this.svg
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(this.yAxis)

    this.yAxis.selectAll('text').attr('fill', Colors.axis)
    this.yAxis.selectAll('path').attr('stroke', Colors.axis)
    this.yAxis.selectAll('line').attr('stroke', Colors.axis)
  }
}
