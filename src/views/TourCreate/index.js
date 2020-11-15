import React from 'react'
import {
  Row,
  Col,
  Container,
  Card,
  CardBody,
  CardHeader,
  FormGroup,
  Label,
  Input,
  Form,
  Button,
  Spinner
} from 'reactstrap'
import { DatePicker } from 'antd'
import ImageUploader from 'react-images-upload'
import TextArea from '../Common/TextArea'
import Moment from 'moment'
import BaseAPI from '../../Controller/BaseAPI'
import { set, get } from 'lodash'
import { withRouter } from 'react-router-dom'
import { getLength, showAlert } from '../../common/function'
class TourCreate extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      fileUpload: null,
      arrDelete: [],
      isUpdate: false,
      image: [
        {
          type: 'image',
          image: null,
          url: ''
        }
      ],
      title: {
        en: '',
        vi: '',
        ja: '',
        cn: ''
      },
      description: {
        en: '',
        vi: '',
        ja: '',
        cn: ''
      },
      subDescription: {
        en: '',
        vi: '',
        ja: '',
        cn: ''
      },
      numPerson: {
        from: 0,
        to: 0
      },
      price: '',
      contactList: {
        email: '',
        telegram: '',
        wechat: ''
      },
      process: [''],
      procedure: {
        isInclude: '',
        notInclude: ''
      },
      bestDuration: {
        from: new Date(),
        to: new Date()
      },
      duration: {
        from: new Date(),
        to: new Date()
      },
      location: '',
      tourScheduleList: [
        {
          name: '',
          title: '',
          description: '',
          place: [''],
          tourList: [{
            name: '',
            image: undefined
          }],
          otherInformation: [
            {
              type: 'destination',
              name: ''
            },
            {
              type: 'address',
              name: ''
            },
            {
              type: 'phone',
              name: ''
            },
            {
              type: 'lunch',
              name: ''
            }
          ]
        }
      ]
    }
  }

  async componentDidMount () {
    const { id } = this.props.match.params
    const state = this.state
    if (id) {
      const response = await BaseAPI.getData(`tour/me/${id}`)
      this.setState({
        ...state,
        ...response,
        isUpdate: true }, () => {
        this.setState({
          numPerson: response.tourInfoList.numPerson || {
            from: 0,
            to: 0
          },
          bestDuration: response.tourInfoList.bestDuration || {
            from: new Date(),
            to: new Date()
          },
          duration: response.tourInfoList.duration || {
            from: new Date(),
            to: new Date()
          },
          location: response.tourInfoList.location || '',
          procedure: response.bookingInfoList.procedure || {
            isInclude: '',
            notInclude: ''
          },
          process: response.bookingInfoList.process || ['']
        })
        if (getLength(response.image) === 0) {
          this.setState({
            image: [
              {
                type: 'image',
                image: null,
                url: ''
              }
            ] })
        }
      })
    }
  }

  onSelectFile = fileUpload => {
    this.setState({ fileUpload }, () => {

    })
  };

  handleInputChange = event => {
    const { name, value } = event.target
    if (name.indexOf('.') > -1) {
      const field = name.split('.')
      const nState = {
        [field[0]]: { ...this.state[field[0]], [field[1]]: value }
      }
      return this.setState(nState)
    }

    return this.setState({ [name]: value })
  };

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

  handleFormSubmit = async (e) => {
    const { id } = this.props.match.params
    this.setState({ isLoading: true })
    e.preventDefault()
    const {
      title,
      description,
      subDescription,
      price,
      contactList,
      bestDuration,
      duration,
      location,
      procedure,
      numPerson,
      process,
      tourScheduleList,
      image,
      isUpdate
    } = this.state
    const state = this.state

    const submitValues = {
      id,
      title,
      description,
      subDescription,
      price,
      contactList,
      bookingInfoList: { procedure, process },
      tourInfoList: {
        numPerson,
        bestDuration,
        duration,
        location
      }
    }

    const promise2 = tourScheduleList.map(async (schedule, idx) => {
      const subPromise = schedule.tourList.map(async (tour, index) => {
        if (get(tour, 'image.size') > 0 && typeof (tour.image) !== 'string') {
          const response = await BaseAPI.uploadImage(tour.image)
          set(state, `tourScheduleList[${idx}].tourList[${index}].image`, response)
        } else {
          return tour
        }
      })

      await Promise.all(subPromise)
    })

    await Promise.all(promise2)

    submitValues.tourScheduleList = state.tourScheduleList

    // Handle upload image;
    const promise = image.map(async (item, idx) => {
      if (item.image && get(item, 'image.size') > 0 && typeof (item.image) !== 'string') {
        const response = await BaseAPI.uploadImage(item.image)
        item.image = response
        return item
      } else {
        return item
      }
    })

    const newListImage = await Promise.all(promise)
    console.log('newListImage', newListImage)
    submitValues.image = newListImage
    console.log(submitValues)
    const response = await BaseAPI[isUpdate ? 'putUpdateData' : 'postCreateData'](submitValues, 'tour')
    this.setState({ isLoading: false })
    showAlert(`${isUpdate ? 'Edit' : 'Create'} succesfully`)
    window.history.back()
    return response
  }

  handleScheduleInputChange = (event) => {
    const state = this.state
    const { name, value } = event.target

    set(state, name, value)

    this.setState({ tourScheduleList: [...state.tourScheduleList] })
  }

  handleTourListFileSelect = (files, index, pos) => {
    const state = this.state

    set(state, `tourScheduleList[${index}].tourList[${pos}].image`, files[0])
    this.setState({ tourScheduleList: [...state.tourScheduleList] })
  }

    handleAddSchedule = () => {
      const { tourScheduleList } = this.state
      const newObj = {
        name: '',
        title: '',
        description: '',
        place: [''],
        tourList: [{
          name: '',
          image: []
        }],
        otherInformation: [
          {
            type: 'destination',
            name: ''
          },
          {
            type: 'address',
            name: ''
          },
          {
            type: 'phone',
            name: ''
          },
          {
            type: 'lunch',
            name: ''
          }
        ]
      }

      const newList = tourScheduleList.slice()
      newList.push(newObj)
      this.setState({ tourScheduleList: newList })
    }

    handleRemoveSchedule =(index) => () => {
      const { tourScheduleList } = this.state
      const newList = tourScheduleList.slice()
      newList.splice(index, 1)

      this.setState({ tourScheduleList: getLength(newList) === 0 ? tourScheduleList : newList })
    }

  handleAddProcess = () => {
    const { process } = this.state

    const newList = process.slice()

    newList.push('')

    this.setState({ process: newList })
  }

  handleRemoveProcess = (pos) => () => {
    const { process } = this.state
    const newList = process.slice()

    newList.splice(pos, 1)

    this.setState({ tourInfoList: getLength(newList) === 0 ? process : newList })
  }

    handleAddPlace = (index) => () => {
      const { tourScheduleList } = this.state

      const newList = tourScheduleList.slice()

      newList[index].place.push('')

      this.setState({ tourInfoList: newList })
    }

    handleRemovePlace = (index, pos) => () => {
      const { tourScheduleList } = this.state
      const newList = tourScheduleList.slice()

      newList[index].place.splice(pos, 1)

      this.setState({ tourInfoList: getLength(newList) === 0 ? tourScheduleList : newList })
    }

    handleAddTourList = (index) => () => {
      const { tourScheduleList } = this.state
      const newList = tourScheduleList.slice()

      newList[index].tourList.push({
        name: '',
        image: []
      })

      this.setState({ tourInfoList: newList })
    }

    handleRemoveTourList = (index, pos) => () => {
      const { tourScheduleList } = this.state
      const newList = tourScheduleList.slice()

      newList[index].tourList.splice(pos, 1)

      this.setState({ tourInfoList: getLength(newList) === 0 ? tourScheduleList : newList })
    }

  renderTourSchedule = () => {
    const { tourScheduleList } = this.state

    return tourScheduleList && tourScheduleList.map((item, index) => {
      return (
        <div key={index} style={{ border: '1px solid #fff', padding: '2rem 1rem', margin: '1rem 0', borderRadius: '7px' }}>
          <FormGroup>
            <Label className={'title-header'} for='exampleEmail'>Name</Label><br />
            <Row>
              <Col>
                <Label>English</Label>
                <Input name={`tourScheduleList[${index}].name.en`} onChange={this.handleScheduleInputChange} value={item.name.en} placeholder='' />
                <br/>
              </Col>
              <Col>
                <Label>Vietnamese</Label>
                <Input name={`tourScheduleList[${index}].name.vi`} onChange={this.handleScheduleInputChange} value={item.name.vi} placeholder='' />
                <br/>
              </Col>
            </Row>
            <Row>
              <Col>
                <Label>Japanese</Label>
                <Input name={`tourScheduleList[${index}].name.ja`} onChange={this.handleScheduleInputChange} value={item.name.ja} placeholder='' />
              </Col>
              <Col>
                <Label>Chinese</Label>
                <Input name={`tourScheduleList[${index}].name.cn`} onChange={this.handleScheduleInputChange} value={item.name.cn} placeholder='' />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Label className={'title-header'} for='exampleEmail'>Title</Label><br />
            <Row>
              <Col>
                <Label>English</Label>
                <Input name={`tourScheduleList[${index}].title.en`} onChange={this.handleScheduleInputChange} value={item.title.en} />
                <br/>
              </Col>
              <Col>
                <Label>Vietnamese</Label>
                <Input name={`tourScheduleList[${index}].title.vi`} onChange={this.handleScheduleInputChange} value={item.title.vi} />
                <br/>
              </Col>
            </Row>
            <Row>
              <Col>
                <Label>Japanese</Label>
                <Input name={`tourScheduleList[${index}].title.ja`} onChange={this.handleScheduleInputChange} value={item.title.ja} />
              </Col>
              <Col>
                <Label>Chinese</Label>
                <Input name={`tourScheduleList[${index}].title.cn`} onChange={this.handleScheduleInputChange} value={item.title.cn} />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Label className={'title-header'} for='exampleEmail'>Description</Label><br />
            <Row>
              <Col>
                <TextArea rows={8} label={'English'} name={`tourScheduleList[${index}].description.en`} onChange={this.handleScheduleInputChange} value={item.description.en} />
                <br/>
              </Col>
              <Col>
                <TextArea rows={8} label={'Vietnamese'} name={`tourScheduleList[${index}].description.vi`} onChange={this.handleScheduleInputChange} value={item.description.vi} />
                <br/>
              </Col>
            </Row>
            <Row>
              <Col>
                <TextArea rows={8} label={'Japanese'} name={`tourScheduleList[${index}].description.ja`} onChange={this.handleScheduleInputChange} value={item.description.ja} />
              </Col>
              <Col>
                <TextArea rows={8} label={'Chinese'} name={`tourScheduleList[${index}].description.cn`} onChange={this.handleScheduleInputChange} value={item.description.cn} />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Label>Places</Label>
            <Row>
              {item.place && item.place.map((p, idx) => (
                <Col key={`place-${index}-${idx}`} xs={6} style={{ display: 'flex', margin: '1rem 0' }}>
                  <Input name={`tourScheduleList[${index}].place[${idx}]`} onChange={this.handleScheduleInputChange} value={p} placeholder='Enter place name' />
                  <Button className={'btn_delete'} color='primary' size='sm' style={{ minWidth: '40px', marginLeft: '10px' }} onClick={this.handleRemovePlace(index, idx)}>-</Button>
                </Col>
              ))}
            </Row>

            <Button className={'btn_dark'} color='primary' onClick={this.handleAddPlace(index)}>+ Place</Button>

          </FormGroup>
          <FormGroup>
            <Label>TourList</Label>
            <Row>
              {item.tourList && item.tourList.map((tour, idx) => (
                <Col key={`tourlist-${index}-${idx}`} xs={6}>
                  <Input style={{ margin: '2rem 0' }} name={`tourScheduleList[${index}].tourList[${idx}].name`} onChange={this.handleScheduleInputChange} value={tour.name} placeholder='Enter tour list name' />
                  <ImageUploader
                    {...typeof (tour.image) === 'string' ? { defaultImage: tour.image } : null}
                    style={{ color: 'black' }}
                    fileContainerStyle={{ margin: 0, padding: 0 }}
                    withIcon
                    withPreview
                    singleImage
                    fileSizeError={'File size too large'}
                    fileTypeError={'This file format is not supported'}
                    label={
                      'Maximum upload size is 10mb, requires JPG-PNG-JPEG selected'
                    }
                    buttonText={'Choose your image'}
                    onChange={(files) => this.handleTourListFileSelect(files, index, idx)}
                    imgExtension={['.jpg', '.jpeg', '.png']}
                    maxFileSize={30242880}
                  />
                  <Button className={'btn_delete'} style={{ margin: '1rem 0' }}size='sm' onClick={this.handleRemoveTourList(index, idx)}>Remove This Item</Button>
                </Col>
              ))}
            </Row>
            <Button className={'btn_dark'} color='primary' size='sm' onClick={this.handleAddTourList(index)}>+ Tour List</Button>

          </FormGroup>
          <FormGroup>
            <Label>Destination</Label>
            <Input name={`tourScheduleList[${index}].otherInformation[0].name`} onChange={this.handleScheduleInputChange} value={get(item, 'otherInformation[0].name')} />
          </FormGroup>
          <FormGroup>
            <Label>Address</Label>
            <Input name={`tourScheduleList[${index}].otherInformation[1].name`} onChange={this.handleScheduleInputChange} value={get(item, 'otherInformation[1].name')} />
          </FormGroup>
          <FormGroup>
            <Label>Phone</Label>
            <Input name={`tourScheduleList[${index}].otherInformation[2].name`} onChange={this.handleScheduleInputChange} value={get(item, 'otherInformation[2].name')} />
          </FormGroup>
          <FormGroup>
            <Label>Lunch</Label>
            <Input name={`tourScheduleList[${index}].otherInformation[3].name`} onChange={this.handleScheduleInputChange} value={get(item, 'otherInformation[3].name')} />
          </FormGroup>
          <Button className={'btn_delete'} onClick={this.handleRemoveSchedule(index)}>Remove</Button>
        </div>
      )
    })
  }

  handleAddImage = () => {
    const { image } = this.state
    image.push({
      type: 'image',
      image: null,
      url: ''
    })
    this.setState({ image: [...image] })
  }

  handleRemoveImage = (idx) => () => {
    const { image } = this.state
    const newList = image.slice()

    newList.splice(idx, 1)

    this.setState({ image: getLength(newList) === 0 ? image : newList })
  }

  handleGalleryInputChange = (e, index) => {
    const { name, value } = e.target

    const state = { ...this.state }

    set(state, `image[${index}][${name}]`, value)
    this.setState({ image: [...state.image] })
  }

  handleGallerySelectFile = (files, index) => {
    const state = this.state
    console.log([...state.image])

    set(state, `image[${index}].image`, files[0])
  }

  renderImageGallery = () => {
    const { image } = this.state

    return image && image.map((image, index) => {
      return (
        <div key={`gallery-${index}`} style={{ marginTop: '1rem', padding: '2rem 1rem', border: '1px solid #fff', borderRadius: '7px' }}>
          <FormGroup>
            <Input type='select' name='type' value={image.type} onChange={(e) => this.handleGalleryInputChange(e, index)}>
              <option value='image'>Image</option>
              <option value='video'>Video</option>
            </Input>
          </FormGroup>
          <ImageUploader
            {...typeof (image.image) === 'string' ? { defaultImage: image.image } : null}
            style={{ color: 'black' }}
            fileContainerStyle={{ margin: 0, padding: 0 }}
            withIcon
            withPreview
            singleImage
            fileSizeError={'File size too large'}
            fileTypeError={'This file format is not supported'}
            label={
              'Maximum upload size is 10mb, requires JPG-PNG-JPEG selected'
            }
            buttonText={'Choose your image'}
            onChange={(files) => this.handleGallerySelectFile(files, index)}
            imgExtension={['.jpg', '.jpeg', '.png']}
            maxFileSize={30242880}
          />
          {image.type === 'video' ? (
            <FormGroup style={{ marginTop: 20 }}>
              <Label>Youtube URL</Label>
              <Input name='url' value={image.url} onChange={(e) => this.handleGalleryInputChange(e, index)} />
            </FormGroup>
          ) : null}
          <Button className={'btn_delete'} color='primary' onClick={this.handleRemoveImage(index)} type='button' size='sm' style={{ marginTop: '1rem' }}>Remove this item</Button>

        </div>
      )
    })
  }

  render () {
    const {
      title,
      process,
      description,
      subDescription,
      price,
      contactList,
      isUpdate,
      procedure,
      bestDuration,
      duration,
      numPerson,
      location,
      isLoading
    } = this.state
    return (
      <Container className='animated fadeIn'>
        <Row className='paddingTop'>
          <Col>
            <Card className={'borderBlack'}>
              <CardHeader className='darkBlueBg'>
                <i className='fa fa-align-justify' />
                {'Create New Tour'}
              </CardHeader>
              <CardBody className='darkBlueBg'>
                <Form onSubmit={this.handleFormSubmit}>
                  <FormGroup>
                    <Label className={'title-header'} for='exampleEmail'>TITLE</Label>
                    <Row>
                      <Col>
                        <Label for='title_en'>English</Label>
                        <Input
                          type='text'
                          id='title_en'
                          name='title.en'
                          onChange={this.handleInputChange}
                          value={title.en}
                          placeholder='Enter title in English'
                        />
                        <br/>
                      </Col>
                      <Col>
                        <Label for='title_vi'>Vietnamese</Label>
                        <Input
                          type='text'
                          id='title_vi'
                          name='title.vi'
                          onChange={this.handleInputChange}
                          value={title.vi}
                          placeholder='Enter title in Vietnamese'
                        />
                      </Col>
                      <br/>
                    </Row>
                    <Row>
                      <Col>
                        <Label for='title_ja'>Japanese</Label>
                        <Input
                          type='text'
                          id='title_ja'
                          name='title.ja'
                          onChange={this.handleInputChange}
                          value={title.ja}
                          placeholder='Enter title in Japanese'
                        />
                      </Col>
                      <Col>
                        <Label for='title_cn'>Chinese</Label>
                        <Input
                          type='text'
                          id='title_cn'
                          name='title.cn'
                          onChange={this.handleInputChange}
                          value={title.cn}
                          placeholder='Enter title in Chinese'
                        />
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Label className={'title-header'} for='exampleEmail'>DESCRIPTION</Label>
                    <Row>
                      <Col>
                        <TextArea
                          rows={8}
                          label={'English'}
                          type='text'
                          id='description_en'
                          onChange={this.handleInputChange}
                          value={description.en}
                          name='description.en'
                          placeholder='Enter description in English'
                        />
                      </Col>
                      <Col>
                        <TextArea
                          rows={8}
                          label={'Vietnamese'}
                          type='text'
                          id='description_vi'
                          onChange={this.handleInputChange}
                          value={description.vi}
                          name='description.vi'
                          placeholder='Enter description in Vietnamese'
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <TextArea
                          rows={8}
                          label={'Japanese'}
                          type='text'
                          id='description_ja'
                          onChange={this.handleInputChange}
                          value={description.ja}
                          name='description.ja'
                          placeholder='Enter description in Japanese'
                        />
                      </Col>
                      <Col>
                        <TextArea
                          rows={8}
                          label={'Chinese'}
                          type='text'
                          id='description_cn'
                          onChange={this.handleInputChange}
                          value={description.cn}
                          name='description.cn'
                          placeholder='Enter description in Chinese'
                        />
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Label className={'title-header'} for='exampleEmail'>SUB DESCRIPTION</Label>
                    <Row>
                      <Col>
                        <TextArea
                          rows={8}
                          type='text'
                          label={'English'}
                          id='sub_description_en'
                          name='subDescription.en'
                          onChange={this.handleInputChange}
                          value={subDescription.en}
                          placeholder='Enter sub description in English'
                        />
                      </Col>
                      <Col>
                        <TextArea
                          rows={8}
                          label={'Vietnamese'}
                          type='text'
                          id='sub_description_vi'
                          name='subDescription.vi'
                          onChange={this.handleInputChange}
                          value={subDescription.vi}
                          placeholder='Enter sub description in Vietnamese'
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <TextArea
                          rows={8}
                          type='text'
                          label={'Japanese'}
                          id='sub_description_ja'
                          name='subDescription.ja'
                          onChange={this.handleInputChange}
                          value={subDescription.ja}
                          placeholder='Enter sub description in Japanese'
                        />
                      </Col>
                      <Col>
                        <TextArea
                          rows={8}
                          label={'Chinese'}
                          type='text'
                          id='sub_description_cn'
                          name='subDescription.cn'
                          onChange={this.handleInputChange}
                          value={subDescription.cn}
                          placeholder='Enter sub description in Chinese'
                        />
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Label className={'title-header'} for='price'>TOUR PRICE</Label>
                    <Input
                      type='number'
                      id='price'
                      name='price'
                      onChange={this.handleInputChange}
                      value={price}
                      placeholder='Enter price'
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label className={'title-header'} for='exampleEmail'>CONTACT INFORMATION</Label>
                    <Row>
                      <Col>
                        <Label for='title_en'>Email</Label>
                        <Input
                          type='text'
                          id='title_en'
                          name='contactList.email'
                          onChange={this.handleInputChange}
                          value={contactList.email}
                          placeholder='Enter email'
                        />
                      </Col>
                      <Col>
                        <Label for='title_vi'>Telegram</Label>
                        <Input
                          type='text'
                          id='title_vi'
                          name='contactList.telegram'
                          onChange={this.handleInputChange}
                          value={contactList.telegram}
                          placeholder='Enter telegram username'
                        />
                      </Col>
                      <Col>
                        <Label for='title_vi'>Wechat</Label>
                        <Input
                          type='text'
                          id='title_vi'
                          name='contactList.wechat'
                          onChange={this.handleInputChange}
                          value={contactList.wechat}
                          placeholder='Enter wechat username'
                        />
                      </Col>
                    </Row>
                  </FormGroup>

                  <FormGroup>
                    <Label className={'title-header'} for='exampleEmail'>BEST DURATION</Label>
                    <Row>
                      <Col>
                        <Label for='bestDurationFrom'>From</Label>
                        <div>
                          <DatePicker defaultValue={new Moment(bestDuration.from)} onChange={(date) => this.handlePickDate('bestDuration.from', date)} />
                        </div>

                      </Col>
                      <Col>
                        <Label for='bestDurationTo'>To</Label>
                        <div>
                          <DatePicker defaultValue={new Moment(bestDuration.to)} onChange={(date) => this.handlePickDate('bestDuration.to', date)} />
                        </div>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Label className={'title-header'} for='exampleEmail'>DURATION</Label>
                    <Row>
                      <Col>
                        <Label for='durationFrom'>From</Label>
                        <div>
                          <DatePicker defaultValue={new Moment(duration.from)} onChange={(date) => this.handlePickDate('duration.from', date)} />
                        </div>
                      </Col>
                      <Col>
                        <Label for='durationTo'>To</Label>
                        <div>
                          <DatePicker defaultValue={new Moment(duration.to)} onChange={(date) => this.handlePickDate('duration.to', date)} />
                        </div>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Label className={'title-header'} for='location'>LOCATION</Label>
                    <Input
                      type='text'
                      id='location'
                      name='location'
                      onChange={this.handleInputChange}
                      value={location}
                      placeholder='Enter tour location'
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label className={'title-header'} for='exampleEmail'>NUM OF PERSON</Label>
                    <Row>
                      <Col>
                        <Label for='numPerson.from'>From</Label>
                        <div>
                          <Input
                            type='text'
                            id='numPerson.from'
                            name='numPerson.from'
                            onChange={this.handleInputChange}
                            value={numPerson.from}
                            placeholder='Enter tour person from'
                          />
                        </div>
                      </Col>
                      <Col>
                        <Label for='numPerson.to'>To</Label>
                        <div>
                          <Input
                            type='text'
                            id='numPerson.to'
                            name='numPerson.to'
                            onChange={this.handleInputChange}
                            value={numPerson.to}
                            placeholder='Enter tour person to'
                          />
                        </div>
                      </Col>
                    </Row>
                  </FormGroup>

                  {/* Step 3 */}
                  <FormGroup>
                    <Label className={'title-header'}>GALLERY</Label>
                    {this.renderImageGallery()}
                    <br />
                    <Button className={'btn_dark'} color='primary' onClick={this.handleAddImage} style={{ marginTop: '1rem' }}>+ Images</Button>
                  </FormGroup>

                  <FormGroup>
                    <Label className={'title-header'} for='exampleEmail'>
                    Tour Schedule
                    </Label>
                    {this.renderTourSchedule()}
                  </FormGroup>
                  <Button className={'btn_dark'} color='secondary' onClick={this.handleAddSchedule}>+ Tour Schedule</Button>
                  <br />

                  {/* Step 2 */}
                  <FormGroup>
                    <Label style={{ marginTop: 20 }} className={'title-header'} for='exampleEmail'>BOOKING INFO PROCEDURE</Label>
                    <Row>
                      <Col>
                        <TextArea
                          rows={8}
                          label={'IS INCLUDE'}
                          type='text'
                          id='description_en'
                          onChange={this.handleInputChange}
                          value={procedure.isInclude}
                          name='procedure.isInclude'
                          placeholder='Enter includes'
                        />
                      </Col>
                      <Col>
                        <TextArea
                          rows={8}
                          label={'IS EXCLUDE'}
                          type='text'
                          id='description_vi'
                          onChange={this.handleInputChange}
                          value={procedure.notInclude}
                          name='procedure.notInclude'
                          placeholder='Enter excludes'
                        />
                      </Col>
                    </Row>
                    <FormGroup>
                      <Label>Booking Process</Label>
                      <Row>
                        {process && process.map((p, idx) => (
                          <Col key={`process-${idx}`} xs={6} style={{ display: 'flex', margin: '1rem 0' }}>
                            <Input name={`process[${idx}]`} onChange={this.handleScheduleInputChange} value={p} placeholder='Enter booking process' />
                            <Button className={'btn_delete'} color='primary' size='sm' style={{ minWidth: '40px', marginLeft: '10px' }} onClick={this.handleRemoveProcess(idx)}>-</Button>
                          </Col>
                        ))}
                      </Row>

                      <Button className={'btn_dark'} color='primary' onClick={this.handleAddProcess}>+ Process</Button>

                    </FormGroup>

                  </FormGroup>

                  <Button disabled={isLoading} className={'btn_dark'} style={{ marginTop: 30 }} color={'primary'} type='submit'>
                    {isLoading ? (
                      <Spinner
                        style={{ width: '1.2rem', height: '1.2rem' }}
                        color='light'
                      />
                    ) : isUpdate ? (
                      'Edit'
                    ) : (
                      'Create'
                    )}
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default withRouter(TourCreate)
