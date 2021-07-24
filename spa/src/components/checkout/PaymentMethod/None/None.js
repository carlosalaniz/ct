export default {
  data: () => ({
    paymentMethod: "card",
  }),
  /* methods: {
    onChange(event) {
        var payMethod = event.target.value;
        if(payMethod == "flexform"){
          this.isShow = true;
        } else {
          this.isShow = false;
        }
        fetch('http://localhost:3000/flex-key')
        .then(response => response.json())
        .then(data => this.captureContext  = data.keyId);
    }
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
        microformobject = microform;
        var number = microform.createField('number', { placeholder: 'Enter card number' });
        var securityCode = microform.createField('securityCode', { placeholder: '•••' });
        number.load('#number-container-1');
        securityCode.load('#securityCode-container');  
        }
    });
  } */
};