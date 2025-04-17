// Funcionalidades / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState } from 'react';

// API:

// Components:
import { KpiFilter } from "./KpiFilter/KpiFilter";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
// import './filterstock.css';


FilterStock.propTypes = {
    close: PropTypes.func,
    idKpiFilter: PropTypes.any,
    setIdKpiFilter: PropTypes.func
}
export function FilterStock({ close, idKpiFilter, setIdKpiFilter }) {
    // // Estados do componente:
    // const [loading, setLoading] = useState(true);
    // const [hasError, setHasError] = useState(true);

    // Logica UI (Para componentes filhos): 
    const [idKpiSelect, setIdKpiSelect] = useState(idKpiFilter || null);


   






    // APLY FILTER:
    async function handleConfirmFilterSector() {
        setIdKpiFilter(idKpiSelect);
        close();
    }

    

    return (
        <div className='Window FilterStock grid WindowFilterUser'>
            <h3>Filtro por KPI</h3>

            <KpiFilter idKpiSelect={idKpiSelect} setIdKpiSelect={setIdKpiSelect} />


            <div className="btns">
                <button className="btn primary" 
                onClick={handleConfirmFilterSector} 
                // disabled={!idKpiSelect}
                >
                    Aplicar filtro
                </button>

                <button className="btn cancel" type="button" onClick={close}>
                    Cancelar
                </button>
            </div>
        </div>
    )        
}