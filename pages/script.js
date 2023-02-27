const mainBox = document.querySelector('main');

const header = document.createElement('header');
header.innerHTML = '<img src="../assets/icons/logoicon.png" alt="logo of website"> <h1>Book Shop</h1>';
mainBox.append(header);

const content = document.createElement('div');
content.className = 'content';
mainBox.append(content);

const catalog = document.createElement('div');
catalog.className = 'catalog box';
catalog.innerHTML = '<h2>Book catalog</h2>';

const cart = document.createElement('div');
cart.className = 'cart box';
cart.innerHTML = '<h2>Shop cart</h2>';
content.append(catalog, cart);

const bookContainer = document.createElement('div');
bookContainer.className = 'book__container';
catalog.append(bookContainer);

function buildBookBox(book) {
    return `
        <img src = "${book.imageLink}" alt="book cover" class="book__cover">
        <h3>${book.title}</h3>
        <h4>${book.author}</h4>
        <p class="price">Price: ${book.price}</p>
    `
}

function buildButtons() {
    return `
        <button type="button" class="btn info">info</button>
        <button type="button" class="btn">&#128722</button>
    `
}

function renderContent() {
    for (let item of books){
        let book = document.createElement('div');
        book.className = 'book__content';
        let buttonBox = document.createElement('div');
        buttonBox.className = 'button__box';
        buttonBox.innerHTML = buildButtons();
        let bookContent = buildBookBox(item);
        book.innerHTML = bookContent;
        book.append(buttonBox);
        bookContainer.append(book);
    }
}

let books = [];

async function getData() {
    await fetch('books.json')
            .then(response => {
                return response.json();
            })
            .then(data => {
                data.forEach((item)=> {
                    books.push(item);
                });
            });
            renderContent();
}
getData();