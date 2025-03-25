// Hooks / Libs:
import Cookies from "js-cookie";
import { useState, useEffect } from 'react';

// API:
import { PRODUCT_GET_PER_PARAMS } from '../../../API/productApi';

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
    const [totalResults, setTotalResults] = useState(0);

    // Logica do modal
    const [showModal, setShowModal] = useState(false);
    const [optionModal, setOptionModal] = useState(null);
    const [optionUpdate, setOptionUpdate] = useState(null);

    // Logica da UI:
    const [productSelect, setProductSelect] = useState(null);

    const filterDefault = 'active=true';
    const [productSearchState, setProductSearchState] = useState(null);
    const [productFilterState, setProductFilterState] = useState(filterDefault); //ex com pesquisa: 'name=${productInputSearch}&active=true'
    const [currentPage, setCurrentPage] = useState(1);
    const [pages, setPages] = useState([]);
    
    const tokenCookie = Cookies.get('tokenEstoque');



    useEffect(()=> {
        //=> Contagem de pagina reinicia ao ter mudança no filter e/ou search (tudo é params)
        setCurrentPage(1);
    }, [productFilterState]);

    useEffect(()=> {
        async function getProductsPerPage() 
        {
            setLoading(true);
            console.log('Effect Component PainelProducts');
            
            try {
                setHasError(true);
                setProducts([]);
                setTotalResults(0);
                
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
                    setTotalResults(response.data.total);
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
    }, [tokenCookie, reflashState, productFilterState, currentPage]);



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
        <div className="Painel PainelProducts">
            <div className="painel-top">
                <h2>Produtos ({totalResults}):</h2>

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
                    
                    <button className="btn primary" onClick={()=> handleOpenModal('create')} disabled={loading || hasError}>
                        <i className="bi bi-plus-lg"></i>
                        <span>Novo produto</span>
                    </button>
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
                            {productSearchState ? (
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
                                    <th scope="col">Nome</th>
                                    <th scope="col">Setor</th>
                                    <th scope="col">Qtd. ideal</th>
                                    <th scope="col">Qtd. mínima</th>
                                    <th scope="col">Vencimento</th>
                                    <th scope="col">Ações</th>
                                </tr>
                            </thead>

                            <tbody>
                            {products.map((product)=> (
                                <tr key={product.id} className="item-sector">
                                    <td data-label="id">
                                        {formatToIdCode(product.id)}
                                    </td>

                                    <td data-label="nome">
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

                        <div className='legenda'>
                            <h5>Legenda:</h5>
                            <small>
                                <span className='alert'>*</span> 
                                Produtos em alerta.
                            </small>
                        </div>

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


            {showModal && (
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
            )}
        </div>
    )        
}