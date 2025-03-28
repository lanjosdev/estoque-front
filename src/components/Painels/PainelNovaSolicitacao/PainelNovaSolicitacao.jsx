// Hooks / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect } from 'react';

// API:
import { PRODUCT_GET_PER_PARAMS } from '../../../API/productApi';

// Components:
import { toast } from 'react-toastify';
import { Pagination } from '../../Pagination/Pagination';
// import { ModalProduct } from "../../Modals/ModalProduct/ModalProduct";

// Utils:
import { formatToIdCode } from '../../../utils/formatStrings';

// Assets:


// Estilo:
import './painelnovasolicitacao.css';


PainelNovaSolicitacao.propTypes = {
    listProductsQuantities: PropTypes.array,
    handleUpdateListProducts: PropTypes.func
}
export function PainelNovaSolicitacao({ listProductsQuantities, handleUpdateListProducts }) {
    // Estados do componente:
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(true);

    // Dados a ser pré-carregados:
    const [products, setProducts] = useState([]);

    // Logica do modal
    // const [showModal, setShowModal] = useState(false);
    // const [optionModal, setOptionModal] = useState(null);

    // Logica da UI:
    // const [productSelect, setProductSelect] = useState(null);

    const filterDefault = 'active=true';
    const [productFilterState, setProductFilterState] = useState(filterDefault); //ex com pesquisa: 'name=${productInputSearch}&active=true'
    const [currentPage, setCurrentPage] = useState(1);
    const [pages, setPages] = useState([]);
    const [productSearchState, setProductSearchState] = useState(null);
    
    const tokenCookie = Cookies.get('tokenEstoque');



    useEffect(()=> {
        //=> Contagem de pagina reinicia ao ter mudança no filter e/ou search (tudo é params)
        setCurrentPage(1);
    }, [productFilterState]);

    useEffect(()=> {
        async function getProductsPerPage() 
        {
            setLoading(true);
            console.log('Effect Component PainelNovaSolicitacao');
            
            try {
                setHasError(true);
                setProducts([]);
                
                const response = await PRODUCT_GET_PER_PARAMS(JSON.parse(tokenCookie), productFilterState, currentPage);
                console.log(response);

                if(response.success) {
                    let arrayPages = [];
                    for(let i = 1; i <= response.data.last_page; i++) {
                        arrayPages.push(i);
                    }
                    // console.log(arrayPages);
                    setPages(arrayPages);
                    setProducts(response.data.data);
                    setHasError(false);
                }
                else if(response.success == false) {
                    console.warn(response.message);

                    if(response.message == "Nenhum produto encontrado com o nome informado.") {
                        setHasError(false);
                    } 
                    else {
                        toast.error(response.message);
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
        getProductsPerPage();
    }, [tokenCookie, productFilterState, currentPage]);



    // function handleOpenModal(opt) {
    //     // console.log(opt);
    //     setOptionModal(opt);
    //     setShowModal(true);
    // }

    // function clearSearch() {
    //     setProductSearchState(null);
    //     setProductFilterState(filterDefault);
    // }


    return (
        <div className="Painel PainelNovaSolicitacao">
            <div className="painel-top">
                <h2>Produtos (Catálago):</h2>

                {products.length > 0 && (
                    <div className="filter--search">
                        {/* <button className='btn filter' title='Filtrar' disabled={loading || hasError}>
                            <i className="bi bi-sliders"></i>
                        </button> */}

                        <button className='btn' title='Filtrar' disabled={loading || hasError}>
                            <i className="bi bi-search"></i>
                            <span>Buscar</span>
                        </button>
                    </div>
                )}
            </div>
            
            {/* <div>
                DIV PARA TER *FILTRO + BUSCA* NA VERSOA MOBILE
            </div> */}

            {(productSearchState && !loading) && (
            <div className='feedback-search'>
                <strong>{`Resultado(s) para "${productSearchState}"`}</strong>

                <button className='btn-filter clear'>
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
                                    <th scope="col">Qtd. estoque</th>
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

                                    <td data-label="qtd. estoque">
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
                        pages={pages}
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