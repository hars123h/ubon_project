// // import client from 'twilio';
// import {toast} from 'react-toastify';

// const accountSid = 'ACc6618732048efe3c8551e5482997ee47';
// const authToken = '056f1c887a96cff417ea93d63a28eef3';



// const sendMessage = (message="This was raally good", receiver="+919140493078", otp="123456") => {

//     client(accountSid, authToken).messages
//         .create({
//             body: message+otp,
//             messagingServiceSid: 'MGb4a4fb92e8fc757e14262d8152b3402b',
//             to: receiver
//         })
//         .then(message =>{ 
//             console.log(message.sid);
//             toast('OTP sent successfully');
//         })
//         .done();
// }

// export default sendMessage;