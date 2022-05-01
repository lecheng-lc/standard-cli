import ejs  from 'ejs';
var people = ['geddy', 'neil', 'alex']
var  html = ejs.renderFile('./common.css', {people: people}).then(data=>{
    console.log(data)
})
console.log(html)