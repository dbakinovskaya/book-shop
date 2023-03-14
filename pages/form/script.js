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
    elem.after(errorMsg);
}

function deleteErrorMsg(elem) {
    elem.classList.remove('error');
    elem.nextSibling.remove();
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