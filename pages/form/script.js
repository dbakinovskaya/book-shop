function buildError(elem) {
    const coords = elem.getBoundingClientRect();

    const div = document.createElement('div');
    div.className = "error__msg";
    div.innerHTML = "The field is invalid";

    div.style.left = (coords.left+50) + 'px';
    div.style.top = (coords.top - 16 + window.pageYOffset) + 'px';

    return div;
}

function checkPersonalInfo(field) {
    const nameReq = (field.id === 'name') && (field.value.length < 4);
    const surnameReq = (field.id === 'surname') && (field.value.length < 5);
    const number = /[0-9]/.test(field.value);
    const space = /\s/.test(field.value);

    if (nameReq || surnameReq || number || space) {
        const errorMsg = buildError(field);

        field.classList.add('error');
        field.after(errorMsg);
    } else {
        field.classList.remove('error');
        field.nextSibling.remove();
    }
}
