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

function checkPersonalInfo(field) {
    const nameReq = (field.id === 'name') && (field.value.length < 4);
    const surnameReq = (field.id === 'surname') && (field.value.length < 5);
    const number = /[0-9]/.test(field.value);
    const space = /\s/.test(field.value);

    (nameReq || surnameReq || number || space) ? showErrorMsg(field) : deleteErrorMsg(field);
}

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

function checkDeliveryInfo(field) {
    const streetReq = ((field.id === 'street') && (field.value.length < 5));
    const houseReq = ((field.id === 'house') && (field.value <= 0 || isNaN(field.value)));
    const flatReq = ((field.id === 'flat') && (field.value.startsWith('-') || isNaN(field.value.replace('-','')) || (field.value.replace('-','')) <= 0));
    const dateReq = ((field.id === 'date') && !field.value);

    (streetReq || houseReq || flatReq || dateReq) ? showErrorMsg(field) : deleteErrorMsg(field);
}

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
        submit.classList.remove('disabled');
        submit.removeAttribute('disabled')
    }

    if (!empty || !valid) {
        submit.setAttribute('disabled','true');
        submit.classList.add('disabled');
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