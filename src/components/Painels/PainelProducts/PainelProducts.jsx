// Hooks / Libs:
import Cookies from "js-cookie";
import { useState, useEffect } from 'react';

// API:
import { PRODUCT_GET_ALL_PER_PARAMS } from '../../../API/productApi';

// Components:
import { toast } from 'react-toastify';
import { DropdownMenuProduct } from '../../DropdownMenus/DropdownProduct/DropdownMenuProduct';
import { Pagination } from '../../Pagination/Pagination';
import { ModalProduct } from "../../Modals/ModalProduct/ModalProduct";

// Utils:
import { formatToIdCode } from '../../../utils/formatStrings';

// Assets:

// Estilo:
import './painelproducts.css';


export function PainelProducts() {
    // Estados do componente:
    const [loading, setLoading] = useState(true);
    const [reflashState, setReflashState] = useState(false);
    const [hasError, setHasError] = useState(true);

    // Dados a ser pré-carregados:
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    // Filtros/Query
    const defaultParams = {
        active: true,
        type: null, //'exit' 'reservation'
        ordering: null, //‘A-Z’ ‘Z-A’
        category: null, //ex: '1,2,3,4'
        name: null, //ex: 'nome produto'
        expiration_date: null, // 0  1
        page: 1
    };
    const [paramsQuery, setParamsQuery] = useState(defaultParams);
    const [productSearchState, setProductSearchState] = useState(null);
    const [idsSectorsFilter, setIdsSectorsFilter] = useState([]);
    const [filterIsExpiration, setFilterIsExpiration] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);


    // Logica do modal
    const [showModal, setShowModal] = useState(false);
    const [optionModal, setOptionModal] = useState(null);
    const [optionUpdate, setOptionUpdate] = useState(null);

    // Logica da UI:
    const [productSelect, setProductSelect] = useState(null);

    // const filterDefault = 'active=true';
    // const [productFilterState, setProductFilterState] = useState(filterDefault); //ex com pesquisa: 'name=${productInputSearch}&active=true'
    




    const tokenCookie = Cookies.get('tokenEstoque');

    useEffect(()=> {
        //=> Contagem de pagina reinicia ao ter mudança no filter e/ou search (tudo é params)
        setCurrentPage(1);
    }, [productSearchState, idsSectorsFilter, filterIsExpiration]);

    useEffect(()=> {
        async function updateParamsQuery() {
            const newParams = {
                active: true,
                name: productSearchState || null,
                category: idsSectorsFilter.join(',') || null,
                expiration_date: filterIsExpiration,
                page: currentPage
            };

            setParamsQuery(newParams);
        }
        updateParamsQuery();
    }, [idsSectorsFilter, productSearchState, currentPage, filterIsExpiration]);

    useEffect(()=> {
        async function getProductsPerPage() 
        {
            setLoading(true);
            console.log('Effect Component PainelProducts');
            
            try {
                setProducts([]);
                setTotalPages(1);
                setTotalResults(0);
                setHasError(true);
                
                // const response = await PRODUCT_GET_PER_PARAMS(JSON.parse(tokenCookie), productFilterState, currentPage);
                // console.log(productSearchState);
                // console.log(idsSectorsFilter);
                // console.log(filterIsExpiration);
                const response = await PRODUCT_GET_ALL_PER_PARAMS(JSON.parse(tokenCookie), paramsQuery);
                console.log(response);

                if(response.success) {
                    // setProducts([]);
                    setProducts(response.data.data);
                    setTotalPages(response.data.last_page);
                    setTotalResults(response.data.total);

                    setHasError(false);
                }
                else if(response.success == false) {
                    console.warn(response.message);
                    toast.error(response.message);

                    // if(response.message == "Nenhum produto encontrado com o nome informado.") {
                    //     setHasError(false);
                    // } 
                    // else {
                    //     toast.error(response.message);
                    // }
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
        getProductsPerPage();
    }, [tokenCookie, reflashState, paramsQuery]);





    function handleOpenModal(opt) {
        console.log(opt);
        setOptionModal(opt);
        setShowModal(true);
    }

    function clearSearch() {
        setProductSearchState(null);
        setIdsSectorsFilter([]);
        setFilterIsExpiration(null);
        setCurrentPage(1);
    }

    return (
        <div className="Painel PainelProducts">
            <div className="painel-top">
                <h2>Total: {totalResults}</h2>

                {!(products.length == 0 && !paramsQuery.name && !paramsQuery.category && !paramsQuery.expiration_date) && (
                    <div className="search--btnAdd">
                        <button className='btn filter' onClick={()=> handleOpenModal('filter')} title='Filtrar' disabled={loading || hasError}>
                            <i className="bi bi-sliders"></i>
                        </button>
                        
                        <button className='btn secundary' title='Buscar' onClick={()=> handleOpenModal('search')} disabled={loading || hasError}>
                            <i className="bi bi-search"></i>
                            <span>Buscar</span>
                        </button>
                        
                        <button className="btn primary" onClick={()=> handleOpenModal('create')} disabled={loading || hasError}>
                            <i className="bi bi-plus-lg"></i>
                            <span>Novo produto</span>
                        </button>
                    </div>
                )}
            </div>
            
            {/* <div>
                DIV PARA TER *FILTRO + BUSCA* NA VERSOA MOBILE
            </div> */}
            {(!loading && (paramsQuery.name || paramsQuery.category || paramsQuery.expiration_date != null)) && (
            <div className='feedback-search'>
                <strong>{`Resultado(s) ${paramsQuery.name ? `para "${paramsQuery.name}"` : ''}`}</strong>

                <button className='btn-filter clear' onClick={clearSearch}>
                    <i className="bi bi-x-circle"></i>
                    <span> Limpar busca/filtro</span>
                </button>
            </div>
            )}
        

            <div className="painel-content">
                {loading ? (

                    <p className='result-empty'>{paramsQuery.name ? 'Buscando produtos...' : 'Carregando produtos...'}</p>

                ) : (
                    hasError ? (

                    <div className='feedback_content'>
                        <p>
                            <i className="bi bi-exclamation-triangle"></i>
                            <span> Erro ao carregar produtos!</span>
                        </p>
                        
                        <a className='btn primary' href='/products'>
                            <i className="bi bi-arrow-clockwise"></i>
                            Recarregue a página
                        </a>
                    </div>

                    ) : (
                        products.length === 0 ? (
                        <div className='result-empty'>
                            {(paramsQuery.name || paramsQuery.category || paramsQuery.expiration_date) ? (
                            <p>
                                Nada encontrado
                            </p>
                            ) : (
                            <>
                            <p>Nenhum produto foi cadastrado!</p>
                            
                            <button className='btn primary' onClick={()=> handleOpenModal('create')} disabled={hasError}>
                                <i className="bi bi-plus-lg"></i>
                                Cadastrar um produto
                            </button>
                            </>
                            )}
                        </div>
                        ) : (
                        <>
                        <table className=''>
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Produto</th>
                                    <th scope="col">Setor</th>
                                    <th scope="col">Qtd. ideal</th>
                                    <th scope="col">Qtd. mínima</th>
                                    <th scope="col">Vencimento</th>
                                    <th scope="col" data-label="ações">Ações</th>
                                </tr>
                            </thead>

                            <tbody>
                            {products.map((product)=> (
                                <tr key={product.id} className="item-sector">
                                    <td data-label="id">
                                        {formatToIdCode(product.id)}
                                    </td>

                                    <td data-label="produto">
                                        <span>{product.name}</span>
                                    </td>

                                    <td data-label="setor">
                                        {product.name_category}
                                    </td>

                                    <td data-label="qtd. ideal">
                                        <span>{product.quantity_ideal}</span>
                                    </td>
                                    
                                    <td data-label="qtd. mínima">
                                        <span>{product.quantity_min}</span>
                                    </td>

                                    <td data-label="vencimento">
                                        {product.expiration_date == 1 ? 'Sim' : 'Não'}
                                    </td>

                                    <td data-label="ações">
                                        <DropdownMenuProduct 
                                        dataProduct={product} 
                                        setProductSelect={setProductSelect} 
                                        handleOpenModal={handleOpenModal}
                                        setOptionUpdate={setOptionUpdate}
                                        />
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
                <ModalProduct
                close={()=> setShowModal(false)} 
                setReflashState={setReflashState} 
                optionModal={optionModal}
                productSelect={productSelect}
                optionUpdate={optionUpdate}
                productSearchState={productSearchState}
                setProductSearchState={setProductSearchState}
                idsSectorsFilter={idsSectorsFilter}
                setIdsSectorsFilter={setIdsSectorsFilter}
                filterIsExpiration={filterIsExpiration}
                setFilterIsExpiration={setFilterIsExpiration}
                clearSearch={clearSearch}
                />
            )}
        </div>
    )        
}