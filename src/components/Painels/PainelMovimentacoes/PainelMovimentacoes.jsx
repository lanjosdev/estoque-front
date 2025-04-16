// Hooks / Libs:
import { useState, useEffect } from 'react';
import Cookies from "js-cookie";

// API:
import { MOVIMENTATION_GET_PER_PARAMS } from '../../../API/movimentationApi';

// Components:
import { toast } from 'react-toastify';
import { DropdownMenuInput } from '../../DropdownMenus/DropdownInput/DropdownMenuInput';
import { DropdownMenuExit } from '../../DropdownMenus/DropdownExit/DropdownMenuExit';
import { Pagination } from '../../Pagination/Pagination';

import { ModalTypeMovimentation } from '../../Modals/ModalTypeMovimentation/ModalTypeMovimentation';
import { ModalInput } from '../../Modals/ModalInput/ModalInput';
import { ModalExit } from '../../Modals/ModalExit/ModalExit';

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
    const [currentPage, setCurrentPage] = useState(1);


    // Logica Modals:
    const [showModalNewMovimentation, setShowModalNewMovimentation] = useState(false);
    const [showModalInput, setShowModalInput] = useState(false);
    const [optionModalInput, setOptionModalInput] = useState(null);
    const [showModalExit, setShowModalExit] = useState(false);
    const [optionModalExit, setOptionModalExit] = useState(null);

    
    const [movimentationSelect, setMovimentationSelect] = useState(null);

    
    const tokenCookie = Cookies.get('tokenEstoque');




    useEffect(()=> {
        async function getMoviments() 
        {
            setLoading(true);
            console.log('Effect Component PainelMovimentacoes');
            
            try {
                setHasError(true);
                const response = await MOVIMENTATION_GET_PER_PARAMS(JSON.parse(tokenCookie), '', currentPage);
                console.log(response);

                if(response.success) {
                    setTotalPages(response.data.last_page);
                    setMovimentations(response.data.data);
                    setHasError(false);
                }
                else if(response.success == false) {
                    console.error(response.message);
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
    }, [tokenCookie, reflashState, currentPage]);



    function handleOpenNewMovimentation() {
        setShowModalNewMovimentation(true);
    }

    function handleOpenModalInput(opt) {
        console.log(opt);
        setShowModalNewMovimentation(false);

        setOptionModalInput(opt);
        setShowModalInput(true);
    }
    function handleOpenModalExit(opt) {
        console.log(opt);
        setShowModalNewMovimentation(false);

        setOptionModalExit(opt);
        setShowModalExit(true);
    }


    return (
        <div className="Painel PainelMovimentacoes">
            <div className="painel-top">
                <h2>Registros</h2>

                <div className="search--btnAdd">
                    {/* <form className="search" onSubmit={handleSubmitSearch}>
                        <input
                        type="text"
                        placeholder="Pesquisa"
                        value={inputBUSCA}
                        onChange={handleChangeInputSearch}
                        />
                        
                        {tarefasBUSCA &&
                        <button type='button' onClick={clearSearch}>
                            <ion-icon name="close-outline"></ion-icon>
                        </button>}

                        <button type='submit' disabled={!inputBUSCA || loading}>
                            <ion-icon name="search"></ion-icon>
                        </button>
                    </form> */}

                    {movimentations.length > 0 && (
                    <button className="btn primary" onClick={handleOpenNewMovimentation} disabled={loading || hasError}>
                        <i className="bi bi-plus-lg"></i>
                        <span>Nova movimentação</span>
                    </button>
                    )}
                </div>
            </div>



            <div className="painel-content">
                {loading ? (

                    <p className='feedback_content'>Carregando registros...</p>

                ) : (
                    hasError ? (

                    <div className='feedback_content'>
                        <p>
                            <i className="bi bi-exclamation-triangle"></i>
                            <span> Erro ao carregar as movimentações!</span>
                        </p>
                        
                        <a className='btn primary' href='/movimentacoes'>
                            <i className="bi bi-arrow-clockwise"></i>
                            Recarregue a página
                        </a>
                    </div>

                    ) : (movimentations.length === 0 ? (
                        <div className='result-empty'>
                            <p>Nenhuma movimentação registrada!</p>
                            
                            <button className='btn primary' onClick={handleOpenNewMovimentation} disabled={hasError}>
                                <i className="bi bi-plus-lg"></i>
                                Registrar movimentação
                            </button>
                        </div>
                    ) : (
                        <>
                        <table className=''>
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Tipo</th>
                                    <th scope="col" data-label="space"></th>
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
                                    
                                    <td data-label="space">
                                        
                                    </td>
                                    
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