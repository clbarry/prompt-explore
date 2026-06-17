
/* This file is for JavaScript code related to the create.html page.*/

/* MODAL CODE (BOOTSTRAP) */
/* https://getbootstrap.com/docs/5.3/components/modal/ */
const myModal = document.getElementById("myModal");
const myInput = document.getElementById("myInput");

myModal.addEventListener("shown.bs.modal", () => {
  myInput.focus();
});

/* CLEARING THE FORM */
const clearBtn = document.getElementById("btn-ClearPrompt");
const form = document.querySelector("formCreatePrompt");

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
    const response = await fetch("/api.", {
      method: "POST",
      // Set the FormData instance as the request body
      body: formData,
    });
    console.log(await response.json());
  } catch (e) {
    console.error(e);
  }
}

// Take over form submission
form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendData();
});