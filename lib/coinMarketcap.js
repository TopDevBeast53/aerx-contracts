const axios = require('axios');
const headers = {
    'X-CMC_PRO_API_KEY': `${process.env.NEXT_PUBLIC_COINBASE_API_KEY}`,
};

const getTokenDetails = async(token_id) => {
        const params = new URLSearchParams([['id', token_id]]);
        try {
            const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest', {
                headers,
                params
            });
            console.log("Response: ",response.data);
            return response.data
        } catch(err) {
          console.error("Error while getting coin details: ", err);
        }
}

const convertTokenToTokenOrFiat = async(amount,token_from_id,fiat_or_token_to_id) => {
    const params = new URLSearchParams([['amount', amount], ['id', token_from_id], ['convert_id', fiat_or_token_to_id]]);
    try {
        const response = await axios.get('https://pro-api.coinmarketcap.com/v1/tools/price-conversion', {
        headers,
        params
      });
        console.log("Response: ",response.data);
        return response.data
    } catch(err) {
      console.error("Error while getting coin details: ", err);
    }
}

//Todo: Add more functions

export {getTokenDetails, convertTokenToTokenOrFiat}
