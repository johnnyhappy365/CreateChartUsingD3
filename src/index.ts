import _ from 'lodash'
import testdata from './testdata'
import { BarChart, LineChart, ScatterChart } from './lib/charts'

new BarChart({
  selector: '#chart-1',
  data: testdata.data1(),
  showMidLine: false,
  margin: {
    bottom: 20,
    left: 200,
    top: 20,
    right: 20
  },
  onClick: d => {}
})

new LineChart({
  selector: '#chart-2',
  data: testdata.data2()
})

new ScatterChart({
  selector: '#chart-3',
  data: testdata.data3()
})
