import page from './page'
import appList from './app-list'
import calendar from './calendar2'

export default {
    install: function (Vue) {
        Vue.component('my-page', page)
        Vue.component('app-list', appList)
        Vue.component('calendar', calendar)
    }
}
