// Hooks / Libs:
import Cookies from "js-cookie";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

// API:


// Components:
// import { ModalSector } from '../../Modals/ModalSector/ModalSector';

// Utils:
import { formatToIdCode } from '../../../utils/formatStrings';

// Assets:

// Estilo:
import './painelsolicitacoes.css';


export function PainelSolicitacoes() {
    // Estados do componente:
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Dados a ser pré-carregados:
    const [solicitacoes, setSolicitacoes] = useState([]);
    

    // Lógica da UI:
    const [showModal, setShowModal] = useState(false);

    
    const tokenCookie = Cookies.get('tokenEstoque');
    const navigate = useNavigate();




    useEffect(()=> {
        async function getAllRequests() 
        {
            setLoading(true);
            const requestsMock = {
                success: true,
                data: [
                    {
                        id: 0,
                        type_name: 'Saída',
                        status_reservation: null,
                        status: 'Recebido',
                    },
                    {
                        id: 1,
                        type_name: 'Empréstimo',
                        status_reservation: 'Em andamento',
                        status: 'Entregue',
                    },
                    {
                        id: 2,
                        type_name: 'Empréstimo',
                        status_reservation: 'Em atraso',
                        status: 'Entregue',
                    },
                    {
                        id: 3,
                        type_name: 'Empréstimo',
                        status_reservation: 'Finalizado',
                        status: 'Devolvido',
                    },
                    {
                        id: 4,
                        type_name: 'Saída',
                        status_reservation: null,
                        status: 'Entregue',
                    }
                ]
            };
            
            try {
                setError(true);
                setSolicitacoes([]);

                const response = requestsMock;
                console.log(response);

                if(response.success) {
                    setSolicitacoes(response.data);
                    setError(false);
                }
                else if(response.success == false) {
                    if(response.message == 'Nenhum resultado encontrado.') {
                        setError(false);
                    }
                    else {
                        console.error(response.message);
                    }
                }
                else {
                    console.error('Erro inesperado.');
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
    }, [tokenCookie]);





    // function handleOpenModal(opt) {
    //     console.log(opt);
    //     setShowModal(true);
    // }

    function handleClickNewRequest() {
        navigate('/nova-solicitacao');
    }

    


    return (
        <div className="Painel PainelSolicitacoes">
            <div className="painel-top">
                <h2>Solicitações ({solicitacoes.length}):</h2>

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
                            <span> Erro ao carregar solicitações!</span>
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
                            <p>Você ainda não efetuou nenhuma solicitação!</p>
                            
                            <button className='btn primary' onClick={handleClickNewRequest} disabled={error}>
                                <i className="bi bi-plus-lg"></i>
                                Faça sua solicitação
                            </button>
                            </>
                            {/* )} */}
                        </div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Tipo</th>
                                    <th scope="col" data-label="status">Status</th>
                                    <th scope="col">Ações</th>
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
                                                {solicitacao.type_name}
                                            </span>
                                            {/* <div>5</div>
                                        </div> */}
                                    </td>
                                    <td data-label="status">
                                        <div>{solicitacao.status} (Linha do tempo...)</div>
                                    </td>
                                    <td data-label="ações">
                                        <button>
                                            <i className="bi bi-eye"></i>
                                            Ver detalhes
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )

                    )
                )}

                <div className='legenda'>
                    <h5>Legenda:</h5>
                    <small>
                        <span className='alert'>!</span> 
                        Empréstimo em atraso
                    </small>
                </div>
            </div>



            {showModal && (
                <h1>FUNÇÃO RENDER MODAL</h1>
            )}
        </div>
    )        
}