import React from 'react'
import { connect } from 'react-redux'
import store from '../../store/store'
import Action from '../../action/action'
import { withStyles } from '@material-ui/core/styles'
import css from 'Css/main'
import Nav from '../common/nav'
import Card from './card'
import Dialog from './dialog'
import api from '../../lib/api'

const styles = {
  
}

class Main extends React.Component {
  constructor() {
    super()
    this.state = {
      station: null
    }
  }

  componentWillReceiveProps(props) {
    let { user } = props.user
    if (!user) {
      this.props.history.replace('/')
    }
  }

  componentDidMount() {
    this.refreshList()
  }

  render() {
    let arr = []
    let { user, list } = this.props.user
    let { station } = this.state
    if (list) {
      let { ownStations, sharedStations } = list
      ownStations.forEach(item => item.mark = 'own')
      sharedStations.forEach(item => item.mark = 'share')
      arr = ownStations.concat(sharedStations)
    }
    
    return (
      <div style={{width: '100%', height: '100%'}}>
        <Nav height='112px' bgColor='rgba(0,0,0,.04)' color='rgba(0,0,0,.87)' 
          user={user} faq={this.faq.bind(this)}/>
        <div className={css.container}>
          <div className={css.main}>
            <div className={css.title}>我的设备</div>
            <div className={css.list}>
              {arr.map(item => <Card key={item.sn} info={item} deleteStation={this.deleteStation.bind(this, item.sn)}/>)}
            </div>
          </div>
          <div className={css.faq}>

          </div>
        </div>
        {!!station?<Dialog refresh={this.refreshList.bind(this)} station={station} close={this.close.bind(this)}/>: null}
        
      </div>
    )
  }

  deleteStation(sn) {
    let { user, list } = this.props.user
    let { ownStations, sharedStations } = list
    let arr = ownStations.concat(sharedStations)
    let station = arr.find(item => item.sn == sn)
    this.setState({ station })
    console.log(station)
  }

  close() {
    this.setState({ station: null})
  }

  faq() {
    console.log('faq')
  }

  async refreshList() {
    try {
      let { token } = this.props.user.user
      let result = await api.getStationList(token)
      let list = result.data
      console.log(list)
      store.dispatch(Action.setList(list))
    } catch(error) { }
  }
}

var mapStateToProps = state => {
  return {
    user: state.user,
    view: state.view
  }
}

export default connect(mapStateToProps)(withStyles(styles)((Main)))