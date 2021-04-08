export function cep(e: React.FormEvent<HTMLInputElement>) {
    e.currentTarget.maxLength = 9;
    let value = e.currentTarget.value;
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{5})(\d)/, "$1-$2");
    e.currentTarget.value = value;
    return e;
}

export function currency(e: React.FormEvent<HTMLInputElement>) {
    let value = e.currentTarget.value;
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d)(\d{2})$/, "$1,$2");
    value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");

    e.currentTarget.value = value;
    return e;
}

export function prettifyCurrency(e: React.FormEvent<HTMLInputElement>) {
    if (!e.currentTarget.value) {
        e.currentTarget.value = '0,00';
        return e;
    }
    let newText = e.currentTarget.value.replace(/(\D)/g, '').replace(/^0+/, '');

    if (newText.length < 3) {
        for (let i = newText.length; i < 3; i++) {
            newText = '0' + newText;
        }
    }
    newText = newText
        .replace(/(\d{2}$)/g, ',$&')
        .replace(/(\d{1})(\d{3})([,])/, '$1.$2$3')
        .replace(/(\d{1})(\d{3})([.])/, '$1.$2$3')
        .replace(/(\d{1})(\d{3})([.])/, '$1.$2$3');

    e.currentTarget.value = newText;
    return e;
}

export function cpf(e: React.FormEvent<HTMLInputElement>) {
    e.currentTarget.maxLength = 14;
    let value = e.currentTarget.value;
    if (!value.match(/^(\d{3}).(\d{3}).(\d{3})-(\d{2})$/)) {
        value = value.replace(/\D/g, "");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{2})$/, "$1-$2");
        e.currentTarget.value = value;
    }
    return e;
}