import React, { PureComponent } from 'react'
import BaseAPI from '../../Controller/BaseAPI'
import { categoryList, typeSortTourGal } from '../../common/constants'

import MyPaginationn from '../../containers/MyPagination'
import { IoIosCloseCircle } from 'react-icons/io'
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
  Spinner,
  ModalFooter
} from 'reactstrap'

import TextDropdown from '../Common/TextDropdown'
import TextFieldGroup from '../Common/TextFieldGroup'
import TextArea from '../Common/TextArea'
import { showAlert, getLength } from '../../common/function'
import { confirmAlert } from 'react-confirm-alert'
const { SearchBar, ClearSearchButton } = Search
var _ = require('lodash')

class TourGallery extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      txtSortValue: 'Title',
      total: 0,
      location: null,
      arrData: [],
      txtCategory: '',
      txtTitle: '',
      arrDelete: [],
      txtCreatedUser: '',
      txtCategoryParent: '',
      txtTitleVI: '',
      txtTitleCN: '',
      txtTitleJA: '',
      txtDescriptionEN: '',
      txtDescriptionVI: '',
      txtDescriptionJA: '',
      txtDescriptionCN: '',
      fileUpload: null,
      size: 15,
      selectedEdit: null
    }
  }
  async componentDidMount () {
    this.loadingInitial(1)
  }

  loadingInitial = async (page) => {
    window.scrollTo(0, window.innerHeight)
    const { size } = this.state
    const response = await BaseAPI.getData(
      `tourgallery/all?size=${size}&page=${page}`
    )
    this.setState({ arrData: response.data, total: response.total })
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
              const res = await BaseAPI.deleteData({ isActive: false, id: row._id }, 'tourgallery')
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
      const res = await BaseAPI.deleteData({ isActive: true, id: row._id }, 'tourgallery')
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
        console.log(_.get(a, typeSortTourGal[txtSortValue]) , _.get(b, typeSortTourGal[txtSortValue]))
        return _.get(a, typeSortTourGal[txtSortValue]) >= _.get(b, typeSortTourGal[txtSortValue]) ? 1 : -1
      })
    } else {
      newData.sort((a, b) => {
        return _.get(a, typeSortTourGal[txtSortValue]) <= _.get(b, typeSortTourGal[txtSortValue]) ? 1 : -1
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
    const { txtTitle, txtTitleVI, txtTitleJA, txtTitleCN } = this.state
    if (txtTitle !== '' || txtTitleVI !== '' || txtTitleJA !== '' || txtTitleCN !== '') {
      this.setState({ isOK: true })
    } else {
      this.setState({ isOK: false })
    }
  }

  resetData = () => {
    this.setState({
      isOK: false,
      arrDelete: [],
      txtCreatedUser: '',
      txtCategoryParent: '',
      selectedEdit: null,
      txtCategory: '',
      txtTitle: '',
      txtTitleVI: '',
      txtTitleCN: '',
      txtTitleJA: '',
      txtDescriptionEN: '',
      txtDescriptionVI: '',
      txtDescriptionJA: '',
      txtDescriptionCN: '',
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
    this.setState({ isLoading: false, isOpenModal: false })
    this.resetData()
  }

  onChangeType = (isNormal) => () => {
    this.setState({ isNormal }, () => {
      this.checkOpenInfo()
    })
  }

  onEdit = (file) => () => {
    this.setState({
      arrDelete: [],
      txtCreatedUser: file.createdUser,
      txtCategoryParent: file.categoryParent,
      txtCategory: file.type,
      txtTitle: file.title['en'],
      txtTitleVI: file.title['vi'],
      txtTitleJA: file.title['ja'],
      txtTitleCN: file.title['cn'],
      txtDescriptionEN: file.description['en'],
      txtDescriptionVI: file.description['vi'],
      txtDescriptionJA: file.description['ja'],
      txtDescriptionCN: file.description['cn'],
      selectedEdit: file,
      txtImage: file.image
    }, () => {
      this.showModal()
      this.checkOpenInfo()
    })
  }

  genObjectLang = (en, vi, ja, cn) => {
    return { en, vi, ja, cn }
  }

  onRemove = (index) => () => {
    const newList = this.state.arrDelete.slice()
    if (!newList.includes(index)) {
      newList.push(index)
    }
    this.setState({ arrDelete: newList })
  }

  onCreateData = async () => {
    const { fileUpload, selectedEdit, arrDelete, txtCreatedUser, txtTitle, txtTitleVI, txtTitleJA, txtTitleCN, txtDescriptionEN, txtDescriptionJA, txtDescriptionVI, txtDescriptionCN, txtImage } = this.state
    this.setState({ isLoading: true })
    const createData = async (newImage) => {
      let imageUpdate = newImage || txtImage

      if (selectedEdit && getLength(arrDelete) > 0) {
        imageUpdate = txtImage.filter((data, index) => {
          return !arrDelete.includes(index)
        })
      }

      const body = {
        createdUser: txtCreatedUser,
        title: this.genObjectLang(txtTitle, txtTitleVI, txtTitleJA, txtTitleCN),
        description: this.genObjectLang(txtDescriptionEN, txtDescriptionVI, txtDescriptionJA, txtDescriptionCN),
        image: imageUpdate
      }
      console.log(body.description)

      if (selectedEdit) {
        body.id = selectedEdit._id
      }

      const res = await BaseAPI[selectedEdit ? 'putUpdateData' : 'postCreateData'](body, 'tourgallery')
      if (res) {
        showAlert(`${selectedEdit ? 'Edit' : 'Create'} succesfully`)
        this.hideModal()
        this.updateData(res)
      } else {
        console.log(res)
        showAlert('Something goes wrong. Please try again.')
      }
    }

    if (fileUpload) {
      const promise = fileUpload.map(async (item) => {
        const urlImage = await BaseAPI.uploadImage(item)
        return urlImage
      })

      const urlImage = await Promise.all(promise)
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
    const { arrData, selectedEdit, fileUpload, arrDelete } = this.state
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
      dataField: 'createdUser',
      text: 'User',
      formatter: (cell, row) => (
        <div>
          {cell}
        </div>
      )
    },
    {
      dataField: 'image',
      text: 'Image',
      sort: true,
      formatter: (cell, row) => (
        <img alt="" src={cell[0]} className={'img-news'} />
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
                <i className='fa fa-align-justify' />{'Manage List Tour Gallary'}
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
                        <h3>{'Find Tour Gallery'}</h3>
                        <SearchBar className={'darkBlueInput'} placeholder={'Enter your search string ...'} {...props.searchProps} />
                        <div className={'row-search'}>
                          <ClearSearchButton className={'btn-info search-btn'} text={'Clear result'} color='info' {...props.searchProps} />
                          <Button onClick={this.openCreate} className={'btn-info search-btn'} color='info'>{'Create new Tour'}</Button>{' '}
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
                                arrOption={['Title', 'Description', 'User', 'Is Active']}
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
                      field='txtTitleJA'
                      label='Title JA'
                      value={this.state.txtTitleJA}
                      onChange={this.onChangeValue}
                    />
                  </Col>
                  <Col xl={6}>
                    <TextFieldGroup
                      field='txtTitleCN'
                      label='Title CN'
                      value={this.state.txtTitleCN}
                      onChange={this.onChangeValue}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xl={6}>
                    <TextArea
                      field='txtDescriptionJA'
                      label='Description JA'
                      value={this.state.txtDescriptionJA}
                      rows='5'
                      onChange={this.onChangeValue}
                    />
                  </Col>
                  <Col xl={6}>
                    <TextArea
                      field='txtDescriptionCN'
                      label='Description Cn'
                      value={this.state.txtDescriptionCN}
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
                    {selectedEdit.image.map((itm, idx) => {
                      if (arrDelete.includes(idx)) {
                        return null
                      } else {
                        return (
                          <div onClick={this.onRemove(idx)} style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'center'
                          }} key={itm}>
                            <Col xl={6}>
                              <img alt="" src={itm} className={'img-news paddingBottom'} />
                              <IoIosCloseCircle className={'close-icon'} />
                            </Col>
                          </div>
                        )
                      }
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
              maxFileSize={30242880}
            />

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
          : <MyPaginationn onChange={this.loadingInitial}
            defaultCurrent={1}
            total={this.state.total}
          />}
      </div>
    )
  }
}

export default TourGallery
