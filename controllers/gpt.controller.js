const fetch = require('node-fetch');
const GPTMessage = require('../models/GPTMessage.model');

const baseBody = {
    model: "gpt-3.5-turbo",
    messages: [{
      role: "user",
      content: ""
    }],
    temperature: 0.7
}

const fetchGPTData = (type) => {
  const body = baseBody;
  body.messages[0].content = `Give me a fitness or bodybuilding ${type}`;
  return fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify(body)
  })
    .then(response => response.json())
}

const saveData = (data, type) => {
  return GPTMessage.create({ response: data, type: type })
    .then(data => {
      return { message: data.response };
    })
}

module.exports.getGptData = (req, res, next) => {
  const type = req.route.path.split('/')[2];
  GPTMessage.findOne({ type: type })
    .then(tip => {
      if (!tip) {
        return fetchGPTData(type)
          .then(response => {
            const tip = response.choices[0].message.content;
            return saveData(tip, type)
              .then(data => {
                res.json(data);
              })
          })
      }
      
      // Create a Date object from the given date string
      const tipDate = new Date(tip.createdAt);

      // Create a Date object for the current date and time
      const now = new Date();

      // Extract only the date portion for both dates (ignoring time)
      const tipDateOnly = new Date(tipDate.getFullYear(), tipDate.getMonth(), tipDate.getDate());
      const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // If tip date is older than today, delete it and fetch new data
      if (tipDateOnly < nowDateOnly) {
        return GPTMessage.deleteOne({ _id: tip._id})
          .then(() => {
            return fetchGPTData(type)
              .then(response => {
                const tip = response.choices[0].message.content;
                return saveData(tip, type)
                  .then(data => {
                    res.json(data);
                  })
              })
          })
      }

      res.json({ message: tip.response });
    })
    .catch(next)
}
