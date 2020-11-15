import React, { PureComponent } from 'react'
import BaseAPI from '../../Controller/BaseAPI'
import { categoryList, sexType, arrCountry } from '../../common/constants'

import filterFactory from 'react-bootstrap-table2-filter'
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit'
import BootstrapTable from 'react-bootstrap-table-next'
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Button,
  ModalFooter,
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  Spinner
} from 'reactstrap'

import MyPagination from '../../containers/MyPagination'
import { showAlert, getLength } from '../../common/function'
import TextFieldGroup from '../Common/TextFieldGroup'
import { confirmAlert } from 'react-confirm-alert'

const { SearchBar, ClearSearchButton } = Search

class BookingHistrory extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      arrData: [],
      arrDataBooking: [],
      fileUpload: null,
      selectedEdit: null,
      txtEmail: '',
      txtFirstName: '',
      txtLastName: '',
      txtImage: '',
      isSex: null,
      txtResidentNum: '',
      txtPhone: '',
      txtAddress: '',
      txtPassword: '',
      txtNewPassword: '',
      txtRole: 'member',
      txtNation: '',
      txtNationCode: '',
      arrNationCode: [],
      arrNation: [],
      isViewDetail: false,
      idUserDetail: '',
      size: 15,
      total: 0

    }
  }
  async componentDidMount () {
    this.loadingInitial(1)
  }

  loadingInitial = async (page) => {
    // const response = await BaseAPI.getData('tour')
    window.scrollTo(0, window.innerHeight)
    const { size } = this.state
    const response = await BaseAPI.getData(
      `bookinghistory/allTourByAdmin?size=${size}&page=${page}`
    )
    const { data, total } = response
    const newData = data.slice()
    const promiseAll = await newData.map((value, index) => {
      value.tourId = JSON.parse(value.tourId)
      return value
    })
    this.setState({ total, arrData: promiseAll })
  }

  onDelete = async (row) => {
    if (row.isActive) {
      confirmAlert({
        title: 'Confirm to delete',
        message: 'Are you sure to delete',
        buttons: [
          {
            label: 'Yes',
            onClick: async () => {
              const res = await BaseAPI.deleteData({ isActive: false, id: row._id }, 'bookinghistory')
              if (res) {
                showAlert('Delete successfully')
                this.updateData(res)
              } else {
                showAlert('Something goes wrong. Please try again.')
              }
            }
          },
          {
            label: 'No',
            onClick: () => { }
          }
        ]
      })
    } else {
      const res = await BaseAPI.deleteData({ isActive: true, id: row._id }, 'bookinghistory')
      if (res) {
        showAlert('Active successfully')
        this.updateData(res)
      } else {
        showAlert('Something goes wrong. Please try again.')
      }
    }
  }

  updateData = (res) => {
    const newTourId = JSON.parse(res.tourId)
    const newItem = res
    newItem.tourId = newTourId
    const newList = this.state.arrData.slice()
    const newIndex = newList.findIndex(itm => itm._id === res._id)
    if (newIndex !== -1) {
      newList[newIndex] = newItem
    }
    this.setState({ arrData: newList })
  }

  onChangeValue = (e) => {
    if (e.target.name === 'txtNation') {
      const find = arrCountry.filter(c => c[0] === e.target.value)
      this.setState({
        txtNation: find[0][1],
        txtNationCode: (typeof find[0][find[0].length - 1]) === 'object' ? [...find[0][find[0].length - 1]][0] : find[0][find[0].length - 1],
        arrNationCode: (typeof find[0][find[0].length - 1]) === 'object' ? [...find[0][find[0].length - 1]] : [find[0][find[0].length - 1]]
      })
    } else {
      let newValue = e.target.value
      if (e.target.name === 'isSex') {
        newValue = sexType[e.target.value]
      }
      this.setState({ [e.target.name]: newValue }, () => {
        this.checkOpenInfo()
      })
    }
  }

  checkOpenInfo = () => {
    this.setState({ isOK: true })
  }

  resetData = () => {
    this.setState({
      fileUpload: null,
      selectedEdit: null,
      txtEmail: '',
      txtFirstName: '',
      txtLastName: '',
      txtNation: '',
      txtImage: '',
      isSex: null,
      txtResidentNum: '',
      txtPhone: '',
      txtAddress: '',
      txtPassword: '',
      txtNewPassword: '',
      txtRole: 'member',
      txtNationCode: '',
      arrNationCode: [],
      arrNation: [],
      isOK: false
    }, () => {
      this.checkOpenInfo()
    })
  }

  openCreate = () => {
    this.showModal()
    this.resetData()
  }

  onSelectFile = (fileUpload) => {
    this.setState({ fileUpload }, () => {
      this.checkOpenInfo()
    })
  }

  showModal = () => {
    this.setState({ isOpenModal: true })
  }

  hideModal = () => {
    this.setState({ isOpenModal: false })
    this.resetData()
  }

  onChangeType = (isNormal) => () => {
    this.setState({ isNormal }, () => {
      this.checkOpenInfo()
    })
  }

  onDetail = (file) => async () => {
    const arrData = await BaseAPI.getData(`user/me${file.createdUser}`)
    console.log(arrData)
    if (arrData) {
      this.setState({
        txtEmail: arrData[0].email,
        txtFirstName: arrData[0].firstName,
        txtLastName: arrData[0].lastName,
        txtImage: arrData[0].image,
        isSex: arrData[0].sex,
        txtResidentNum: arrData[0].residentNum,
        txtPhone: arrData[0].phone,
        txtAddress: arrData[0].address,
        txtPassword: arrData[0].password,
        txtRole: arrData[0].role,
        txtNation: arrData[0].nation,
        txtNationCode: arrData[0].nationCode
      }, () => {
        this.showModal()
        this.checkOpenInfo()
      })
    }
  }

  genObjectLang = (en, vi) => {
    return { en, vi }
  }

  onCreateData = async () => {
    const { fileUpload, selectedEdit, txtFirstName, txtLastName,
      txtNation, isSex, txtResidentNum, txtPhone, txtAddress, txtRole, txtNationCode, txtNewPassword } = this.state
    const createData = async (newImage) => {
      const body = {
        firstName: txtFirstName,
        lastName: txtLastName,
        sex: isSex,
        residentNum: txtResidentNum,
        phone: txtPhone,
        address: txtAddress,
        role: txtRole,
        nation: txtNation,
        nationCode: txtNationCode,
        password: txtNewPassword
      }

      if (selectedEdit) {
        body.id = selectedEdit.id
      }

      const res = await BaseAPI[selectedEdit ? 'putUpdateData' : 'postCreateData'](body, 'user')
      if (res) {
        showAlert(`${selectedEdit ? 'Edit' : 'Create'} succesfully`)
        this.hideModal()
        this.loadingInitial()
      } else {
        showAlert('Something goes wrong. Please try again.')
      }
    }

    if (fileUpload && fileUpload.length > 0) {
      const promise = fileUpload.map(async (itm) => {
        const signedFile = await BaseAPI.uploadFileImageS3(itm)
        if (signedFile) {
          return signedFile.url
        } else {
          return null
        }
      })

      const promiseData = await Promise.all(promise)
      createData(promiseData.filter(itm => itm !== null))
    } else {
      createData()
    }
  }

  onChangeValueBase = (key, val) => {
    let newVal = val
    this.setState({ [key]: newVal }, () => {
      this.checkOpenInfo()
    })
  }

  toggleDropdown = () => {
    this.setState({ isOpenDropdown: !this.state.isOpenDropdown })
  }
  toggleDropdown2 = () => {
    this.setState({ isOpenDropdown2: !this.state.isOpenDropdown2 })
  }

  getSelect = (category) => {
    const findData = categoryList.find(itm => itm === category)
    return findData || 'Please select category'
  }

  getSelect2 = (id) => {
    const findData = this.state.arrData.find(itm => itm._id === (id || this.state.txtCategoryParent))
    return findData ? findData.title['en'] : 'Please select category parent'
  }

  filterCategoryParent = () => {
    const { selectedEdit } = this.state
    return this.state.arrData.filter(itm => itm.type === this.state.txtCategory && (selectedEdit ? selectedEdit._id !== itm._id : true))
  }

  render () {
    const { total, size, arrData, selectedEdit, txtEmail, txtFirstName, txtLastName,
      txtNation, isSex, txtResidentNum, txtPhone, txtAddress, txtRole, txtNationCode } = this.state
    const column = [{
      dataField: 'tourId',
      text: 'Tour Title',
      filterValue: (cell) => cell ? cell.title.en : '',
      sort: true,
      formatter: (cell, row) => (
        <div>
          {cell ? cell.title.en : ''}
        </div>
      )
    },
    {
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
      dataField: 'bookingInfo',
      text: 'Email',
      filterValue: (cell) => cell.email,
      sort: true,
      formatter: (cell, row) => (
        <div>
          {cell.email}
        </div>
      )
    },
    {
      dataField: 'bookingInfo',
      text: 'Address',
      filterValue: (cell) => cell.address,
      sort: true,
      formatter: (cell, row) => (
        <div>
          {cell.address}
        </div>
      )
    },
    {
      dataField: 'bookingInfo',
      text: 'Room',
      filterValue: (cell) => cell.room,
      sort: true,
      formatter: (cell, row) => (
        <div>
          {cell.room}
        </div>
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
    },
    {
      dataField: 'symbol',
      text: 'Detail User',
      formatter: (cell, row) => (
        <Button className={'btn_dark'} color={'success'} onClick={this.onDetail(row)}>{'Detail'}</Button>
      )
    },
    {
      dataField: 'isActive',
      text: 'Is Active',
      formatter: (cell, row) => (
        <input key={1} type='checkbox' name='dapp_show'
          onClick={(e) => this.onDelete(row)} checked={cell} />
      )
    }]
    return (
      <div className='animated fadeIn'>
        <Row className='paddingTop'>
          <Col >
            <Card className={'borderBlack'}>
              <CardHeader className='darkBlueBg'>
                <i className='fa fa-align-justify' />{'Manage Booking History'}
              </CardHeader>
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
            </Card>
          </Col>
        </Row>
        <Modal size={'lg'} isOpen={this.state.isOpenModal} >
          <ModalHeader >{'View Detail'}</ModalHeader>
          <ModalBody>
            <CardBody>
              <Form>
                <Row>
                  <Col xl={6}>
                    <TextFieldGroup
                      field='txtEmail'
                      label='Email'
                      value={txtEmail}
                      disabled
                    />
                  </Col>
                  <Col xl={6}>
                    <TextFieldGroup
                      field='txtFirstName'
                      label='First Name'
                      value={txtFirstName}
                      disabled
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xl={6}>
                    <TextFieldGroup
                      field='txtLastName'
                      label='Last Name'
                      value={txtLastName}
                      disabled
                    />
                  </Col>
                  <Col xl={6}>
                    <TextFieldGroup
                      field='isSex'
                      label='Sex'
                      value={isSex ? 'Female' : 'Male'}
                      disabled
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xl={6}>
                    <TextFieldGroup
                      field='txtNation'
                      label='Nation'
                      value={arrCountry.filter(c => c[1] === txtNation)[0] !== undefined ? arrCountry.filter(c => c[1] === txtNation)[0][0] : ''}
                      disabled
                    />
                  </Col>
                  <Col xl={6}>
                    <TextFieldGroup
                      field='txtNationCode'
                      label='Nation Code'
                      value={txtNationCode}
                      disabled
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xl={6}>
                    <TextFieldGroup
                      field='txtAddress'
                      label='Address'
                      value={txtAddress}
                      disabled
                    />
                  </Col>
                  <Col xl={6}>
                    <TextFieldGroup
                      field='txtResidentNum'
                      label='Resident'
                      value={txtResidentNum}
                      disabled
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xl={6}>
                    <TextFieldGroup
                      field='txtPhone'
                      label='Phone'
                      value={txtPhone}
                      disabled
                    />
                  </Col>
                  <Col xl={6}>
                    <TextFieldGroup
                      field='txtRole'
                      label='Role'
                      value={txtRole}
                      disabled
                    />
                  </Col>
                </Row>
                <Row />
                <br />
              </Form>
            </CardBody>
          </ModalBody>
          <ModalFooter>
            <Button color={'secondary'} onClick={this.hideModal}>{'Close'}</Button>
            <Button disabled={!this.state.isOK} color={'primary'} onClick={this.onCreateData}>{
              this.state.isLoading
                ? (<Spinner style={{ width: '1.2rem', height: '1.2rem' }} color='light' />)
                : (selectedEdit ? 'Edit' : 'Create')}</Button>
          </ModalFooter>
        </Modal>
        {getLength(arrData) === 0 ? ''
          : <MyPagination onChange={this.loadingInitial}
            defaultCurrent={1}
            pageSize={size}
            total={total}
          />}
      </div>
    )
  }
}

export default BookingHistrory
