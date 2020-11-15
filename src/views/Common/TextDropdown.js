import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const TextDropdown = ({ field, value, label, placeholder, error, type, onChange, checkUserExists, rows, arrOption = [] }) => {
  let result = ''
  result = arrOption.map((value, index) => {
    return <option key={index} value={value}>{value}</option>
  })
  return (
    <div className={classnames('form-group', { 'has-error': error })}>
      <label className='control-label'>{label}</label>
      <select
        onChange={onChange}
        onBlur={checkUserExists}
        value={value}
        type={type}
        name={field}
        placeholder={placeholder}
        className='form-control blacktext'
        rows={rows}
      >
        {result}
      </select>
      {error && <span className='help-block'>{error}</span>}
    </div>)
}

TextDropdown.propTypes = {
  field: PropTypes.string.isRequired,
  arrOption: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  rows: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  checkUserExists: PropTypes.func
}

TextDropdown.defaultProps = {
  type: 'text',
  rows: '3'
}

export default TextDropdown
