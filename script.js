// ====== data + constructor ======
const myLibrary = [];

function Book(title, author, pages, hadRead) {
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.hadRead = !!hadRead; // boolean covertion
}

Book.prototype.toggleRead = function () {
  this.hadRead = !this.hadRead;
};

// ====== DOM refs ======
const bookForm = document.querySelector("#book-form"); // <form id="book-form">
const cardContainer = document.querySelector(".card-container"); // where cards go
const formContainer = document.querySelector(".form-container"); // modal wrapper
const formIcon = document.querySelector(".form-icon"); // open form button
const closeBtn = document.querySelector(".x-btn"); // close button

// ====== open/close form (small UX) ======
if (formIcon && formContainer) {
  formIcon.addEventListener("click", () => formContainer.classList.toggle("hidden"));
}
if (closeBtn && formContainer) {
  closeBtn.addEventListener("click", () => formContainer.classList.add("hidden"));
}

// ====== add book to library (separate from constructor) ======
function addBookToLibrary(title, author, pages, hadRead) {
  const book = new Book(title, author, pages, hadRead);
  myLibrary.push(book);
  return book;
}

// ====== rendering helpers (no innerHTML) ======
function createTextSpan(className, text) {
  const span = document.createElement("span");
  span.classList.add(className);
  span.textContent = text;
  return span;
}

function createCardElement(book) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.id = book.id; // create data-id attribute to make the div unique and identifiable

  // Title
  const titleEl = document.createElement("h3");
  titleEl.classList.add("title");
  titleEl.textContent = "Title: ";
  titleEl.append(createTextSpan("title-value", book.title));

  // Author
  const authorEl = document.createElement("h3");
  authorEl.classList.add("author");
  authorEl.textContent = "Author: ";
  authorEl.append(createTextSpan("author-value", book.author));

  // Pages
  const pagesEl = document.createElement("h3");
  pagesEl.classList.add("pages");
  pagesEl.textContent = "Pages: ";
  pagesEl.append(createTextSpan("pages-value", String(book.pages)));

  // Read status
  const readEl = document.createElement("h3");
  readEl.classList.add("readStatus");
  readEl.textContent = "Read Status: ";
  readEl.append(createTextSpan("readStatus-value", book.hadRead ? "Yes" : "No"));

  // Remove button
  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.classList.add("remove-btn");
  removeBtn.textContent = "Remove";

  // Read toggle button
  const toggleBtn = document.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.classList.add("readToggle-btn");
  toggleBtn.textContent = book.hadRead ? "Mark Unread" : "Mark Read";

  // Append elements into card
  card.append(titleEl, authorEl, pagesEl, readEl, removeBtn, toggleBtn);
  return card;
}

// Rebuild UI from myLibrary array
function renderLibrary() {
  // clear existing
  cardContainer.innerHTML = ""; 
  // create nodes
  myLibrary.forEach((book) => {
    const card = createCardElement(book);
    cardContainer.appendChild(card);
  });
}

// ====== form submit handling ======
if (bookForm) {
  bookForm.addEventListener("submit", (e) => {
    e.preventDefault(); 

    // read + trim values
    const titleInput = bookForm.querySelector("#title");
    const authorInput = bookForm.querySelector("#author");
    const pagesInput = bookForm.querySelector("#pages");
    const readSelect = bookForm.querySelector("#has-read");

    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const pages = pagesInput.value.trim();
    const hadRead = readSelect.value === "yes"; // coverts the value to boolean 

    // validation
    if (!title || !author || !pages) {
      alert("Please fill out Title, Author and Pages.");
      return;
    }
    if (!/^\d+$/.test(pages) || Number(pages) < 1) {
      alert("Pages must be a positive whole number.");
      return;
    }

    // add to library (data layer)
    addBookToLibrary(title, author, Number(pages), hadRead);

    // update UI
    renderLibrary();

    // reset form + close
    bookForm.reset();
    if (formContainer) formContainer.classList.add("hidden");
  });
}

// ====== event delegation for Remove and Toggle (works for dynamic cards) ======
document.addEventListener("click", (e) => {
  // Remove
  if (e.target.matches(".remove-btn")) {
    const card = e.target.closest(".card");
    if (!card) return;
    const id = card.dataset.id;
    const index = myLibrary.findIndex((b) => b.id === id);
    if (index > -1) {
      myLibrary.splice(index, 1); // remove from array
      renderLibrary();
    }
    return;
  }

  // Read toggle
  if (e.target.matches(".readToggle-btn")) {
    const card = e.target.closest(".card");
    if (!card) return;
    const id = card.dataset.id;
    const book = myLibrary.find((b) => b.id === id);
    if (!book) return;
    book.toggleRead();
    renderLibrary(); // re-render to reflect change
  }
});

// ====== optional: seed some books so you see something ======
addBookToLibrary("Harry Potter", "J. K. Rowling", 199, true);
// addBookToLibrary("Clean Code", "Robert C. Martin", 450, false);
renderLibrary();
