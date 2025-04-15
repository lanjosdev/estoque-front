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
// import { ModalProduct } from "../../Modals/ModalProduct/ModalProduct";

// Utils:
import { formatToIdCode } from '../../../utils/formatStrings';

// Assets:


// Estilo:
import './painelstock.css';


export function PainelStock() {
    const { profileDetails } = useContext(UserContext);
    // Estados do componente:
    const [loading, setLoading] = useState(true);
    // const [reflashState, setReflashState] = useState(false);
    const [hasError, setHasError] = useState(true);

    // Dados a ser pré-carregados:
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState([]);
    const [totalResults, setTotalResults] = useState(0);


    // Logica do modal
    const [showModal, setShowModal] = useState(false);
    const [optionModal, setOptionModal] = useState(null);

    // Logica da UI:
    // const [productSelect, setProductSelect] = useState(null);
    const filterDefault = 'active=true';
    const [productFilterState, setProductFilterState] = useState(filterDefault); //ex com pesquisa: 'name=${productInputSearch}&active=true'
    const [productSearchState, setProductSearchState] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    
    const tokenCookie = Cookies.get('tokenEstoque');



    useEffect(()=> {
        //=> Contagem de pagina reinicia ao ter mudança no filter e/ou search (tudo é params)
        setCurrentPage(1);
    }, [productFilterState]);

    useEffect(()=> {
        async function getStockPerPage() 
        {
            setLoading(true);
            console.log('Effect Component PainelStock');
            
            try {
                setHasError(true);
                setProducts([]);
                setTotalResults(0);
                
                const response = await STOCK_GET_ALL_PER_PARAMS(JSON.parse(tokenCookie), productFilterState, currentPage);
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

                    if(response.message == "Nenhum produto encontrado com o nome informado.") {
                        setHasError(false);
                    } 
                    else {
                        toast.warn(response.message);
                    }
                    //setProductSearchState(null);
                    //setProductFilterState('active=true');
                }
                else {
                    toast.error('Erro inesperado.');
                    setProductSearchState(null);
                    setProductFilterState(filterDefault);
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
    }, [tokenCookie, productFilterState, currentPage]);




    function handleOpenModal(opt) {
        // console.log(opt);
        setOptionModal(opt);
        setShowModal(true);
    }

    function clearSearch() {
        setProductSearchState(null);
        setProductFilterState(filterDefault);
    }


    return (
        <div className="Painel PainelStock">
            <div className="painel-top">
                <h2>Total: {totalResults}</h2>

                <div className="search--btnAdd">
                    {(products.length > 0 || productSearchState) && (
                    <>
                    {/* <button className='btn filter' title='Filtrar' disabled={loading || hasError}>
                        <i className="bi bi-sliders"></i>
                    </button> */}
                    <button className='btn' title='Filtrar' onClick={()=> handleOpenModal('search')} disabled={loading || hasError}>
                        <i className="bi bi-search"></i>
                        <span>Buscar</span>
                    </button>
                    
                    {/* <button className="btn primary" onClick={()=> handleOpenModal('create')} disabled={loading || hasError}>
                        <i className="bi bi-plus-lg"></i>
                        <span>Novo produto</span>
                    </button> */}
                    </>
                    )}
                </div>
            </div>
            
            {/* <div>
                DIV PARA TER *FILTRO + BUSCA* NA VERSOA MOBILE
            </div> */}

            {(productSearchState && !loading) && (
            <div className='feedback-search'>
                <strong>{`Resultado(s) para "${productSearchState}"`}</strong>

                <button className='btn-filter clear' onClick={clearSearch}>
                    <i className="bi bi-x-circle"></i>
                    <span> Limpar busca</span>
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
                            {productSearchState ? (
                            <p>
                                Nada encontrado
                            </p>
                            ) : (
                            <>
                            <p>Nenhum produto foi cadastrado no catálogo.</p>
                            {profileDetails.level_name == 'manager' && (
                            <p>Contate o administrador do sistema.</p>
                            )}

                            {profileDetails.level_name == 'admin' && (
                            <Link to='/products' className='btn primary' disabled={hasError}>
                                <i className="bi bi-plus-lg"></i>
                                Cadastrar um produto
                            </Link>
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
                                        <span className={!product.name_storage_location ? 'txt danger' : ''}>{product.name_storage_location || 'Sem entrada'}</span>
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
        </div>
    )        
}