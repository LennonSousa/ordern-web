export function maskCurrency(e: string) {
    if (!e) {
        return '0.00';
    }
    let newText = e.replace(/(\D)/g, '').replace(/^0+/, '');

    if (newText.length < 3) {
        for (let i = newText.length; i < 3; i++) {
            newText = '0' + newText;
        }
    }
    newText = newText.replace(/(\d)(\d{2})$/, "$1.$2");

    return newText;
}