const { Configuration, OpenAIApi } = require("openai");
const inquirer = require('inquirer');
const fs = require('fs');
const config = Object.create(null);
const Spinner = require('cli-spinner').Spinner;
const spinner = new Spinner('Loading.. %s');
spinner.setSpinnerString('▂ ▃ ▄ ▅ ▆ ▇ █');

async function main() {
  // 判断文件是否存在
  const keysIsExist = fs.existsSync('openai_keys');
  if(!keysIsExist) {
    const { apiKey } = await inquirer.prompt({
      type: 'password',
      name: 'apiKey',
      message: '请输入 Open AI 的 Key',
    })

    // 覆盖写入
    fs.writeFile('openai_keys', apiKey.trim(), { flag: 'w' }, (err) => {
      if (err) console.error(err)
      else main()
    })
  } else {
    fs.readFile('openai_keys', (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      config.apiKey = data.toString();
    })
  }

	const { model } = await inquirer.prompt({
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
	})
	config.model = model;

  const { apiKey } = config;
	console.log('\033[42;30m LGOIN \033[40;32m 登录成功\033[0m');
	const configuration = new Configuration({
		apiKey
	});
	config.openai = new OpenAIApi(configuration);
	start()
}

async function start() {
	const { model } = config;
	const { prompt } = await inquirer.prompt({
		type: 'input',
		name: 'prompt',
		message: '请输入问题',
	});
	if(!prompt.trim()) {
		start()
		return false
	}
	try {
		spinner.start();
		const { data: { choices } } = await config.openai.createCompletion({
			model,
			prompt,
			temperature: 0.5,
			max_tokens: 150,
			top_p: 1.0,
			frequency_penalty: 0.0,
			presence_penalty: 0.0,
		})
		const answer = choices[0]?.text?.replace(/\ +/g, '');
		spinner.stop(true);
		console.log('\033[32mOpen AI：' + answer?.trim() + '\033[0m');
		start()
	} catch (error) {
		spinner.stop(true);
		console.log(error);
	} 
}

main();