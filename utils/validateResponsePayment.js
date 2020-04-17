'use strict'

async function validateResponse (data) {
  switch (data.responseCode) {
    case 'ERROR': {
      return { estado: false, data: [], mensaje: 'Ocurrió un error general.', status: 'ERROR' }
    }
    
    case 'ANTIFRAUD_REJECTED': {
      return { estado: false, data: [], mensaje: 'La transacción fue rechazada por el sistema anti-fraude.', status: 'ERROR'  }
    }

    case 'PAYMENT_NETWORK_REJECTED': {
      return { estado: false, data: [], mensaje: 'La red financiera rechazó la transacción.', status: 'ERROR'  }
    }

    case 'ENTITY_DECLINED': {
      return { estado: false, data: [], mensaje: 'La transacción fue declinada por el banco o por la red financiera debido a un error.', status: 'ERROR'  }
    }

    case 'INTERNAL_PAYMENT_PROVIDER_ERROR': {
      return { estado: false, data: [], mensaje: 'Ocurrió un error en el sistema intentando procesar el pago.', status: 'ERROR'  }
    }

    case 'INACTIVE_PAYMENT_PROVIDER': {
      return { estado: false, data: [], mensaje: 'El proveedor de pagos no se encontraba activo.', status: 'ERROR'  }
    } 

    case 'DIGITAL_CERTIFICATE_NOT_FOUND	': {
      return { estado: false, data: [], mensaje: 'La red financiera reportó un error en la autenticación.', status: 'ERROR'  }
    }

    case 'INVALID_EXPIRATION_DATE_OR_SECURITY_CODE': {
      return { estado: false, data: [], mensaje: 'El código de seguridad o la fecha de expiración estaba inválido.', status: 'ERROR'  }
    }

    case 'INVALID_RESPONSE_PARTIAL_APPROVAL': {
      return { estado: false, data: [], mensaje: 'Tipo de respuesta no válida. La entidad aprobó parcialmente la transacción y debe ser cancelada automáticamente por el sistema.', status: 'ERROR'  }
    }

    case 'INSUFFICIENT_FUNDS': {
      return { estado: false, data: [], mensaje: 'La cuenta no tenía fondos suficientes.', status: 'ERROR'  }
    }

    case 'CREDIT_CARD_NOT_AUTHORIZED_FOR_INTERNET_TRANSACTIONS': {
      return { estado: false, data: [], mensaje: 'La tarjeta de crédito no estaba autorizada para transacciones por Internet.', status: 'ERROR'  }
    }

    case 'INVALID_TRANSACTION': {
      return { estado: false, data: [], mensaje: 'La red financiera reportó que la transacción fue inválida.', status: 'ERROR'  }
    }

    case 'INVALID_CARD': {
      return { estado: false, data: [], mensaje: 'La tarjeta es inválida.', status: 'ERROR'  }
    }

    case 'EXPIRED_CARD': {
      return { estado: false, data: [], mensaje: 'La tarjeta ya expiró.', status: 'ERROR'  }
    }

    case 'RESTRICTED_CARD': {
      return { estado: false, data: [], mensaje: 'La tarjeta presenta una restricción.', status: 'ERROR'  }
    }

    case 'CONTACT_THE_ENTITY': {
      return { estado: false, data: [], mensaje: 'Debe contactar al banco.', status: 'ERROR'  }
    }

    case 'REPEAT_TRANSACTION': {
      return { estado: false, data: [], mensaje: 'Se debe repetir la transacción.', status: 'ERROR'  }
    }

    case 'ENTITY_MESSAGING_ERROR':  {
      return { estado: false, data:[], mensaje: 'La red financiera reportó un error de comunicaciones con el banco.', status: 'ERROR'  }
    }

    case 'BANK_UNREACHABLE': {
      return { estado: false, data: [], mensaje: 'El banco no se encontraba disponible.', status: 'ERROR'  }
    }

    case 'EXCEEDED_AMOUNT': {
      return { estado: false, data: [], mensaje: 'La transacción excede un monto establecido por el banco.', status: 'ERROR'  }
    }

    case 'NOT_ACCEPTED_TRANSACTION': {
      return { estado: false, data: [], mensaje: 'La transacción no fue aceptada por el banco por algún motivo.', status: 'ERROR'  }
    }

    case 'ERROR_CONVERTING_TRANSACTION_AMOUNTS': {
      return { estado: false, data: [], mensaje: 'Ocurrió un error convirtiendo los montos a la moneda de pago.', status: 'ERROR'  }
    }

    case 'EXPIRED_TRANSACTION': {
      return { estado: false, data: [], mensaje: 'La transacción expiró.', status: 'ERROR'  }
    }

    case 'PENDING_TRANSACTION_REVIEW': {
      return { estado: false, data: [], mensaje: 'La transacción fue detenida y debe ser revisada, esto puede ocurrir por filtros de seguridad.', status: 'ERROR'  }
    }
    
    case 'PENDING_TRANSACTION_CONFIRMATION': {
      return { estado: false, data: [], mensaje: 'La transacción está pendiente de ser confirmada.', status: 'ERROR'  }
    }

    case 'PENDING_TRANSACTION_TRANSMISSION': {
      return { estado: false, data: [], mensaje: 'La transacción está pendiente para ser trasmitida a la red financiera. Normalmente esto aplica para transacciones con medios de pago en efectivo.', status: 'ERROR'  }
    }

    case 'PAYMENT_NETWORK_BAD_RESPONSE': {
      return { estado: false, data: [], mensaje: 'El mensaje retornado por la red financiera es inconsistente.', status: 'ERROR'  }
    }

    case 'PAYMENT_NETWORK_NO_CONNECTION': {
      return { estado: false, data: [], mensaje: 'No se pudo realizar la conexión con la red financiera.', status: 'ERROR'  }
    }

    case 'PAYMENT_NETWORK_NO_RESPONSE': {
      return { estado: false, data: [], mensaje: 'La red financiera no respondió.', status: 'ERROR'  }
    }

    case 'FIX_NOT_REQUIRED': {
      return { estado: false, data: [], mensaje: 'Clínica de transacciones: Código de manejo interno.', status: 'ERROR'  }
    }

    case 'AUTOMATICALLY_FIXED_AND_SUCCESS_REVERSAL': {
      return { estado: false, data: [], mensaje: 'Clínica de transacciones: Código de manejo interno. Sólo aplica para la API de reportes.', status: 'ERROR'  }
    }

    case 'AUTOMATICALLY_FIXED_AND_UNSUCCESS_REVERSAL': {
      return { estado: false, data: [], mensaje: 'Clínica de transacciones: Código de manejo interno. Sólo aplica para la API de reportes.', status: 'ERROR'  }
    }

    case 'AUTOMATIC_FIXED_NOT_SUPPORTED': {
      return { estado: false, data: [], mensaje: 'Clínica de transacciones: Código de manejo interno. Sólo aplica para la API de reportes.', status: 'ERROR'  }
    }

    case 'NOT_FIXED_FOR_ERROR_STATE': {
      return { estado: false, data: [], mensaje: 'Clínica de transacciones: Código de manejo interno. Sólo aplica para la API de reportes.', status: 'ERROR'  }
    }

    case 'ERROR_FIXING_AND_REVERSING': {
      return { estado: false, data: [], mensaje: 'Clínica de transacciones: Código de manejo interno. Sólo aplica para la API de reportes.', status: 'ERROR'  }
    }

    case 'ERROR_FIXING_INCOMPLETE_DATA': {
      return { estado: false, data: [], mensaje: 'Clínica de transacciones: Código de manejo interno. Sólo aplica para la API de reportes.', status: 'ERROR'  }
    }

  }
}

module.exports = validateResponse