// Funcionalidades / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect } from 'react';

// API:
import { STOCK_GET_ALL_KPI } from "../../../../../API/stockApi";

// Components:
// import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
// import './filterstock.css';


KpiFilter.propTypes = {
    idKpiSelect: PropTypes.any,
    setIdKpiSelect: PropTypes.func
}
export function KpiFilter({ idKpiSelect, setIdKpiSelect }) {
    // Estados do componente:
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(true);

    // Dados a ser pré-carregados:
    const [kpiList, setKpiList] = useState([]);

    // Logica UI:
    const kpiTitlesPT = {
        good: 'Ideal',
        warning: 'Alerta',
        danger: 'Crítico'
    }



    const tokenCookie = Cookies.get('tokenEstoque');

    useEffect(()=> {
        async function getAllKpi() {
            setLoading(true);
            console.log('Effect KpiFilter');
            
            try {
                setHasError(true);
                
                const response = await STOCK_GET_ALL_KPI(JSON.parse(tokenCookie));
                console.log(response);

                if(response.success) {
                    // setKpiList([]);
                    setKpiList(response.data);

                    setHasError(false);
                }
                else if(response.success == false) {
                    console.warn(response.message);
                }
                else {
                    console.error('Erro inesperado.');
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
        getAllKpi();
    }, [tokenCookie]);


    function handleClick(valueId) {
        if(valueId == idKpiSelect) {
            setIdKpiSelect(null);
        }
    }

    

    return (
        <div className='KpiFilter'>
            {/* <h4>Filtro por KPI</h4> */}

            {loading ? (
                <p className=''>Carregando...</p>
            ) : (

                hasError ? (
                    <p className='result-empty'>Erro ao carregar dados</p>
                ) : (
                    <div className="content-window">
                        <div className="radios-group">
                            {kpiList.map((item, idx)=> (
                            <label className='btn-filter' key={idx}>
                                <input 
                                type="radio" 
                                checked={item.id == idKpiSelect}
                                onChange={()=> setIdKpiSelect(item.id)}
                                onClick={()=> handleClick(item.id)}
                                />

                                <span className={`circle_kpi ${item.performance_indicator}`}></span>
                                
                                {kpiTitlesPT[item.performance_indicator]}
                            </label>
                            ))}
                        </div>
                    </div>
                )

            )}           
        </div>
    )        
}