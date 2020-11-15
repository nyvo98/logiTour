
import './polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import AdminWebsite from './Home'
global.BASE_URL = process.env.REACT_APP_API
global.BASE_TAG = ';'

// window.addEventListener('beforeunload', (event) => {
//   localStorage.removeItem('auth')
// })

ReactDOM.render(<AdminWebsite />, document.getElementById('root'))
