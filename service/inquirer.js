function inquirerApiKey() {
  return {
    type: 'password',
    name: 'apiKey',
    message: '请输入 Open AI 的 Key',
  }
}

function inquirerModel() {
  return {
    type: 'list',
    name: 'model',
    message: '请选择对话机器人',
    choices: [
      { name: 'text-ada-001', value: 'text-ada-001' },
      { name: 'text-curie-001', value: 'text-curie-001' },
      { name: 'text-babbage-001', value: 'text-babbage-001' },
      { name: 'text-davinci-003', value: 'text-davinci-003' },
    ],
    default: 'text-davinci-003'
  }
}

function inquirerPrompt() {
  return {
    type: 'input',
    name: 'prompt',
    message: '请输入问题',
  }
}

module.exports = {
  inquirerApiKey,
  inquirerModel,
  inquirerPrompt
}