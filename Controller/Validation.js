export class Validation {
    required(value, messageError, id) {
        const element = document.getElementById(id);
        if (value === '' || value === null || value === undefined) {
            element.innerHTML = messageError;
            element.style.display = 'block';
            return false;
        }
        element.innerHTML = '';
        element.style.display = 'none';
        return true
    }

    checkPrice(value, messageError, id) {
        const element = document.getElementById(id);
        if (value) {
            if (value > 0) {
                element.innerHTML = messageError;
                element.style.display = 'none';
                return true;
            }
            element.innerHTML = messageError;
            element.style.display = 'block';
            return false;
        }
        element.innerHTML = '*Please enter product price!';
        element.style.display = 'block';
        return false;
    }
}