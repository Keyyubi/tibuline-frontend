import { API } from './API'

export const $api = {
  activity: new API('activity'),
  activityPeriod: new API('activityPeriod'),
  budget: new API('budget'),
  company: new API('company'),
  consultant: new API('consultant'),
  contract: new API('contract'),
  CostCenter: new API('CostCenter'),
  demand: new API('demand'),
  experience: new API('experienceSpan'),
  invoice: new API('activity'),
  jobTitle: new API('jobTitle'),
  project: new API('project'),
  supplier: new API('supplier'),
  user: new API('user'),
}

export const UserService = new API('user')
