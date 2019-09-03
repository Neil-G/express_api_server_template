const sendgridClient = require('./sendgridClient')

module.exports = ({ emailAddress }) => {
    try {
        return sendgridClient.send({
            to: emailAddress,
            from: 'test@example.com',
            subject: 'Verify your email',
            text: 'Click this link to verify your email',
        })
    } catch (e) {
        console.log(e)
    }
}