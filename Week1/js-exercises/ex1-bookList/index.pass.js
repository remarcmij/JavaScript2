/*
  
 ** Exercise 1: The book list **

  I'd like to display my three favorite books inside a nice webpage!

  1. Iterate through the array of books.
  2. For each book, create a `<p>`
  element with the book title and author and append it to the page.
  3. Use a `<ul>`  and `<li>` to display the books.
  4. Add an `<img>` to each book that links to a URL of the book cover.
  5. Change the style of the book depending on whether you have read it(green) or not(red).

  The end result should look something like this:
  https: //hyf-js2-week1-makeme-ex1-demo.herokuapp.com/

*/

function createBookList(books) {
  const ul = document.createElement('ul');
  books.forEach(book => {
    const li = document.createElement('li');
    const p = document.createElement('p');
    p.textContent = `${book.title} by ${book.author}`;
    li.appendChild(p);
    const img = document.createElement('img');
    img.src = `./assets/${book.image}`;
    img.alt = book.title;
    li.appendChild(img);
    ul.appendChild(li);
  });
  return ul;
}

const myBooks = [
  {
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    image: 'the_design_of_everyday_things.jpg',
    alreadyRead: false,
  },
  {
    title: 'The Most Human Human',
    author: 'Brian Christian',
    image: 'the_most_human_human.jpg',
    alreadyRead: true,
  },
  {
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt',
    image: 'the_pragmatic_programmer.jpg',
    alreadyRead: true,
  },
];

const ulElement = createBookList(myBooks);

document.querySelector('#bookList').appendChild(ulElement);
