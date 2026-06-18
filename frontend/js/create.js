
/* This file is for JavaScript code related to the create.html page.*/

/* MODAL CODE (BOOTSTRAP) */
/* https://getbootstrap.com/docs/5.3/components/modal/ */


/* DEFINE CONSTANTS */
const clearBtn = document.getElementById("btn-ClearPrompt");
const form = document.getElementById("formCreatePrompt");
const log = document.getElementById("log");

/* CLEAR THE FORM */
function logReset(event) {
  log.textContent = "Form reset!";
}

form.addEventListener("reset", logReset);


clearBtn.addEventListener("click", () => {
  document.getElementById("formCreatePrompt").reset();
});

/* Resources: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Sending_forms_through_JavaScript */
/* SUBMITTING THE FORM DATA TO THE BACKEND */

async function sendData() {
  // Associate the FormData object with the form element
  const formData = new FormData(form);

  try {
    const response = await fetch("/api/create", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ 
        use: formData.get("use"), 
        prompt: formData.get("prompt"), 
        contributor: formData.get("contributor"), 
        rating: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 } }),
    });
    const result = await response.json();

    if (response.ok) {
      form.reset();
      log.textContent = "Prompt submitted successfully!";
    } else {
      log.textContent = result.error || "Submit failed. Please try again.";
    }
  } catch (e) {
    console.error(e);
    log.textContent = "An error occurred. Please try again.";
  }
}

// Take over form submission
form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendData();
});