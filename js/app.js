const bookForm = document.querySelector("#book-form");
const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const isbnInput = document.querySelector("#isbn");
const bookList = document.querySelector("#book-list");

let books = [];

bookForm.addEventListener("submit", addBook);
bookList.addEventListener("click", handleBookListClick);

function addBook(e) {
  e.preventDefault();

  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const isbn = isbnInput.value.trim();

  if (title === "" || author === "" || isbn === "") {
    displayNotification("Please enter all fields", "danger");
    return;
  }

  const newBook = {
    title,
    author,
    isbn
  };

  books.push(newBook);

  renderBook(newBook);

  saveBooksToStorage();

  displayNotification("Book added successfully", "success");

  bookForm.reset();
}

function renderBook(book) {
  const row = document.createElement("tr");

  const titleCell = document.createElement("td");
  titleCell.textContent = book.title;
  row.appendChild(titleCell);

  const authorCell = document.createElement("td");
  authorCell.textContent = book.author;
  row.appendChild(authorCell);

  const isbnCell = document.createElement("td");
  isbnCell.textContent = book.isbn;
  row.appendChild(isbnCell);

  const actionCell = document.createElement("td");

  const editButton = document.createElement("button");
  editButton.classList.add("btn", "btn-primary", "btn-sm", "me-1");
  editButton.textContent = "Edit";
  actionCell.appendChild(editButton);

  const saveButton = document.createElement("button");
  saveButton.classList.add("btn", "btn-success", "btn-sm");
  saveButton.textContent = "Save";
  saveButton.style.display = "none";
  actionCell.appendChild(saveButton);

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("btn", "btn-danger", "btn-sm");
  deleteButton.textContent = "Delete";
  actionCell.appendChild(deleteButton);

  row.appendChild(actionCell);
  row.setAttribute('data-title', book.title.toLowerCase())

  bookList.appendChild(row);
}

function handleBookListClick(e) {
  const target = e.target;

  if (target.classList.contains("btn-primary")) {
    handleEditClick(target);
  } else if (target.classList.contains("btn-success")) {
    handleSaveClick(target);
  } else if (target.classList.contains("btn-danger")) {
    handleDeleteClick(target);
  }
}

function handleEditClick(button) {
  const row = button.closest("tr");
  const titleCell = row.querySelector("td:first-child");
  const authorCell = row.querySelector("td:nth-child(2)");

  titleCell.contentEditable = true;
  authorCell.contentEditable = true;
  titleCell.classList.add("editable", "edit-mode");
  authorCell.classList.add("editable", "edit-mode");

  button.style.display = "none";
  const saveButton = button.nextElementSibling;
  saveButton.style.display = "inline-block";
}

function handleSaveClick(button) {
  const row = button.closest("tr");
  const titleCell = row.querySelector("td:first-child");
  const authorCell = row.querySelector("td:nth-child(2)");

  titleCell.contentEditable = false;
  authorCell.contentEditable = false;
  titleCell.classList.remove("editable", "edit-mode");
  authorCell.classList.remove("editable", "edit-mode");

  button.style.display = "none";
  const editButton = button.previousElementSibling;
  editButton.style.display = "inline-block";

  const title = titleCell.textContent.trim();
  const author = authorCell.textContent.trim();
  const isbn = row.querySelector("td:nth-child(3)").textContent.trim();

  const updatedBook = {
    title,
    author,
    isbn
  };

  const bookIndex = books.findIndex((book) => book.isbn === isbn);
  books.splice(bookIndex, 1, updatedBook);

  saveBooksToStorage();

  displayNotification("Book updated successfully", "warning");
}

function handleDeleteClick(button) {
  const row = button.closest("tr");
  const isbn = row.querySelector("td:nth-child(3)").textContent.trim();

  const bookIndex = books.findIndex((book) => book.isbn === isbn);
  books.splice(bookIndex, 1);

  row.remove();

  saveBooksToStorage();

  displayNotification("Book removed successfully", "danger");
}

function displayNotification(message, type) {
  const notification = document.createElement("div");
  notification.classList.add("alert", `alert-${type}`);
  notification.textContent = message;

  const container = document.querySelector(".container");
  container.insertBefore(notification, bookForm);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function saveBooksToStorage() {
  localStorage.setItem("books", JSON.stringify(books));
}

function retrieveBooksFromStorage() {
  const storedBooks = localStorage.getItem("books");
  if (storedBooks) {
    books = JSON.parse(storedBooks);
    books.forEach(renderBook);
  }
}

retrieveBooksFromStorage();

const searchInput = document.querySelector('#search-input');
searchInput.addEventListener('input', handleSearch);

function handleSearch() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  const bookRows = Array.from(bookList.getElementsByTagName('tr'));
  bookRows.forEach((row) => {
    const title = row.getAttribute('data-title');
    if (title.includes(searchTerm)) {
      row.style.display = 'table-row';
    } else {
      row.style.display = 'none';
    }
  });
}