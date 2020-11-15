import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Container } from 'reactstrap'

import {
  AppAside,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav
} from '@coreui/react'
// routes config
import routes from '../../routes'
import DefaultAside from './DefaultAside'
import DefaultHeader from './DefaultHeader'
import Alert from 'react-s-alert'

// sidebar nav config
import navigation from '../../_nav'

class DefaultLayout extends Component {
  render () {
    const auth = localStorage.getItem('auth')
    const user = localStorage.getItem('user')

    let newUser = {}
    if (!auth || !user) {
      return (
        <Redirect from='/' to='/login' />
      )
    } else {
      newUser = JSON.parse(user)
    }
    return (
      <div className='app'>
        <AppHeader fixed>
          <DefaultHeader />
        </AppHeader>
        <div className='app-body'>
          <AppSidebar fixed display='lg'>
            <AppSidebarHeader />
            <AppSidebarForm />
            <AppSidebarNav navConfig={navigation} {...this.props} />
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className='main backgroundChild'>
            <Container fluid>
              <Switch>
                {(routes).map((route, idx) => {
                  return route.component ? (<Route key={idx} path={route.path} exact={route.exact} name={route.name} render={props => (
                    <route.component {...props} />
                  )} />)
                    : (null)
                }
                )}
                <Redirect from='/' to={'/user'} />
              </Switch>
            </Container>
          </main>
          <AppAside fixed hidden>
            <DefaultAside />
          </AppAside>
        </div>
        <Alert timeout={5000} stack={{ limit: 3 }} />
      </div>
    )
  }
}

export default DefaultLayout
