import React, { PureComponent } from 'react'
import BaseAPI from '../../Controller/BaseAPI'
import {  categoryList, typeSortTour } from '../../common/constants'

import ImageUploader from 'react-images-upload'
import filterFactory from 'react-bootstrap-table2-filter'
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit'
import BootstrapTable from 'react-bootstrap-table-next'
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Form,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap'

import TextDropdown from '../Common/TextDropdown'
import TextFieldGroup from '../Common/TextFieldGroup'
import TextArea from '../Common/TextArea'
import { showAlert, convertDateMoment, getLength } from '../../common/function'
import { confirmAlert } from 'react-confirm-alert'
import MyPagination from '../../containers/MyPagination'
import { Link } from 'react-router-dom'
var _ = require('lodash')

const { SearchBar, ClearSearchButton } = Search

class Tour extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      txtSortValue: 'Title',
      location: null,
      arrData: [],
      total: 0,
      size: 15,
      txtCategory: '',
      txtTitle: '',
      txtCreatedUser: '',
      txtCategoryParent: '',
      txtTitleVI: '',
      txtDescriptionEN: '',
      txtDescriptionVI: '',
      fileUpload: null,
      selectedEdit: null
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
      `tour?size=${size}&page=${page}`
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
              const res = await BaseAPI.deleteData({ isActive: false, id: row._id }, 'tour')
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
      const res = await BaseAPI.deleteData({ isActive: true, id: row._id }, 'tour')
      if (res) {
        showAlert('Active successfully')
        this.updateData(res)
      } else {
        showAlert('Something goes wrong. Please try again.')
      }
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
        return _.get(a, typeSortTour[txtSortValue]) >= _.get(b, typeSortTour[txtSortValue]) ? 1 : -1
      })
    } else {
      newData.sort((a, b) => {
        return _.get(a, typeSortTour[txtSortValue]) <= _.get(b, typeSortTour[txtSortValue]) ? 1 : -1
      })
    }
    this.setState({ arrData: newData })
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
    let newValue = e.target.value

    this.setState({ [e.target.name]: newValue }, () => {
      this.checkOpenInfo()
    })
    console.log(this.state)
  }

  checkOpenInfo = () => {
    const {  txtTitle, txtTitleVI } = this.state
    if (txtTitle !== '' || txtTitleVI !== '') {
      this.setState({ isOK: true })
    } else {
      this.setState({ isOK: false })
    }
  }

  resetData = () => {
    this.setState({
      isOK: false,
      txtCreatedUser: '',
      txtCategoryParent: '',
      selectedEdit: null,
      txtCategory: '',
      txtTitle: '',
      txtTitleVI: '',
      txtDescriptionEN: '',
      txtDescriptionVI: '',
      fileUpload: null
    }, () => {
      this.checkOpenInfo()
    })
  }

  openCreate = () => {
    this.showModal()
    this.resetData()
  }

  onSelectFile = (fileUpload) => {
    console.log(fileUpload)

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

  onEdit = (file) => () => {
    this.setState({
      txtCreatedUser: file.createdUser,
      txtCategoryParent: file.categoryParent,
      txtCategory: file.type,
      txtTitle: file.title['en'],
      txtTitleVI: file.title['vi'],
      txtDescriptionEN: file.description['en'],
      txtDescriptionVI: file.description['vi'],
      selectedEdit: file,
      txtImage: file.image
    }, () => {
      this.showModal()
      this.checkOpenInfo()
    })
  }

  genObjectLang = (en, vi) => {
    return { en, vi }
  }

  onCreateData = async () => {
    const { fileUpload, selectedEdit, txtCreatedUser, txtTitle, txtTitleVI, txtDescriptionEN, txtImage, txtDescriptionVI } = this.state
    const createData = async (newImage) => {
      let imageUpdate = newImage || txtImage

      const body = {
        createdUser: txtCreatedUser,
        title: this.genObjectLang(txtTitle, txtTitleVI),
        description: this.genObjectLang(txtDescriptionEN, txtDescriptionVI),
        image: imageUpdate
      }

      if (selectedEdit) {
        body.id = selectedEdit._id
      }

      const res = await BaseAPI[selectedEdit ? 'putUpdateData' : 'postCreateData'](body, 'tour')
      if (res) {
        showAlert(`${selectedEdit ? 'Edit' : 'Create'} succesfully`)
        this.hideModal()
        this.loadingInitial()
      } else {
        console.log(res)
        showAlert('Something goes wrong. Please try again.')
      }
    }

    if (fileUpload) {
      const urlImage = await BaseAPI.uploadImage(fileUpload)
      createData(urlImage)
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
    const { arrData, total, size, selectedEdit, fileUpload } = this.state

    const column = [{
      dataField: 'title',
      text: 'Title',
      formatter: (cell, row) => (
        <div className={'txt-content'}>
          {cell['en']}
        </div>
      )
    },
    {
      dataField: 'description',
      text: 'Description',
      formatter: (cell, row) => (
        <div className={'txt-content'}>
          {cell['en']}
        </div>
      )
    },
    {
      dataField: 'subDescription',
      text: 'Sub Description',
      formatter: (cell, row) => (
        <div className={'txt-content'}>
          {cell['en']}
        </div>
      )
    },
    {
      dataField: 'tourInfoList',
      text: 'Location',
      formatter: (cell, row) => (
        <div>
          {cell.location}
        </div>
      )
    },
    {
      dataField: 'tourInfoList',
      text: 'Start Day',
      formatter: (cell, row) => {
        return (
          <div>
            {convertDateMoment(cell.bestDuration.from, 'DD/MM/YYYY')}
          </div>
        )
      }
    },
    {
      dataField: 'tourInfoList',
      text: 'End Day',
      formatter: (cell, row) => {
        return (
          <div>
            {convertDateMoment(cell.bestDuration.to, 'DD/MM/YYYY')}
          </div>
        )
      }
    },
    {
      dataField: 'image',
      text: 'Image',
      formatter: (cell, row) => (
        <img alt="" src={cell[0].image} className={'img-news'} />
      )
    },
    {
      dataField: 'symbol',
      text: 'Edit',
      formatter: (cell, row) => (
        <Link to={`/tourcreate/${row._id}`}>
          <Button className={'btn_dark'} color={'success'} onClick={this.onEdit(row)}>{'Edit'}</Button>
        </Link>
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
                <i className='fa fa-align-justify' />{'Manage List Tour'}
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
                        <h3>{'Find Tour'}</h3>
                        <SearchBar className={'darkBlueInput'} placeholder={'Enter your search string ...'} {...props.searchProps} />
                        <div className={'row-search'}>
                          <ClearSearchButton className={'btn-info search-btn'} text={'Clear result'} color='info' {...props.searchProps} />
                          {/* <Button onClick={this.openCreate} className={'btn-info search-btn'} color='info'>{'Create new Tour'}</Button>{' '} */}
                          <Link to='/tourcreate'>
                            <Button className={'btn-info search-btn'} color='info'>{'Create new Tour'}</Button>
                          </Link>
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
                                arrOption={['Title', 'Description', 'Sub Description', 'Location', 'Start Day', 'End Day', 'Is Active']}
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
          <ModalHeader >{selectedEdit ? 'Edit Category' : 'Create new Tour'}</ModalHeader>
          <ModalBody>

            <CardBody>
              <Form>
                <Row>
                  <Col xl={6}>
                    <TextFieldGroup
                      field='txtTitle'
                      label='Title EN'
                      value={this.state.txtTitle}
                      onChange={this.onChangeValue}
                    />
                  </Col>
                  <Col xl={6}>
                    <TextFieldGroup
                      field='txtTitleVI'
                      label='Title VI'
                      value={this.state.txtTitleVI}
                      onChange={this.onChangeValue}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col xl={6}>
                    <TextArea
                      field='txtDescriptionEN'
                      label='Description EN'
                      value={this.state.txtDescriptionEN}
                      rows='5'
                      onChange={this.onChangeValue}
                    />
                  </Col>
                  <Col xl={6}>
                    <TextArea
                      field='txtDescriptionVI'
                      label='Description VI'
                      value={this.state.txtDescriptionVI}
                      rows='5'
                      onChange={this.onChangeValue}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xl={6}>
                    <TextFieldGroup
                      field='txtCreatedUser'
                      label='Created User'
                      isNumber
                      value={this.state.txtCreatedUser}
                      onChange={this.onChangeValue}
                    />
                  </Col>
                </Row>
                <br />
                {
                  selectedEdit && !fileUpload &&
                  <Row>
                    {selectedEdit.image.map(itm => {
                      return (
                        <Col key={itm} xl={6}>
                          <img alt="" src={itm} className={'img-news paddingBottom'} />
                        </Col>
                      )
                    }
                    )}
                  </Row>
                }
              </Form>
            </CardBody>

            <ImageUploader
              fileContainerStyle={{ margin: 0, padding: 0 }}
              withIcon
              withPreview
              fileSizeError={'File size too large'}
              fileTypeError={'This file format is not supported'}
              label={'Maximum upload size is 10mb, requires JPG-PNG-JPEG selected'}
              buttonText={'Choose your image'}
              onChange={this.onSelectFile}
              imgExtension={['.jpg', '.jpeg', '.png']}
              maxFileSize={10242880}
            />

          </ModalBody>
          <ModalFooter>
            <Button color={'secondary'} onClick={this.hideModal}>{'Close'}</Button>
            <Button disabled={!this.state.isOK} color={'primary'} onClick={this.onCreateData}>{selectedEdit ? 'Edit' : 'Create'}</Button>
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

export default Tour
