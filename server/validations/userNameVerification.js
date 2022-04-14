const userNameVerification = value =>
    value === undefined ||
    value === null ||
    value === '' ||
    value === /^[a-zA-Z0-9!@#$%^&*]{6,16}$/ ||
    ( typeof value === 'object' && Object.keys( value ).length === 0 ) ||
    ( typeof value === 'string' && Object.length === 0 );


module.exports = userNameVerification;
