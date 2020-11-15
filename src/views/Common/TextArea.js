import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const TextArea = ({ name, field, value, label, placeholder, error, type, onChange, checkUserExists, rows }) => {
  return (
    <div className={classnames('form-group', { 'has-error': error })}>
      <label className='control-label'>{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        onBlur={checkUserExists}
        type={type}
        name={name || field}
        placeholder={placeholder}
        className='form-control blacktext'
        rows={rows}
      >{value}</textarea>
      {error && <span className='help-block'>{error}</span>}
    </div>)
}

TextArea.propTypes = {
  field: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  rows: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  checkUserExists: PropTypes.func
}

TextArea.defaultProps = {
  type: 'text',
  rows: '3'
}

export default TextArea
