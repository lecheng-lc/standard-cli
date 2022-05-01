module.exports = (plop) => {
  plop.setGenerator('page', {
    description: '创建页面',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: '请输入你的页面名称⭐️',
        default: '',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'pages/{{ camelCase name }}/{{ camelCase name }}.wxml',
        templateFile: 'plop-templates/page/page.vue.hbs',
      },
    ],
  })
  plop.setGenerator('component', {
    description: '创建组件',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: '请输入你想创建的组件名称',
        default: '',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'pages/{{ camelCase name }}/{{ camelCase name }}.vue',
        templateFile: 'plop-templates/component/page.vue.hbs',
      },
    ],
  })
}
