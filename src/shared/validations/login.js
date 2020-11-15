import Validator from 'validator'
import isEmpty from 'lodash/isEmpty'

export default function validateinput (data) {
  let errors = {}

  if (Validator.isEmpty(data.identifier)) {
    errors.identifier = 'Please enter username'
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Please enter password'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
