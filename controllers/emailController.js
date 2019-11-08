const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');


class Email {
    async send(email, body) {
        try {
            const msg = {
                to: email,
                from: 'gracialab@gracialab.com.co',
                subject: 'Correo enviado desde tuikit',
                html: body
            }
            const sendEmail = await sgMail.send(msg)
            return { message: "Se ha enviado el código a el correo!" }
        } catch (error) {
            return { error: "El correo no es valido" }
        }

    }
}

module.exports = new Email()