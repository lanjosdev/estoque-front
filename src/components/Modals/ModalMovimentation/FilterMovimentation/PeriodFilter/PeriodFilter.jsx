// Funcionalidades / Libs:
// import PropTypes from "prop-types";
// import Cookies from "js-cookie";
// import { useState } from 'react';

// API:
// import { STOCK_GET_ALL_KPI } from "../../../../../API/stockApi";

// Components:
// import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
import './periodfilter.css';


// TypeFilter.propTypes = {
//     idKpiSelect: PropTypes.any,
//     setIdKpiSelect: PropTypes.func
// }
export function PeriodFilter({ periodFilterSelect, setPeriodFilterSelect }) {
    // Estados do componente:
    



    // const [dateStart, setDateStart] = useState(periodFilterSelect[0]);
    // const [dateEnd, setDateEnd] = useState(periodFilterSelect[1]);



    function handleChangePeriod(idx, value) {
        const newPeriod = [...periodFilterSelect];

        newPeriod[idx] = value;

        console.log(newPeriod);
        setPeriodFilterSelect(newPeriod);
    }
    

    return (
        <div className='PeriodFilter TypeFilter'>
            <h4>Filtro por período</h4>

            
            <div className="content">

                <div className="label--input">
                    <label htmlFor="">Data inicio</label>

                    <input type="date" className="input" 
                    value={periodFilterSelect[0] || ''} 
                    onChange={(e)=> handleChangePeriod(0, e.target.value)}  
                    required 
                    />
                </div>

                <div className="label--input">
                    <label htmlFor="">Data fim</label>

                    <input type="date" className="input" 
                    value={periodFilterSelect[1] || ''} 
                    onChange={(e)=> handleChangePeriod(1, e.target.value)}
                    min={periodFilterSelect[0]}
                    disabled={!periodFilterSelect[0]}
                    required 
                    />
                </div>
                
            </div>
                         
        </div>
    )        
}