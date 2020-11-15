import React, { PureComponent } from 'react'
import BaseAPI from '../../Controller/BaseAPI'

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
  Spinner,
  Form,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap'

import TextFieldGroup from '../Common/TextFieldGroup'
import { showAlert, generateId } from '../../common/function'

class Tour extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      isOpenModal: false,
      memberList: [],
      fileUpload: null,
      selectedEdit: null
    }
  }
  async componentDidMount () {
    this.loadingInitial()
  }

  loadingInitial = async () => {
    const resConfig = await BaseAPI.getData('config')
    const { companyConfig } = resConfig

    this.setState({
      memberList: companyConfig ? companyConfig.member : []
    })
  }

  // Basic CRUD with modal admin
  openCreate = () => {
    this.resetDataHeader()
    this.onOpenModal(true)
  }

  onHideModal = () => {
    this.resetDataHeader()
    this.onOpenModal(false)
  }

  resetDataHeader = () => {
    this.setState({ isLoading: false, txtRole: '', txtName: '', txtNumSort: '', txtImage: '', selectedEdit: null })
  }

  onOpenModal = (isOpenModal) => {
    this.setState({ isOpenModal })
  }

  onSelectFile = (fileUpload) => {
    this.setState({ fileUpload: fileUpload[0] })
  }

  onEdit = (file) => () => {
    this.setState({
      txtRole: file.role || '',
      txtName: file.name || '',
      txtNumSort: file.numSort || '',
      txtImage: file.image || '',
      selectedEdit: file
    }, () => {
      this.onOpenModal(true)
    })
  }

  onChangeValue = (e) => {
    let newValue = e.target.value

    this.setState({ [e.target.name]: newValue })
  }

  onCreateData = async () => {
    const { fileUpload, selectedEdit, txtRole, txtNumSort, txtName, txtImage, memberList } = this.state
    this.setState({ isLoading: true })

    const createData = async (newImage) => {
      let imageUpdate = newImage || txtImage
      let newData = memberList.slice()

      const addData = {
        id: generateId(),
        image: imageUpdate,
        role: txtRole,
        name: txtName,
        numSort: txtNumSort
      }
      if (!selectedEdit || newData.length === 0) {
        newData.push(addData)
      } else {
        const findExist = newData.findIndex(itm => itm.id === selectedEdit.id)
        if (findExist !== -1) {
          newData[findExist] = addData
        }
      }
      const res = await BaseAPI.updateConfig({ companyConfig: { member: newData } })
      if (res) {
        showAlert(`${selectedEdit ? 'Edit' : 'Create'} member succesfully`)
        this.onHideModal()
        this.loadingInitial()
      } else {
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

  onDelete=(itemData) => async () => {
    const { memberList } = this.state
    const newData = memberList.slice()
    const findIndex = newData.findIndex(item => item.id === itemData.id)
    if (findIndex !== -1) {
      newData.splice(findIndex, 1)
      await BaseAPI.updateConfig({ companyConfig: { member: newData } })
      this.loadingInitial()
    }
  }

  render () {
    const { selectedEdit, memberList } = this.state
    const column = [
      {
        dataField: 'image',
        text: 'Image',
        sort: true,
        formatter: (cell, row) => (
          <img alt="" src={cell} className={'img-news'} />
        )
      },
      {
        dataField: 'role',
        text: 'Role',
        sort: true
      },
      {
        dataField: 'name',
        text: 'Name',
        sort: true
      },
      {
        dataField: 'numSort',
        text: 'Sort number',
        sort: true
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
        text: 'Delete',
        formatter: (cell, row) => (
          <Button className={'btn_dark'} color={'success'} onClick={this.onDelete(row)}>{'Delete'}</Button>
        )
      }
    ]
    return (
      <div className='animated fadeIn'>
        <Row className='paddingTop'>
          <Col >
            <Card className={'borderBlack'}>
              <CardHeader className='darkBlueBg'>
                <i className='fa fa-align-justify' />{'Manage Company Member'}
              </CardHeader>
              <CardBody className='darkBlueBg'>
                <ToolkitProvider
                  keyField='_id'
                  data={memberList}
                  columns={column}
                  search
                >
                  {
                    props =>
                      (<div>
                        <div className={'row-search'}>
                          <Button onClick={this.openCreate} className={'btn-info search-btn'} color='info'>{'Create new Company Member'}</Button>{' '}
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
          <ModalHeader >{selectedEdit ? 'Edit company member' : 'Create new company member'}</ModalHeader>
          <ModalBody>

            <CardBody>
              <Form>
                <Row>
                  <Col xl={6}>
                    <TextFieldGroup
                      field='txtRole'
                      label='Role'
                      value={this.state.txtRole}
                      onChange={this.onChangeValue}
                    />
                  </Col>
                  <Col xl={6}>
                    <TextFieldGroup
                      field='txtName'
                      label='Name'
                      value={this.state.txtName}
                      onChange={this.onChangeValue}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xl={6}>
                    <TextFieldGroup
                      type={'number'}
                      field='txtNumSort'
                      label='Num sort'
                      value={this.state.txtNumSort}
                      onChange={this.onChangeValue}
                    />
                  </Col>
                </Row>
                {
                  selectedEdit && !this.state.fileUpload &&
                  <Row>
                    <Col key={selectedEdit.image} xl={6}>
                      <img alt="" src={selectedEdit.image} className={'img-news paddingBottom'} />
                    </Col>
                  </Row>
                }
              </Form>
            </CardBody>
            <ImageUploader
              fileContainerStyle={{ margin: 0, padding: 0 }}
              withIcon
              withPreview
              singleImage
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
            <Button color={'secondary'} onClick={this.onHideModal}>{'Close'}</Button>
            <Button disabled={this.state.isLoading} color={'primary'} onClick={this.onCreateData}>{
              this.state.isLoading
                ? (<Spinner style={{ width: '1.2rem', height: '1.2rem' }} color='light' />)
                : (selectedEdit ? 'Edit' : 'Create')}</Button>
          </ModalFooter>
        </Modal>

      </div>
    )
  }
}

export default Tour
