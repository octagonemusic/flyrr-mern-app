const asyncHandler = require("express-async-handler");
const axios = require("axios");

const JUDGE0_API = "https://judge0-ce.p.rapidapi.com";
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY; // Add this to your .env file

const executeCode = asyncHandler(async (req, res) => {
  const { source_code, language_id } = req.body;

  try {
    // Step 1: Submit the code
    const submitResponse = await axios.post(
      `${JUDGE0_API}/submissions`,
      {
        source_code: source_code,
        language_id: language_id,
        stdin: "",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "X-RapidAPI-Key": RAPIDAPI_KEY,
        },
      }
    );

    const token = submitResponse.data.token;

    // Step 2: Get the results (with retries)
    let attempts = 0;
    const maxAttempts = 10;
    while (attempts < maxAttempts) {
      const resultResponse = await axios.get(
        `${JUDGE0_API}/submissions/${token}`,
        {
          headers: {
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "X-RapidAPI-Key": RAPIDAPI_KEY,
          },
        }
      );

      const { status, stdout, stderr, compile_output } = resultResponse.data;

      if (status.id >= 3) {
        // Status 3 means finished
        return res.json({
          output: stdout || stderr || compile_output || "No output",
          status: status.description,
        });
      }

      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retrying
    }

    throw new Error("Execution timeout");
  } catch (error) {
    console.error("Code execution error:", error);
    res.status(500).json({
      error:
        "Error executing code: " +
        (error.response?.data?.error || error.message),
    });
  }
});

module.exports = { executeCode };
