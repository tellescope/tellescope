import { Form } from "@tellescope/types-client"

export const form_display_text_for_language = (form: Form | undefined, text: string, placeholder?: string) => {
  if (!form) return text

  if (form.language === 'Spanish') {
    if (text === 'First Name') { return "Nombre" }
    if (text === 'Last Name')  { return "Apellido" }
    if (text === 'Date of Birth (MM-DD-YYYY)')  { return "Cumpleaños (MM-DD-AAAA)" }
    if (text === 'Email')  { 
      return "Email"
      // return "Correo Electrónico" 
    }
    if (text === 'Phone')  { return "Número Celular" }
    if (text === 'State')  { return "Estado" }

    if (text === 'Next')  { return "Próximo" }
    if (text === 'Previous')  { return "Previo" }
    if (text === 'Submit')  { return "Entregar" }

    if (typeof placeholder === 'string') { return placeholder }
  }

  return text
}