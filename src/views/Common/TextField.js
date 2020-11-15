import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const TextField = ({ field, value, style, type, onChange, checkUserExists, placeholder }) => {
  return (
      <input
        onChange={onChange}
        onBlur={checkUserExists}
        value={value}
        type={type}
        name={field}
        style={style}
        placeholder= {placeholder}
      /> );
}

TextField.propTypes = {
  field: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  style: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  checkUserExists: PropTypes.func
}

TextField.defaultProps = {
  type: 'text'
}

export default TextField;