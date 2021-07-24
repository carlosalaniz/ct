const express = require('express')
var cors = require('cors')
const app = express()
const port = 3000
app.use(express.json())
app.use(cors())
const xmlhttprequest = require("xmlhttprequest");
app.get('/flex-key', (req, res) => {
    /*var FlexSDKNode = require('@cybersource/flex-sdk-node');
    var flex = FlexSDKNode({
        // auth credentials
        mid: 'wiproltd',
        keyId: '701071e0-d220-4446-b250-28b1110c3362',
        sharedSecret: 'tUWZxuME3dzL60iTvVupPUbs/hKpq8Kxqh8VOKzdncI=',
        // live environment
        production: false
    });
    var options = {
        encryptionType: flex.constants.encryptionType.RsaOaep,
        targetOrigin: 'http://localhost:8080'
    };
    flex.createKey(options, function (err, resp, key) {
        if (err) {
            // handle error
            alert(err);
            return;
        }
        console.log(key);
        res.json(key)
    });*/
    var captureContext = '';
    var XMLHttpRequest = xmlhttprequest.XMLHttpRequest;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://www.qa.ct.cybsplugin.com/keys');
    xhr.setRequestHeader('Content-Type', 'application/json');
    console.log('inside flex');
    xhr.onload = function () {
        if (xhr.status === 200) {
            var flexKeys = JSON.parse(xhr.responseText);
            captureContext = flexKeys.captureContext;
            verificationContext = flexKeys.verificationContext;
            console.log('inside flex' + captureContext);
            res.json({ "captureContext": captureContext });
        } else {
            console.log(xhr.status);
        }
    };
    xhr.send();
    console.log('after flex' + captureContext);

})

