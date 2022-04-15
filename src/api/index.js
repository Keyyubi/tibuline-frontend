import { API } from './API'

export const $api = {
  activity: new API('activity'),
  activityPeriod: new API('activityPeriod'),
  budget: new API('budget'),
  company: new API('company'),
  consultant: new API('consultant'),
  contract: new API('contract'),
  costCenter: new API('costCenter'),
  demand: new API('demand'),
  experience: new API('experience'),
  invoice: new API('invoice'),
  jobTitle: new API('jobTitle'),
  project: new API('project'),
  supplier: new API('supplier'),
  user: new API('user'),
}
