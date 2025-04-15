// Funcionalidades / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect } from 'react';

// API:
import { CATEGORY_GET_ALL } from "../../../../API/categoryApi";
import { toast } from "react-toastify";
import { PRODUCT_GET_ALL_PER_PARAMS } from "../../../../API/productApi";

// Components:
// import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
// import './filterproduct.css';


FilterProduct.propTypes = {
    close: PropTypes.func,
    sectorFilter: PropTypes.string,
    setSectorFilter: PropTypes.func
}
export function FilterProduct({ close, sectorFilter, setSectorFilter }) {
    // Estados do componente:
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(true);

    // Dados a ser pré-carregados:
    const [sectors, setSectors] = useState([]);


    const [sectorsActives, setSectorsActives] = useState([]);


    const [sectorFilterModal, setSectorFilterModal] = useState(sectorFilter);

    const optionsFilter = [
        {title: 'Ativados', value: 'active=true'},
        {title: 'Deletados', value: 'active=false'},
        {title: 'Ambos', value: ''}
    ];



    useEffect(()=> {
        async function getAllSectors() {
            setLoading(true);
            console.log('Effect Window FilterProduct');
            
            // try {
            //     setHasError(true);
            //     setProducts([]);
            //     console.log(paramsQuery)
                
            //     // const response = await PRODUCT_GET_PER_PARAMS(JSON.parse(tokenCookie), `${productFilterState}&type=${typeRequest == 'Saída' ? 'exit' : 'reservation'}`, currentPage);
            //     const response = await PRODUCT_GET_ALL_PER_PARAMS(JSON.parse(tokenCookie), paramsQuery, otherQuery);
            //     console.log(response);

            //     if(response.success) {
            //         setProducts([]);
            //         setProducts(response.data.data);
            //         setTotalPages(response.data.last_page);

            //         setHasError(false);
            //     }
            //     else if(response.success == false) {
            //         console.warn(response.message);

            //         if(response.message == "Nenhum produto encontrado com o nome informado.") {
            //             setHasError(false);
            //         } 
            //         else {
            //             toast.error(response.message);
            //         }
            //         //setProductSearchState(null);
            //         //setProductFilterState('active=true');
            //     }
            //     else {
            //         toast.error('Erro inesperado.');
            //         // setProductSearchState(null);
            //         // setProductFilterState(filterDefault);
            //     }
            // }
            // catch(error) {
            //     if(error?.response?.data?.message == 'Unauthenticated.') {
            //         console.error('Requisição não autenticada.');
            //     }
            //     else {
            //         console.error('Houve algum erro.');
            //     }

            //     console.error('DETALHES DO ERRO:', error);
            // }
            
            setLoading(false);
        }
        getAllSectors();
    }, []);




    // FILTER/READ:
    async function handleConfirmFilterSector() {
        setSectorFilter(sectorFilterModal);
        close();
    }

    

    return (
        <div className='Window FilterSector grid WindowFilterUser'>
            <h3>Filtrar Setores</h3>

            <div className="content-window">
                <div className="radios-group">
                    {optionsFilter.map((item, idx)=> (
                    <label className='btn-filter' key={idx}>
                        <input 
                        type="radio" 
                        value={item.value}
                        onChange={()=> setSectorFilterModal(item.value)}
                        checked={item.value == sectorFilterModal}
                        />
                        {item.title}
                    </label>
                    ))}
                </div>

                <div className="btns">
                    <button className="btn primary" onClick={handleConfirmFilterSector} disabled={sectorFilterModal == sectorFilter}>
                        Aplicar filtro
                    </button>

                    <button className="btn cancel" type="button" onClick={close}>
                        Cancelar
                    </button>
                </div>
            </div>           
        </div>
    )        
}