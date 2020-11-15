import React from 'react'
import BaseAPI from '../../Controller/BaseAPI'

import filterFactory from 'react-bootstrap-table2-filter'
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit'
import BootstrapTable from 'react-bootstrap-table-next'

import {
  Button,
  CardBody
} from 'reactstrap'

const { SearchBar, ClearSearchButton } = Search

class ViewDetailComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      arrData: []
    }
  }
  async componentDidMount () {
    const { id } = this.props
    const arrData = await BaseAPI.getData(`bookinghistory/tourbyadmin/${id}`)
    this.setState({ arrData })
  }

  render () {
    const { arrData } = this.state

    const column = [{
      dataField: 'bookingInfo',
      text: 'Name',
      filterValue: (cell) => cell.firstName,
      sort: true,
      formatter: (cell, row) => (
        <div>
          {cell.firstName + ' ' + cell.lastName }
        </div>
      )
    },
    {
      dataField: 'tourId',
      text: 'Tour Title',
      filterValue: (cell) => JSON.parse(cell).title.en,
      sort: true,
      formatter: (cell, row) => (
        <div>
          {JSON.parse(cell).title.en}
        </div>
      )
    },
    {
      dataField: 'tourId',
      text: 'Contact',
      filterValue: (cell) => JSON.parse(cell).contactList,
      sort: true,
      formatter: (cell, row) => (
        <ul style={{ float: 'left' }}>
          <li>Email: {JSON.parse(cell).contactList.email}</li>
          <li>Telegram: {JSON.parse(cell).contactList.telegram}</li>
          <li>Wechat: {JSON.parse(cell).contactList.wechat}</li>
        </ul>
      )
    },
    {
      dataField: 'payment',
      text: 'Amount',
      filterValue: (cell) => cell.transactions[0],
      sort: true,
      formatter: (cell, row) => (
        <div>
          {cell.transactions[0].amount.total + ' ' + cell.transactions[0].amount.currency}
        </div>
      )
    },
    {
      dataField: 'isPayment',
      text: 'Payment',
      filterValue: (cell) => cell,
      sort: true,
      formatter: (cell, row) => (
        <Button color={cell ? 'success' : 'danger'} >{cell ? 'Paid' : 'Unpaid'}</Button>
      )
    }]

    return (
      <CardBody className='darkBlueBg'>
        <ToolkitProvider
          keyField='_id'
          data={arrData}
          columns={column}
          search
        >
          {
            props =>
              (<div>
                <h3>{'Find Booking'}</h3>
                <SearchBar className={'darkBlueInput'} placeholder={'Enter your search string ...'} {...props.searchProps} />
                <div className={'row-search'}>
                  <ClearSearchButton className={'btn-info search-btn'} text={'Clear result'} color='info' {...props.searchProps} />
                </div>
                <hr />
                <BootstrapTable
                  rowClasses={'table-header'}
                  headerClasses={'table-header'}
                  filter={filterFactory()}
                  {...props.baseProps}
                />
              </div>
              )
          }
        </ToolkitProvider>
      </CardBody>
    )
  }
}

export default ViewDetailComponent
