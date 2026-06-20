/* Identify DOM Elements */
const btnLoadPrompt = document.getElementById("btn-LoadPrompt");
const btnDeletePrompt = document.getElementById("btn-DeletePrompt");
const btnSaveEdits = document.getElementById("btn-SaveEdits");
const btnApproveEdits = document.getElementById("btn-ApproveEdits");

/* Define form and log elements */
const form = document.getElementById("moderatorForm");
const log = document.getElementById("moderatorLog");

/* Event Listeners for Moderator Actions */

/* LOAD PROMPT MODERATOR PAGE */
/* Load Prompt button will fetch the next prompt in the review queue */
async function loadPrompt(after) {
  try {
    const query = after ? `?after=${encodeURIComponent(after)}` : "";
    const response = await fetch(`/api/recently-deleted${query}`);
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      /* Loads back to the first prompt if no more prompts are available */
      if (response.status === 404 && after) {
        form.elements["promptId"].value = "";
      }
      log.textContent = err.error || "No prompts in the review queue.";
      return;
    }
    const prompt = await response.json();

    const loadedId = prompt?._id?.$oid || prompt?._id?.toString() || prompt?._id || "";
    form.elements["promptId"].value = loadedId;

    // Populate form fields with prompt data
    form.elements["use"].value = prompt.use || "";
    form.elements["prompt"].value = prompt.prompt || "";
    form.elements["contributor"].value = prompt.contributor || "";
    log.textContent = "Prompt loaded successfully!";
  } catch (error) {
    console.error("Load prompt failed:", error);
    if (error.message.includes("404")) {
      log.textContent = "No prompts in the review queue.";
    } else {
      log.textContent = "Failed to load prompt. Please try again.";
    }
  }
}

btnLoadPrompt.addEventListener("click", async () => {
  const currentId = form.elements["promptId"].value;
  await loadPrompt(currentId);
});

/* DELETE PROMPT MODERATOR PAGE */
async function deletePrompt(promptId) {
  if (!promptId) {
    log.textContent = "Load a prompt before attempting to delete.";
    return;
  }

  try {
    const response = await fetch("/api/mod_delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promptId }),
    });
    const result = await response.json();

    if (response.ok) {
      form.reset();
      log.textContent = "Prompt deleted successfully!";
    } else {
      log.textContent = result.error || "Delete failed. Please try again.";
    }
  } catch (e) {
    console.error(e);
    log.textContent = "An error occurred. Please try again.";
  }
}

btnDeletePrompt.addEventListener("click", async () => {
  const promptId = form.elements["promptId"].value;
  await deletePrompt(promptId);
});

btnSaveEdits.addEventListener("click", async () => {
  await sendData();
});

/* Resources: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Sending_forms_through_JavaScript */
/* SUBMITTING THE FORM DATA TO THE BACKEND */

async function sendData() {
  // Associate the FormData object with the form element
  const formData = new FormData(form);
  const promptId = formData.get("promptId");

  if (!promptId) {
    log.textContent = "Load a prompt before saving edits.";
    return;
  }

  try {
    const response = await fetch("/api/mod_saveedits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        promptId,
        use: formData.get("use"),
        prompt: formData.get("prompt"),
        contributor: formData.get("contributor"),
      }),
    });
    const result = await response.json();

    if (response.ok) {
      log.textContent = "Prompt edits submitted successfully!";
      return true;
    } else {
      log.textContent = result.error || "Submit failed. Please try again.";
      return false;
    }
  } catch (e) {
    console.error(e);
    log.textContent = "An error occurred. Please try again.";
    return false;
  }
}

async function approvePrompt() {
  const formData = new FormData(form);
  const promptId = formData.get("promptId");

  if (!promptId) {
    log.textContent = "Load a prompt before approving edits.";
    return false;
  }

  try {
    const response = await fetch("/api/mod_approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        promptId,
        use: formData.get("use"),
        prompt: formData.get("prompt"),
        contributor: formData.get("contributor"),
      }),
    });
    const result = await response.json();

    if (!response.ok) {
      log.textContent = result.error || "Approve failed. Please try again.";
      return false;
    }

    return true;
  } catch (e) {
    console.error(e);
    log.textContent = "An error occurred. Please try again.";
    return false;
  }
}

// Take over form submission (Approve Edits button will submit the form)
form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendData();
});

btnApproveEdits.addEventListener("click", async () => {
  const promptId = form.elements["promptId"].value;

  if (!promptId) {
    log.textContent = "Load a prompt before approving edits.";
    return;
  }

  const approved = await approvePrompt();
  if (!approved) return;

  form.reset();
  log.textContent = "Prompt edits approved and moved back to prompts.";
});

