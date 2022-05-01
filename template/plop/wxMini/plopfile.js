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
        templateFile: 'plop-templates/page/page.wxml.hbs',
      },
      {
        type: 'add',
        path: 'pages/{{ camelCase name }}/{{ camelCase name }}.scss',
        templateFile: 'plop-templates/page/page.scss.hbs',
      },
      {
        type: 'add',
        path: 'pages/{{ camelCase name }}/{{ camelCase name }}.ts',
        templateFile: 'plop-templates/page/page.ts.hbs',
      },
      {
        type: 'add',
        path: 'pages/{{ camelCase name }}/{{ camelCase name }}.json',
        templateFile: 'plop-templates/page/page.json.hbs',
      },
    ],
  })
  plop.setGenerator('component', {
    description: '创建组件',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: '请输入你的组件名称⭐️',
        default: '',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'pages/{{ camelCase name }}/{{ camelCase name }}.wxml',
        templateFile: 'plop-templates/component/component.wxml.hbs',
      },
      {
        type: 'add',
        path: 'pages/{{ camelCase name }}/{{ camelCase name }}.scss',
        templateFile: 'plop-templates/component/component.scss.hbs',
      },
      {
        type: 'add',
        path: 'pages/{{ camelCase name }}/{{ camelCase name }}.ts',
        templateFile: 'plop-templates/component/component.ts.hbs',
      },
      {
        type: 'add',
        path: 'pages/{{ camelCase name }}/{{ camelCase name }}.json',
        templateFile: 'plop-templates/component/component.json.hbs',
      },
    ],
  })
}
