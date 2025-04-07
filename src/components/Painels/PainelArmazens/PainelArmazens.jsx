// Hooks / Libs:
import Cookies from "js-cookie";
import { useState, useEffect } from 'react';

// API:
import { STORAGE_GET_PER_PARAMS } from "../../../API/storageApi";

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

    // Logica do modal
    const [showModal, setShowModal] = useState(false);
    const [optionModal, setOptionModal] = useState(null);
    
    // Logica da UI:
    const [armazemSelect, setArmazemSelect] = useState(null);

    const filterDefault = 'active=true';
    const [storageSearchState, setStorageSearchState] = useState(null);
    const [storageFilterState, setStorageFilterState] = useState(filterDefault); //ex com pesquisa: 'name=${searchStateAqui}&active=true'
    const [currentPage, setCurrentPage] = useState(1);
    // const [pages, setPages] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    
    const tokenCookie = Cookies.get('tokenEstoque');



    useEffect(()=> {
        //=> Contagem de pagina reinicia ao ter mudança no filter e/ou search (tudo é params)
        setCurrentPage(1);
    }, [storageFilterState]);

    useEffect(()=> {
        async function getArmazensPerParams() 
        {
            console.log('Effect Component PainelArmazens');
            setLoading(true);
            
            try {
                setHasError(true);
                
                const response = await STORAGE_GET_PER_PARAMS(JSON.parse(tokenCookie), storageFilterState, currentPage);
                console.log(response);

                if(response.success) {
                    // let arrayPages = [];
                    // for(let i = 1; i <= response.data.last_page; i++) {
                    //     arrayPages.push(i);
                    // }
                    // // console.log(arrayPages);
                    // setPages(arrayPages);

                    setTotalResults(response.data.total);
                    setTotalPages(response.data.last_page);
                    setArmazens(response.data.data);
                    setHasError(false);
                }
                else if(response.success == false) {
                    toast.error(response.message);
                    setStorageSearchState(null);
                    setStorageFilterState('active=true');
                }
                else {
                    toast.error('Erro inesperado.');
                    setStorageSearchState(null);
                    setStorageFilterState('active=true');
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
    }, [tokenCookie, reflashState, storageFilterState, currentPage]);



    function handleOpenModal(opt) {
        // console.log(opt);
        setOptionModal(opt);
        setShowModal(true);
    }
    function handleViewProductsArmazem(itemTarget) {
        setArmazemSelect(itemTarget);

        handleOpenModal('view');
    }

    function clearSearch() {
        setStorageSearchState(null);
        setStorageFilterState('active=true');
    }


    return (
        <div className="Painel PainelArmazens">
            <div className="painel-top">
                <h2>Armazéns ({totalResults}):</h2>

                <div className="search--btnAdd">
                    {armazens.length > 0 && (
                    <>
                    {/* <button className='btn filter' title='Filtrar' disabled={loading || hasError}>
                        <i className="bi bi-sliders"></i>
                    </button> */}
                    {/* <button className='btn' title='Filtrar' onClick={()=> handleOpenModal('search')} disabled={loading || hasError}>
                        <i className="bi bi-search"></i>
                        <span>Buscar</span>
                    </button> */}
                    
                    <button className="btn primary" onClick={()=> handleOpenModal('create')} disabled={loading || hasError}>
                        <i className="bi bi-plus-lg"></i>
                        <span>Novo armazém</span>
                    </button>
                    </>
                    )}
                </div>
            </div>
            
            {/* <div>
                DIV PARA TER *FILTRO + BUSCA* NA VERSOA MOBILE
            </div> */}

            {(storageSearchState && !loading) && (
            <div className='feedback-search'>
                <strong>{`Resultado(s) para "${storageSearchState}"`}</strong>

                <button onClick={clearSearch}>
                    X 
                    Limpar busca
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
                        <div className='result-empty'>
                            <p>Nenhum armazém foi cadastrado!</p>
                            
                            <button className='btn primary' onClick={()=> handleOpenModal('create')} disabled={hasError}>
                                <i className="bi bi-plus-lg"></i>
                                Cadastrar um armazém
                            </button>
                        </div>
                    ) : (
                        <>
                        <table className=''>
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Armazém</th>
                                    <th scope="col">Setor</th>
                                    <th scope="col">Detalhamento</th>
                                    <th scope="col" data-label="ações">Ações</th>
                                </tr>
                            </thead>

                            <tbody>
                            {armazens.map((item)=> (
                                <tr key={item.id} className="item">
                                    <td data-label="id">
                                        {formatToIdCode(item.id)}
                                    </td>

                                    <td data-label="armazém">
                                        <span>
                                        {item.name}
                                        </span>
                                    </td>

                                    <td data-label="setor">
                                        {item.category_name || 'Setor não atribuido'}
                                    </td>
                                    
                                    <td data-label="detalhamento">
                                        {item.observation || 'Não informado'}
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
                setStorageFilterState={setStorageFilterState}
                />
            )}
        </div>
    )        
}