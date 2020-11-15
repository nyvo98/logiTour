import React, { Component } from 'react'
import { Nav, NavItem, NavLink } from 'reactstrap'

import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react'
import logo from '../../assets/img/horizontalLogo.png'

const defaultProps = {}

class DefaultHeader extends Component {
  render () {
    return (
      <React.Fragment>
        <AppSidebarToggler className='d-lg-none' display='md' mobile />
        <AppNavbarBrand
          full={{ src: logo, width: '80%', alt: 'Logo' }}
          minimized={{ src: logo, width: 30, height: 30, alt: 'Logo' }}
        />
        <Nav className='d-md-down-none' navbar>
          <NavItem className='px-3'>
            <NavLink className='whiteText' href='#/logout'>Logout</NavLink>
          </NavItem>
        </Nav>
      </React.Fragment>
    )
  }
}

DefaultHeader.defaultProps = defaultProps

export default DefaultHeader
