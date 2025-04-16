// Funcionalidades / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect } from 'react';

// API:
import { CATEGORY_GET_ALL } from "../../../../API/categoryApi";

// Components:
import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
// import './filterarmazem.css';


FilterArmazem.propTypes = {
    close: PropTypes.func,
    idsSectorsFilter: PropTypes.any,
    setIdsSectorsFilter: PropTypes.func
}
export function FilterArmazem({ close, idsSectorsFilter, setIdsSectorsFilter }) {
    // Estados do componente:
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(true);

    // Dados a ser pré-carregados:
    const [sectors, setSectors] = useState([]);

    // Logica UI: 
    const [idsSectorsActives, setIdsSectorsActives] = useState(idsSectorsFilter || []);

    const tokenCookie = Cookies.get('tokenEstoque');



    useEffect(()=> {
        async function getAllSectors() {
            setLoading(true);
            console.log('Effect Window FilterProduct');
            
            try {
                setHasError(true);
                
                const response = await CATEGORY_GET_ALL(JSON.parse(tokenCookie), 'active=true');
                console.log(response);

                if(response.success) {
                    // setSectors([]);
                    setSectors(response.data);

                    setHasError(false);
                }
                else if(response.success == false) {
                    console.warn(response.message);
                    toast.warn(response.message);
                }
                else {
                    toast.error('Erro inesperado.');
                }
            }
            catch(error) {
                if(error?.response?.data?.message == 'Unauthenticated.') {
                    console.error('Requisição não autenticada.');
                }
                else {
                    console.error('Houve algum erro.');
                }

                console.error('DETALHES DO ERRO:', error);
            }
            
            setLoading(false);
        }
        getAllSectors();
    }, [tokenCookie]);




    function handleChangeIdsSectors(idTarget) {
        const index = idsSectorsActives.findIndex(each=> each == idTarget);
        const newIdsSectorsActives = [...idsSectorsActives];

        if(index == -1) {
            newIdsSectorsActives.push(idTarget);
        } 
        else {
            newIdsSectorsActives.splice(index, 1);
        }

        console.log(newIdsSectorsActives);
        setIdsSectorsActives(newIdsSectorsActives);
    }


    // APLY FILTER:
    async function handleConfirmFilterSector() {
        setIdsSectorsFilter(idsSectorsActives);
        close();
    }

    

    return (
        <div className='Window FilterProduct grid WindowFilterUser'>
            <h3>Filtro por setores</h3>

            {loading ? (
                <p className='result-empty'>Carregando dados...</p>
            ) : (

                hasError ? (
                    <p className='result-empty'>Erro ao carregar dados</p>
                ) : (
                    <div className="content-window">
                        <div className="radios-group">
                            {sectors.map((item, idx)=> (
                            <label className='btn-filter' key={idx}>
                                <input 
                                type="checkbox" 
                                // value={item.value}
                                checked={idsSectorsActives.some(each=> each == item.id)}
                                onChange={()=> handleChangeIdsSectors(item.id)}
                                />
                                {item.name}
                            </label>
                            ))}
                        </div>

                        <div className="btns">
                            <button className="btn primary" 
                            onClick={handleConfirmFilterSector} 
                            // disabled={sectorFilterModal == sectorFilter}
                            // disabled={idsSectorsActives.length == 0}
                            >
                                Aplicar filtro
                            </button>

                            <button className="btn cancel" type="button" onClick={close}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                )
            )}           
        </div>
    )        
}