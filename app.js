import { MDCTopAppBar } from "@material/top-app-bar";
import { MDCTextField } from "@material/textfield";
import { MDCRipple } from "@material/ripple";
import { MDCList } from "@material/list";
import { MDCSnackbar } from "@material/snackbar";
import { iconStrings } from "@material/textfield";

// Instantiation
const topAppBar = new MDCTopAppBar(document.querySelector(".mdc-top-app-bar"));
const inputs = document.querySelectorAll(".mdc-text-field");
const buttonRipple = new MDCRipple(document.querySelector(".mdc-button"));
const list = new MDCList(document.querySelector(".mdc-list"));
const textField = Array.from(inputs).map(input => {
  new MDCTextField(input);
});
const snackBar = document.querySelector(".mdc-snackbar");

// Book Class: Represents a Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI Class: Handle UI Tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach(book => UI.addBookToList(book));
  }

  static displayBookLength() {
    const booksLength = document.querySelector('.book-length');

    if(Store.getBooks().length >= 1) {
        booksLength.style.display = 'none';
        booksLength.textContent = " ";
    } else {
        booksLength.style.display = 'block';
        booksLength.textContent = `It's Lonely Here`;
    }
    return Store.getBooks().length;
  }

  static addBookToList(book) {
      
    const list = document.querySelector("#books");
    const listItem = document.createElement("li");

    listItem.classList.add("mdc-list-item");
    listItem.innerHTML = `
    <div class="mdc-list-item__text">
    <div class="mdc-list-item__primary-text">${book.title}</div>
        <div class="mdc-list-item__secondary-text" value=${book.isbn}>
        ${book.author} - ${book.isbn} 
        </div>
        <i class="material-icons delete">delete</i>
    </div>
    `;
    const icon = document.querySelector(".material-icons");
    list.appendChild(listItem);
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message) {
    const div = document.createElement("div");
    const container = document.querySelector(".mdc-layout-grid");
    div.classList.add("mdc-snackbar");
    div.classList.add("mdc-snackbar--leading");
    div.innerHTML = `
    <div class="mdc-snackbar__surface">
        <div class="mdc-snackbar__label" role="status" aria-live="polite">
        ${message}
        </div>
    </div>`;
    container.append(div);
    new MDCSnackbar(div).open();
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}

// Store Class: Handles Storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event: Display Book
UI.displayBooks();
const bookLength = setInterval(UI.displayBookLength, 500);
if(UI.displayBookLength < 1) {
    clearInterval(bookLength);
} else {
    bookLength;
}


// Event: Add a Book
document.querySelector("form").addEventListener("submit", event => {
  event.preventDefault();
  // Get form values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please fill in all fields");
  } else {
    // Instantiate Book
    const book = new Book(title, author, isbn);
    // Add Book to UI
    UI.addBookToList(book);

    // Add Book to Storage
    Store.addBook(book);

    UI.showAlert("Book Added");

    // Clear fields
    UI.clearFields();
  }
});

// Event: Remove a Book
document.querySelector("#books").addEventListener("click", e => { 
  const isbn = e.target.previousElementSibling.getAttribute('value');
  // Remove book from UI
  UI.deleteBook(e.target);
  // Remove book from Storage
  Store.removeBook(isbn);
});

