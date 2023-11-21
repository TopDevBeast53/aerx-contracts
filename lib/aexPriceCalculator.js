
const getAexPrice = (worthOfOneAexToToken, priceOfToken) => {
    const outPutToken = 1 / worthOfOneAexToToken;
    const aexPrice = outPutToken * priceOfToken;
    return aexPrice;
}

const getEquivalentAex =  (worthOfOneAexToToken, priceOfToken, amount) => {
    let res = getAexPrice(worthOfOneAexToToken,priceOfToken)
    const tokenValue = amount / priceOfToken;
    const aexValue = amount / res;
    return {
        token_number: tokenValue,
        aex_number : aexValue,
    };
}
export {getAexPrice, getEquivalentAex}