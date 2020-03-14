import * as _ from 'lodash'
import testdata from './testdata'
import { BarChart } from './lib/charts'

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
