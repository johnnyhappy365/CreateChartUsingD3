import * as _ from 'lodash'
import * as faker from 'faker'

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
  }
}
