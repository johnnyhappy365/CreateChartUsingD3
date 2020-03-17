import * as _ from 'lodash'
import * as faker from 'faker'
import moment from 'moment'

export default {
  data1: () => {
    const data: any = []
    _.times(20, () => {
      data.push({
        y: faker.company.companyName(),
        x: faker.random.number(126)
      })
    })
    return data
  },
  data2: () => {
    const data: any = []
    for (let index = 0; index < 20; index++) {
      data.push({
        x: moment()
          .add(index, 'days')
          .toDate(),
        y: Math.round(_.random(50))
      })
    }
    return data
  },
  data3: () => {
    const data: any = []
    for (let index = 0; index < 500; index++) {
      data.push({
        x: Math.round(_.random(1000)),
        y: Math.round(_.random(1000))
      })
    }
    return data
  }
}
