// Hooks / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect } from 'react';
// import { useNavigate } from "react-router-dom";

// API:
import { ORDER_GET_ALL_PER_PARAMS } from "../../../API/orderApi";

// Components:
import { toast } from "react-toastify";
import { Pagination } from "../../Pagination/Pagination";
import { DropdownMenuSolicitacoes } from "../../DropdownMenus/DropdownSolicitacoes/DropdownMenuSolicitacoes";
import { ModalSolicitacoes } from "../../Modals/ModalSolicitacoes/ModalSolicitacoes";
// import { ModalSector } from '../../Modals/ModalSector/ModalSector';

// Utils:
import { formatToIdCode } from '../../../utils/formatStrings';
import { formatFullToHoursMinutes } from "../../../utils/formatDate";
import { ModalExit } from "../../Modals/ModalExit/ModalExit";

// Assets:

// Estilo:
import './painelsolicitacoes.css';


PainelSolicitacoes.propTypes = {
    filterFinalized: PropTypes.bool
}
export function PainelSolicitacoes({ filterFinalized }) {
    // Estados do componente:
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(null);
    const [refreshState, setRefreshState] = useState(false);

    // Dados a ser pré-carregados:
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // Logica UI:
    // Filtros/Query:
    const [paramsQuery, setParamsQuery] = useState({
        finalized: false,
        page: 1
    }); //ex com pesquisa: 'name=${productInputSearch}&active=true'
    const [currentPage, setCurrentPage] = useState(1);
    
    // Lógica Modal:
    const [showModal, setShowModal] = useState(false);
    const [optionModal, setOptionModal] = useState(null);
    const [requestTarget, setRequestTarget] = useState(null);

    
    const tokenCookie = Cookies.get('tokenEstoque');



    useEffect(()=> {
        async function updateParamsQuery() {
            const newParams = {
                finalized: filterFinalized,
                page: currentPage
            };

            setParamsQuery(newParams);
        }
        updateParamsQuery();
    }, [filterFinalized, currentPage]);

    useEffect(()=> {
        async function getAllRequests() 
        {
            setLoading(true);
            
            try {
                setHasError(true);
                setSolicitacoes([]);
                setTotalResults(0);
                
                const response = await ORDER_GET_ALL_PER_PARAMS(JSON.parse(tokenCookie), paramsQuery);
                console.log(response);

                if(response.success) {
                    // setSolicitacoes([]);
                    setSolicitacoes(response.data.data);
                    setTotalResults(response.data.total);
                    setTotalPages(response.data.last_page);

                    setHasError(false);
                }
                else if(response.success == false) {
                    console.warn(response.message);
                    toast.warn(response.message);

                    if(response.message == "Nenhum produto encontrado com o nome informado.") {
                        setHasError(false);
                    } 
                    else {
                        toast.error(response.message);
                    }
                }
                else {
                    toast.error('Erro inesperado.');
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
        getAllRequests();
    }, [tokenCookie, paramsQuery, refreshState]);




    function handleOpenModal(itemTarget, optModal) {
        console.log(optModal)
        setRequestTarget(itemTarget);
        setOptionModal(optModal);

        setShowModal(true);
    }


    return (
        <div className="Painel PainelSolicitacoes">
            <div className="painel-top">
                <h2>Total ({totalResults}):</h2>

                <div className="search--btnAdd">
                    {(solicitacoes.length > 0) && (
                    <>
                    {/* <button className='btn filter' onClick={()=> handleOpenModal('filter')} title='Filtrar' disabled={loading || hasError}>
                        <i className="bi bi-sliders"></i>
                    </button> */}

                    {/* <button className="btn primary"  disabled={loading || hasError}>
                        <i className="bi bi-plus-lg"></i>
                        <span>Nova solicitação</span>
                    </button> */}
                    </>
                    )}
                </div>
            </div>

            <div className="painel-content">
                {loading ? (

                    <p className='feedback_content'>Carregando solicitações...</p>

                ) : (
                    hasError ? (

                    <div className='feedback_content'>
                        <p>
                            <i className="bi bi-exclamation-triangle"></i>
                            <span> Erro ao carregar solicitações.</span>
                        </p>
                        
                        <a className='btn primary' href='/solicitacoes'>
                            <i className="bi bi-arrow-clockwise"></i>
                            Recarregue a página
                        </a>
                    </div>

                    ) : (
                        
                    solicitacoes.length == 0 ? (
                        <div className='feedback_content'>
                            {/* {sectorFilter != filterDefault ? (
                            <p>
                                Nada encontrado!
                            </p>
                            ) : ( */}
                            <>
                            <p>Nenhuma solicitação foi encontrada</p>
                            
                            {/* <a className='btn primary' href='/solicitacoes'>
                                <i className="bi bi-arrow-clockwise"></i>
                                Recarregue a página
                            </a> */}
                            </>
                            {/* )} */}
                        </div>
                    ) : (
                        <>
                        <table>
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col" data-label="tipo">Tipo</th>
                                    <th scope="col">Criado em</th>
                                    <th scope="col">Finalizado em</th>
                                    <th scope="col" data-label="ações">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                            {solicitacoes.map((solicitacao)=> (
                                <tr key={solicitacao.id} className="item">
                                    <td data-label="id">
                                        {formatToIdCode(solicitacao.id, 4)}
                                    </td>

                                    <td data-label="tipo">
                                        {/* <div className="content_type"> */}
                                        <span className={`badge ${solicitacao.status_reservation == 'Em atraso' ? 'alert' : ''}`}>
                                            {solicitacao.order_type == "Saída" ? (
                                            <i className="bi bi-box-arrow-left"></i>
                                            ) : (
                                            <i className="bi bi-calendar-event"></i>
                                            )}

                                            <span> {solicitacao.order_type}</span>
                                        </span>
                                            {/* <div>5</div>
                                        </div> */}
                                    </td>

                                    <td data-label="criado em">
                                        {formatFullToHoursMinutes(solicitacao?.created_at)}
                                    </td>
                                    <td data-label="finalizado em">
                                        {formatFullToHoursMinutes(solicitacao?.finalized_at)}
                                    </td>

                                    <td data-label="status">
                                        <div className="btns_actions">
                                            <button className="btn view" title="Exibir detalhes" 
                                            onClick={()=> handleOpenModal(solicitacao, 'details')}
                                            disabled={loading || hasError}
                                            >
                                                <i className="bi bi-eye"></i>
                                            </button>

                                            <DropdownMenuSolicitacoes
                                            itemTarget={solicitacao}
                                            handleOpenModal={handleOpenModal}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>


                        <div className='legenda'>
                            <h5>Legenda:</h5>
                            <small>
                                <span className='alert'>!</span>
                                Empréstimo em atraso
                            </small>
                        </div>

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
                <ModalSolicitacoes
                close={()=> setShowModal(false)}
                setRefreshState={setRefreshState}
                optionModal={optionModal}
                requestTarget={requestTarget}
                />
            )}
        </div>
    )        
}