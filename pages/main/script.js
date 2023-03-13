const mainBox = document.querySelector('main');

const header = document.createElement('header');
header.innerHTML = '<img src="../../assets/icons/logoicon.png" alt="logo of website"> <h1>Book Shop</h1>';
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

const cartContent = document.createElement('div');
cartContent.className = 'cart__content';
cartContent.innerHTML = `
    <div class="book__list"></div>
    <p class="total__sum">Total: <span id="total">0</span>&#36</p>
    <a href="../form/index.html" class="submit">Proceed to checkout</a>
`;
cart.append(cartContent);

content.append(catalog, cart);

const bookContainer = document.createElement('div');
bookContainer.className = 'book__container';
catalog.append(bookContainer);

function buildBookBox(book) {
    return `
        <img src = "${book.imageLink}" alt="book cover" class="book__cover">
        <h3>${book.title}</h3>
        <h4>${book.author}</h4>
        <p class="price">Price: ${book.price}&#36</p>
    `
}

function buildButtons() {
    return `
        <button class="btn open__modal">info</button>
        <button class="btn add__item">&#128722</button>
    `
}

function buildModalContent(book) {
    return `
        <img src = "${book.imageLink}" alt="book cover" class="book__cover__modal">
        <div class='description'>
            <h3>${book.title}</h3>
            <p>${book.description}</p>
        </div>
        <button class='close__modal btn'> &#10006 </button>
    `
}

function buildModal(content) {
    const modContainer = document.createElement('div');
    modContainer.className = 'modal__container';

    const modBody = document.createElement('div');
    modBody.className = 'modal__body';
    modBody.innerHTML = buildModalContent(content);

    modContainer.append(modBody);
    return modContainer;
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

        const modal = buildModal(item);

        const bookWrapper = document.createElement('div');
        bookWrapper.className = 'book__wrapper';
        bookWrapper.setAttribute('data-id', books.indexOf(item));
        bookWrapper.setAttribute('draggable', true);
        bookWrapper.append(book, modal);

        bookContainer.append(bookWrapper);
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

function showModal(event) {
    let elem = event.target;
    const body = document.querySelector('body');

    if (elem.classList.contains('open__modal')) {
        let parent = elem.closest('.book__wrapper');
        let modal = parent.lastElementChild;
        modal.style.display = 'block';
        body.classList.add('modal__open');
    }

    if (elem.classList.contains('close__modal')) {
        let modal = elem.closest('.modal__container');
        modal.style.display = 'none';
        body.classList.remove('modal__open');
    }
};

function buildCartItem(book) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart__item';
    cartItem.innerHTML = `
        <img src = "${book.imageLink}" alt="book cover" class="book__cover">
        <div class='cart__description'>
            <p>${book.title}</p>
            <p>${book.author}</p>
            <p>Price: ${book.price}&#36</p>
        </div>
        <p>x<span class='quantity'>1</span></p>
        <button class="delete__book btn"> &#10006 </button>
    `
    return cartItem;
}

function addItem(event) {
    let elem = event.target;
    const parentElement = elem.closest('.book__wrapper');
    const id = parentElement.dataset.id;
    const bookList = document.querySelector('.book__list');
    const newItem = bookList.querySelector(`[data-id='${id}']`);

    if (elem.classList.contains('add__item')&& !newItem) {
        const book = buildCartItem(books[id]);
        book.setAttribute('data-id', id);
        bookList.append(book);
        total.innerText = Number(total.innerText) + books[id].price;
    }

    if (elem.classList.contains('add__item') && newItem) {
        let itemQuantity = newItem.querySelector('.quantity');
        ++itemQuantity.innerText;
        total.innerText = Number(total.innerText) + books[id].price;
    }

    showConfirmBtn();
}

function deleteItem(event) {
    const elem = event.target;
    const parentElement = elem.closest('.cart__item');
    const id = parentElement.dataset.id;
    let quantity = parentElement.querySelector('.quantity');


    if (elem.classList.contains('delete__book') && (quantity.innerText >= 1)) {
        --quantity.innerText;
        total.innerText = Number(total.innerText) - books[id].price;
    }

    if (elem.classList.contains('delete__book') && (quantity.innerText == 0)) {
        parentElement.remove();
    }

    showConfirmBtn();
}

function showConfirmBtn () {
    const bookList = document.querySelector('.book__list');
    const btn = document.querySelector('.submit');
    if (bookList.querySelector('.cart__item')) {
        btn.style.display = 'block';
    } else {
        btn.style.display = 'none';
    }
}

bookContainer.addEventListener('click', showModal);
bookContainer.addEventListener('click', addItem);
cartContent.addEventListener('click', deleteItem);

bookContainer.addEventListener('dragstart', function(event){
    const elem = event.target;
    if(elem.classList.contains('book__wrapper')) {
        elem.setAttribute('id', 'dragging');
    }
});

bookContainer.addEventListener('dragend', function(event){
    const elem = event.target;
    elem.removeAttribute('id');
});

cartContent.addEventListener('dragover', function(event){
    event.preventDefault();
});

cartContent.addEventListener('drop', function(event){
    event.preventDefault();
    const currentBook = document.querySelector('#dragging');
    const id = currentBook.dataset.id;
    const bookList = document.querySelector('.book__list');
    const newItem = bookList.querySelector(`[data-id='${id}']`);

    if (!newItem) {
        const book = buildCartItem(books[id]);
        book.setAttribute('data-id', id);
        bookList.append(book);
        total.innerText = Number(total.innerText) + books[id].price;
        event.preventDefault();

    }

    if (newItem) {
        let itemQuantity = newItem.querySelector('.quantity');
        ++itemQuantity.innerText;
        total.innerText = Number(total.innerText) + books[id].price;
        event.preventDefault();
    }
});