app.post('/decodeJwt', (req, res) => {
    console.log('dfddf');
    var token = req.body.token;
    console.log("mcirotoken" + token);
    var jwt_decode = require("jwt-decode");
    var decoded = jwt_decode(token);
    console.log("decodetoken" + decoded);
    response = {
        maskedPan: decoded.data.number,
        cardType: decoded.data.type,
        token: token
    };
    if (!verifyTokenCreated(response)) {
        return;
    }
    var XMLHttpRequest = xmlhttprequest.XMLHttpRequest;
    var xhr = new XMLHttpRequest();

    xhr.open('POST', 'https://api.us-central1.gcp.commercetools.com/ct-project/payments');
    xhr.setRequestHeader('Authorization', 'Bearer jIkACLntu1M4qWD3x2D-UbQuSTW8Vd9N');
    console.log('inside flex');
    xhr.onload = function () {
        if (xhr.status === 201) {
            console.log(xhr.status + "resp" + JSON.stringify(xhr));
            var paymentResponse = JSON.parse(xhr.responseText);


            console.log(paymentResponse.id);
            res.json(paymentResponse.id);
        } else {
            console.log(xhr.status + "resp" + JSON.stringify(xhr.status));
        }
    };
    xhr.send(JSON.stringify({
        "amountPlanned": {
            "currencyCode": "EUR",
            "centAmount": 949
        },
        "paymentMethodInfo": {
            "paymentInterface": "cybersource",
            "method": "creditCard",
        },
        "custom": {
            "type": {
                "key": "isv_payment_data"
            },
            "fields": {
                "isv_token":
                    "eyJraWQiOiJ6dSIsImFsZyI6IlJTMjU2In0.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJ2RlMzL2lUb0ZwUXNUNVZkb1FudjdoQUFFT3RjVUhSMFBVVHZPUnVRTS9CUUg1UC8wNG4xRmptYXNQck1vSTQ1TzVUN3dLWHdKNHRML2dxc0hGRDRtL0tpSzRGVW9sc2xVWHV0d2kzRk1TOFVXSzI1cmFaRkFGUmZuTDZMelFyKzd4MTMiLCJvcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSIsImp3ayI6eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6ImVuYyIsIm4iOiJuNmJvU1RSWlo0U1VmUHJjQjcxN2dpblQ4QU1Yem0yREZVZXpWY2lTcWY0VEMzUVZZcDRUa1JkOXZNQzNoUXJub2ZxRmRLT3AtNENKNDVOam1YSmZPaklNWkppSkp0Tk5KX2ZaMGtpbC0xWjBTYlFWS0s0b1BvX285TF9KQWdPSHEzUGNuSUJVRmdSTzlVOEFjTkFaaE1EYkFoMHlkbEhtRTRFbmwxU3M1VUVsS3QwX1JfN09HSWUyd0R6eERYV29MNUs2Q21rSDd2eXozY1pfYWlQNlIwRjBqbHdwdjhwSzZSVHRnZDVkUnpnODNMbHBCSlJCdm1VUEttTUQtcW5RMjA3d2NsTnBDVVVCZVc2dXZPWVdBcUM4ZjNscnY0TDIyU3pvUGpKUmdoeDlBNVNPQXJyRzFjSWQ5MjFyVlkxZmJiaTh1ekdlMFZpYkVyeWVVVk5iOHciLCJraWQiOiIwOEE3UWRIRGJIenhCSGxNQTJISHBKbFVsUEdrSHZFQyJ9fSwiY3R4IjpbeyJkYXRhIjp7InRhcmdldE9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sIm1mT3JpZ2luIjoiaHR0cHM6Ly90ZXN0ZmxleC5jeWJlcnNvdXJjZS5jb20ifSwidHlwZSI6Im1mLTAuMTEuMCJ9XSwiaXNzIjoiRmxleCBBUEkiLCJleHAiOjE2MjcwMzI0OTEsImlhdCI6MTYyNzAzMTU5MSwianRpIjoiTjFVczRnUHRwYkRkME13dCJ9.L7i8pJu7k-PpG9HbQWkxZ1WS-QgCairmv6fpxVn0wF_mGekKPzTdVD-sxLRuWkkUkINxBrileq02N0sSf89eCrzKpjX3xx-01islzv3jSe1o5tUo7mtz_sEU3jb7QIkc3vtvJuVcj1yzYgzGbad0vtNRISaqSQBaKjv3V_ix46ioXRsigRzUnP5KGEyraMAjW6keeXzRpniqaXxT3zt_xITuYn4t67hbjYJokmy-XJgYSmaph8wE5tCmG__BgtDz3pOnpOHyiciJ0NtgvEh6UIVFoyisUdTOW4fw2lbdIzu45s56O_ehPTF9y9VE6CsmH_VpUg5vtBJl6l12rHhghw",
                'isv_maskedPan': "411111XXXXXX1111",
                "isv_cardType": "001",
                "isv_cardExpiryMonth": "01",
                "isv_cardExpiryYear": "2021"
            }
        }
    }));
    /* var XMLHttpRequest = xmlhttprequest.XMLHttpRequest;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "payment");
    xhr.setRequestHeader('Content-Type', 'application/json');
    console.log("inside payment");
    xhr.onload = function() {
        console.log('xhr');
        if (xhr.status === 200) {
            console.log("success payment2");
            var paymentResponse = JSON.parse(xhr.responseText);
            console.log("payment id"+paymentResponse.paymentId);
            //res.json(response);
        } else{
            console.log("out");
        }
    };
    xhr.send(createPaymentRequest(response, "creditcard")); */

})
/* app.get('/createPayment', (req, res) => {
   
}) */
function verifyTokenCreated(response) {
    if (response.error) {
        alert('There has been an error - check console for details');
        console.log(response);
        payButton.disabled = false;
        payButton.innerHTML = 'Authorise';
        return false;
    } else {
        console.log('Token generated: ');
        console.log(JSON.stringify(response));
        return true;
    }
}

