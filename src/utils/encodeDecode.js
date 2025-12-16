
export const encodeDesignNumbers = (designNumbers) => {
    return designNumbers.map(designNumber => Buffer.from(designNumber).toString('base64'));
};

export const decodeDesignNumbers = (encodedDesignNumbers) => {
    return encodedDesignNumbers.map(encoded => Buffer.from(encoded, 'base64').toString('utf-8'));
};
