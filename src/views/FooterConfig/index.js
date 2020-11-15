import React, { PureComponent } from 'react'
import BaseAPI from '../../Controller/BaseAPI'
import {  langType } from '../../common/constants'

import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Label,
  Button,
} from 'reactstrap'

import TextFieldGroup from '../Common/TextFieldGroup'
import { showAlert, generateId, genObjectLang } from '../../common/function'
import TextArea from '../Common/TextArea'
const _ = require('lodash')

class Tour extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      footerConfig: {
        titleTop: {},
        titleBottom: {},
        address: {},
        contact: {}
      }
    }
  }
  async componentDidMount () {
    this.loadingInitial()
    }

  loadingInitial = async () => {
    const resConfig = await BaseAPI.getData('config')
    const { footerConfig } = resConfig
    this.setState({
      footerConfig: footerConfig || {}
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
    const { footerConfig } = this.state
    const newList = footerConfig.slice()
    const index = newList.indexOf(langName)
    if (index !== -1) {
      newList.splice(index, 1)
    } else {
      newList.push(langName)
    }
    this.setState({
      footerConfig: newList
    })
    console.log(this.state.footerConfig)
  }

  onChangeValue = (e) => {
    const [lang, key] = e.target.name.split('_')
    const value = e.target.value
    const { footerConfig } = this.state
    let newConfig = JSON.parse(JSON.stringify(footerConfig))
    if (key === 'titleTop' || key === 'titleBottom') {
      _.set(newConfig, `[${key}][${langType[lang]}]`, value)
    }
    if (key === 'address') {
      _.set(newConfig, `[${key}]`, value)
    }
    if (['phone', 'fax', 'email', 'telegram', 'wechat'].includes(key)) {
      _.set(newConfig, `contact[${key}]`, value)
    }
    this.setState({
      footerConfig: newConfig
    })
  }

  onSaveLanguage = async () => {
    const { footerConfig } = this.state
    console.log(footerConfig)
    const payload = await BaseAPI.updateConfig({ footerConfig })
    if (payload) {
      showAlert(`Save Config succesfully`)
    } else {
      showAlert('Something goes wrong. Please try again.')
    }
  }

  onSaveTerm = async () => {
    const { footerConfig } = this.state
    const payload = await BaseAPI.updateConfig({ footerConfig })
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
    const { titleTop, address, contact, titleBottom } = this.state.footerConfig
    console.log(titleTop)
    return (
      <div className='animated fadeIn'>
        <Row className='paddingTop'>
          <Col >
            <Card className={'borderBlack'}>
              <CardHeader className='darkBlueBg'>
                <i className='fa fa-align-justify' />{'Footer Config'}
              </CardHeader>
              <CardBody className='darkBlueBg'>
                <Label className={'title-header'} for='exampleEmail'>Title Top</Label><br />
                <Row>
                  <Col xl={6}>
                    <TextArea
                      field={`English_titleTop`}
                      label='English'
                      value={titleTop.en}
                      rows='5'
                      onChange={this.onChangeValue}
                    />
                  </Col>
                  <Col xl={6}>
                    <TextArea
                      field={`Vietnamese_titleTop`}
                      label='Vietnamese'
                      value={titleTop.vi}
                      rows='5'
                      onChange={this.onChangeValue}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xl={6}>
                    <TextArea
                      field={`Japanese_titleTop`}
                      label='Japanese'
                      value={titleTop.ja}
                      rows='5'
                      onChange={this.onChangeValue}
                    />
                  </Col>
                  <Col xl={6}>
                    <TextArea
                      field={`Chinese_titleTop`}
                      label='Chinese'
                      value={titleTop.cn}
                      rows='5'
                      onChange={this.onChangeValue}
                    />
                  </Col>
                </Row>
                <Label className={'title-header'} for='exampleEmail'>Address</Label>
                <Row>
                  <Col xl={6}>
                    <TextFieldGroup
                      field={`English_address`}
                      label='Address'
                      value={address}
                      rows='5'
                      onChange={this.onChangeValue}
                    />
                  </Col>
                </Row>
                <Label className={'title-header'} for='exampleEmail'>Contact</Label><br />
                <Row>
                  <Col xl={6}>
                    <TextFieldGroup
                      field={`English_phone`}
                      label='Phone'
                      value={contact.phone}
                      rows='5'
                      onChange={this.onChangeValue}
                    />
                  </Col>
                  <Col xl={6}>
                    <TextFieldGroup
                      field={`English_fax`}
                      label='Fax'
                      value={contact.fax}
                      rows='5'
                      onChange={this.onChangeValue}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xl={6}>
                    <TextFieldGroup
                      field={`English_email`}
                      label='Email'
                      value={contact.email}
                      rows='5'
                      onChange={this.onChangeValue}
                    />
                  </Col>
                  <Col xl={6}>
                    <TextFieldGroup
                      field={`English_telegram`}
                      label='Telegram'
                      value={contact.telegram}
                      rows='5'
                      onChange={this.onChangeValue}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xl={6}>
                    <TextFieldGroup
                      field={`English_wechat`}
                      label='Wechat'
                      value={contact.wechat}
                      rows='5'
                      onChange={this.onChangeValue}
                    />
                  </Col>
                </Row>
                <Label className={'title-header'} for='exampleEmail'>Title Bottom</Label><br />
                <Row>
                  <Col xl={6}>
                    <TextArea
                      field={`English_titleBottom`}
                      label='English'
                      value={titleBottom.en}
                      rows='10'
                      onChange={this.onChangeValue}
                    />
                  </Col>
                  <Col xl={6}>
                    <TextArea
                      field={`Vietnamese_titleBottom`}
                      label='Vietnamese'
                      value={titleBottom.vi}
                      rows='10'
                      onChange={this.onChangeValue}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xl={6}>
                    <TextArea
                      field={`Japanese_titleBottom`}
                      label='Japanese'
                      value={titleBottom.ja}
                      rows='10'
                      onChange={this.onChangeValue}
                    />
                  </Col>
                  <Col xl={6}>
                    <TextArea
                      field={`Chinese_titleBottom`}
                      label='Chinese'
                      value={titleBottom.cn}
                      rows='10'
                      onChange={this.onChangeValue}
                    />
                  </Col>
                </Row>

                <Button onClick={this.onSaveTerm} className={'btn-info search-btn'} color='info'>Save</Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Tour
