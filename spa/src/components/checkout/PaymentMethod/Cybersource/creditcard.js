//import axios from "axios";

export default {
  data: () => ({
    paymentMethod: "card",
    paymentFlex: "flexForm",
    captureContext: "",
    isShow: "",
  }),
  methods: {
    onChange(event) {
        var payMethod = event.target.value;
        if(payMethod == "flexform"){
          this.isShow = true;
        } else {
          this.isShow = false;
        }
        fetch('http://localhost:3000/flex-key')
        .then(response => response.json())
        .then(data => this.captureContext  = data.captureContext);
    },

    /* cybsOrder() {
        alert('placeOrder');
        var transToken = null;
        var options = {
            expirationMonth: document.querySelector('#expMonth').value,
            expirationYear: document.querySelector('#expYear').value
        };
        alert('optio'+options.expirationMonth);
        microformobject.createToken(options, function (err, token) {
        if (err) {
            alert(err);
        } else {
            if (token) {
                transToken = token;
                alert(transToken);
            }
        }
        });  */
        
        /* var cartData = this.me.activeCart;
        alert(JSON.stringify(cartData));
        var payload = {
            "clientReferenceInformation" : {
                "code" : "Commercetools",
            },
            "processingInformation" : {
                "capture" : false,
            },
            "paymentInformation" : {
                "card" : {
                "typeSelectionIndicator" : "1"
                }
            },
            "orderInformation" : {
            "shipTo" : {
                "firstName" : cartData.shippingAddress.firstName,
                "lastName" : cartData.shippingAddress.lastName,
                "address1" : cartData.shippingAddress.streetName,
                "postalCode" : cartData.shippingAddress.postalCode,
                "locality" : cartData.shippingAddress.city,
                "administrativeArea" : "CA",
                "country" : cartData.shippingAddress.country,
                "phoneNumber" : cartData.shippingAddress.phone,
                "email" : cartData.shippingAddress.email,
            },
            "billTo" : {
                "firstName" : cartData.billingAddress.firstName,
                "lastName" : cartData.billingAddress.lastName,
                "address1" : cartData.billingAddress.streetName,
                "postalCode" : cartData.billingAddress.postalCode,
                "locality" : cartData.billingAddress.city,
                "administrativeArea" : "CA",
                "country" : cartData.billingAddress.country,
                "phoneNumber" : cartData.billingAddress.phone,
                "email" : cartData.billingAddress.email,
            },
            "lineItems" : [
                {
                "productCode" : "default",
                "productName" : cartData.lineItems[0].name,
                "productSKU" : cartData.lineItems[0].variant.sku,
                "quantity" : cartData.lineItems[0].quantity,
                "unitPrice" : cartData.lineItems[0].price.value,
            }
            ],
            "amountDetails": {
                "totalAmount" : cartData.totalPrice.centAmount,
                "currency" : cartData.totalPrice.currencyCode
                },
            },
            "tokenInformation" : {
            "transientTokenJwt" : "transToken"
            },
        };
        alert(payload);  */
            //const requestOptions = JSON.stringify(data);
            /*  const request = new Request(
                "http://localhost:3000/authorise",
                {
                method: "POST",
                mode: "no-cors",
                cache: "default",
                body: JSON.stringify(data)
                }
            );
            const res =  fetch(request);
            const data1 = res.json();
            alert(data1); 
            //fetch('http://localhost:3000/authorise', {requestOptions}).
            //then(response =>alert(JSON.stringify(response)));
            let res = axios.post("http://localhost:3000/authorise", {
                //'cartData' : payload
                    
            });
            alert(res); 
            return false;
      },*/
  },
  mounted() {
    this.$emit("card-paid");
    let externalscript=document.createElement('script');
    externalscript.setAttribute('src',
    'https://flex.cybersource.com/cybersource/assets/microform/0.11/flex-microform.min.js');
    document.head.appendChild(externalscript);  
  },
  updated: function () {
    this.$nextTick(function () { 
        var contextThere = document.getElementById("captureContext").value;
        if (contextThere) {
        var captureContext = contextThere;
        var myStyles = {
            'input': {
                'font-size': '14px',
                'color': '#3A3A3A'
            },
            '::placeholder': {
                'color': 'black',
                'line-height': '10px'
            },
            ':focus': {
                'color': 'black'
            },
            ':hover': {
                'font-style': 'italic'
            },
            ':disabled': {
                'cursor': 'not-allowed',
            },
            'valid': {
                'color': 'green'
            },
            'invalid': {
                'color': 'red'
            },
        };
    
        var flex = new Flex(captureContext);
        var microform = flex.microform({ styles: myStyles });
        this.$microObject.value = microform;
        var number = microform.createField('number', { placeholder: 'Enter card number' });
        var securityCode = microform.createField('securityCode', { placeholder: '•••' });
        number.load('#number-container-1');
        securityCode.load('#securityCode-container'); 
    }
    });
  },
};
/* const microformObejct =  getMicroform();*/
//export {microObject}; 