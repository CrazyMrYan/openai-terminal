module.exports = function (model, prompt) {
  return {
    model,
    prompt,
    temperature: 0.5,
    max_tokens: 150,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  }
}