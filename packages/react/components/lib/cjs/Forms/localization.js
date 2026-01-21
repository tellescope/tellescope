"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.booking_display_text_for_language = exports.form_display_text_for_language = void 0;
var SPANISH_TRANSLATIONS = {
    // Personal Information
    'First Name': 'Nombre',
    'Last Name': 'Apellido',
    'Date of Birth (MM-DD-YYYY)': 'Cumpleaños (MM-DD-AAAA)',
    'Email': 'Email',
    'Gender': 'Género',
    'Sex at Birth': 'Sexo',
    'Phone': 'Número Celular',
    // Navigation
    'Next': 'Próximo',
    'Continue': 'Continuar',
    'Previous': 'Previo',
    'Submit': 'Entregar',
    'Back': 'Atrás',
    // Common UI
    'Select One': 'Seleccione una',
    'Other': 'Otra',
    'Remove': 'Eliminar',
    'No results found': 'No se encontraron resultados',
    'Type to start search': 'Escriba para comenzar la búsqueda',
    'Answer here...': 'Responda aquí...',
    'Enter phone...': 'Ingrese teléfono...',
    'Enter email...': 'Ingrese correo electrónico...',
    'Enter a number...': 'Ingrese un número...',
    'Full Name': 'Nombre Completo',
    'MM-DD-YYYY': 'MM-DD-AAAA',
    'Enter your legal full name to complete the signature': 'Ingrese su nombre legal completo para completar la firma',
    'I consent to use': 'Consiento usar',
    'electronic signatures': 'firmas electrónicas',
    'View document in new tab': 'Ver documento en nueva pestaña',
    'Drag and drop to re-order the above options': 'Arrastre y suelte para reordenar las opciones anteriores',
    // Address
    'Address Line 1': 'Dirección Línea 1',
    'Address Line 2': 'Dirección Línea 2',
    'City': 'Ciudad',
    'State': 'Estado',
    'ZIP Code': 'Código Postal',
    // Table Input
    'Add new entry': 'Agregar nueva entrada',
    // File Input
    'Select a File': 'Seleccionar un Archivo',
    'Select Files': 'Seleccionar Archivos',
    'Select file or take picture': 'Seleccionar archivo o tomar foto',
    'Select files or take pictures': 'Seleccionar archivos o tomar fotos',
    'Drop to select file': 'Soltar para seleccionar archivo',
    'Drop to select files': 'Soltar para seleccionar archivos',
    'Click or drag and drop': 'Haga clic o arrastre y suelte',
    // Related Contacts
    'Relationship': 'Relación',
    'Phone Number': 'Número de Teléfono',
    'Save Contact': 'Guardar Contacto',
    'Add Contact': 'Agregar Contacto',
    'Unnamed Contact': 'Contacto Sin Nombre',
    // Medications
    'Search medications...': 'Buscar medicamentos...',
    'Add Medication': 'Agregar Medicamento',
    'Remove medication': 'Eliminar medicamento',
    'Medication Name': 'Nombre del Medicamento',
    'Reason for taking medication': 'Razón para tomar el medicamento',
    'Medication instructions: how much you take, how often, and when': 'Instrucciones del medicamento: cuánto toma, con qué frecuencia y cuándo',
    // Payment
    'Make Payment': 'Realizar Pago',
    'Save Payment Details': 'Guardar Detalles de Pago',
    // Appointment Booking
    'Add to Calendar': 'Agregar al Calendario',
    'Downloading...': 'Descargando...',
    'Your appointment has been booked': 'Su cita ha sido reservada',
    // Allergies/Conditions
    'Search allergies...': 'Buscar alergias...',
    'Search conditions...': 'Buscar condiciones...',
    // Emotii Survey
    'Please click Next or Submit to continue.': 'Por favor haga clic en Próximo o Entregar para continuar.',
    // Insurance Input
    'Insurer': 'Aseguradora',
    'Search insurer...': 'Buscar aseguradora...',
    'Member ID': 'Número de Miembro',
    'Plan Name': 'Nombre del Plan',
    'Group Number': 'Número de Grupo',
    'Plan Start Date': 'Fecha de Inicio del Plan',
    'Relationship to Policy Owner': 'Relación con el Titular de la Póliza',
    'Policy Owner Details': 'Detalles del Titular de la Póliza',
    'Cell Phone': 'Teléfono Celular',
    'Address': 'Dirección',
    'Line Two': 'Línea Dos',
    'Date of Birth': 'Fecha de Nacimiento',
    // BelugaPatientPreference (Prescription fields)
    'Strength': 'Concentración',
    'Dispense Unit': 'Unidad de Dispensación',
    'Quantity': 'Cantidad',
    'Refills': 'Recargas',
    'Days Supply': 'Días de Suministro',
    'Sig (Instructions)': 'Sig (Instrucciones)',
    'Med ID (NDC11)': 'ID del Medicamento (NDC11)',
    // Medications Search
    'Search': 'Buscar',
    'Searching...': 'Buscando...',
    'Drug Select': 'Seleccionar Medicamento',
    'Other Drug': 'Otro Medicamento',
    // Pharmacy Search
    'pharmacies found': 'farmacias encontradas',
    'pharmacy found': 'farmacia encontrada',
    'Please enter a valid 5-digit ZIP code': 'Por favor ingrese un código postal válido de 5 dígitos',
    'No pharmacies found for this ZIP code': 'No se encontraron farmacias para este código postal',
    'Failed to search pharmacies': 'Error al buscar farmacias',
    // Height Input
    'Feet': 'Pies',
    'Inches': 'Pulgadas',
    // Allergies Input
    'Severity': 'Gravedad',
    'Note': 'Nota',
    // Bridge Eligibility
    'Check Provider Eligibility (Free)': 'Verificar Elegibilidad del Proveedor (Gratis)',
    'Checking...': 'Verificando...',
    'Check Service Eligibility (Paid)': 'Verificar Elegibilidad del Servicio (Pagado)',
    'Polling...': 'Consultando...',
    'Initiating...': 'Iniciando...',
    'Polling for results... (this may take 15-30 seconds)': 'Consultando resultados... (esto puede tardar 15-30 segundos)',
    // Other UI
    'ZIP+4': 'Código Postal+4',
    'ZIP + 4': 'Código Postal + 4',
    'None': 'Ninguno',
    'No booking page specified': 'No se especificó página de reserva',
    'Try Again': 'Intentar de Nuevo',
    'Loading...': 'Cargando...',
    'No input choices available': 'No hay opciones de entrada disponibles',
    'Loading product information...': 'Cargando información del producto...',
    'No eligible users found for booking': 'No se encontraron usuarios elegibles para la reserva',
};
var form_display_text_for_language = function (form, text, placeholder) {
    if (!form)
        return text;
    if (form.language === 'Spanish' || form.language === 'Español') {
        var translation = SPANISH_TRANSLATIONS[text];
        if (translation)
            return translation;
        if (typeof placeholder === 'string')
            return placeholder;
    }
    return text;
};
exports.form_display_text_for_language = form_display_text_for_language;
var SPANISH_BOOKING_TRANSLATIONS = {
    // Event Selection
    'What would you like to schedule?': '¿Qué desea programar?',
    'Minute Appointment': 'Minutos de Cita',
    // Calendar/Time Selection
    'Pick a date and time for your visit': 'Seleccione fecha y hora para su visita',
    'Select a visit time:': 'Seleccione una hora:',
    'No appointments are available at this date': 'No hay citas disponibles en esta fecha',
    'Loading...': 'Cargando...',
    'Location': 'Ubicación',
    'Timezone': 'Zona Horaria',
    'Event Type': 'Tipo de Evento',
    'Back': 'Atrás',
    'Back to host selection': 'Volver a selección de anfitrión',
    'Scroll down to view more times': 'Desplácese hacia abajo para ver más horarios',
    'Tap and scroll down to view more times': 'Toque y desplácese hacia abajo para ver más horarios',
    'No valid appointment hosts found': 'No se encontraron anfitriones válidos',
    'Your care team must be assigned before booking this appointment type': 'Su equipo de atención debe ser asignado antes de reservar este tipo de cita',
    'No users found': 'No se encontraron usuarios',
    'of': 'de',
    'Booking': 'Reservando',
    // Intake Form
    'Enter your contact information': 'Ingrese su información de contacto',
    'First Name': 'Nombre',
    'Last Name': 'Apellido',
    'Phone': 'Número Celular',
    'Email': 'Email',
    'Birth Date': 'Fecha de Nacimiento',
    'MM-DD-YYYY': 'MM-DD-AAAA',
    'State': 'Estado',
    'Next': 'Próximo',
    // Validation messages
    'First name is required': 'Nombre es requerido',
    'Last name is required': 'Apellido es requerido',
    'Email is required': 'Email es requerido',
    'Must be a valid email': 'Debe ser un email válido',
    'State is required': 'Estado es requerido',
    // Confirmation
    'Confirm your appointment': 'Confirme su cita',
    'Reason for Appointment': 'Razón de la Cita',
    'I agree to the': 'Acepto los',
    'Confirm': 'Confirmar',
    'for this appointment': 'por esta cita',
    // Thank You
    'Appointment Confirmed': 'Cita Confirmada',
    'Check your email for next steps': 'Revise su correo para los próximos pasos',
    'Add to Calendar': 'Agregar al Calendario',
    'Add to Google Calendar': 'Agregar a Google Calendar',
    'Downloading...': 'Descargando...',
    'Opening...': 'Abriendo...',
    // State Selection
    'Which state are you a resident of?': '¿En qué estado reside?',
    'Save': 'Guardar',
    'Saving...': 'Guardando...',
    // Errors
    'This link has expired': 'Este enlace ha expirado',
    'This link is invalid': 'Este enlace no es válido',
    // Payment
    'Your payment details have been saved!': '¡Sus datos de pago han sido guardados!',
    'Save Payment Details': 'Guardar Datos de Pago',
};
var booking_display_text_for_language = function (bookingPage, text, placeholder) {
    var _a, _b;
    if (!bookingPage)
        return text;
    if (bookingPage.language === 'Spanish' || bookingPage.language === 'Español') {
        return (_b = (_a = SPANISH_BOOKING_TRANSLATIONS[text]) !== null && _a !== void 0 ? _a : placeholder) !== null && _b !== void 0 ? _b : text;
    }
    return text;
};
exports.booking_display_text_for_language = booking_display_text_for_language;
//# sourceMappingURL=localization.js.map