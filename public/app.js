async function submitCode() {
  const code = document.getElementById("codeInput").value;
  try {
    const response = await fetch("/generateForLoopTask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userCode: code }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    // Clear previous messages
    document.getElementById("feedback").innerHTML = "";
    // Start typewriter effect with new message
    startTypewriter(data.message || "No feedback available");

    document.getElementById("nextChallengeForm").style.display = data.nextButton
      ? "block"
      : "none";
  } catch (error) {
    document.getElementById("feedback").textContent = `Error: ${error.message}`;
  }
}

document.getElementById("submitBtn").addEventListener("click", submitCode);

let isDarkMode = false;
function toggleDarkMode() {
  const styles = isDarkMode
    ? ["white", "black", "🌚"]
    : ["black", "white", "🌕"];
  document.body.style.color = styles[0];
  document.body.style.backgroundColor = styles[1];
  document.getElementById("darkMode").textContent = styles[2];
  isDarkMode = !isDarkMode;
}

document.getElementById("darkMode").addEventListener("click", toggleDarkMode);

// Typewriter effect function
var i = 0;
var txt = ""; // The text to be typed out
var speed = 50; // Typing speed in milliseconds

function startTypewriter(text) {
  txt = text; // Set the text from API response
  i = 0; // Reset the index for each new message
  typeWriter(); // Start the typewriter effect
}

function typeWriter() {
  if (i < txt.length) {
    document.getElementById("feedback").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}
