import React, { PureComponent } from 'react'
import BaseAPI from '../../Controller/BaseAPI'
import { categoryList, sexType, arrCountry, typeSortUser } from '../../common/constants'

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
  Form
} from 'reactstrap'

import ViewDetailComponent from './ViewDetailComponent'
import { showAlert, getLength } from '../../common/function'
import TextFieldGroup from '../Common/TextFieldGroup'
import TextDropdown from '../Common/TextDropdown'
import { confirmAlert } from 'react-confirm-alert'
import MyPagination from '../../containers/MyPagination'

const { SearchBar, ClearSearchButton } = Search

class ListUser extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      txtSortValue: 'Email',
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
      total: 0,
      size: 15

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
      `user?size=${size}&page=${page}`
    )
    const { data, total } = response
    this.setState({ total, arrData: data })
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
              const res = await BaseAPI.deleteData({ isActive: false, id: row._id }, 'user')
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
      const res = await BaseAPI.deleteData({ isActive: true, id: row._id }, 'user')
      if (res) {
        showAlert('Active successfully')
        this.updateData(res)
      } else {
        showAlert('Something goes wrong. Please try again.')
      }
    }
  }

  updateData = (res) => {
    const newList = this.state.arrData.slice()
    const newIndex = newList.findIndex(itm => itm._id === res._id)
    if (newIndex !== -1) {
      newList[newIndex] = res
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

  onChangeValueSort = (e) => {
    const name = e.target.name
    const value = e.target.value
    this.setState({
      [name]: value
    })
  }

  onSort = (isSort) => () => {
    const { txtSortValue, arrData } = this.state
    const newData = arrData.slice()
    if (isSort === true) {
      newData.sort((a, b) => {
        return a[`${typeSortUser[txtSortValue]}`] >= b[typeSortUser[txtSortValue]] ? 1 : -1
      })
      this.setState({ arrData: newData })
    } else {
      newData.sort((a, b) => {
        return a[typeSortUser[txtSortValue]] <= b[typeSortUser[txtSortValue]] ? 1 : -1
      })
      this.setState({ arrData: newData })
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
    this.setState({
      isViewDetail: true,
      idUserDetail: file.id
    }, () => {
      this.showModal()
      this.checkOpenInfo()
    })
  }

  onEdit = (file) => () => {
    const arrNation = arrCountry.map((value, index) => {
      return value[0]
    })
    let arrNationCode = []
    if (file.nation !== '') {
      const nationCode = arrCountry.filter(c => c[1] === file.nation)
      arrNationCode = (typeof nationCode[0][nationCode[0].length - 1]) === 'object' ? [...nationCode[0][nationCode[0].length - 1]] : [nationCode[0][nationCode[0].length - 1]]
    }
    this.setState({
      txtEmail: file.email,
      txtFirstName: file.firstName,
      txtLastName: file.lastName,
      txtImage: file.image,
      isSex: file.sex,
      txtResidentNum: file.residentNum,
      txtPhone: file.phone,
      txtAddress: file.address,
      txtPassword: file.password,
      txtRole: file.role,
      txtNation: file.nation,
      txtNationCode: file.nationCode,
      selectedEdit: file,
      arrNation,
      arrNationCode,
      isViewDetail: false
    }, () => {
      this.showModal()
      this.checkOpenInfo()
    })
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
      txtNation, isSex, txtResidentNum, txtPhone, txtAddress, txtRole, txtNationCode, arrNationCode, arrNation, isViewDetail, idUserDetail } = this.state
    const column = [{
      dataField: 'email',
      text: 'Email',
      formatter: (cell, row) => (
        <div>
          {cell}
        </div>
      )
    },
    {
      dataField: 'firstName',
      text: 'First Name',
      formatter: (cell, row) => (
        <div>
          {cell}
        </div>
      )
    },
    {
      dataField: 'lastName',
      text: 'Last Name',
      formatter: (cell, row) => (
        <div>
          {cell}
        </div>
      )
    },
    {
      dataField: 'sex',
      text: 'Sex',
      formatter: (cell, row) => (
        <div>
          {cell ? 'Female' : 'Male'}
        </div>
      )
    },
    {
      dataField: 'phone',
      text: 'Phone',
      formatter: (cell, row) => (
        <div>
          {cell}
        </div>
      )
    },
    {
      dataField: 'address',
      text: 'Address',
      formatter: (cell, row) => (
        <div>
          {cell}
        </div>
      )
    },
    {
      dataField: 'role',
      text: 'Role',
      formatter: (cell, row) => (
        <div>
          {cell}
        </div>
      )
    },
    {
      dataField: 'symbol',
      text: 'Edit',
      formatter: (cell, row) => (
        <Button className={'btn_dark'} color={'success'} onClick={this.onEdit(row)}>{'Edit'}</Button>
      )
    },
    {
      dataField: 'symbol',
      text: 'Tour Booking',
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
                <i className='fa fa-align-justify' />{'Manage List User'}
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
                        <h3>{'Find User'}</h3>
                        <SearchBar className={'darkBlueInput'} placeholder={'Enter your search string ...'} {...props.searchProps} />
                        <div className={'row-search'}>
                          <ClearSearchButton className={'btn-info search-btn'} text={'Clear result'} color='info' {...props.searchProps} />
                        </div>
                        <hr />
                        <div>
                          <Row>
                            <Col>
                              <TextDropdown
                                field='txtSortValue'
                                label='Sort'
                                value={this.state.txtSortValue}
                                onChange={this.onChangeValueSort}
                                arrOption={['Email', 'First Name', 'Last Name', 'Sex', 'Phone', 'Address', 'Role', 'Is Active']}
                              />
                            </Col>
                            <Col style={{ marginTop: '15px' }}>
                              <Button onClick={this.onSort(true)} className={'btn-info search-btn'} color='info'>{`Ascending`}</Button>{' '}
                              <Button onClick={this.onSort(false)} className={'btn-info search-btn'} color='info'>{'Decending'}</Button>{' '}
                            </Col>
                          </Row>

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
          <ModalHeader >{selectedEdit ? 'Edit User' : 'View Detail'}</ModalHeader>
          <ModalBody>
            {
              isViewDetail ? <ViewDetailComponent id={idUserDetail} /> : (
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
                          onChange={this.onChangeValue}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xl={6}>
                        <TextFieldGroup
                          field='txtLastName'
                          label='Last Name'
                          value={txtLastName}
                          onChange={this.onChangeValue}
                        />
                      </Col>
                      <Col xl={6}>
                        <TextDropdown
                          field='isSex'
                          label='Sex'
                          value={isSex ? 'Female' : 'Male'}
                          onChange={this.onChangeValue}
                          arrOption={['Male', 'Female']}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xl={6}>
                        <TextDropdown
                          field='txtNation'
                          label='Nation'
                          value={arrCountry.filter(c => c[1] === txtNation)[0] !== undefined ? arrCountry.filter(c => c[1] === txtNation)[0][0] : ''}
                          onChange={this.onChangeValue}
                          arrOption={arrNation}
                        />
                      </Col>
                      <Col xl={6}>
                        <TextDropdown
                          field='txtNationCode'
                          label='Nation Code'
                          value={txtNationCode}
                          arrOption={arrNationCode}
                          onChange={this.onChangeValue}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xl={6}>
                        <TextFieldGroup
                          field='txtAddress'
                          label='Address'
                          value={txtAddress}
                          onChange={this.onChangeValue}
                        />
                      </Col>
                      <Col xl={6}>
                        <TextFieldGroup
                          field='txtResidentNum'
                          label='Resident'
                          value={txtResidentNum}
                          onChange={this.onChangeValue}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xl={6}>
                        <TextFieldGroup
                          field='txtPhone'
                          label='Phone'
                          value={txtPhone}
                          onChange={this.onChangeValue}
                        />
                      </Col>
                      <Col xl={6}>
                        <TextDropdown
                          field='txtRole'
                          label='Role'
                          value={txtRole}
                          onChange={this.onChangeValue}
                          arrOption={['admin', 'member']}
                        />
                      </Col>
                    </Row>
                    <Row />
                    <br />
                  </Form>
                </CardBody>
              )
            }
          </ModalBody>
          <ModalFooter>
            <Button color={'secondary'} onClick={this.hideModal}>{'Close'}</Button>
            {
              isViewDetail ? '' : <Button disabled={!this.state.isOK} color={'primary'} onClick={this.onCreateData}>{selectedEdit ? 'Edit' : 'Create'}</Button>
            }
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

export default ListUser