function createPaymentRequest(tokenResponse, paymentMethod) {
    console.log('here');
    return JSON.stringify({
        maskedPan: tokenResponse.maskedPan,
        cardType: tokenResponse.cardType,
        cardExpiryMonth: '02',
        cardExpiryYear: '2022',
        //verificationContext: verificationContext,
        token: tokenResponse.token,
        savedToken: tokenResponse.savedToken,
        tokenAlias: "",
        requestJwt: '',
        method: paymentMethod,
        billingAddressKey: "78759"
    });
}

function authorizeRequest(configObject, payload, callback) {
    var cybersourceRestApi = require('cybersource-rest-client');
    try {
        var apiClient = new cybersourceRestApi.ApiClient();
        var requestObj = new cybersourceRestApi.CreateCreditRequest();

        var clientReferenceInformation = new cybersourceRestApi.Ptsv2paymentsClientReferenceInformation();
        clientReferenceInformation.code = payload.clientReferenceInformation.code;
        requestObj.clientReferenceInformation = clientReferenceInformation;

        var processingInformation = new cybersourceRestApi.Ptsv2paymentsProcessingInformation();
        processingInformation.capture = false;
        requestObj.processingInformation = processingInformation;

        var tokenInformation = new cybersourceRestApi.Ptsv2paymentsTokenInformation();
        tokenInformation.transientTokenJwt = payload.tokenInformation.transientTokenJwt;
        requestObj.tokenInformation = tokenInformation;

        var orderInformation = new cybersourceRestApi.Ptsv2paymentsOrderInformation();
        var orderInformationAmountDetails = new cybersourceRestApi.Ptsv2paymentsOrderInformationAmountDetails();
        orderInformationAmountDetails.totalAmount = payload.orderInformation.amountDetails.totalAmount;
        orderInformationAmountDetails.currency = payload.orderInformation.amountDetails.currency;
        orderInformation.amountDetails = orderInformationAmountDetails;

        var orderInformationBillTo = new cybersourceRestApi.Ptsv2paymentsOrderInformationBillTo();
        orderInformationBillTo.firstName = payload.orderInformation.billTo.firstName;
        orderInformationBillTo.lastName = payload.orderInformation.billTo.lastName;
        orderInformationBillTo.address1 = payload.orderInformation.billTo.address1;
        orderInformationBillTo.locality = payload.orderInformation.billTo.locality;
        orderInformationBillTo.administrativeArea = 'CA';
        orderInformationBillTo.postalCode = payload.orderInformation.billTo.postalCode;
        orderInformationBillTo.country = payload.orderInformation.billTo.country;
        orderInformationBillTo.email = payload.orderInformation.billTo.email;
        orderInformationBillTo.phoneNumber = payload.orderInformation.billTo.phone;
        orderInformation.billTo = orderInformationBillTo;

        requestObj.orderInformation = orderInformation;


        var instance = new cybersourceRestApi.PaymentsApi(configObject, apiClient);
        instance.createPayment(requestObj, function (error, data, response) {
            if (error) {
                console.log('\nError : ' + JSON.stringify(error));
            }
            else if (data) {
                console.log('\nData : ' + JSON.stringify(data));
            }

            //console.log('\nResponse : ' + JSON.stringify(response));
            //console.log('\nResponse Code of Process a Payment : ' + JSON.stringify(response['status']));
            //res.json( response);
            callback(error, data, response);
        });
        console.log('ok');
    }
    catch (error) {
        console.log('\nException on calling the API : ' + error);
    }
}
// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`)
// })

(async function () {
    import { createClient } from '@commercetools/sdk-client'
    import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
    import SdkAuth from '@commercetools/sdk-auth'

    const client = createClient({
        middlewares: [
            createHttpMiddleware({
                host:"https://api.us-central1.gcp.commercetools.com",
                fetch
            }),
        ],
    })
    const request = {
        uri: '/foo/bar',
        method: 'GET',
        headers: {
            Authorization: 'Bearer xxx',
        },
    }

    client.execute(request)
        .then(result => ...)
        .catch(error => ...)
})()