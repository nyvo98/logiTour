import React from 'react'
import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  FormGroup,
  Label,
  Form,
  Button,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap'
import { DatePicker } from 'antd'
import filterFactory from 'react-bootstrap-table2-filter'
import ToolkitProvider from 'react-bootstrap-table2-toolkit'
import BootstrapTable from 'react-bootstrap-table-next'
import TextFieldGroup from '../Common/TextFieldGroup'
import Moment from 'moment'
import { showAlert, generateId, genObjectLang } from '../../common/function'

import BaseAPI from '../../Controller/BaseAPI'
class TimelineConfig extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      timelineConfig: [],
      selectedEdit: null,
      isOpenModal: false,
      isLoading: false,
      indexYearCreate: '',
      txtContentEN: '',
      txtContentVI: '',
      txtContentJA: '',
      txtContentCN: '',
      txtYearInput: '',
      txtDate: (new Date()).toString('')

    }
  }

  async componentDidMount () {
    this.loadingInitial()
  }

    loadingInitial = async () => {
      const resConfig = await BaseAPI.getData('config')
      const { timelineConfig } = resConfig

      this.setState({
        timelineConfig: timelineConfig || []
      })
    }

    onOpenModal = (isOpenModal) => {
      this.setState({ isOpenModal })
    }

    onHideModal = () => {
      this.resetDataHeader()
      this.onOpenModal(false)
    }

    onChangeValue = (e) => {
      let newValue = e.target.value
      this.setState({ [e.target.name]: newValue })
    }
    onChangeValueDate = (e) => {
      this.setState({
        txtDate: Date(e)
      })
    }

    resetDataHeader = (index) => {
      this.setState({ txtDate: (new Date()).toString(''), selectedEdit: null, txtContentEN: '', txtContentVI: '', txtContentJA: '', txtContentCN: '', isLoading: false })
    }

    onEdit = (file) => () => {
      this.setState({
        selectedEdit: file,
        txtDate: file.date,
        txtContentEN: file.content.en,
        txtContentVI: file.content.vi,
        txtContentJA: file.content.ja,
        txtContentCN: file.content.cn
      }, () => {
        this.onOpenModal(true)
      })
    }

    handleAddYear = () => {
      const { timelineConfig, txtYearInput } = this.state
      if (txtYearInput !== '') {
        const newList = timelineConfig.slice()
        const newItem = {
          year: txtYearInput,
          info: []
        }
        newList.push(newItem)
        this.setState({ timelineConfig: newList, txtYearInput: '' })
      } else {
        showAlert('Your Input is Empty!')
      }
    }

    openCreate = (index) => () => {
      this.setState({
        indexYearCreate: index
      })
      this.resetDataHeader(index)
      this.onOpenModal(true)
    }

    handlePickDate = (name, value) => {
      if (name.indexOf('.') > -1) {
        const field = name.split('.')
        const nState = {
          [field[0]]: { ...this.state[field[0]], [field[1]]: value }
        }
        return this.setState(nState)
      }

      return this.setState({ [name]: value })
    }

    onDelete= (row) => async () => {
      const { timelineConfig } = this.state
      this.setState({ isLoading: true })
      const newData = timelineConfig.slice()
      let indexTimline = -1
      let indexInfo

      newData.map((value, index) => {
        indexInfo = value.info.findIndex(item => row.id === item.id)
        if (indexInfo !== -1) {
          indexTimline = index
        }
      })
      if (indexTimline !== -1) {
        newData[indexTimline].info.splice(indexInfo, 1)
      }
      const res = await BaseAPI.updateConfig({ timelineConfig: newData })
      if (res) {
        showAlert(`Delete Timeline succesfully`)
        this.resetDataHeader()
        this.loadingInitial()
        this.setState({
          timelineConfig: []
        })
      } else {
        showAlert('Something goes wrong. Please try again.')
      }
    }

    onDeleteYear = index => async () => {
      console.log(index)
      const { timelineConfig } = this.state
      const newData = timelineConfig.slice()
      newData.splice(index, 1)
      const res = await BaseAPI.updateConfig({ timelineConfig: newData })
      if (res) {
        showAlert(`Delete Year succesfully`)
        this.resetDataHeader()
        this.loadingInitial()
      } else {
        showAlert('Something goes wrong. Please try again.')
      }
    }

    onCreateData = async () => {
      const { selectedEdit, txtDate, timelineConfig, indexYearCreate, txtContentEN, txtContentVI, txtContentJA, txtContentCN } = this.state
      this.setState({ isLoading: true })
      const createData = async () => {
        let newData = timelineConfig.slice()
        const addData = {
          id: generateId(),
          date: new Date(txtDate),
          content: genObjectLang(txtContentEN, txtContentVI, txtContentJA, txtContentCN)
        }
        if (!selectedEdit || newData.length === 0) {
          newData[indexYearCreate].info.push(addData)
        } else {
          let findIndexInfo
          const findExist = newData.findIndex(itm => {
            findIndexInfo = itm.info.findIndex(itm2 => itm2.id === selectedEdit.id)
            return findIndexInfo !== -1
          })
          if (findExist !== -1) {
            newData[findExist].info[findIndexInfo] = addData
          }
        }
        const res = await BaseAPI.updateConfig({ timelineConfig: newData })
        if (res) {
          showAlert(`${selectedEdit ? 'Edit' : 'Create'} Timeline succesfully`)
          this.onHideModal()
          this.loadingInitial()
        } else {
          showAlert('Something goes wrong. Please try again.')
        }
      }
      createData()
    }

    onRenderTimeLine () {
      const { timelineConfig } = this.state
      const column = [{
        dataField: 'date',
        text: 'Date',
        filterValue: (cell) => cell,
        formatter: (cell, row) => {
          return (
            <div>
              {(new Moment(new Date(cell))).format('L')}
            </div>
          )
        },
        sort: true
      },
      {
        dataField: 'content',
        text: 'Content',
        filterValue: (cell) => cell.en,
        formatter: (cell, row) => (
          <div>
            {cell.en}
          </div>
        ),
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
          <Button key={1} className={'btn_dark'} color={'success'} onClick={this.onDelete(row)}>{'Delete'}</Button>
        )
      }]
      let result = ''
      result = timelineConfig.map((value, index) => {
        return (
          <Row key={index}>
            <Label className={'title-header'} for='exampleEmail'>{value.year}</Label>

            <ToolkitProvider
              keyField='_id'
              data={value.info}
              columns={column}
              search
            >
              {
                props =>
                  (<div>
                    <div className={'row-search'}>
                      <Button onClick={this.openCreate(index)} className={'btn-info search-btn'} color='info'>{'Add New Timeline'}</Button>{' '}
                      <Button onClick={this.onDeleteYear(index)} className={'btn-info search-btn'} color='info'>{'Delete Year'}
                      </Button>{' '}
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
          </Row>
        )
      })
      return result
    }
    render () {
      const {
        selectedEdit,
        timelineConfig,
        txtYearInput

      } = this.state
      console.log(timelineConfig)
      return (
        <div>
          <div className='animated fadeIn'>
            <Row className='paddingTop'>
              <Col>
                <Card className={'borderBlack'}>
                  <CardHeader className='darkBlueBg'>
                    <i className='fa fa-align-justify' />
                    {'Manage About us timeline'}
                  </CardHeader>
                  <CardBody className='darkBlueBg'>
                    <Form>
                      {
                        this.onRenderTimeLine()
                      }
                      <FormGroup>
                        <Col>
                          <Row>
                            <TextFieldGroup
                              value={txtYearInput}
                              field='txtYearInput'
                              label='Enter New Year'
                              onChange={this.onChangeValue}
                            />
                          </Row>
                          <Row>
                            <Button className={'btn_dark'} color='primary' onClick={this.handleAddYear}>Add New Year</Button>
                          </Row>
                        </Col>
                      </FormGroup>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
          <Modal size={'lg'} isOpen={this.state.isOpenModal} >
            <ModalHeader >{selectedEdit ? 'Edit Timeline' : 'Create Timeline'}</ModalHeader>
            <ModalBody>

              <CardBody>
                <Form>
                  <Row>
                    <Col xl={6}>
                      <label>Date</label><br />
                      <DatePicker autoFocus defaultValue={new Moment(this.state.txtDate)} onChange={(date) => this.handlePickDate('txtDate', date)} />

                    </Col>

                  </Row>
                  <br />
                  <Row>
                    <Col xl={6}>
                      <TextFieldGroup
                        field='txtContentEN'
                        label='Content EN'
                        value={this.state.txtContentEN}
                        onChange={this.onChangeValue}
                      />
                    </Col>
                    <Col xl={6}>
                      <TextFieldGroup
                        field='txtContentVI'
                        label='Content VI'
                        value={this.state.txtContentVI}
                        onChange={this.onChangeValue}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={6}>
                      <TextFieldGroup
                        field='txtContentJA'
                        label='Content JA'
                        value={this.state.txtContentJA}
                        onChange={this.onChangeValue}
                      />
                    </Col>
                    <Col xl={6}>
                      <TextFieldGroup
                        field='txtContentCN'
                        label='Content CN'
                        value={this.state.txtContentCN}
                        onChange={this.onChangeValue}
                      />
                    </Col>
                  </Row>
                </Form>
              </CardBody>
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

export default TimelineConfig
