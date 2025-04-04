// Hooks / Libs:
import Cookies from "js-cookie";
import { useState, useEffect } from 'react';
// import { Navigate } from 'react-router-dom';

// API:
import { USER_GET_PER_PARAMS } from '../../../API/userApi';

// Components:
import { CreateUser } from '../../Modals/ModalUser/CreateUser/CreateUser';
import { DeleteUser } from '../../Modals/ModalUser/DeleteUser/DeleteUser';
import { UpdateUser } from '../../Modals/ModalUser/UpdateUser/UpdateUser';
import { FilterUser } from '../../Modals/ModalUser/FilterUser/FilterUser';
import { RestoreUser } from '../../Modals/ModalUser/RestoreUser/RestoreUser';
import { DropdownMenuUser } from '../../DropdownMenus/DropdownUser/DropdownMenuUser';
import { Pagination } from '../../Pagination/Pagination';
import { toast } from 'react-toastify';

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:


// Estilo:
import './painelusers.css';


export function PainelUsers() {
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(true);
    const [reflashState, setReflashState] = useState(false);
    const filterDefault = 'active=true';

    const [showModal, setShowModal] = useState(false);
    const [optionModal, setOptionModal] = useState(null);
    const [optionUpdate, setOptionUpdate] = useState(null);

    const [users, setUsers] = useState([]);
    const [userFilter, setUserFilter] = useState(filterDefault);
    const [currentPage, setCurrentPage] = useState(1);
    const [pages, setPages] = useState([]);
    const [userSelect, setUserSelect] = useState(null);
    
    const tokenCookie = Cookies.get('tokenEstoque');



    useEffect(()=> {
        async function getAllUsers() 
        {
            setLoading(true);
            
            try {
                setHasError(true);
                setUsers([]);
                // setTotalResults(0);

                const response = await USER_GET_PER_PARAMS(JSON.parse(tokenCookie), userFilter, currentPage);
                console.log(response);

                if(response.success) {
                    let arrayPages = [];
                    for(let i = 1; i <= response.data.last_page; i++) {
                        arrayPages.push(i);
                    }
                    // console.log(arrayPages);
                    setPages(arrayPages);
                    setUsers(response.data.data);
                    setHasError(false);
                    // setTotalResults(response.data.total);
                }
                else if(response.success == false) {
                    if(response.message == 'Nenhum resultado encontrado.') {
                        setHasError(false);
                    }
                    else {
                        toast.error(response.message);
                    }
                }
                else {
                    toast.error('Erro inesperado.');
                    // setProductSearchState(null);
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
        getAllUsers();
    }, [tokenCookie, reflashState, userFilter, currentPage]);



    // Função que retorna JSX baseado no switch
    const renderModal = ()=> {
        switch(optionModal) {
            case 'filter':
                return <FilterUser close={()=> setShowModal(false)} userFilter={userFilter} setUserFilter={setUserFilter} />;
            case 'create':
                return <CreateUser close={()=> setShowModal(false)} setReflashState={setReflashState} />;
            case 'delete':
                return <DeleteUser close={()=> setShowModal(false)} setReflashState={setReflashState} userSelect={userSelect} />;
            case 'update':
                return <UpdateUser close={()=> setShowModal(false)} setReflashState={setReflashState} userSelect={userSelect} optionUpdate={optionUpdate} />;
            case 'restore':
                return <RestoreUser close={()=> setShowModal(false)} setReflashState={setReflashState} userSelect={userSelect} />;
            default:
                return <div>Status desconhecido</div>;
        }
    };

    function handleOpenModalCreate() {
        setOptionModal('create');
        setShowModal(true);
    }

    function handleOpenModalFilter() {
        setOptionModal('filter');
        setShowModal(true);
    }


    return (
        <div className="Painel PainelUsers">
            <div className="painel-top">
                <h2>Usuários ({users.length}):</h2>

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

                    {(users.length > 0 || userFilter != filterDefault) && (
                    <>
                    <button className='btn filter' onClick={handleOpenModalFilter} title='Filtrar' disabled={loading || hasError}>
                        <i className="bi bi-sliders"></i>
                    </button>
                    
                    <button className="btn primary" onClick={handleOpenModalCreate} disabled={loading || hasError}>
                        <i className="bi bi-plus-lg"></i>
                        <span>Novo usuário</span>
                    </button>
                    </>
                    )}
                </div>
            </div>

            {((userFilter != filterDefault) && !loading) && (
            <div className='feedback-search'>
                <strong>{`Resultado(s) do filtro`}</strong>

                <button className='btn-filter clear' onClick={()=> setUserFilter(filterDefault)}>
                    <i className="bi bi-x-circle"></i>
                    <span> Limpar filtro</span>
                </button>
            </div>
            )}

            <div className="painel-content">
                {loading ? (

                    <p className='feedback_content'>
                        Carregando usuários...
                    </p>

                ) : (
                    hasError ? (

                    // <p>Erro ao carregar usuários!</p>
                    <div className='feedback_content'>
                        <p>
                            <i className="bi bi-exclamation-triangle"></i>
                            <span> Erro ao carregar usuários!</span>
                        </p>
                        
                        <a className='btn primary' href='/users'>
                            <i className="bi bi-arrow-clockwise"></i>
                            Recarregue a página
                        </a>
                    </div>

                    ) : (users.length === 0 ? (
                        <div className='result-empty'>
                            {userFilter != filterDefault ? (
                            <p>
                                Nada encontrado!
                            </p>
                            ) : (
                            <>
                            <p>Nenhum usuário foi cadastrado!</p>
                            <button className='btn primary' onClick={handleOpenModalCreate} disabled={hasError}>
                                <i className="bi bi-plus-lg"></i>
                                Criar um usuário
                            </button>
                            </>
                            )}
                        </div>
                    ) : (
                        <>
                        <table className=''>
                            <thead>
                                <tr>
                                    <th scope="col">Nome</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Nível</th>
                                    <th scope="col" data-label="ações">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                            {users.map((user)=> (
                                <tr key={user.id} className="item-user" title={user.id}>
                                    <td data-label="nome">
                                        <span className="name_profile">{user.name}</span>
                                    </td>

                                    <td data-label="email">{user.email}</td>

                                    <td data-label="nível">
                                        {user.level_name == 'user' ? (
                                            <span><i className="bi bi-person-circle"></i> comum</span>
                                        ) : (user.level_name == 'admin' ? (
                                            <span><i className="bi bi-shield-fill-check"></i> admin</span>
                                        ) : (
                                            <span><i className="bi bi-shield-shaded"></i> gerente</span>
                                        )
                                        )}
                                    </td>

                                    <td data-label="ações">
                                        <DropdownMenuUser
                                        dataUser={user}
                                        setUserSelect={setUserSelect}
                                        setOptionModal={setOptionModal}
                                        setOptionUpdate={setOptionUpdate}
                                        setShowModal={setShowModal}
                                        />
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
                    ))
                )}
            </div>


            {showModal && (
                renderModal()
            )}
        </div>
    )        
}