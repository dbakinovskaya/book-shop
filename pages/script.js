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

function buildBookBox(book) {
    return `
        <img src = "${book.imageLink}" alt="book cover" class="book__cover">
        <h3>${book.title}</h3>
        <h4>${book.author}</h4>
        <p>Price: ${book.price}</p>
    `
}

function renderContent() {
    for (let item of books){
        let book = document.createElement('div');
        book.className = 'book__content'
        let bookContent= buildBookBox(item);
        book.innerHTML = bookContent;
        catalog.append(book);
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