import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import React, { useState } from 'react'
function PhoneNumber() {

    const [phoneNumber, setPhoneNumber] = useState()
    return (
        <PhoneInput
            placeholder="Enter phone number"
            value={phoneNumber}
            name={phoneNumber}
            onChange={setPhoneNumber} />
    )
}

export default PhoneNumber