import React, { PureComponent } from 'react'
import BaseAPI from '../../Controller/BaseAPI'
import {  langIndex } from '../../common/constants'
import { Search } from 'react-bootstrap-table2-toolkit'

import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Button,
  FormGroup,
  Label,
} from 'reactstrap'

import TextFieldGroup from '../Common/TextFieldGroup'
import './style.scss'
import { Spin } from 'antd'
const _ = require('lodash')

Object.filter = (obj, predicate) => Object.fromEntries(Object.entries(obj).filter(predicate))

class LanguageConfig extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      arrLangKey: [],
      txtKeySearch: '',
      txtLangBackup: [],
      headerConfig: [],
      languageConfig: [],
      fileUpload: null,
      selectedEdit: null,
      langActive: 'en',
      txtKeyInput: '',
      txtLang: {},
      isSearch: false
    }
  }
  async componentDidMount () {
    this.loadingInitial()
  }

  loadingInitial = async () => {
    let txtLangConfig
    this.setState({ txtLangBackup: null, txtLang: null, arrLangKey: [] }, async () => {
      while (true) {
        txtLangConfig = await BaseAPI.getDataWebsite(`getFileLang`)
        if (txtLangConfig) {
          this.setState({
            arrLangKey: txtLangConfig ? Object.keys(txtLangConfig[0].json) : [],
            txtLang: txtLangConfig,
            txtLangBackup: txtLangConfig,
            txtKeyInput: '',
            txtKeySearch: '',
            isSearch: false
          })
          break
        }
      }
    })
  }

  onRefreshPage = () => {
    setTimeout(() => {
      window.location.reload(false)
    }, 1000)
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
    const { txtLangBackup } = this.state
    this.setState({ txtLang: txtLangBackup, arrLangKey: Object.keys(txtLangBackup[0].json), txtKeyInput: '', txtKeySearch: '', isSearch: false })
  }

  onOpenModal = (isOpenModal) => {
    this.setState({ isOpenModal })
  }

  onSelectFile = (fileUpload) => {
    this.setState({ fileUpload: fileUpload[0] })
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
  }

  onChangeInput = async (e) => {
    let newValue = e.target.value
    this.setState({ [e.target.name]: newValue })
  }

  onSearch = async (e) => {
    let newValue = e.target.value
    this.setState({ [e.target.name]: newValue, isSearch: true })
    const { txtLangBackup } = this.state
    const newKey = Object.keys(txtLangBackup[0].json)
    var filtered = newKey.filter(
      value => value.toLowerCase().includes(e.target.value.toLowerCase()) ||
        txtLangBackup[0].json[value].toLowerCase().includes(e.target.value.toLowerCase()) ||
        txtLangBackup[1].json[value].toLowerCase().includes(e.target.value.toLowerCase()) ||
        txtLangBackup[2].json[value].toLowerCase().includes(e.target.value.toLowerCase()) ||
        txtLangBackup[3].json[value].toLowerCase().includes(e.target.value.toLowerCase())
    )
    this.setState({
      arrLangKey: filtered
    })
  }

  onChangeInputLang = async (e) => {
    const [name, type] = e.target.name.split('___')
    const value = e.target.value
    const { txtLang, txtLangBackup } = this.state
    const newValue = txtLang.slice()
    const newValueBackup = txtLangBackup.slice()
    _.set(newValue, `[${langIndex[type]}].json.${name}`, value)
    _.set(newValueBackup, `[${langIndex[type]}].json.${name}`, value)

    this.setState({ txtLang: newValue, txtLangBackup: newValueBackup })
  }

  onCreateDataHeader = async () => {
    const arrKey = []
    const { txtLangBackup } = this.state
    let newData = txtLangBackup.slice()
    const promisAll = arrKey.map(async (value, index) => {
      newData[0].json[value] = ''
      newData[1].json[value] = ''
      newData[2].json[value] = ''
      newData[3].json[value] = ''
    })
    const finalData = await Promise.all(promisAll)
    if (finalData) {
      console.log(newData)
      BaseAPI.putUpdateDataWebsite({ data: newData }, 'updateFileLang')
      this.onRefreshPage()
    }
  }

  onRenderLang () {
    const { txtLang, arrLangKey } = this.state
    const result = []
    for (let i = 0; i < arrLangKey.length; i++) {
      result.push(
        <div style={{ border: '1px solid #fff', padding: '2rem 1rem', margin: '1rem 0', borderRadius: '7px' }}>
          <Label className={'title-header'} for='exampleEmail'>{arrLangKey[i]}</Label>
          <FormGroup>

            <Row>
              <Col className='widthInput' key={`${arrLangKey[i]}_EN`} lg={6} style={{ display: 'flex', margin: '1rem 0' }}>
                <TextFieldGroup
                  field={`${arrLangKey[i]}___English`}
                  value={txtLang[0].json[arrLangKey[i]]}
                  label='English'
                  onChange={this.onChangeInputLang}
                />
              </Col>
              <Col className='widthInput' key={`${arrLangKey[i]}_VI`} lg={6} style={{ display: 'flex', margin: '1rem 0' }}>
                <TextFieldGroup
                  field={`${arrLangKey[i]}___Vietnamese`}
                  value={txtLang[1].json[arrLangKey[i]]}
                  label='Vietnamese'
                  onChange={this.onChangeInputLang}
                />
              </Col>
            </Row>
            <Row>
              <Col className='widthInput' key={`${arrLangKey[i]}_JA`} lg={6} style={{ display: 'flex', margin: '1rem 0' }}>
                <TextFieldGroup
                  field={`${arrLangKey[i]}___Japanese`}
                  value={txtLang[2].json[arrLangKey[i]]}
                  label='Japanese'
                  onChange={this.onChangeInputLang}
                />
              </Col>
              <Col className='widthInput' key={`${arrLangKey[i]}_CN`} lg={6} style={{ display: 'flex', margin: '1rem 0' }}>
                <TextFieldGroup
                  field={`${arrLangKey[i]}___Chinese`}
                  value={txtLang[3].json[arrLangKey[i]]}
                  label='Chinese'
                  onChange={this.onChangeInputLang}
                />
              </Col>
            </Row>
          </FormGroup>
        </div>
      )
    }
    return result
  }

  render () {
    const { txtKeySearch, txtLangBackup } = this.state
    return (
      <div className='animated fadeIn'>
        <Row className='paddingTop'>
          <Col >
            <Card className={'borderBlack'}>
              <CardHeader className='darkBlueBg'>
                <i className='fa fa-align-justify' />{'Manage Language'}
              </CardHeader>
              <CardBody className='darkBlueBg'>
                <h3>{'Find Text'}</h3>
                <label style={{ width: '100%', marginBottom: '0.25rem', display: 'block !important', TouchAction: 'manipulation' }}>
                  <input value={txtKeySearch} name='txtKeySearch' onChange={this.onSearch} className='inputSearch' placeholder='Enter your search string' />
                </label>
                <div className={'row-search'}>
                  <Button className='btn_dark' color='primary' onClick={this.resetDataHeader}>Clear Result</Button>
                  <Button className={'btn_dark'} color='primary' onClick={this.onCreateDataHeader}>Save</Button>
                </div>
                <hr />
                <FormGroup>
                  {
                    (txtLangBackup !== null && txtLangBackup !== []) ? this.onRenderLang()
                      : <div>
                        <Spin size='large' className='spinClass' /><br />
                        <label style={{ color: 'white' }} className='spinClass'>Server on building</label>
                      </div>
                  }
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default LanguageConfig
