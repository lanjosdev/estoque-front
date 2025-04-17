// Hooks / Libs:
import Cookies from "js-cookie";
import { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";

// API:
import { STOCK_GET_ALL_PER_PARAMS } from "../../../API/stockApi";

// Contexts:
import UserContext from '../../../contexts/userContext';

// Components:
import { toast } from 'react-toastify';
import { Pagination } from '../../Pagination/Pagination';
import { ModalStock } from "../../Modals/ModalStock/ModalStock";

// Utils:
import { formatToIdCode } from '../../../utils/formatStrings';

// Assets:


// Estilo:
import './painelstock.css';


export function PainelStock() {
    const { profileDetails } = useContext(UserContext);
    // Estados do componente:
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    // const [reflashState, setReflashState] = useState(false);

    // Dados a ser pré-carregados:
    const [products, setProducts] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // Logica da UI:
    // Filtros/Query
    const defaultParams = {
        active: true,
        kpi: null,
        name: null,
        page: 1
    };
    const [paramsQuery, setParamsQuery] = useState(defaultParams);
    const [idKpiFilter, setIdKpiFilter] = useState(null);
    const [productSearchState, setProductSearchState] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Logica do modal
    const [showModal, setShowModal] = useState(false);
    const [optionModal, setOptionModal] = useState(null);


    const tokenCookie = Cookies.get('tokenEstoque');





    useEffect(()=> {
        //=> Contagem de pagina reinicia ao ter mudança no filter e/ou search (tudo é params)
        setCurrentPage(1);
    }, [productSearchState, idKpiFilter]);


    useEffect(()=> {
        async function updateParamsQuery() {
            const newParams = {
                active: true,
                kpi: idKpiFilter || null,
                name: productSearchState,
                page: currentPage
            };

            setParamsQuery(newParams);
        }
        updateParamsQuery();
    }, [idKpiFilter, productSearchState, currentPage]);

    useEffect(()=> {
        async function getStockPerPage() 
        {
            setLoading(true);
            console.log('Effect Component PainelStock');
            
            try {
                setProducts([]);
                setHasError(true);
                setTotalResults(0);
                setTotalPages(1);
                
                const response = await STOCK_GET_ALL_PER_PARAMS(JSON.parse(tokenCookie), paramsQuery);
                console.log(response);

                if(response.success) {
                    // setProducts([]);
                    setProducts(response.data.data);
                    setTotalPages(response.data.last_page)
                    setTotalResults(response.data.total);

                    setHasError(false);
                }
                else if(response.success == false) {
                    console.warn(response.message);
                    toast.warn(response.message);

                    // if(response.message == "Nenhum produto encontrado com o nome informado.") {
                    //     setHasError(false);
                    // } 
                    // else {
                    //     toast.warn(response.message);
                    // }
                    //setProductSearchState(null);
                    //setProductFilterState('active=true');
                }
                else {
                    toast.error('Erro inesperado.');
                    // setProductSearchState(null);
                    // setProductFilterState(filterDefault);
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
        getStockPerPage();
    }, [tokenCookie, paramsQuery]);






    function handleOpenModal(optModal) {
        console.log(optModal)

        setOptionModal(optModal);
        setShowModal(true);
    }

    function clearSearch() {
        setIdKpiFilter(null);
        setProductSearchState(null);
        setCurrentPage(1);
    }


    return (
        <div className="Painel PainelStock">
            <div className="painel-top">
                <h2>Total: {totalResults}</h2>

                <div className="filter--search">
                    <button className='btn filter' onClick={()=> handleOpenModal('filter')} title='Filtrar' disabled={loading || hasError}>
                        <i className="bi bi-sliders"></i>
                    </button>
                    
                    <button className='btn secundary' onClick={()=> handleOpenModal('search')} title='Buscar' disabled={loading || hasError}>
                        <i className="bi bi-search"></i>
                        <span>Buscar</span>
                    </button>
                </div>
            </div>
            
            {/* <div>
                DIV PARA TER *FILTRO + BUSCA* NA VERSOA MOBILE
            </div> */}

            {((productSearchState || idKpiFilter) && !loading) && (
            <div className='feedback-search'>
                <strong>{`Resultado(s) ${productSearchState ? `para "${productSearchState}"` : ''}`}</strong>

                <button className='btn-filter clear' onClick={clearSearch}>
                    <i className="bi bi-x-circle"></i>
                    <span> Limpar busca/filtro</span>
                </button>
            </div>
            )}

            <div className="painel-content">
                {loading ? (

                    <p className='result-empty'>{productSearchState ? 'Buscando produtos...' : 'Carregando produtos...'}</p>

                ) : (
                    hasError ? (

                    <div className='feedback_content'>
                        <p>
                            <i className="bi bi-exclamation-triangle"></i>
                            <span> Erro ao carregar os dados!</span>
                        </p>
                        
                        <a className='btn primary' href='/estoque'>
                            <i className="bi bi-arrow-clockwise"></i>
                            Recarregue a página
                        </a>
                    </div>

                    ) : (
                        products.length === 0 ? (
                        <div className='result-empty'>
                            {(paramsQuery.kpi || paramsQuery.name) ? (
                            <p>
                                Nada encontrado
                            </p>
                            ) : (
                            <>
                            <p>Nenhum produto foi cadastrado no catálogo.</p>

                            {profileDetails.level_name == 'admin' ? (
                                <Link to='/products' className='btn primary' disabled={hasError}>
                                    <i className="bi bi-plus-lg"></i>
                                    Cadastrar um produto
                                </Link>
                            ) : (
                                <p>Contate o administrador do sistema.</p>
                            )}                            
                            </>
                            )}


                        </div>
                        ) : (
                        <>
                        <table className=''>
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col" data-label="produto">Produto</th>
                                    <th scope="col">Setor</th>
                                    <th scope="col">Armazenado em</th>
                                    <th scope="col">Qtd. ideal</th>
                                    <th scope="col">Qtd. mínima</th>
                                    <th scope="col">Qtd. atual</th>
                                    <th scope="col">KPI</th>
                                </tr>
                            </thead>

                            <tbody>
                            {products.map((product)=> (
                                <tr key={product.id} className="item">
                                    <td data-label="id">
                                        {formatToIdCode(product.id)}
                                    </td>

                                    <td data-label="produto">
                                        <span>{product.name}</span>
                                    </td>

                                    <td data-label="setor">
                                        {product.name_category}
                                    </td>

                                    <td data-label="armazenado em">
                                        <div>
                                            {product.detailing_storage_location && (
                                                <p className="">
                                                    {product.detailing_storage_location}
                                                </p>
                                            )}

                                            <span className={!product.name_storage_location ? 'txt danger' : 'local'}>
                                                {product.name_storage_location || 'Sem'}
                                            </span>
                                        </div>
                                    </td>

                                    <td data-label="qtd. ideal">
                                        <span>{product.quantity_ideal}</span>
                                    </td>
                                    
                                    <td data-label="qtd. mínima">
                                        <span>{product.quantity_min}</span>
                                    </td>

                                    <td data-label="qtd. atual">
                                        <span className={product.kpi == 'danger' ? 'txt danger' : ''}>{product.quantity_stock}</span>
                                    </td>

                                    <td data-label="kpi">
                                        <span className={`circle_kpi ${product.kpi}`} title={product.kpi == 'good' ? 'ideal' : product.kpi == 'warning' ? 'alerta' : 'crítico'}></span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        {/* <div className='legenda'>
                            <h5>Legenda:</h5>
                            <small>
                                <span className='alert'>*</span> 
                                Produtos em alerta.
                            </small>
                        </div> */}

                        <Pagination 
                        setLoading={setLoading} 
                        setHasError={setHasError} 
                        currentPage={currentPage} 
                        setCurrentPage={setCurrentPage} 
                        totalPages={totalPages}
                        />
                        </>
                        )
                    )
                )}
            </div>


            {showModal && (
                <ModalStock
                close={()=> setShowModal(false)} 
                optionModal={optionModal}
                productSearchState={productSearchState}
                setProductSearchState={setProductSearchState}
                idKpiFilter={idKpiFilter}
                setIdKpiFilter={setIdKpiFilter}
                // clearSearch={clearSearch}
                />
            )}
        </div>
    )        
}