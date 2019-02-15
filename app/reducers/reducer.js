import { combineReducers } from 'redux'
import view from './view'
import user from './user'

const reducer = combineReducers({
  view, user
})

export default reducer