const { Configuration, OpenAIApi } = require("openai");
const inquirer = require('inquirer');
const fs = require('fs');
const Spinner = require('cli-spinner').Spinner;
const spinner = new Spinner('Loading.. %s');
spinner.setSpinnerString('▂ ▃ ▄ ▅ ▆ ▇ █');
const config = Object.create(null);
const { inquirerApiKey, inquirerModel, inquirerPrompt } = require('./service/inquirer');
const openaiConf = require('./service/openai');

function writeOpenaiKeysFile() {
  return new Promise(async (resolve, reject) => {
    // 判断文件是否存在
    const keysIsExist = fs.existsSync('openai_keys');
    if (!keysIsExist) {
      const { apiKey } = await inquirer.prompt(inquirerApiKey())
      if (!apiKey.trim()) {
        main();
        return false
      }
      // 覆盖写入
      fs.writeFile('openai_keys', apiKey.trim(), { flag: 'w' }, (err) => {
        if (err) {
          main()
          return false
        }
        else resolve(apiKey.trim())
      })
    } else {
      // 读取
      fs.readFile('openai_keys', (err, data) => {
        if (err) reject(err)
        else {
          // 不存在内容
          if (!data.toString()) {
            fs.unlinkSync('openai_keys');
            main()
            return false
          }
          resolve(data.toString())
        }
      })
    }
  })
}

async function main() {
  const apiKey = await writeOpenaiKeysFile();
  if (!apiKey) {
    main();
    return false
  }
  const { model } = await inquirer.prompt(inquirerModel())
  config.model = model;

  const configuration = new Configuration({ apiKey });
  config.openai = new OpenAIApi(configuration);
  console.log('\033[42;30m LGOIN \033[40;32m 登录成功\033[0m');
  start()
}

async function start() {
  const { model } = config;
  const { prompt } = await inquirer.prompt(inquirerPrompt());
  if (!prompt.trim()) {
    start()
    return false
  }
  try {
    spinner.start();
    const { data: { choices } } = await config.openai.createCompletion(openaiConf(model, prompt))
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