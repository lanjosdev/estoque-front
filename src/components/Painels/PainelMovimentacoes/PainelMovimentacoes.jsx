// Hooks / Libs:
import { useState, useEffect } from 'react';
import Cookies from "js-cookie";

// API:
import { MOVIMENTATION_GET_ALL_PER_PARAMS } from '../../../API/movimentationApi';

// Components:
import { toast } from 'react-toastify';
import { DropdownMenuInput } from '../../DropdownMenus/DropdownInput/DropdownMenuInput';
import { DropdownMenuExit } from '../../DropdownMenus/DropdownExit/DropdownMenuExit';
import { Pagination } from '../../Pagination/Pagination';

import { ModalTypeMovimentation } from '../../Modals/ModalTypeMovimentation/ModalTypeMovimentation';
import { ModalInput } from '../../Modals/ModalInput/ModalInput';
import { ModalExit } from '../../Modals/ModalExit/ModalExit';
import { ModalMovimentation } from '../../Modals/ModalMovimentation/ModalMovimentation';

// Utils:
import { formatToIdCode } from '../../../utils/formatStrings';
import { formatFullToHoursMinutes } from '../../../utils/formatDate';

// Assets:

// Estilo:
import './painelmovimentacoes.css';


export function PainelMovimentacoes() {
    // Estados do componente:
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(true);
    const [reflashState, setReflashState] = useState(false);

    // Dados a ser pré-carregados:
    const [movimentations, setMovimentations] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    // Logica da UI:
    // Filtros/Query
    const defaultParams = {
        type: null,
        // discarded: null, //1
        period: null,
        product: null,
        date: null,
        page: 1
    };
    const [paramsQuery, setParamsQuery] = useState(defaultParams);
    const [typeFilter, setTypeFilter] = useState(null);
    const [periodFilter, setPeriodFilter] = useState([]); //array data inicia e fim
    const [productSearchState, setProductSearchState] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);


    // Logica Modals:
    const [showModal, setShowModal] = useState(false);
    const [optionModal, setOptionModal] = useState(null);
    const [showModalNewMovimentation, setShowModalNewMovimentation] = useState(false);
    const [showModalInput, setShowModalInput] = useState(false);
    const [optionModalInput, setOptionModalInput] = useState(null);
    const [showModalExit, setShowModalExit] = useState(false);
    const [optionModalExit, setOptionModalExit] = useState(null);

    
    const [movimentationSelect, setMovimentationSelect] = useState(null);

    
    const tokenCookie = Cookies.get('tokenEstoque');



    useEffect(()=> {
        //=> Contagem de pagina reinicia ao ter mudança no filter e/ou search (tudo é params)
        setCurrentPage(1);
    }, [productSearchState, typeFilter]);


    useEffect(()=> {
        async function updateParamsQuery() {
            const newParams = {
                type: typeFilter || null,
                period: periodFilter[1] ? periodFilter.join(',') : null,
                product: productSearchState || null,
                date: null,
                page: currentPage || 1
            };

            setParamsQuery(newParams);
        }
        updateParamsQuery();
    }, [productSearchState, typeFilter, periodFilter, currentPage]);

    useEffect(()=> {
        async function getMoviments() 
        {
            setLoading(true);
            console.log('Effect Component PainelMovimentacoes');
            
            try {
                setMovimentations([]);
                setTotalPages(1);
                setHasError(true);

                // const response = await MOVIMENTATION_GET_PER_PARAMS(JSON.parse(tokenCookie), '', currentPage);
                const response = await MOVIMENTATION_GET_ALL_PER_PARAMS(JSON.parse(tokenCookie), paramsQuery);
                console.log(response);

                if(response.success) {
                    setMovimentations(response.data.data);
                    setTotalPages(response.data.last_page);

                    setHasError(false);
                }
                else if(response.success == false) {
                    console.warn(response.message);
                    toast.warn(response.message);
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
        getMoviments();
    }, [tokenCookie, paramsQuery, reflashState]);



    function handleOpenNewMovimentation() {
        setShowModalNewMovimentation(true);
    }

    function handleOpenModalInput(opt) {
        console.log(opt);
        setShowModalNewMovimentation(false);

        setOptionModalInput(opt);
        setShowModalInput(true);

        if(opt == 'create') {
            clearSearch();
        }
    }
    function handleOpenModalExit(opt) {
        console.log(opt);
        setShowModalNewMovimentation(false);

        setOptionModalExit(opt);
        setShowModalExit(true);

        if(opt == 'create') {
            clearSearch();
        }
    }



    function handleOpenModal(optModal) {
        console.log(optModal)

        setOptionModal(optModal);
        setShowModal(true);
    }

    function clearSearch() {
        setTypeFilter(null);
        setPeriodFilter([]);
        setProductSearchState(null);

        setCurrentPage(1);
    }


    return (
        <div className="Painel PainelMovimentacoes">
            <div className="painel-top">
                <h2>Registros</h2>

                <div className="search--btnAdd">
                    <button className='btn filter' onClick={()=> handleOpenModal('filter')} title='Filtrar' disabled={loading || hasError}>
                        <i className="bi bi-sliders"></i>
                    </button>

                    <button className='btn secundary' title='Buscar' onClick={()=> handleOpenModal('search')} disabled={loading || hasError}>
                        <i className="bi bi-search"></i>
                        <span>Buscar</span>
                    </button>

                    {movimentations.length > 0 && (
                    <button className="btn primary" onClick={handleOpenNewMovimentation} disabled={loading || hasError}>
                        <i className="bi bi-plus-lg"></i>
                        <span>Nova movimentação</span>
                    </button>
                    )}
                </div>
            </div>


            {((productSearchState || typeFilter || periodFilter[0]) && !loading) && (
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

                    <p className='feedback_content'>Carregando registros...</p>

                ) : (
                    hasError ? (

                    <div className='feedback_content'>
                        <p>
                            <i className="bi bi-exclamation-triangle"></i>
                            <span> Erro ao carregar as movimentações</span>
                        </p>
                        
                        <a className='btn primary' href='/movimentacoes'>
                            <i className="bi bi-arrow-clockwise"></i>
                            Recarregue a página
                        </a>
                    </div>

                    ) : (
                    movimentations.length === 0 ? (
                        (paramsQuery.type || paramsQuery.period || paramsQuery.product) ? (
                            <div className='result-empty'>
                                <p>Nada encontrado</p>
                            </div>
                        ) : (
                            <div className='result-empty'>
                                <p>Nenhuma movimentação registrada</p>
                                
                                <button className='btn primary' onClick={handleOpenNewMovimentation} disabled={hasError}>
                                    <i className="bi bi-plus-lg"></i>
                                    Registrar movimentação
                                </button>
                            </div>
                        )
                        
                    ) : (
                        <>
                        <table className=''>
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Tipo</th>
                                    {/* <th scope="col" data-label="space"></th> */}
                                    <th scope="col">Produto</th>
                                    <th scope="col">Setor</th>
                                    <th scope="col" data-label="quantidade">Quantidade</th>
                                    <th scope="col">Usuário</th>
                                    {/* <th scope="col">Armazém</th> */}
                                    <th scope="col">Data</th>
                                    <th scope="col" data-label="ações">Ações</th>
                                </tr>
                            </thead>

                            <tbody>
                            {movimentations.map((item)=> (
                                <tr key={`${item.id}${item.sub_type || item.type}`} className="item">
                                    <td data-label="id">
                                        <span>{formatToIdCode(item.id, 4)}</span>
                                    </td>

                                    <td data-label="tipo">
                                        <div className="tipo_content">
                                            <span className={`badge ${item.type == 'ENTRADA' ? 'success' : ''}`} title={item.type}>
                                                {item.type == 'ENTRADA' ? (
                                                <i className="bi bi-box-arrow-in-down"></i>
                                                ) : (
                                                <i className="bi bi-box-arrow-up"></i>
                                                )}
                                                {/* <span>{item.type}</span> */}
                                            </span>
                                            
                                            {item.sub_type && (
                                            <span className={`sub_type ${item.sub_type == 'DESCARTE' ? 'discard alert' : ''}`} title={item.sub_type}>
                                                {item.sub_type == 'DESCARTE' ? 'D' : 'E'}
                                            </span>
                                            )}
                                        </div>
                                    </td>
                                    
                                    {/* <td data-label="space">
                                        
                                    </td> */}
                                    
                                    <td data-label="Produto">
                                        <span>{item.product_name}</span>
                                    </td>

                                    <td data-label="setor">
                                        <span>{item.category_name}</span>
                                    </td>

                                    <td data-label="quantidade">
                                        <span>
                                            {item.quantity > 0 ? (item.type == 'ENTRADA' ? '+' : '-') : ''}
                                            {item.quantity}
                                            
                                            {(item.type == 'ENTRADA' && item.pending == 1) && (
                                                <span className='pending'>!</span>
                                            )}
                                        </span>
                                    </td>

                                    <td data-label="usuário">
                                        <span>
                                            <span className="name-profile">{item.name_user}</span>
                                        </span>
                                    </td>

                                    {/* <td data-label="armazém">
                                        <span>{item.storage_locations_name || 'Sem dado'}</span>
                                    </td> */}

                                    <td data-label="data">
                                        {formatFullToHoursMinutes(item.created_at)}
                                    </td>
                                    
                                    <td data-label="ações">
                                        {item.type == 'ENTRADA' ? (
                                            <DropdownMenuInput
                                            dataInput={item}
                                            setInputSelect={setMovimentationSelect}
                                            handleOpenModalInput={handleOpenModalInput}
                                            />
                                        ) : (
                                            <DropdownMenuExit 
                                            dataExit={item}
                                            setExitSelect={setMovimentationSelect}
                                            handleOpenModalExit={handleOpenModalExit}
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <div className='legenda'>
                            <h5>Legenda:</h5>

                            <div className="legenda_content">
                                <small>
                                    <span className='discard'>D</span>
                                    Descarte
                                </small>

                                <small>
                                    <span>E</span>
                                    Empréstimo
                                </small>

                                <small>
                                    <span className='pending'>!</span>
                                    Pendência
                                </small>
                            </div>
                        </div>

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



            {showModalNewMovimentation && (
                <ModalTypeMovimentation 
                close={()=> setShowModalNewMovimentation(false)}
                handleOpenModalInput={handleOpenModalInput}
                handleOpenModalExit={handleOpenModalExit}
                />
            )}

            {showModal && (
                <ModalMovimentation 
                close={()=> setShowModal(false)} 
                optionModal={optionModal}
                productSearchState={productSearchState}
                setProductSearchState={setProductSearchState}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                periodFilter={periodFilter}
                setPeriodFilter={setPeriodFilter}
                />
            )}

            {showModalInput && (
                <ModalInput
                close={()=> setShowModalInput(false)} 
                setReflashState={setReflashState} 
                optionModal={optionModalInput}
                inputSelect={movimentationSelect}
                />
            )}
            {showModalExit && (
                <ModalExit
                close={()=> setShowModalExit(false)}
                setReflashState={setReflashState}
                optionModal={optionModalExit}
                exitSelect={movimentationSelect}
                />
            )}
        </div>
    )        
}