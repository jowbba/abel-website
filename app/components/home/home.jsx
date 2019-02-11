import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import store from '../../store/store'
import Action from '../../action/action'
// import css from 'Css/home'
class Home extends React.Component {
  constructor() {
    super()
    this.state = {
      videoCover: false,
      navbar : false
    }
  }

  render() {
    return (
      <div>
        123
      </div>
    )
  }

}

var mapStateToProps = state => {
  return {
    view: state.view
  }
}

export default connect(mapStateToProps)(Home)