// TraversyMedia YT
// https://www.youtube.com/watch?v=JaMCxVWtW58&t=44s&ab_channel=TraversyMedia

// --------------------------------------------------------------------------------

// Book Class =  represents a book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn
  }
}

// UI Class = handle UI tasks
class UI {
  static displayBooks() {
    const books =  Store.getBooks();
    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector('#book-list');
    const row = document.createElement('tr');

    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;

    list.appendChild(row)
  }

  static deleteBook(el) {
    if(el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const divAlert = document.createElement('div');
    divAlert.className = `alert-box alert alert-${className}`;
    divAlert.append(message);

    const containerAlert =  document.querySelector('.container');
    const form = document.querySelector('#book-form');
    containerAlert.insertBefore(divAlert, form);

    // Vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 2000)
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }
}

// Store Class = handles storage
class Store {
  static getBooks() {
    let books;
    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'))
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    // ISBN because it should be unique
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if(book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books))
  }
}

// Event = display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event = add a book
document.querySelector('#book-form').addEventListener('submit', (e) => {
  // Prevent actual submit
  e.preventDefault()

  //Get form values
  const title = document.querySelector('#title').value
  const author = document.querySelector('#author').value
  const isbn = document.querySelector('#isbn').value

  // Validation
  if(title === '' || author === '' || isbn === '') {
    UI.showAlert('Fill all the fields.', 'danger')
  } else {
    // Instatiate book
    const book = new Book(title, author, isbn)
    // Add book to UI
    UI.addBookToList(book);

    // Add book to localstorage
    Store.addBook(book);

    // Show success message
    UI.showAlert('Book added!', 'success');
  
    // Clear fields
    UI.clearFields()
  }
})

// Event = Remove a book
document.querySelector('#book-list').addEventListener('click', (e) => {
  // Event propagation with e.target
  UI.deleteBook(e.target);

  // Remove book from UI
  UI.showAlert('Book removed!', 'info');

  // Remove book from localstorage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
});