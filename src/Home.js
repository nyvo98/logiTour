import React, { Component } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import './App.css'
// Styles
// CoreUI Icons Set
import '@coreui/icons/css/coreui-icons.min.css'
// Import Flag Icons Set
import 'flag-icon-css/css/flag-icon.min.css'
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css'
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css'
// Import Main styles for this application
import './scss/style.css'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css'
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css'
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css'
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
// mandatory
import 'react-s-alert/dist/s-alert-default.css'
import 'antd/dist/antd.css' // or 'antd/dist/antd.less'
// optional - you can choose the effect you want
import 'react-s-alert/dist/s-alert-css-effects/slide.css'
import 'react-s-alert/dist/s-alert-css-effects/scale.css'
import 'react-s-alert/dist/s-alert-css-effects/bouncyflip.css'
import 'react-s-alert/dist/s-alert-css-effects/flip.css'
import 'react-s-alert/dist/s-alert-css-effects/genie.css'
import 'react-s-alert/dist/s-alert-css-effects/jelly.css'
import 'react-s-alert/dist/s-alert-css-effects/stackslide.css'

// Containers
import { DefaultLayout } from './containers'
// Pages
import { Login, Page404, Page500, Register } from './views/Pages'

class App extends Component {
  render () {
    return (
      <HashRouter>
        <Switch>
          <Route exact path='/login' name='Login Page' component={Login} />
          <Route exact path='/logout' name='Logout Page' component={Login} />
          <Route exact path='/register' name='Register Page' component={Register} />
          <Route exact path='/404' name='Page 404' component={Page404} />
          <Route exact path='/500' name='Page 500' component={Page500} />
          <Route path='/' name='Home' component={DefaultLayout} />
        </Switch>
      </HashRouter>
    )
  }
}

export default App
