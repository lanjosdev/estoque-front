// Hooks / Libs:
import Cookies from "js-cookie";
import { useState, useEffect } from 'react';

// API:
import { STORAGE_GET_ALL_PER_PARAMS } from "../../../API/storageApi";

// Components:
import { toast } from 'react-toastify';
import { DropdownMenuArmazens } from "../../DropdownMenus/DropdownArmazens/DropdownMenuArmazens";
import { Pagination } from '../../Pagination/Pagination';
import { ModalArmazem } from "../../Modals/ModalArmazem/ModalArmazem";

// Utils:
import { formatToIdCode } from '../../../utils/formatStrings';

// Assets:


// Estilo:
import './painelarmazens.css';


export function PainelArmazens() {
    // Estados do componente:
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(true);
    const [reflashState, setReflashState] = useState(false);

    // Dados a ser pré-carregados:
    const [armazens, setArmazens] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Logica da UI:
    // Filtros/Query
    const defaultParams = {
        active: true,
        category: null,
        name: null,
        ordering: null,
        page: 1
    };
    const [paramsQuery, setParamsQuery] = useState(defaultParams);
    const [idsSectorsFilter, setIdsSectorsFilter] = useState([]);
    const [storageSearchState, setStorageSearchState] = useState(null);
    const [order, setOrder] = useState(null); //'A-Z'
    const [currentPage, setCurrentPage] = useState(1);

    const [armazemSelect, setArmazemSelect] = useState(null);

    // Logica do modal
    const [showModal, setShowModal] = useState(false);
    const [optionModal, setOptionModal] = useState(null);
    
    const tokenCookie = Cookies.get('tokenEstoque');




    useEffect(()=> {
        //=> Contagem de pagina reinicia ao ter mudança no filter e/ou search (tudo é params)
        setCurrentPage(1);
    }, [storageSearchState, idsSectorsFilter]);


    useEffect(()=> {
        async function updateParamsQuery() {
            const newParams = {
                active: true,
                category: idsSectorsFilter.join(',') || null,
                name: storageSearchState,
                ordering: order || null,
                page: currentPage
            };

            setParamsQuery(newParams);
        }
        updateParamsQuery();
    }, [idsSectorsFilter, storageSearchState, order, currentPage]);

    useEffect(()=> {
        async function getArmazensPerParams() 
        {
            setLoading(true);
            console.log('Effect Component PainelArmazens');
            
            try {
                setArmazens([]);
                setHasError(true);
                
                // const response = await STORAGE_GET_PER_PARAMS(JSON.parse(tokenCookie), storageFilterState, currentPage);
                const response = await STORAGE_GET_ALL_PER_PARAMS(JSON.parse(tokenCookie), paramsQuery);
                console.log(response);

                if(response.success) {
                    // setArmazens([]);
                    setArmazens(response.data.data);
                    setTotalPages(response.data.last_page);
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
        getArmazensPerParams();
    }, [tokenCookie, paramsQuery, reflashState]);




    
    function handleOpenModal(optModal) {
        console.log(optModal)

        setOptionModal(optModal);
        setShowModal(true);
    }
    function handleViewProductsArmazem(itemTarget) {
        setArmazemSelect(itemTarget);

        handleOpenModal('view');
    }

    function clearSearch() {
        setStorageSearchState(null);
        setIdsSectorsFilter([]);
        setCurrentPage(1);
    }


    return (
        <div className="Painel PainelArmazens">
            <div className="painel-top">
                <h2>Total: {totalResults}</h2>

                <div className="search--btnAdd">
                    {/* {armazens.length > 0 && ( */}
                    <>
                    <button className='btn filter' onClick={()=> handleOpenModal('filter')} title='Filtrar' disabled={loading || hasError}>
                        <i className="bi bi-sliders"></i>
                    </button>
                    
                    <button className='btn secundary' title='Filtrar' onClick={()=> handleOpenModal('search')} disabled={loading || hasError}>
                        <i className="bi bi-search"></i>
                        <span>Buscar</span>
                    </button>

                    
                    <button className="btn primary" onClick={()=> handleOpenModal('create')} disabled={loading || hasError}>
                        <i className="bi bi-plus-lg"></i>
                        <span>Novo armazém</span>
                    </button>
                    </>
                    {/* )} */}
                </div>
            </div>
            
            {/* <div>
                DIV PARA TER *FILTRO + BUSCA* NA VERSOA MOBILE
            </div> */}

            {((storageSearchState || idsSectorsFilter.length > 0) && !loading) && (
            <div className='feedback-search'>
                <strong>{`Resultado(s) ${storageSearchState ? `para "${storageSearchState}"` : ''}`}</strong>

                <button className='btn-filter clear' onClick={clearSearch}>
                    <i className="bi bi-x-circle"></i>
                    <span> Limpar busca/filtro</span>
                </button>
            </div>
            )}

            <div className="painel-content">
                {loading ? (

                    <p className='result-empty'>{storageSearchState ? 'Buscando armazéns...' : 'Carregando armazéns...'}</p>

                ) : (
                    hasError ? (

                    <div className='feedback_content'>
                        <p>
                            <i className="bi bi-exclamation-triangle"></i>
                            <span> Erro ao carregar armazéns!</span>
                        </p>
                        
                        <a className='btn primary' href='/armazens'>
                            <i className="bi bi-arrow-clockwise"></i>
                            Recarregue a página
                        </a>
                    </div>

                    ) : (
                    armazens.length === 0 ? (
                        (paramsQuery.category || paramsQuery.name) ? (
                            <div className='result-empty'>
                                <p>Nada encontrado</p>
                            </div>
                        ) : (
                            <div className='result-empty'>
                                <p>Nenhum armazém foi cadastrado!</p>
                                
                                <button className='btn primary' onClick={()=> handleOpenModal('create')} disabled={hasError}>
                                    <i className="bi bi-plus-lg"></i>
                                    Cadastrar um armazém
                                </button>
                            </div>
                        )
                    ) : (
                        <>
                        <table className=''>
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Setor</th>
                                    <th scope="col">Armazém</th>
                                    <th scope="col">Endereçamento</th>
                                    <th scope="col" data-label="ações">Ações</th>
                                </tr>
                            </thead>

                            <tbody>
                            {armazens.map((item)=> (
                                <tr key={item.id} className="item">
                                    <td data-label="id">
                                        {formatToIdCode(item.id)}
                                    </td>

                                    <td data-label="setor">
                                        {item.category_name || 'Setor não atribuido'}
                                    </td>

                                    <td data-label="armazém">
                                        <span>
                                        {item.observation || 'Não informado'}
                                        </span>
                                    </td>
                                    
                                    <td data-label="endereçamento">
                                        {item.name}
                                    </td>

                                    <td data-label="ações">
                                        <div className="btns_actions">
                                            <button 
                                            className="btn view" 
                                            title="Ver produtos contidos neste armazém"
                                            onClick={()=> handleViewProductsArmazem(item)}
                                            >
                                                <i className="bi bi-eye"></i>
                                            </button>

                                            <DropdownMenuArmazens
                                            dataArmazem={item}
                                            setArmazemSelect={setArmazemSelect}
                                            handleOpenModal={handleOpenModal}
                                            />
                                        </div>
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
                    ))
                )}
            </div>


            {showModal && (
                <ModalArmazem
                close={()=> setShowModal(false)} 
                setReflashState={setReflashState} 
                optionModal={optionModal}
                armazemSelect={armazemSelect}
                storageSearchState={storageSearchState}
                setStorageSearchState={setStorageSearchState}
                idsSectorsFilter={idsSectorsFilter}
                setIdsSectorsFilter={setIdsSectorsFilter}
                />
            )}
        </div>
    )        
}