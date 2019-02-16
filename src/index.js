import React from 'react'
import ReactDOM from 'react-dom'
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom'
import App from './App'
import { User } from './components/containers'

const RoutableApp = ({ match }) => <App graphName={match.params.graph} />

function RoutedApp() {
  return (
    <Router>
      <Switch>
        <Redirect exact from='/' to='/graph/' />
        <Route path='/graph' exact render={() => <App graphName='/' />} />
        <Route path='/graph/:graph' component={RoutableApp} />
        <Route path='/user' component={User} />
      </Switch>
    </Router>
  )
}

ReactDOM.render(<RoutedApp />, document.getElementById('root'))
