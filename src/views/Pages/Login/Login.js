import React, { Component } from 'react'
import { Button, Card, CardBody, CardGroup, Col, Container, InputGroup, Row } from 'reactstrap'
import validateInput from '../../../shared/validations/login'
import TextFieldGroup from '../../Common/TextFieldGroup'
import AdminServices from '../../../Controller/BaseAPI'
import { setItemStorage, removeItemStorage } from '../../../common/function'

class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      identifier: '',
      password: '',
      errors: {},
      isLoading: false
    }
    removeItemStorage('auth')
    if (this.props.location.pathname === '/logout') window.location.href = '#/login'
  }

  isValid () {
    const { errors, isValid } = validateInput(this.state)

    if (!isValid) {
      this.setState({ errors })
    }
    return isValid
  }

  async onSubmit (e) {
    const { identifier, password } = this.state
    e.preventDefault()
    if (this.isValid()) {
      this.setState({ errors: {}, isLoading: true })
      const result = await AdminServices.loginAdmin(identifier, password)
      if (result.jwtToken && result.jwtToken.length > 0) {
        setItemStorage('auth', result.jwtToken)
        setItemStorage('user', JSON.stringify(result.data))
        this.props.history.push('/config')
      } else {
        console.log(result)
        this.setState({ isLoading: false, errors: { common: result.errMess === 'namePwNotFound' ? 'Username or password is incorrect' : 'Unauthorized Access is denied' } })
      }
    }
  }

  onChange (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  render () {
    const { errors, identifier, password, isLoading } = this.state
    return (
      <div className='app flex-row align-items-center img-background'>
        <Container >
          <Row className='justify-content-center'>
            <Col md='4'>
              <form onSubmit={e => this.onSubmit(e)}>
                <CardGroup>
                  <Card className='p-4 card_dark'>
                    <CardBody>
                      <h1 style={{ color: 'white' }}>Admin Login</h1>
                      <span className='error'>{errors.common}</span>
                      <InputGroup className='mb-3'>
                        <TextFieldGroup
                          field='identifier'
                          label='Username'
                          value={identifier}
                          error={errors.identifier}
                          onChange={e => this.onChange(e)}
                        />
                      </InputGroup>
                      <InputGroup className='mb-4'>
                        <TextFieldGroup
                          type='password'
                          field='password'
                          label='Password'
                          value={password}
                          error={errors.password}
                          onChange={e => this.onChange(e)}
                        />
                      </InputGroup>
                      <Row>
                        <Col xs='6'>
                          <Button className='px-4 btn_dark' disabled={isLoading}>Login</Button>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </CardGroup>
              </form>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}
export default Login
