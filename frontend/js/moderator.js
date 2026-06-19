/* Identify DOM Elements */
const btnLoadPrompt = document.getElementById("btn-LoadPrompt");
const btnDeletePrompt = document.getElementById("btn-DeletePrompt");
const btnSaveEdits = document.getElementById("btn-SaveEdits");
const btnApproveEdits = document.getElementById("btn-ApproveEdits");
const btnSkip = document.getElementById("btn-Skip");

/* Define form and log elements */
const form = document.getElementById("moderatorForm");
const log = document.getElementById("moderatorLog");

/* Event Listeners for Moderator Actions */


async function loadPrompt(promptId) {
  try {
    const query = promptId ? `?promptId=${encodeURIComponent(promptId)}` : "";
    const response = await fetch(`/api/recently-deleted${query}`);
    if (!response.ok) {
      throw new Error(`Error fetching prompt: ${response.statusText}`);
    }
    const prompt = await response.json();

    const loadedPromptId = prompt?._id?.$oid || prompt?._id || "";
    form.elements["promptId"].value = loadedPromptId;

    // Populate form fields with prompt data
    form.elements["use"].value = prompt.use || "";
    form.elements["prompt"].value = prompt.prompt || "";
    form.elements["contributor"].value = prompt.contributor || "";
    log.textContent = "Prompt loaded successfully!";
  } catch (error) {
    console.error("Load prompt failed:", error);
    log.textContent = "Failed to load prompt. Please try again.";
  }
}

btnLoadPrompt.addEventListener("click", async () => {  
  const promptId = form.elements["promptId"].value;
  await loadPrompt(promptId);
});




btnDeletePrompt.addEventListener("click", async () => deletePrompt(promptId));




btnSaveEdits.addEventListener("click", async () => {  
});




/* Resources: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Sending_forms_through_JavaScript */
/* SUBMITTING THE FORM DATA TO THE BACKEND */

async function sendData() {
  // Associate the FormData object with the form element
  const formData = new FormData(form);

  try {
    const response = await fetch("/api/mod_saveedits", {
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
      log.textContent = "Prompt edits submitted successfully!";
    } else {
      log.textContent = result.error || "Submit failed. Please try again.";
    }
  } catch (e) {
    console.error(e);
    log.textContent = "An error occurred. Please try again.";
  }
}

// Take over form submission (Approve Edits button will submit the form)
form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendData();
});

btnApproveEdits.addEventListener("click", async () => {  
});




btnSkip.addEventListener("click", async () => {  
});
    