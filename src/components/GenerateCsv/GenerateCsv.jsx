// Funcionalidades / Libs:
// import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect } from 'react';

// API:
// import { ALERT_PRODUCT_GET_ALL, ALERT_PRODUCT_GENERATE } from "../../API/aleertsApi";
import { ALERT_PRODUCT_GET_ALL, ALERT_PRODUCT_GENERATE } from "../../API/alertsApi";

// Components:
import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
// import './filterstock.css';


// KpiFilter.propTypes = {
//     idKpiSelect: PropTypes.any,
//     setIdKpiSelect: PropTypes.func
// }
export function GenerateCsv() {
    // Estados do componente:
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [loadingGenerate, setLoadingGenerate] = useState(false);

    // Dados a ser pré-carregados:
    const [totalProductsALerts, setTotalProductsALerts] = useState(0);

    // Logica UI:
    



    const tokenCookie = Cookies.get('tokenEstoque');

    useEffect(()=> {
        async function getAllProductsAlerts() {
            setLoading(true);
            console.log('Effect KpiFilter');
            
            try {
                setTotalProductsALerts(0);
                setHasError(true);
                
                const response = await ALERT_PRODUCT_GET_ALL(JSON.parse(tokenCookie));
                console.log(response);

                if(response.success) {
                    // setProductsALerts([]);
                    setTotalProductsALerts(response.data.total);

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
        getAllProductsAlerts();
    }, [tokenCookie]);
    



    async function handleClickGenerateCsv() {
        setLoadingGenerate(true);

        if(!hasError) {
            if(totalProductsALerts > 0) {
                try {
                    await ALERT_PRODUCT_GENERATE(JSON.parse(tokenCookie));
                }
                catch(error) {
                    console.log(error);
                }
            }
            else {
                toast.warn('Não há produtos em alerta para gerar relatório')
                setHasError(true);
            }
        }
        

        setLoadingGenerate(false);
    }
    

    return (
        <div className='GenerateCsv'>

            <button className="btn primary" onClick={handleClickGenerateCsv} disabled={loading || hasError || loadingGenerate}>
                {loadingGenerate ? (
                    <span className="loader"></span>
                ) : (
                    <i className="bi bi-filetype-csv"></i>
                )}
                
                <span><span>Relatório</span> produtos em alerta</span>
            </button>

        </div>
    )        
}