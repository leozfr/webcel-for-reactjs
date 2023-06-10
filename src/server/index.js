const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');

const app = express();
const PORT = 3010;

app.use(express.json());
app.use(cors());

// GMail API kimlik bilgilerini ayarlayın
const CLIENT_ID = '753085379190-t2cbtdo384o25e99d2625g12agtessfl.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04eoCdHLhF8meCgYIARAAGAQSNwF-L9IrUo7Xac5bYVaVC_t9W1Yb5lJJn-clSAdBRu20aMTS96FhfACWaocaVqzb2So3fs6PHkA';

// GMail API'ye yetkilendirme işlemi
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// E-posta gönderme işlemi
const sendEmail = async (to, subject, message) => {
  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  const emailLines = [];
  emailLines.push(`From: "EmirJS" <emir1903@topkapi.edu.tr>`);
  emailLines.push(`To: ${to}`);
  emailLines.push('Content-type: text/html;charset=iso-8859-1');
  emailLines.push(`Subject: ${subject}`);
  emailLines.push('');
  emailLines.push(message);

  const email = emailLines.join('\r\n').trim();

  const encodedEmail = Buffer.from(email).toString('base64');
  const res = await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedEmail,
    },
  });

  console.log('Email sent:', res.data);
};

app.post('/send-email', async (req, res) => {
  const { data, userEmail, selectedOption } = req.body;

  try {
    // Tablodan alınan verileri e-posta içeriğine dönüştürme
    let message = '<table>';
    message += '<thead>';
    message += '<tr>';
    message += '<th>NO</th>';
    message += '<th>TITLE2</th>';
    message += '<th>TITLE3</th>';
    message += '<th>NUMBER</th>';
    message += '<th>Adet/saat/dönem</th>';
    message += '<th>NUMBER3</th>';
    message += '<th>NUMBER4 </th>';
    message += '<th>TITLE4</th>';
    message += '</tr>';
    message += '</thead>';
    message += '<tbody>';
    data.forEach((item) => {
      message += '<tr>';
      message += `<td>${item.NO}</td>`;
      message += `<td>${item['TITLE2']}</td>`;
      message += `<td>${item['TITLE3']}</td>`;
      message += `<td>${item.NUMBER}</td>`;
      message += `<td>${item['NUMBER2']}</td>`;
      message += `<td>${item['NUMBER3']}</td>`;
      message += `<td>${item['NUMBER4']}</td>`;
      message += `<td>${item['TITLE4']}</td>`;
      message += '</tr>';
    });
    message += '</tbody>';
    message += '</table>';

    // E-postayı gönderme
    await sendEmail(selectedOption, userEmail + ' - E-Puan Tablosu', message);

    res.status(200).json({ success: true, message: 'Email sent successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'An error occurred while sending the email.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});