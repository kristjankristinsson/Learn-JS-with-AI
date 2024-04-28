require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());
app.use(express.static("public"));

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/generateForLoopTask", async (req, res) => {
  const { userCode } = req.body;
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a JavaScript for loop. Please evaluate the following code:",
          },
          { role: "user", content: userCode },
        ],
        max_tokens: 150,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (
      response.data &&
      response.data.choices &&
      response.data.choices.length > 0
    ) {
      const hint = response.data.choices[0].message.content;
      const passTest =
        userCode.includes("for") &&
        userCode.includes("{") &&
        hint.includes("for loop");
      const message = passTest
        ? "Well done! Your code correctly uses a for loop."
        : "Keep trying!";

      res.json({ hint, message, nextButton: passTest });
    } else {
      throw new Error("Invalid API response");
    }
  } catch (error) {
    console.error(
      "API call failed:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .json({ error: "Error processing your request", details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
