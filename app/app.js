import React from 'react'
import { render }  from 'react-dom'
import { BrowserRouter, HashRouter, Route, Link, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import Home from './components/login/login'
import NoMatch from './components/nomatch/noMatch'
// import 'Font/font.css'
import 'Css/index.css'
import store from './store/store'
import Action from './action/action'

class App extends React.Component {
  constructor() {
    super()
  }

  componentDidMount() {
    store.dispatch(Action.setSize(document.body.offsetWidth, document.body.offsetHeight))
    window.onresize = function() {
      store.dispatch(Action.setSize(document.body.offsetWidth, document.body.offsetHeight))
    }

    window.onscroll = (e) => {
      store.dispatch(Action.setScroll(document.body.scrollTop || document.documentElement.scrollTop))
      
    }
  }

  render() {
    return (
      <div style={{height: '100%'}}>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route component={NoMatch}/>
        </Switch>
      </div>
    )
  }
}

render((
  <Provider store={store}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </Provider>
), document.getElementById('root'))

if (module.hot) {
  module.hot.accept()
}