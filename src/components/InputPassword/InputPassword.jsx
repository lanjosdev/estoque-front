// Funcionalidades / Libs:
import PropTypes from "prop-types";
import { useState } from 'react';
// import { Navigate } from 'react-router-dom';

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:


// Estilo:
import './inputpassword.css';


InputPassword.propTypes = {
    passwordRef: PropTypes.any
}
export function InputPassword({ passwordRef }) {
    const [showPassword, setShowPassword] = useState(false);
    

    return (
        <div className="InputPassword">
            <input ref={passwordRef} className="input" id='senha' type={showPassword ? 'text' : 'password'} required />
            <div className="eye">
                <input
                type="checkbox"
                id='showSenha'
                onClick={()=> setShowPassword(!showPassword)}
                />

                <label htmlFor="showSenha">
                    {showPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                </label>
            </div>
        </div>
    )        
}