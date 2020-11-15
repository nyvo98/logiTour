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
  Form,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap'

import TextFieldGroup from '../Common/TextFieldGroup'
import TextArea from '../Common/TextArea'
import { showAlert, getLength, generateId, genObjectLang } from '../../common/function'

class Tour extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      termOfServices: { vi: '', en: '', cn: '', ja: '' },
      headerConfig: [],
      languageConfig: [],
      precautionConfig: { vi: '', en: '', cn: '', ja: '' },
      fileUpload: null,
      selectedEdit: null
    }
  }
  async componentDidMount () {
    this.loadingInitial()
  }

  loadingInitial = async () => {
    const resConfig = await BaseAPI.getData('config')
    const { termOfService, headerConfig, aboutUs, languageConfig, precautionConfig } = resConfig

    const newTerm = termOfService || { vi: '', en: '', cn: '', ja: '' }
    const newPre = precautionConfig || { vi: '', en: '', cn: '', ja: '' }

    this.setState({
      txtContentEN: newTerm.en,
      txtContentVI: newTerm.vi,
      txtContentJA: newTerm.ja,
      txtContentCN: newTerm.cn,
      txtContentPreEN: newPre.en,
      txtContentPreVI: newPre.vi,
      txtContentPreJA: newPre.ja,
      txtContentPreCN: newPre.cn,
      headerConfig: headerConfig || [],
      aboutUs: aboutUs || {},
      languageConfig: languageConfig || []
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
    this.setState({ txtTitleEN: '', txtTitleVI: '', txtTitleJA: '', txtTitleCN: '', txtSubTitleVI: '', txtSubTitleEN: '', txtSubTitleJA: '', txtSubTitleCN: '', txtKey: '', fileUpload: null, selectedEdit: null })
  }

  onOpenModal = (isOpenModal) => {
    this.setState({ isOpenModal })
  }

  onSelectFile = (fileUpload) => {
    this.setState({ fileUpload: fileUpload[0] })
  }

  onEdit = (file) => () => {
    this.setState({
      txtKey: file.key,
      txtTitleEN: file.title ? file.title.en : '',
      txtTitleVI: file.title ? file.title.vi : '',
      txtTitleJA: file.title ? file.title.ja : '',
      txtTitleCN: file.title ? file.title.cn : '',
      txtSubTitleEN: file.subTitle ? file.subTitle.en : '',
      txtSubTitleVI: file.subTitle ? file.subTitle.vi : '',
      txtSubTitleJA: file.subTitle ? file.subTitle.ja : '',
      txtSubTitleCN: file.subTitle ? file.subTitle.cn : '',
      selectedEdit: file,
      txtImage: file.image
    }, () => {
      this.onOpenModal(true)
    })
  }

  onOrderLanguage = (langName) => () => {
    const { languageConfig } = this.state
    const newList = languageConfig.slice()
    const index = newList.indexOf(langName)
    if (index !== -1) {
      newList.splice(index, 1)
    } else {
      newList.push(langName)
    }
    this.setState({
      languageConfig: newList
    })
    console.log(this.state.languageConfig)
  }

  onChangeValue = (e) => {
    let newValue = e.target.value

    this.setState({ [e.target.name]: newValue })
  }

  onSaveLanguage = async () => {
    const { languageConfig } = this.state
    console.log(languageConfig)
    const payload = await BaseAPI.updateConfig({ languageConfig })
    if (payload) {
      showAlert(`Save Config succesfully`)
    } else {
      showAlert('Something goes wrong. Please try again.')
    }
  }

  onSaveTerm = async () => {
    const { txtContentEN, txtContentVI, txtContentJA, txtContentCN } = this.state
    const payload = await BaseAPI.updateConfig({ termOfService: { vi: txtContentVI, en: txtContentEN, cn: txtContentCN, ja: txtContentJA } })
    if (payload) {
      showAlert(`Save Config succesfully`)
    } else {
      showAlert('Something goes wrong. Please try again.')
    }
  }

  onSavePre = async () => {
    const { txtContentPreEN, txtContentPreVI, txtContentPreJA, txtContentPreCN } = this.state
    const payload = await BaseAPI.updateConfig({ precautionConfig: { vi: txtContentPreVI, en: txtContentPreEN, cn: txtContentPreCN, ja: txtContentPreJA } })
    if (payload) {
      showAlert(`Save Config succesfully`)
    } else {
      showAlert('Something goes wrong. Please try again.')
    }
  }

  onCreateDataHeader = async () => {
    const { fileUpload, selectedEdit, txtTitleEN, txtTitleVI, txtTitleJA, txtTitleCN, txtSubTitleEN, txtSubTitleVI, txtSubTitleJA, txtSubTitleCN, txtKey, txtImage, headerConfig } = this.state

    const createData = async (newImage) => {
      let imageUpdate = newImage || txtImage
      let newData = headerConfig.slice()

      const bannerData = {
        id: generateId(),
        image: imageUpdate,
        key: txtKey,
        title: genObjectLang(txtTitleEN, txtTitleVI, txtTitleJA, txtTitleCN),
        subTitle: genObjectLang(txtSubTitleEN, txtSubTitleVI, txtSubTitleJA, txtSubTitleCN)
      }
      if (!selectedEdit || newData.length === 0) {
        newData.push(bannerData)
      } else {
        const findExist = newData.findIndex(itm => itm.id === selectedEdit.id)
        if (findExist !== -1) {
          newData[findExist] = bannerData
        }
      }
      const res = await BaseAPI.updateConfig({ headerConfig: newData })
      if (res) {
        showAlert(`${selectedEdit ? 'Edit' : 'Create'} Header succesfully`)
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

  render () {
    const { selectedEdit, fileUpload, headerConfig, languageConfig } = this.state
    const column = [{
      dataField: 'key',
      text: 'Key',
      sort: true
    },
    {
      dataField: 'title',
      text: 'Title',
      sort: true,
      formatter: (cell, row) => (
        <div>
          {cell ? cell['en'] : ''}
        </div>
      )
    },
    {
      dataField: 'subTitle',
      text: 'Sub Title',
      sort: true,
      formatter: (cell, row) => (
        <div>
          {cell ? cell['en'] : ''}
        </div>
      )
    },
    {
      dataField: 'image',
      text: 'Image',
      sort: true,
      formatter: (cell, row) => (
        <img alt="" src={cell} className={'img-news'} />
      )
    },
    {
      dataField: 'symbol',
      text: 'Edit',
      formatter: (cell, row) => (
        <Button className={'btn_dark'} color={'success'} onClick={this.onEdit(row)}>{'Edit'}</Button>
      )
    }]
    return (
      <div className='animated fadeIn'>
        <Row className='paddingTop'>
          <Col >
            <Card className={'borderBlack'}>
              <CardHeader className='darkBlueBg'>
                <i className='fa fa-align-justify' />{'Precautions For Reservation Config'}
              </CardHeader>
              <CardBody className='darkBlueBg'>
                <Row>
                  <Col xl={6}>
                    <TextArea
                      field='txtContentPreEN'
                      label='English'
                      value={this.state.txtContentPreEN}
                      rows='5'
                      onChange={this.onChangeValue}
                    />
                  </Col>
                  <Col xl={6}>
                    <TextArea
                      field='txtContentPreVI'
                      label='Vietnamese'
                      value={this.state.txtContentPreVI}
                      rows='5'
                      onChange={this.onChangeValue}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col xl={6}>
                    <TextArea
                      field='txtContentPreJA'
                      label='Japanese'
                      value={this.state.txtContentPreJA}
                      rows='5'
                      onChange={this.onChangeValue}
                    />
                  </Col>
                  <Col xl={6}>
                    <TextArea
                      field='txtContentPreCN'
                      label='Chinese'
                      value={this.state.txtContentPreCN}
                      rows='5'
                      onChange={this.onChangeValue}
                    />
                  </Col>
                </Row>

                <Button onClick={this.onSavePre} className={'btn-info search-btn'} color='info'>Save</Button>
              </CardBody>
            </Card>
            <Card className={'borderBlack'}>
              <CardHeader className='darkBlueBg'>
                <i className='fa fa-align-justify' />{'Terms and conditions Config'}
              </CardHeader>
              <CardBody className='darkBlueBg'>
                <Row>
                  <Col xl={6}>
                    <TextArea
                      field='txtContentEN'
                      label='English'
                      value={this.state.txtContentEN}
                      rows='5'
                      onChange={this.onChangeValue}
                    />
                  </Col>
                  <Col xl={6}>
                    <TextArea
                      field='txtContentVI'
                      label='Vietnamese'
                      value={this.state.txtContentVI}
                      rows='5'
                      onChange={this.onChangeValue}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col xl={6}>
                    <TextArea
                      field='txtContentJA'
                      label='Japanese'
                      value={this.state.txtContentJA}
                      rows='5'
                      onChange={this.onChangeValue}
                    />
                  </Col>
                  <Col xl={6}>
                    <TextArea
                      field='txtContentCN'
                      label='Chinese'
                      value={this.state.txtContentCN}
                      rows='5'
                      onChange={this.onChangeValue}
                    />
                  </Col>
                </Row>

                <Button onClick={this.onSaveTerm} className={'btn-info search-btn'} color='info'>Save</Button>
              </CardBody>
            </Card>
            <Card className={'borderBlack'}>
              <CardHeader className='darkBlueBg'>
                <i className='fa fa-align-justify' />{'Other config'}
              </CardHeader>
              <CardBody className='darkBlueBg'>
                <label><input key={1} type='checkbox' name='dapp_show' onChange={this.onOrderLanguage('cn')} checked={languageConfig.includes('cn')} />  China</label>
                <br />
                <label><input key={1} type='checkbox' name='dapp_show' onChange={this.onOrderLanguage('en')} checked={languageConfig.includes('en')} />  United State Of American</label>
                <br />
                <label><input key={1} type='checkbox' name='dapp_show' onChange={this.onOrderLanguage('ja')} checked={languageConfig.includes('ja')} />  Korean</label>
                <br />
                <label><input key={1} type='checkbox' name='dapp_show' onChange={this.onOrderLanguage('vi')} checked={languageConfig.includes('vi')} />  VietNam</label>
                <br />
                <Button onClick={this.onSaveLanguage} className={'btn-info search-btn'} color='info'>Save</Button>
              </CardBody>
            </Card>
            <Card className={'borderBlack'}>
              <CardHeader className='darkBlueBg'>
                <i className='fa fa-align-justify' />{'Manage Header'}
              </CardHeader>
              <CardBody className='darkBlueBg'>
                <ToolkitProvider
                  keyField='_id'
                  data={headerConfig}
                  columns={column}
                  search
                >
                  {
                    props =>
                      (<div>
                        <div className={'row-search'}>
                          <Button onClick={this.openCreate} className={'btn-info search-btn'} color='info'>{'Create new header'}</Button>{' '}
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
          <ModalHeader >{selectedEdit ? 'Edit Header' : 'Create new header'}</ModalHeader>
          <ModalBody>

            <CardBody>
              <Form>
                <Row>
                  <Col xl={6}>
                    <TextFieldGroup
                      field='txtKey'
                      label='Key'
                      value={this.state.txtKey}
                      onChange={this.onChangeValue}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col xl={6}>
                    <TextFieldGroup
                      field='txtTitleEN'
                      label='Title EN'
                      value={this.state.txtTitleEN}
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
                    <TextFieldGroup
                      field='txtSubTitleEN'
                      label='Sub title EN'
                      value={this.state.txtSubTitleEN}
                      onChange={this.onChangeValue}
                    />
                  </Col>
                  <Col xl={6}>
                    <TextFieldGroup
                      field='txtSubTitleVI'
                      label='Sub title VI'
                      value={this.state.txtSubTitleVI}
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
                    <TextFieldGroup
                      field='txtSubTitleJA'
                      label='Sub title JA'
                      value={this.state.txtSubTitleJA}
                      onChange={this.onChangeValue}
                    />
                  </Col>
                  <Col xl={6}>
                    <TextFieldGroup
                      field='txtSubTitleCN'
                      label='Sub title CN'
                      value={this.state.txtSubTitleCN}
                      onChange={this.onChangeValue}
                    />
                  </Col>
                </Row>

                <br />
                {
                  selectedEdit && !fileUpload &&
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
            <Button disabled={getLength(this.state.txtKey) === 0} color={'primary'} onClick={this.onCreateDataHeader}>{selectedEdit ? 'Edit' : 'Create'}</Button>
          </ModalFooter>
        </Modal>

      </div>
    )
  }
}

export default Tour
