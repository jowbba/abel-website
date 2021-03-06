/*
 * @Author: harry.liu 
 * @Date: 2019-02-15 16:22:52 
 * @Last Modified by: harry.liu
 * @Last Modified time: 2019-02-21 11:41:15
 */

export default {
  setSize(width, height) {
    return {
      type: 'SET_SIZE',
      width, height
    }
  },

  setUser(user) {
    return {
      type: 'SET_USER',
      user
    }
  },

  setList(list) {
    return {
      type: 'SET_LIST',
      list
    }
  },

  logout() {
    return { type: 'LOGOUT'}
  }
}