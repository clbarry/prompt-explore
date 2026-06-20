
# Design Plan Narrative #

# Description 
Prompt explore is a web-based application that supports users looking to improve or expand their prompt engineering skills by exploring a database of existing user prompts and templates from a HuggingFace dataset. Users can also create and upload user prompts to quickly reference their favorite prompts when using applications such as Claude or ChatGPT.The following features will be available to users.

---

# Database Collections 

### prompts (main) collection:
Create: Users can create new prompts to add to the current prompt dataset. (Create Page)
Read: Users can explore the database of prompts by searching or filtering by rating and/or usefulness category. (RED Page)
Update: Users can update the prompt rating, which indicates the quality of the prompt. (RED Page)Delete: Users can delete a prompt from the dataset if it has an average rating below 3 stars out of 5, or if it contains offensive content. (RED Page)

### recently_deleted collection
Create: Moderator will create a new record in the main 'prompts' collection when they click 'Approve'. (moderator hidden page)Read: Moderator can iterate through the database as the page is populated with a single record's details. (moderator hidden page)Update: Moderator can update the prompts deleted by users and save edits for later, potentially to be reviewed by another moderator. (moderator hidden page)Delete: Moderator can decide to permanently delete a prompt from the recently_deleted collection. (moderator hidden page)

---

# User Personas 

## Vibe Coder
Goal: Improve my vibe-coding skills by exploring existing prompts for building applications and uploading my personal prompts for future reference.
Needs: A way to sort through usefulness categories for relevant prompts to my tech stack. I also need to be able to add my own prompts that I can reference later to use again.

## HCI Researcher
Goal: Explore how people are using AI. I want to see what tasks they are using AI for, what patterns emerge in prompting techniques, and the tones or sentiments used when communicating with agents.
Needs: A way to query the database and explore all user prompts. I need to be able to iterate through the different usefulness categories at my own pace to explore all prompts, and to see all the available usefulness categories to understand from a higher level how people are using LLMs.

## Student Looking for A Job
Goal: Obtain feedback and suggestions to improve my resume, cover letter, and interview preparation. 
Needs: A way to search the database and find user prompts related to job searching, resume feedback, and interview preparation. After I use the prompt, I would like to rate the prompt based on the results I get from using it in an LLM. 

---

# User Stories

## Sort by Usefulness Category
- As a vibe coder, I need to be able to sort the prompts in the database by categories that are relevant to me, such as prompts saved for front-end developers. The filter features on the RED page will allow me to navigate the database by usefulness category and user ratings.
- As a student looking for a job, I will also need to filter by usefulness category to look for prompts related to cover letters, interview prep, and resume reviews so that I can paste the prompts into an LLM of my choice

## Update Prompt Rating
- As a vibe coder, I might want to rate a prompt that worked well for me 5 stars, so that other vibe coders know this prompt is high quality.
- As a researcher, I might want to see how users are rating different prompts or explore prompt ratings by categories (i.e., how harsh are vibe coders in their reviews of prompts?). I will be able to collect this data because the site allows users to update prompt ratings. 
- As a student looking for a job, I might want to rate a prompt very poorly because it did not work very well and I was frustrated with the results. This will dissuade other students looking for jobs from using the bad prompt.

## Create a Prompt
- As a vibe coder, I may upload prompts that I used to successfully create a software feature. 
- As a student looking for a job, I may develop a prompt that is more useful than the available prompts. After I get a job, I may want to help other students in the hiring process and share my successful prompt.

---

# Work Division

### Page1: Home ### 
Home page. Users are welcomed to the site and informed about the purpose. 

### Page2: Prompts ###
Prompts [Read, Edit, Delete (RED)] Page. Edit – Users can edit the rating of a prompt by selecting their own star rating. This will contribute to the average rating of a promptRead – When a user visits the site, the client will request a stream of the first 50 entries of prompts from the database. Users will be able to create new requests by modifying filters and sorting (Show All, sort by rating, show all for filtered usefulness categories, etc).Delete – If an entry contains inappropriate content or is rated an average < 3 stars with at least 5 reviews, users can delete the prompt record from the database.

### Page 3: Create ### 
Create Page. Uploading a new response, the user would type in the prompt, select add from the list of usefulness categories. HTML, CSS, JS from (submit button connected to NodeJS) on submit, collect text information, and Express app will submit this new record to the Prompt MongoDB.

### Page 4: Moderator ###
Moderator Page. Moderator is able to load/read, edit, delete, or approve the prompts marked for deletion. (see recently_deleted CRUD description above). 

### Julia 
Julia will be responsible for the Read, Edit, Delete (RED) page full stack (HTML + ES6 modules + Express Routes).

### Carey 
Carey will be responsible for the Create  & Moderator page full stack (HTML + ES6 modules + Express Routes).