// Funcionalidades / Libs:
import PropTypes from "prop-types";
// import Cookies from "js-cookie";
import { useState } from 'react';

// API:

// Components:
import { SectorFilter } from "./SectorFilter/SectorFilter";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
import './filterproduct.css';


FilterProduct.propTypes = {
    close: PropTypes.func,
    idsSectorsFilter: PropTypes.any,
    setIdsSectorsFilter: PropTypes.func
}
export function FilterProduct({ 
    close, 
    idsSectorsFilter, 
    setIdsSectorsFilter,
    filterIsExpiration,
    setFilterIsExpiration
}) {
    // Estados do componente:
    // const [loading, setLoading] = useState(true);
    // const [hasError, setHasError] = useState(true);


    // Logica UI (Para componentes filhos): 
    // Setores
    const [idsSectorsActives, setIdsSectorsActives] = useState(idsSectorsFilter || []);

    // Validade
    const [isExpirationSelect, setIsExpirationSelect] = useState(filterIsExpiration);

    function handleClickRadio(valueId) {
        if(valueId == isExpirationSelect) {
            setIsExpirationSelect(null);
        }
    }





    // APLY FILTER:
    async function handleConfirmFilterSector() {
        console.log(isExpirationSelect)
        setIdsSectorsFilter(idsSectorsActives);
        setFilterIsExpiration(isExpirationSelect);
        close();
    }


    return (
        <div className='Window FilterProduct grid WindowFilterUser'>

            <h3>Filtros</h3>

            <div className="content-window">

                <SectorFilter idsSectorsActives={idsSectorsActives} setIdsSectorsActives={setIdsSectorsActives} />                

                <div className="component_child">
                    <h4 className="title_child">Filtrar por validade</h4>

                    <div className="radios-group">
                        <label className='btn-filter'>
                            <input 
                            type="radio" 
                            checked={isExpirationSelect == 1}
                            onChange={()=> setIsExpirationSelect(1)}
                            onClick={()=> handleClickRadio(1)}
                            />

                            <span>Com validade</span>
                        </label>

                        <label className='btn-filter'>
                            <input 
                            type="radio" 
                            checked={isExpirationSelect == 0}
                            onChange={()=> setIsExpirationSelect(0)}
                            onClick={()=> handleClickRadio(0)}
                            />

                            <span>Sem validade</span>
                        </label>
                    </div>
                </div>



                <div className="btns">
                    <button className="btn primary" 
                    onClick={handleConfirmFilterSector} 
                    >
                        Aplicar filtro(s)
                    </button>

                    <button className="btn cancel" type="button" onClick={close}>
                        Cancelar
                    </button>
                </div>
            </div>    

        </div>
    )        
}