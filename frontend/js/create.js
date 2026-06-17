/* This file is for JavaScript code related to the create.html page.*/

/* https://getbootstrap.com/docs/5.3/components/modal/ */

const myModal = document.getElementById("myModal");
const myInput = document.getElementById("myInput");

myModal.addEventListener("shown.bs.modal", () => {
  myInput.focus();
});
