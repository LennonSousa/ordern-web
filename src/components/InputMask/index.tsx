import React, { InputHTMLAttributes, useCallback } from "react";

import { cep, cpf, prettifyCurrency } from "./masks";



interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    mask: "cep" | "currency" | "cpf";
    prefix?: string;
}

const Input: React.FC<InputProps> = ({ mask, prefix, ...props }) => {
    const handleKeyUp = useCallback(
        (e: React.FormEvent<HTMLInputElement>) => {
            if (mask === "cep") {
                cep(e);
            }
            if (mask === "currency") {
                prettifyCurrency(e);
            }
            if (mask === "cpf") {
                cpf(e);
            }
        },
        [mask]
    );

    return (
        <div className="input-group mb-2">
            <div className="input-group-prepend">
                <div className="input-group-text">{prefix && prefix}</div>
            </div>
            <input {...props} onKeyUp={handleKeyUp} className="form-control" />
        </div>
    );
};

export default Input;
