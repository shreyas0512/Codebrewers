require('dotenv').config();
const sentenceGenerator = async (difficultyLevel, time)=>{

    const key = process.env.API_KEY;
    const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`
        },
        body: JSON.stringify({
          model: "text-davinci-003",
          prompt: `prepare a story to type for ${time} seconds having ${difficultyLevel} difficulty where difficulty implies the complexity of words and punctuations.`,
          max_tokens: 1024,
          temperature: 1
        })
      })

      const data = await response.json()
      return data.choices[0].text.trim().replace(/\n/g, '');
}

module.exports = sentenceGenerator;