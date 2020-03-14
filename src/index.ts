import * as _ from 'lodash'
import testdata from './testdata'
import { BarChart } from './lib/charts'

new BarChart({
  selector: '#chart-1',
  data: testdata.data1()
})
