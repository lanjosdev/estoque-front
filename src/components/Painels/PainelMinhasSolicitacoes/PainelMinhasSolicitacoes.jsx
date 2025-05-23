// Hooks / Libs:
import Cookies from "js-cookie";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

// API:
import { ORDER_GET_ME_PER_PARAMS } from "../../../API/orderApi";

// Components:
import { toast } from "react-toastify";
import { Pagination } from "../../Pagination/Pagination";
import { ModalSolicitacoes } from "../../Modals/ModalSolicitacoes/ModalSolicitacoes";
import { StatusProgress } from "../../StatusProgress/StatusProgress";

// Utils:
import { formatToIdCode } from '../../../utils/formatStrings';
import { formatFullToHoursMinutes } from "../../../utils/formatDate";

// Assets:

// Estilo:
import './painelminhassolicitacoes.css';


export function PainelMinhasSolicitacoes() {
    const navigate = useNavigate();
    // Estados do componente:
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Dados a ser pré-carregados:
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const paramsDefault = '';
    const [paramsQuery, setParamsQuery] = useState(paramsDefault); //ex com pesquisa: 'name=${productInputSearch}&active=true'
    const [totalResults, setTotalResults] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    

    // Lógica da UI:
    // Lógica Modal:
    const [showModal, setShowModal] = useState(false);
    const [optionModal, setOptionModal] = useState(null);
    const [requestTarget, setRequestTarget] = useState(null);

    
    const tokenCookie = Cookies.get('tokenEstoque');




    useEffect(()=> {
        async function getAllRequests() 
        {
            setLoading(true);
            
            try {
                setError(true);
                setSolicitacoes([]);
                setTotalResults(0);
                
                // const response = await PRODUCT_GET_PER_PARAMS(JSON.parse(tokenCookie), productFilterState, currentPage);
                const response = await ORDER_GET_ME_PER_PARAMS(JSON.parse(tokenCookie), paramsQuery, currentPage);
                console.log(response);

                if(response.success) {
                    
                    setSolicitacoes(response.data.data);
                    setTotalPages(response.data.last_page);
                    setTotalResults(response.data.total);
                    setError(false);
                }
                else if(response.success == false) {
                    console.warn(response.message);
                    toast.error(response.message);

                    if(response.message == "Nenhum produto encontrado com o nome informado.") {
                        setError(false);
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
    }, [tokenCookie, currentPage, paramsQuery]);





    // function handleOpenModal(opt) {
    //     console.log(opt);
    //     setShowModal(true);
    // }
    function handleOpenModal(itemTarget, optModal) {
        console.log(optModal)
        setRequestTarget(itemTarget);
        setOptionModal(optModal);

        setShowModal(true);
    }

    function handleClickNewRequest() {
        navigate('/nova-solicitacao');
    }

    


    return (
        <div className="Painel PainelMinhasSolicitacoes">
            <div className="painel-top">
                <h2>Total: {totalResults}</h2>

                <div className="search--btnAdd">
                    {(solicitacoes.length > 0) && (
                    <>
                    {/* <button className='btn filter' onClick={()=> handleOpenModal('filter')} title='Filtrar' disabled={loading || hasError}>
                        <i className="bi bi-sliders"></i>
                    </button> */}

                    <button className="btn primary" onClick={handleClickNewRequest} disabled={loading || error}>
                        <i className="bi bi-plus-lg"></i>
                        <span>Nova solicitação</span>
                    </button>
                    </>
                    )}
                </div>
            </div>

            <div className="painel-content">
                {loading ? (

                    <p className='feedback_content'>Carregando solicitações...</p>

                ) : (
                    error ? (

                    <div className='feedback_content'>
                        <p>
                            <i className="bi bi-exclamation-triangle"></i>
                            <span> Erro ao carregar solicitações.</span>
                        </p>
                        
                        <a className='btn primary' href='/minhas-solicitacoes'>
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
                            <p>Você ainda não efetuou nenhuma solicitação.</p>
                            
                            <button className='btn primary' onClick={handleClickNewRequest} disabled={error}>
                                <i className="bi bi-plus-lg"></i>
                                Faça sua solicitação
                            </button>
                            </>
                            {/* )} */}
                        </div>
                    ) : (
                        <>
                        <table>
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Tipo</th>
                                    <th scope="col" data-label="status">Status</th>
                                    <th scope="col" data-label="criado em">Criado em</th>
                                    <th scope="col" data-label="ações">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                            {solicitacoes.map((solicitacao)=> (
                                <tr key={solicitacao.id} className="item">
                                    <td data-label="id">
                                        {formatToIdCode(solicitacao.id)}
                                    </td>

                                    <td data-label="tipo">
                                        {/* <div className="content_type"> */}
                                            <span className={`badge ${solicitacao.status_reservation == 'Em atraso' ? 'alert' : ''}`}>
                                                {solicitacao.order_type == "Saída" ? (
                                                <i className="bi bi-box-arrow-left"></i>
                                                ): (
                                                <i className="bi bi-calendar-event"></i>
                                                )}
                                                <span> {solicitacao.order_type}</span>
                                            </span>
                                            {/* <div>5</div>
                                        </div> */}
                                    </td>

                                    <td data-label="status">
                                        {(solicitacao.status == 'Cancelado' || solicitacao.status_id == 6) ? (
                                            <span className="status danger">{solicitacao.status}</span>
                                        ) : (
                                            <span className={`status ${((solicitacao.order_type == "Saída" && solicitacao.status == 'Entregue') || (solicitacao.order_type == "Empréstimo" && solicitacao.status == 'Devolvido')) ? 'success' : ''} ${(solicitacao.order_type == "Empréstimo" && solicitacao.status == 'Entregue') ? 'progress' : ''}`}
                                            >
                                                {solicitacao.status}
                                            </span>
                                        )}
                                        
                                        <StatusProgress typeRequest={solicitacao.order_type} idStatus={solicitacao.status_id} />
                                    </td>

                                    <td data-label="criado em">
                                        {formatFullToHoursMinutes(solicitacao?.created_at)}
                                    </td>

                                    <td data-label="ações">
                                        <button className="btn view" onClick={()=> handleOpenModal(solicitacao, 'details')}>
                                            <i className="bi bi-eye"></i>
                                            <span>Ver detalhes</span>
                                        </button>

                                        <div>
                                            <button className="btn view" onClick={()=> handleOpenModal(solicitacao, 'details')}>
                                                <i className="bi bi-eye"></i>
                                                <span>Ver detalhes</span>
                                            </button>
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
                        setHasError={setError}
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
                // setRefreshState={setRefreshState}
                optionModal={optionModal}
                requestTarget={requestTarget}
                />
            )}
        </div>
    )        
}