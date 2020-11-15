import React, { Component } from 'react'

import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Button
} from 'reactstrap'
import ToolkitProvider, { Search, CSVExport } from 'react-bootstrap-table2-toolkit'

import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import filterFactory, { selectFilter, Comparator } from 'react-bootstrap-table2-filter'
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor'
import { confirmAlert } from 'react-confirm-alert'
import AdminServices from '../../Controller/BaseAPI'
const { SearchBar, ClearSearchButton } = Search
const { ExportCSVButton } = CSVExport

class Dashboard extends Component {
  constructor (props) {
    super(props)

    this.state = {
      selected: [],
      arrAccounts: []
    }
  }
  async componentDidMount () {
    this.loadingInitial()
  }

  loadingInitial = async () => {
    const arrAccounts = await AdminServices.getAllUser()
    if (arrAccounts) {
      this.setState({ arrAccounts })
    }
  }

  beforeSaveCell = (oldValue, newValue, row, column, done) => {
    // if (column.dataField === 'role') {
    //   confirmAlert({
    //     title: 'Xác nhận',
    //     message: 'Bạn có muốn lưu thay đổi?',
    //     buttons: [
    //       {
    //         label: 'Đồng ý',
    //         onClick: () => {
    //           const fetchData = {
    //             method: 'PUT',
    //             headers: headers,
    //             body: JSON.stringify({
    //               id: row.id,
    //               role: newValue
    //             })
    //           }
    //           fetch(global.BASE_URL + '/changeRole', fetchData).then(() => {
    //             alert('Cập nhật thông tin thành công')
    //           }).catch(console.log)
    //           done(true)
    //         }
    //       },
    //       {
    //         label: 'Không',
    //         onClick: () => done(false)
    //       }
    //     ]
    //   })
    // }
    // return { async: true }
  }

  handleOnSelect = (row, isSelect) => {
    if (isSelect) {
      this.setState(() => ({
        selected: [...this.state.selected, row.id]
      }))
    } else {
      this.setState(() => ({
        selected: this.state.selected.filter(x => x !== row.id)
      }))
    }
  }

  onDelete = () => {
    if (this.state.selected.length > 0) {
      confirmAlert({
        title: 'Xác nhận',
        message: 'Bạn có muốn ngưng hoạt động những tài khoản này?',
        buttons: [
          {
            label: 'Đồng ý',
            onClick: async () => {
              console.log(this.state.selected)
              await AdminServices.blockAccount(this.state.selected)
              this.setState({ selected: [] })
              this.loadingInitial()
            }
          },
          {
            label: 'Không',
            onClick: () => { this.setState({ selected: [] }) }
          }
        ]
      })
    }
  }

  handleOnSelectAll = (isSelect, rows) => {
    const ids = rows.map(r => r.id)
    if (isSelect) {
      this.setState(() => ({
        selected: ids
      }))
    } else {
      this.setState(() => ({
        selected: []
      }))
    }
  }

  render () {
    const { arrAccounts } = this.state
    const selectRow = {
      selected: this.state.selected,
      mode: 'checkbox',
      clickToSelect: true,
      bgColor: '#58BAD9',
      onSelect: this.handleOnSelect,
      onSelectAll: this.handleOnSelectAll
    }

    const columns = [
      {
        dataField: 'id',
        text: 'ID',
        sort: true,
        editable: false
      },
      {
        dataField: 'name',
        text: 'Tên',
        sort: true,
        editable: false
      },
      {
        dataField: 'email',
        text: 'Email',
        sort: true,
        editable: false
      },
      {
        dataField: 'image',
        text: 'Avatar',
        sort: true,
        editable: false,
        formatter: (cell, row) => (
          <img src={cell} className={'img-news'} />
        )
      },
      {
        dataField: 'address',
        text: 'Address',
        sort: true,
        editable: false
      },
      {
        dataField: 'isActive',
        sort: true,
        text: 'Trạng thái',
        editor: {
          type: Type.SELECT,
          options: [{
            value: true,
            label: 'Đang hoạt động'
          }, {
            value: false,
            label: 'Ngưng hoạt động'
          }]
        },
        filter: selectFilter({
          options: {
            true: 'Đang hoạt động',
            false: 'Ngưng hoạt động'
          },
          comparator: Comparator.LIKE
        }),
        formatter: (cell, row) => (
          <span>{cell ? 'Đang hoạt động' : 'Ngưng hoạt động'}</span>
        )
      }]

    const pagination = paginationFactory({
      sizePerPage: 100,
      totalSize: arrAccounts.length
    })

    if (arrAccounts.length > 0) {
      return (
        <div className='animated fadeIn'>
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <i className='fa fa-align-justify' />{'Tài khoản người dùng'}
                </CardHeader>
                <CardBody>
                  <ToolkitProvider

                    keyField='id' data={arrAccounts}
                    columns={columns}
                    search
                  >
                    {
                      props =>
                        (<div>
                          <h3>{'Tìm tài khoản người dùng'}</h3>
                          <SearchBar placeholder={'Tìm kiếm'} {...props.searchProps} />
                          <div className={'row-search'}>
                            <ClearSearchButton className={'btn-info search-btn'} text={'Xóa tìm kiếm'} color='info' {...props.searchProps} />
                            <ExportCSVButton className={'btn-info search-btn'} {...props.csvProps}>{'Xuất CSV File'}</ExportCSVButton>
                            <Button onClick={this.onDelete} className={'btn-info search-btn'} color='danger'>{'Xóa người dùng'}</Button>{' '}
                          </div>
                          <hr />
                          <BootstrapTable
                            selectRow={selectRow}
                            cellEdit={cellEditFactory({
                              mode: 'click',
                              blurToSave: true,
                              beforeSaveCell: this.beforeSaveCell
                            })}
                            filter={filterFactory()}
                            pagination={pagination}
                            {...props.baseProps}
                          />
                        </div>
                        )
                    }
                  </ToolkitProvider>

                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      )
    }
    return (
      <div id='page-loading'>
        <div className='three-balls'>
          <div className='ball ball1' />
          <div className='ball ball2' />
          <div className='ball ball3' />
        </div>
      </div>
    )
  }
}

export default Dashboard
