import { createStore } from 'redux'
import {
  currentTrans,
  currentAddress,
  currentAddressTrans,
  currentAddressAnalytic
} from './Reducers'

export function currentTransStore () {
  return createStore(currentTrans, {})
}
export function currentAddressTransStore () {
  return createStore(currentAddressTrans, {})
}
export function currentAddressStore () {
  return createStore(currentAddress, {})
}
export function currentAddressAnalyticStore () {
  return createStore(currentAddressAnalytic, {})
}
