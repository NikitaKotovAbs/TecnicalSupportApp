import React, { useState } from 'react';

const VerificationCodeInput = ({ length, onChange }) => {
    const [values, setValues] = useState(Array(length).fill(''));

    const handleChange = (value, index) => {
        // Проверяем, что вводятся только цифры
        if (!/^\d*$/.test(value)) return;

        const newValues = [...values];
        newValues[index] = value;
        setValues(newValues);
        onChange(newValues.join(''));

        // Автоматический переход к следующему полю
        if (value && index < length - 1) {
            document.getElementById(`digit-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // Переход на предыдущую клетку при нажатии Backspace
        if (e.key === 'Backspace' && !values[index] && index > 0) {
            document.getElementById(`digit-${index - 1}`).focus();
        }
    };

    return (
        <div className="flex justify-center space-x-2">
            {Array(length).fill(0).map((_, index) => (
                <input
                    key={index}
                    id={`digit-${index}`}
                    type="text"
                    maxLength="1"
                    value={values[index]}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            ))}
        </div>
    );
};

export default VerificationCodeInput;
