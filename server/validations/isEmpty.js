const isEmpty = value =>
    value === undefined ||
    value === null ||
    value === '' ||
    ( typeof value === 'object' && Object.keys( value ).length === 0 ) ||
    ( typeof value === 'string' && Object.length === 0 );

module.exports = isEmpty;
