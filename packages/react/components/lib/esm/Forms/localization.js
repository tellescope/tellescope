export var form_display_text_for_language = function (form, text, placeholder) {
    if (!form)
        return text;
    if (form.language === 'Spanish' || form.language === 'Español') {
        if (text === 'First Name') {
            return "Nombre";
        }
        if (text === 'Last Name') {
            return "Apellido";
        }
        if (text === 'Date of Birth (MM-DD-YYYY)') {
            return "Cumpleaños (MM-DD-AAAA)";
        }
        if (text === 'Email') {
            return "Email";
            // return "Correo Electrónico" 
        }
        if (text === 'Gender') {
            return "Género";
        }
        if (text === 'Sex at Birth') {
            return "Sexo";
        }
        if (text === 'Phone') {
            return "Número Celular";
        }
        if (text === 'State') {
            return "Estado";
        }
        if (text === 'Next') {
            return "Próximo";
        }
        if (text === 'Previous') {
            return "Previo";
        }
        if (text === 'Submit') {
            return "Entregar";
        }
        if (text === 'Select One') {
            return "Seleccione una";
        }
        if (text === 'Other') {
            return "Otra";
        }
        if (text === 'Address Line 1') {
            return "Dirección Línea 1";
        }
        if (text === 'Address Line 2') {
            return "Dirección Línea 2";
        }
        if (text === 'City') {
            return "Ciudad";
        }
        if (text === 'State') {
            return "Estado";
        }
        if (text === 'ZIP Code') {
            return "Código Postal";
        }
        if (typeof placeholder === 'string') {
            return placeholder;
        }
    }
    return text;
};
//# sourceMappingURL=localization.js.map