// Hooks / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect } from 'react';

// API:
import { PRODUCT_GET_ALL_PER_PARAMS } from '../../../API/productApi';

// Components:
import { toast } from 'react-toastify';
import { Pagination } from '../../Pagination/Pagination';
import { ModalProduct } from "../../Modals/ModalProduct/ModalProduct";

// Utils:
import { formatToIdCode } from '../../../utils/formatStrings';

// Assets:

// Estilo:
import './painelnovasolicitacao.css';


PainelNovaSolicitacao.propTypes = {
    listProductsQuantities: PropTypes.array,
    handleUpdateListProducts: PropTypes.func,
    typeRequest: PropTypes.any
}
export function PainelNovaSolicitacao({ listProductsQuantities, handleUpdateListProducts, typeRequest }) {
    // Estados do componente:
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(true);

    // Dados a ser pré-carregados:
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);


    // Logica da UI:
    const defaultParams = {
        active: true,
        type: null, //'exit' 'reservation'
        name: null, //ex: 'nome produto'
        category: null, //ex: '1,2,3,4'
        expiration_date: null, // 0  1
        ordering: null, //‘A-Z’ ‘Z-A’
        page: 1
    };
    const [paramsQuery, setParamsQuery] = useState(defaultParams);
    const [productSearchState, setProductSearchState] = useState(null);
    const [idsSectorsFilter, setIdsSectorsFilter] = useState([]);
    const [filterIsExpiration, setFilterIsExpiration] = useState(null);
    // const [order, setOrder] = useState(null); //'A-Z'
    const [currentPage, setCurrentPage] = useState(1);


    // Lógica Modal:
    const [showModal, setShowModal] = useState(false);
    const [optionModal, setOptionModal] = useState(null);
    
    const tokenCookie = Cookies.get('tokenEstoque');



    useEffect(()=> {
        //=> Contagem de pagina reinicia ao ter mudança no filter e/ou search (tudo é params)
        setProductSearchState(null);
        setIdsSectorsFilter([]);
        setFilterIsExpiration(null);
        setCurrentPage(1);
    }, [typeRequest]);

    useEffect(()=> {
        //=> Contagem de pagina reinicia ao ter mudança no filter e/ou search (tudo é params)
        setCurrentPage(1);
    }, [productSearchState, idsSectorsFilter, filterIsExpiration]);


    useEffect(()=> {
        async function updateParamsQuery() {
            const newParams = {
                active: true,
                type: typeRequest == 'Saída' ? 'exit' : 'reservation',
                name: productSearchState || null,
                category: idsSectorsFilter.join(',') || null,
                expiration_date: filterIsExpiration,
                page: currentPage
            };

            setParamsQuery(newParams);
        }
        updateParamsQuery();
    }, [typeRequest, productSearchState, currentPage, idsSectorsFilter, filterIsExpiration]);


    useEffect(()=> {
        async function getProductsPerPage() {
            setLoading(true);
            console.log('Effect Component PainelNovaSolicitacao');
            
            try {
                setProducts([]);
                setTotalPages(1);
                setHasError(true);
                
                // const response = await PRODUCT_GET_PER_PARAMS(JSON.parse(tokenCookie), `${productFilterState}&type=${typeRequest == 'Saída' ? 'exit' : 'reservation'}`, currentPage);
                const response = await PRODUCT_GET_ALL_PER_PARAMS(JSON.parse(tokenCookie), paramsQuery);
                console.log(response);

                if(response.success) {
                    // setProducts([]);
                    setProducts(response.data.data);
                    setTotalPages(response.data.last_page);

                    setHasError(false);
                }
                else if(response.success == false) {
                    console.warn(response.message);
                    toast.warn(response.message);

                    // if(response.message == "Nenhum produto encontrado com o nome informado.") {
                    //     setHasError(false);
                    // } 
                    // else {
                    //     toast.error(response.message);
                    // }
                    
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
        getProductsPerPage();
    }, [tokenCookie, paramsQuery]);




    
    function handleOpenModal(optModal) {
        console.log(optModal)

        setOptionModal(optModal);
        setShowModal(true);
    }

    function clearSearch() {
        setProductSearchState(null);
        setIdsSectorsFilter([]);
        setFilterIsExpiration(null);
        setCurrentPage(1);
    }


    return (
        <div className="Painel PainelNovaSolicitacao">
            <div className="painel-top">
                <h2>Catálago de produtos</h2>

                {/* {(products.length > 0 || productSearchState) && ( */}
                <div className="filter--search">
                    <button className='btn filter' onClick={()=> handleOpenModal('filter')} title='Filtrar' disabled={loading || hasError}>
                        <i className="bi bi-sliders"></i>
                    </button>

                    <button className='btn secundary' 
                    onClick={()=> handleOpenModal('search')}
                    title='Buscar por nome de produto' 
                    disabled={loading || hasError}
                    >
                        <i className="bi bi-search"></i>
                        <span>Buscar</span>
                    </button>
                </div>
                {/* )} */}
            </div>
            
            {/* <div>
                DIV PARA TER *FILTRO + BUSCA* NA VERSOA MOBILE
            </div> */}

            {((productSearchState || idsSectorsFilter.length > 0 || paramsQuery.expiration_date != null) && !loading) && (
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
                            <span> Erro ao carregar produtos!</span>
                        </p>
                        
                        <a className='btn primary' href='/nova-solicitacao'>
                            <i className="bi bi-arrow-clockwise"></i>
                            Recarregue a página
                        </a>
                    </div>

                    ) : (
                        products.length == 0 ? (

                        <div className='result-empty'>
                            <p>Nada encontrado</p>
                        </div>

                        ) : (
                        <>
                        <table className=''>
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Produto</th>
                                    <th scope="col">Setor</th>
                                    <th scope="col">Qtde</th>
                                    <th scope="col" data-label="ações">Ações</th>
                                </tr>
                            </thead>

                            <tbody>
                            {products.map((product)=> (
                                <tr key={product.id} className="item-sector" disabled={product.quantity_stock == 0}>
                                    <td data-label="id">
                                        {formatToIdCode(product.id)}
                                    </td>

                                    <td data-label="produto">
                                        <span>{product.name}</span>
                                    </td>

                                    <td data-label="setor">
                                        {product.name_category}
                                    </td>

                                    <td data-label="qtde">
                                        <span className={product.quantity_stock == 0 ? 'empty' : ''}>{product.quantity_stock || 'Sem estoque'}</span>
                                    </td>

                                    <td data-label="ações">
                                        {listProductsQuantities.some((each)=> each.id == product.id) ? (
                                        <button className="btn danger" onClick={()=> handleUpdateListProducts(product)} disabled={product.quantity_stock == 0}>
                                            <i className="bi bi-trash3"></i>
                                            <span>Remover</span>
                                        </button>
                                        ) : (
                                        <button className="btn secundary" onClick={()=> handleUpdateListProducts(product)} disabled={product.quantity_stock == 0}>
                                            <i className="bi bi-plus-circle"></i>
                                            <span>Adicionar</span>
                                        </button>
                                        )}
                                        
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

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


            {/* {showModal && (
                <ModalProduct
                close={()=> setShowModal(false)} 
                setReflashState={setReflashState} 
                optionModal={optionModal}
                productSelect={productSelect}
                optionUpdate={optionUpdate}
                productSearchState={productSearchState}
                setProductSearchState={setProductSearchState}
                setProductFilterState={setProductFilterState}
                clearSearch={clearSearch}
                />
            )} */}
            {showModal && (
                <ModalProduct
                close={()=> setShowModal(false)} 
                optionModal={optionModal}
                productSearchState={productSearchState}
                setProductSearchState={setProductSearchState}
                idsSectorsFilter={idsSectorsFilter}
                setIdsSectorsFilter={setIdsSectorsFilter}
                filterIsExpiration={filterIsExpiration}
                setFilterIsExpiration={setFilterIsExpiration}
                // clearSearch={clearSearch}
                />
            )}
        </div>
    )        
}