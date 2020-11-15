import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const TextFieldGroup = ({ borderColor, className, disabled, isNumber, field, children, value, label, error, type, onChange, checkUserExists }) => {
  return (
    <div className={classnames('form-group', { 'has-error': error })}>
      <label className='control-label'>{label}</label>
      {
        children || <input
          style={{ borderColor: borderColor }}
          disabled={disabled}
          onChange={onChange}
          onBlur={checkUserExists}
          value={value}
          type={type}
          {...isNumber ? { inputMode: 'numeric' } : null}
          name={field}
          className='form-control'
        />
      }

      {error && <span className='help-block'>{error}</span>}
    </div>)
}

TextFieldGroup.propTypes = {
  field: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  checkUserExists: PropTypes.func
}

TextFieldGroup.defaultProps = {
  type: 'text'
}

export default TextFieldGroup
