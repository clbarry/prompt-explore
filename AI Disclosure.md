# AI Disclosure

This project used AI assistance through Copilot Chat and Claude Sonnet 4.6 for planning, debugging, UI/CSS guidance, deployment troubleshooting, and README documentation support.
AI was also used to draft and organize this AI Disclosure page.

## Disclosure Log

| Category | Prompt / Use | Reason for Use |
| --- | --- | --- |
| Create Page | "How would I make the modal button go back without clearing the form?" | To adjust the form flow so the user could return to editing without losing entered values. |
| Create Page | "How would I make the font inside the alert follow the Bootstrap rules except font type" | To style the alert text while keeping Bootstrap spacing, sizing, and layout rules. |
| Create Page | "can I change it just for the alert" | To confirm whether the alert could be styled independently from the rest of the page. |
| Moderator | "will the highlighted code submit the form data to the prompt database or recently deleted" | To understand which collection the moderator save-edits flow was updating. |
| Moderator | "is the mod_saveedit.js fixed correctly" | To verify whether the moderator save-edits logic was implemented correctly. |
| Moderator | "How would I update by id and not create a new one" | To make the moderator edit flow update an existing prompt instead of inserting a duplicate. |
| Moderator | "what do you mean by this: Right now moderator.js is still reading formData.get(\"use\"), formData.get(\"prompt\"), formData.get(\"contributor\"), but your HTML fields are useMod, promptMod, contributorMod and do not currently include a promptId field. So you still need to send the loaded prompt id from the frontend for this to work end to end." | To align the frontend form field names with the backend data being submitted. |
| Moderator Load | "Is load now set to load prompt only from the recently_deleted collection?" | To confirm the moderator load flow was reading from the correct collection. |
| Moderator Load | "could I just change the mod_load.js to promptId and not id to fix this" | To determine whether a naming change would solve the load-by-id issue. |
| Moderator Load | "it load the first entry in the recently_deleted database?" | To verify whether the moderator loader started from the first available deleted prompt. |
| Moderator Load | "I want it to automatically load the first prompt" | To make the moderator workflow start with the first prompt automatically. |
| Moderator Load | "does this seem better?" | To compare implementation options and choose the clearer approach. |
| Moderator Load | "Is there a way to make it load the next prompt each time you press the button" | To support sequential review of prompts in the moderator UI. |
| Deployment | "I am getting this error when trying to deploy on render Error: Cannot find module '/opt/render/project/src/index.js'" | To fix the deployment entrypoint so Render starts the correct server file. |
| Deployment | "I deployed on render, but am getting this error MongoServerSelectionError: 00FD7991E4720000:error:0A000438:SSL routines:ssl3_read_bytes:tlsv1 alert internal error:../deps/openssl/openssl/ssl/record/rec_layer_s3.c:918:SSL alert number 80" | To troubleshoot MongoDB Atlas connection and TLS configuration issues on Render. |
| Documentation | "I want you to think like a full-stack engineer with experience in HTML and CSS, and create a README file for this project using the guide I am providing." | To produce a complete README that matched the assignment requirements. |
| Documentation | "include a structure graphic" | To add a visual project layout diagram to the README. |
| Documentation | "add a comment about the use of Render for deployment" | To document the hosting platform and deployment notes in the README. |

## Summary

AI was used as a development assistant for clarification, debugging support, documentation drafting, and reviewing implementation choices. Final code and documentation were reviewed and adjusted manually for this project.
