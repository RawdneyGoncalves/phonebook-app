export const usePhoneFormatter = () => {
  const sanitizePhone = (phone: string): string => {
    return phone.replace(/\D/g, '')
  }

  const formatPhoneDisplay = (phone: string): string => {
    const cleaned = sanitizePhone(phone)

    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }

    return cleaned
  }

  const validatePhone = (phone: string): boolean => {
    const cleaned = sanitizePhone(phone)
    return cleaned.length >= 10 && cleaned.length <= 20
  }

  const preventNonNumeric = (event: KeyboardEvent): void => {
    const char = event.key
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab']

    if (!/[0-9]/.test(char) && !allowedKeys.includes(char)) {
      event.preventDefault()
    }
  }

  return {
    sanitizePhone,
    formatPhoneDisplay,
    validatePhone,
    preventNonNumeric,
  }
}
