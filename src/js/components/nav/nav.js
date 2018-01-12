const navHtml=require('./template/nav.html')
const navScss=require('./css/nav.scss')
module.exports=function(){
  /* eslint-disable no-undef */
  $('body').prepend(navHtml)
}