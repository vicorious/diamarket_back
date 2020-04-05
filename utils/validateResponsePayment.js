'use strict'

async function validateResponse (data) {
  switch (data.responseCode) {
    case 'ERROR': {
      return { estado: false, data: [], mensaje: 'Ocurrió un error general.' }
    }
    
    case 'ANTIFRAUD_REJECTED': {
      return { estado: false, data: [], mensaje: 'La transacción fue rechazada por el sistema anti-fraude.' }
    }

    case 'PAYMENT_NETWORK_REJECTED': {
      return { estado: false, data: [], mensaje: 'La red financiera rechazó la transacción.' }
    }

    case 'ENTITY_DECLINED': {
      return { estado: false, data: [], mensaje: 'La transacción fue declinada por el banco o por la red financiera debido a un error.' }
    }

    case 'INTERNAL_PAYMENT_PROVIDER_ERROR': {
      return { estado: false, data: [], mensaje: 'Ocurrió un error en el sistema intentando procesar el pago.' }
    }

    case 'INACTIVE_PAYMENT_PROVIDER': {
      return { estado: false, data: [], mensaje: 'El proveedor de pagos no se encontraba activo.' }
    } 

    case 'DIGITAL_CERTIFICATE_NOT_FOUND	': {
      return { estado: false, data: [], mensaje: 'La red financiera reportó un error en la autenticación.' }
    }

    case 'INVALID_EXPIRATION_DATE_OR_SECURITY_CODE': {
      return { estado: false, data: [], mensaje: 'El código de seguridad o la fecha de expiración estaba inválido.' }
    }

    case 'INVALID_RESPONSE_PARTIAL_APPROVAL': {
      return { estado: false, data: [], mensaje: 'Tipo de respuesta no válida. La entidad aprobó parcialmente la transacción y debe ser cancelada automáticamente por el sistema.' }
    }

    case 'INSUFFICIENT_FUNDS': {
      return { estado: false, data: [], mensaje: 'La cuenta no tenía fondos suficientes.' }
    }

    case 'CREDIT_CARD_NOT_AUTHORIZED_FOR_INTERNET_TRANSACTIONS': {
      return { estado: false, data: [], mensaje: 'La tarjeta de crédito no estaba autorizada para transacciones por Internet.' }
    }

    case 'INVALID_TRANSACTION': {
      return { estado: false, data: [], mensaje: 'La red financiera reportó que la transacción fue inválida.' }
    }

    case 'INVALID_CARD': {
      return { estado: false, data: [], mensaje: 'La tarjeta es inválida.' }
    }

    case 'EXPIRED_CARD': {
      return { estado: false, data: [], mensaje: 'La tarjeta ya expiró.' }
    }

    case 'RESTRICTED_CARD': {
      return { estado: false, data: [], mensaje: 'La tarjeta presenta una restricción.' }
    }

    case 'CONTACT_THE_ENTITY': {
      return { estado: false, data: [], mensaje: 'Debe contactar al banco.' }
    }

    case 'REPEAT_TRANSACTION': {
      return { estado: false, data: [], mensaje: 'Se debe repetir la transacción.' }
    }

    case 'ENTITY_MESSAGING_ERROR':  {
      return { estado: false, data:[], mensaje: 'La red financiera reportó un error de comunicaciones con el banco.' }
    }

    case 'BANK_UNREACHABLE': {
      return { estado: false, data: [], mensaje: 'El banco no se encontraba disponible.' }
    }

    case 'EXCEEDED_AMOUNT': {
      return { estado: false, data: [], mensaje: 'La transacción excede un monto establecido por el banco.' }
    }

    case 'NOT_ACCEPTED_TRANSACTION': {
      return { estado: false, data: [], mensaje: 'La transacción no fue aceptada por el banco por algún motivo.' }
    }

    case 'ERROR_CONVERTING_TRANSACTION_AMOUNTS': {
      return { estado: false, data: [], mensaje: 'Ocurrió un error convirtiendo los montos a la moneda de pago.' }
    }

    case 'EXPIRED_TRANSACTION': {
      return { estado: false, data: [], mensaje: 'La transacción expiró.' }
    }

    case 'PENDING_TRANSACTION_REVIEW': {
      return { estado: false, data: [], mensaje: 'La transacción fue detenida y debe ser revisada, esto puede ocurrir por filtros de seguridad.' }
    }
    
    case 'PENDING_TRANSACTION_CONFIRMATION': {
      return { estado: false, data: [], mensaje: 'La transacción está pendiente de ser confirmada.' }
    }

    case 'PENDING_TRANSACTION_TRANSMISSION': {
      return { estado: false, data: [], mensaje: 'La transacción está pendiente para ser trasmitida a la red financiera. Normalmente esto aplica para transacciones con medios de pago en efectivo.' }
    }

    case 'PAYMENT_NETWORK_BAD_RESPONSE': {
      return { estado: false, data: [], mensaje: 'El mensaje retornado por la red financiera es inconsistente.' }
    }

    case 'PAYMENT_NETWORK_NO_CONNECTION': {
      return { estado: false, data: [], mensaje: 'No se pudo realizar la conexión con la red financiera.' }
    }

    case 'PAYMENT_NETWORK_NO_RESPONSE': {
      return { estado: false, data: [], mensaje: 'La red financiera no respondió.' }
    }

    case 'FIX_NOT_REQUIRED': {
      return { estado: false, data: [], mensaje: 'Clínica de transacciones: Código de manejo interno.' }
    }

    case 'AUTOMATICALLY_FIXED_AND_SUCCESS_REVERSAL': {
      return { estado: false, data: [], mensaje: 'Clínica de transacciones: Código de manejo interno. Sólo aplica para la API de reportes.' }
    }

    case 'AUTOMATICALLY_FIXED_AND_UNSUCCESS_REVERSAL': {
      return { estado: false, data: [], mensaje: 'Clínica de transacciones: Código de manejo interno. Sólo aplica para la API de reportes.' }
    }

    case 'AUTOMATIC_FIXED_NOT_SUPPORTED': {
      return { estado: false, data: [], mensaje: 'Clínica de transacciones: Código de manejo interno. Sólo aplica para la API de reportes.' }
    }

    case 'NOT_FIXED_FOR_ERROR_STATE': {
      return { estado: false, data: [], mensaje: 'Clínica de transacciones: Código de manejo interno. Sólo aplica para la API de reportes.' }
    }

    case 'ERROR_FIXING_AND_REVERSING': {
      return { estado: false, data: [], mensaje: 'Clínica de transacciones: Código de manejo interno. Sólo aplica para la API de reportes.' }
    }

    case 'ERROR_FIXING_INCOMPLETE_DATA': {
      return { estado: false, data: [], mensaje: 'Clínica de transacciones: Código de manejo interno. Sólo aplica para la API de reportes.' }
    }

  }
}

module.exports = validateResponse