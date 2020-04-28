import Vue from 'vue'
import App from './App.vue'
import { DatePicker, Form, Input, Button, Icon, Select, Radio, Alert, message, Row, Col } from 'ant-design-vue'
import VueClipboard from 'vue-clipboard2';
import VueResource from 'vue-resource';
import VueScrollTo from 'vue-scrollto';
import Vue2TouchEvents from 'vue2-touch-events'

import './styles/main.scss'
import 'ant-design-vue/dist/antd.css'
import { store } from './store/store'
// import './example'

const { Item: FormItem } = Form

Vue.prototype.$message = message

Vue.use(DatePicker)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Icon)
Vue.use(VueClipboard)
Vue.use(Select)
Vue.use(VueResource)
Vue.use(VueScrollTo)
Vue.use(Vue2TouchEvents)
Vue.use(Radio)
Vue.use(Alert)
Vue.use(Row)
Vue.use(Col)

store.dispatch('fetchSettings')

new Vue({
    el: '#app',
    store,
    render: h => h(App),
})

// make a request if get on the page with url plans/params
