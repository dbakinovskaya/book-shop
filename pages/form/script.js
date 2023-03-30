function buildError(elem) {
    const coords = elem.getBoundingClientRect();

    const div = document.createElement('div');
    div.className = "error__msg";
    div.innerHTML = "The field is invalid";

    div.style.left = (coords.left+48) + 'px';
    div.style.top = (coords.top - 16 + window.pageYOffset) + 'px';

    return div;
}

function showErrorMsg(elem) {
    const errorMsg = buildError(elem);

    elem.classList.add('error');
    if (elem.nextSibling.className !== 'error__msg') elem.after(errorMsg);
}

function deleteErrorMsg(elem) {
    elem.classList.remove('error');
    if (elem.nextSibling.className === 'error__msg') elem.nextSibling.remove();
}

function checkPersonalInfo(event) {
    const field = event.target;
    const nameReq = (field.id === 'firstname') && (field.value.length < 4);
    const surnameReq = (field.id === 'surname') && (field.value.length < 5);
    const number = /[0-9]/.test(field.value);
    const space = /\s/.test(field.value);

    (nameReq || surnameReq || number || space) ? showErrorMsg(field) : deleteErrorMsg(field);
}

person.addEventListener('focusout', checkPersonalInfo);

function getDeliveryDate() {
    const date = new Date();
    const day = date.getDate() +1;
    let month = date.getMonth() +1;
    const year = date.getFullYear();

    if (month <= 9) {
        month = '0' + month
    }

    return `${year}-${month}-${day}`;
}
date.setAttribute('min', getDeliveryDate());

function checkDeliveryInfo(event) {
    const field = event.target;
    const streetReq = ((field.id === 'street') && (field.value.length < 5));
    const houseReq = ((field.id === 'house') && (field.value <= 0 || isNaN(field.value)));
    const flatReq = ((field.id === 'flat') && (field.value.startsWith('-') || isNaN(field.value.replace('-','')) || (field.value.replace('-','')) <= 0));
    const dateReq = ((field.id === 'date') && (!field.value || field.value < getDeliveryDate()));

    (streetReq || houseReq || flatReq || dateReq) ? showErrorMsg(field) : deleteErrorMsg(field);
}

delivery.addEventListener('focusout', checkDeliveryInfo);

function checkQuantity() {
    changeStatus();

    let checkedGifts = document.querySelectorAll('[data-status="checked"]');
    let uncheckedGifts = document.querySelectorAll('[data-status="unchecked"]');

    if (checkedGifts.length >= 2) {
        uncheckedGifts.forEach((gift) => gift.disabled = 'true');
    };

    if (uncheckedGifts.length > 2) {
        uncheckedGifts.forEach((gift) => gift.removeAttribute('disabled'));
    }
}

function changeStatus() {
    let gifts = document.querySelectorAll('[name="gift"]');
    gifts.forEach((gift) => (gift.checked) ? (gift.dataset.status = 'checked') : (gift.dataset.status = 'unchecked'));
}

function showConfirmBtn() {
    const empty = checkEmptyField();
    const valid = checkErrors();

    if (empty && valid) {
        submit.removeAttribute('disabled')
    }

    if (!empty || !valid) {
        submit.setAttribute('disabled','true');
    }
}

function checkEmptyField() {
    const elems = form.querySelectorAll('[required]');

    for (elem of elems) {
        if (!elem.value)  {
            return;
        }
    }
    return true;
}

function checkErrors() {
    const errors = form.querySelectorAll('.error__msg');
    if (errors.length != 0) return;
    return true;
}

form.addEventListener('focusout', showConfirmBtn);

function buildMessage() {
    const paymentmethod = payment.querySelector('[checked]');
    const giftList = buildGiftList();
    return  `<div class='result__message'>
            <h2>Thanks, your order created!</h2>
            <p>The delivery address: ${street.value} street, house ${house.value}, flat ${flat.value}.</p>
            <p>Customer: ${firstname.value} ${surname.value}.</p>
            <p>Payment method: ${paymentmethod.value}.</p>
            <p>Your gifts: ${giftList}.</p>
        </div>`;
}

function buildGiftList() {
    const giftElem = gifts.querySelectorAll('input');
    const list = [];

    giftElem.forEach((gift)=> {
        if (gift.checked) list.push(gift.value);
    });

    if (list.length == 0) {
        return('no gifts');
    } else {
        return(list.join(', '));
    }
}

function showResult() {
    container.innerHTML = buildMessage();
}

submit.addEventListener('click', showResult);