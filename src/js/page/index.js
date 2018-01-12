// 引入css
require('../../css/lib/reset.css')
require('../../css/common/global.css')
require('../../css/common/grid.css')
require('../../css/page/index.scss')
const nav=require('../../js/components/nav/nav.js')
nav()
/* eslint-disable no-undef */
$('.g-bd').append('<p class="text">我是JS生成的</p>')

// 增加事件
$('.btn').click(function () {
  require.ensure(['../components/dialog/index.js'], function (require) {
    var Dialog = require('../components/dialog/index.js')
    new Dialog()
  })
})
