// Funcionalidades / Libs:
// import PropTypes from "prop-types";
// import Cookies from "js-cookie";
// import { useState, useEffect } from 'react';

// API:
// import { STOCK_GET_ALL_KPI } from "../../../../../API/stockApi";

// Components:
// import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
import './typefilter.css';


// TypeFilter.propTypes = {
//     idKpiSelect: PropTypes.any,
//     setIdKpiSelect: PropTypes.func
// }
export function TypeFilter({ typeFilterSelect, setTypeFilterSelect }) {
    // Estados do componente:
    








    function handleClick(valueId) {
        if(valueId == typeFilterSelect) {
            setTypeFilterSelect(null);
        }
    }


    return (
        <div className='TypeFilter'>
            <h4>Filtro por tipo de movimentação</h4>

            
            <div className="content-window">

                <div className="radios-group">
                    <label className='btn-filter'>
                        <input 
                        type="radio" 
                        // value={item.value}
                        checked={typeFilterSelect == 'input'}
                        onChange={()=> setTypeFilterSelect('input')}
                        onClick={()=> handleClick('input')}
                        />
                        Entradas
                    </label>

                    <label className='btn-filter'>
                        <input 
                        type="radio" 
                        // value={item.value}
                        checked={typeFilterSelect == 'exit'}
                        onChange={()=> setTypeFilterSelect('exit')}
                        onClick={()=> handleClick('exit')}
                        />
                        Saídas
                    </label>
                </div>

            </div>
                         
        </div>
    )        
}