// Hooks / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect } from 'react';

// API:
import { CATEGORY_GET_ALL } from "../../../../API/categoryApi";
import { STORAGE_VIEW_PRODUCTS } from "../../../../API/storageApi";

// Context:
// import UserContext from "../../../../contexts/userContext";

// Components:
import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
import './viewarmazem.css';


ViewArmazem.propTypes = {
    close: PropTypes.func,
    armazemSelect: PropTypes.object
}
export function ViewArmazem({ close, armazemSelect }) {
    console.log(armazemSelect)
    // Estados do componente:
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);


    // Pré carregamento de dados:
    const [productsArmazem, setProductsArmazem] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Logica UI:
    const [currentPage, setCurrentPage] = useState(1);
    // const paramsDefault = '';
    // const [storageFilterState, setStorageFilterState] = useState(paramsDefault); //ex com pesquisa: 'name=${searchStateAqui}&active=true'
    // const [storageSearchState, setStorageSearchState] = useState(null);


    const tokenCookie = Cookies.get('tokenEstoque');



    useEffect(()=> {
        async function getProductsArmazem() {
            setLoading(true);
            console.log('Effect Window ViewArmazem');

            try {
                setHasError(true);
                //=> GET ALL CATEGORY
                const response = await STORAGE_VIEW_PRODUCTS(JSON.parse(tokenCookie), armazemSelect.id, 1)
                console.log(response);

                if(response.success) {
                    // setProductsArmazem([]);
                    setProductsArmazem(prev=> [...prev, ...response.data.data]);
                    setTotalPages(response.data.last_page);
                    setTotalResults(response.data.total);
                    
                    setHasError(false);
                }
                else if(response.success == false) {
                    console.error(response.message);
                    // toast.error(response.message);
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
        getProductsArmazem();
    }, [tokenCookie, armazemSelect, currentPage]);



    

    

    return (
        <div className='Window ViewArmazem grid'>
            <div className="window_top">
                <h3>Produtos armazenados em: "{armazemSelect.name}"</h3>

                <button type="button" onClick={close}>
                    <i className="bi bi-x-lg"></i>
                </button>
            </div>   


            <div className="window_content">
                {(loading && productsArmazem.length == 0) ? (

                    <p className='result-empty'>Carregando produtos...</p>

                ) : (
                    (hasError && productsArmazem.length == 0) ? (

                    <p className='result-empty'>
                        <span>
                            <i className="bi bi-exclamation-triangle"></i>
                            <span> Erro ao carregar produtos!</span>
                        </span>
                    </p>

                    ) : (
                    
                    productsArmazem.length == 0 ? (
                        <p className='result-empty'>
                            Sem produtos neste armazém.
                        </p>
                    ) : (
                        <>
                        <p className="total_result">Total de produtos: {totalResults}</p>

                        <ul className="list_items">
                            <li className="title_list">
                                <span className="product_name">Produto</span>                                
                                <span className="product_qtd">Qtd. estoque</span>                                
                            </li>

                            {productsArmazem.map(item=> (
                            <li className="item_list" key={item.id_product} >
                                <span className="product_name">{item.product}</span>
                                <span className="product_qtd">{item.quantity}</span>
                            </li>
                            ))}


                            {currentPage < totalPages && (
                            <p className="show-more">
                                <button type="button"
                                onClick={()=> setCurrentPage(currentPage + 1)}
                                disabled={loading || hasError}
                                >
                                    Mostrar mais {(hasError && !loading) && '(Houve algum erro)'}
                                </button>
                            </p>
                            )}
                        </ul>
                        </>
                    )
                    
                    )
                )}
            </div>
        </div>
    )        
}