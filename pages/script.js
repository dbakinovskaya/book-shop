/*fetch('books.json')
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
        }); */

const dom = {
    main: document.querySelector('main'),
}

const header = document.createElement('header');
header.innerHTML = '<img src="../assets/icons/logoicon.png" alt="logo of website"> <h1>Book Shop</h1>';
dom.main.append(header);