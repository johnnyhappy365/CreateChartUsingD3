import * as d3 from 'd3'

enum Colors {
  grey = 'lightgrey',
  primary = '#42b983',
  secondary = '#e96900'
}

export interface DataItem {
  x: string | number
  y: string | number
}

export interface ChartMargin {
  left: number
  right: number
  top: number
  bottom: number
}

export interface BarChartConfig {
  selector: string
  width?: number | 300
  height?: number | 500
  data: DataItem[]
  margin?: ChartMargin
}

export class BarChart {
  config: BarChartConfig
  svg: any
  x: any
  y: any
  xAxis: any
  yAxis: any

  constructor(config: BarChartConfig) {
    this.config = {
      width: 500,
      height: 300,
      margin: {
        bottom: 20,
        top: 20,
        left: 160,
        right: 20
      },
      ...config
    }
    this.init()
  }

  init() {
    console.log('render')
    this.initSvg()
    this.initAxis()
    this.initGridlines()
    this.addAxis()
    this.initSeries()
    this.initMidLine()
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
    const { data, margin } = this.config
    this.svg
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
    this.svg
      .append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(this.xAxis)
    this.svg
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(this.yAxis)
  }

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
