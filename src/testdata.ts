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
    for (let index = 0; index < 50; index++) {
      data.push({
        x: index + Math.round(_.random(10)),
        y: index + Math.round(_.random(10))
      })
    }
    for (let index = 0; index < 10; index++) {
      data.push({
        x: 5 + Math.round(_.random(10)),
        y: 35 + Math.round(_.random(20))
      })
    }
    for (let index = 0; index < 20; index++) {
      data.push({
        x: 35 + Math.round(_.random(10)),
        y: 5 + Math.round(_.random(20))
      })
    }
    return data
  }
}
