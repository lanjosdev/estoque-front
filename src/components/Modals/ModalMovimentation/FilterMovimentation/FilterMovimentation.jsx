// Funcionalidades / Libs:
// import PropTypes from "prop-types";
// import Cookies from "js-cookie";
import { useState } from 'react';

// API:

// Components:
import { TypeFilter } from './TypeFilter/TypeFilter';
import { PeriodFilter } from './PeriodFilter/PeriodFilter';

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
// import './filtermovimentation.css';


// FilterMovimentation.propTypes = {
//     close: PropTypes.func,
//     idKpiFilter: PropTypes.any,
//     setIdKpiFilter: PropTypes.func
// }
export function FilterMovimentation({ close, typeFilter, setTypeFilter, periodFilter, setPeriodFilter }) {
    // // Estados do componente:
    // const [loading, setLoading] = useState(true);
    // const [hasError, setHasError] = useState(true);

    // Logica UI (Para componentes filhos): 
    const [typeFilterSelect, setTypeFilterSelect] = useState(typeFilter || null);
    const [periodFilterSelect, setPeriodFilterSelect] = useState(periodFilter || ['', '']);


//    console.log(periodFilter);






    // APLY FILTER:
    async function handleConfirmFilters() {
        console.log(typeFilterSelect)
        console.log(periodFilterSelect)

        setTypeFilter(typeFilterSelect);
        if(!periodFilterSelect[1]) {
            setPeriodFilter(['', '']);
        } 
        else {
            setPeriodFilter(periodFilterSelect);
        }
        
        close();
    }

    

    return (
        <div className='Window FilterMovimentation grid WindowFilterUser'>
            <h3>Filtros</h3>

            <TypeFilter typeFilterSelect={typeFilterSelect} setTypeFilterSelect={setTypeFilterSelect} />

            <PeriodFilter periodFilterSelect={periodFilterSelect} setPeriodFilterSelect={setPeriodFilterSelect} />


            <div className="btns">
                <button className="btn primary" 
                onClick={handleConfirmFilters} 
                disabled={!typeFilterSelect && (!periodFilterSelect[0] || !periodFilterSelect[1])}
                >
                    Aplicar filtro(s)
                </button>

                <button className="btn cancel" type="button" onClick={close}>
                    Cancelar
                </button>
            </div>
        </div>
    )        
}