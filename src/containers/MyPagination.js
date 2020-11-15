import React from 'react'
import { Pagination } from 'antd'

class MyPagination extends React.PureComponent {
  render () {
    const { itemRender, ...rest } = this.props
    return (
      <Pagination
        style={{ display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          alignSelf: 'flex-end',
          marginBottom: 50 }}
        {...rest}
      />
    )
  }
}

export default MyPagination
