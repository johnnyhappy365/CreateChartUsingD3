import * as d3 from 'd3'

enum Colors {
  grey = '#eee'
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
  }

  protected initAxis() {
    const { data, width, height, margin } = this.config
    const maxDomainValue = d3.max(data, (d: DataItem) => d.x as number)
    this.x = d3
      .scaleLinear()
      .domain([0, maxDomainValue])
      .range([0, width - margin.right - margin.left])

    this.xAxis = d3.axisBottom(this.x)
    this.svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${height - margin.bottom})`)
      .call(this.xAxis)

    this.y = d3
      .scaleBand()
      .domain(data.map((d: DataItem) => d.y) as string[])
      .range([margin.top, height - margin.top - margin.bottom])

    this.yAxis = d3.axisLeft(this.y)
    this.svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
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
