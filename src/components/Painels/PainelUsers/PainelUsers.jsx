// Funcionalidades / Libs:
import { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import { USER_GET_ALL } from '../../../API/userApi';
// import { Navigate } from 'react-router-dom';

// Components:
// import { CreateUser } from '../../Modals/ModalUser/CreateUser/CreateUser';
// import { DeleteUser } from '../../Modals/ModalUser/DeleteUser/DeleteUser';
// import { UpdateUser } from '../../Modals/ModalUser/UpdateUser/UpdateUser';
// import { FilterUser } from '../../Modals/ModalUser/FilterUser/FilterUser';
// import { RestoreUser } from '../../Modals/ModalUser/RestoreUser/RestoreUser';
// import { DropdownMenuUser } from '../../DropdownMenus/DropdownUser/DropdownMenuUser';
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
    const [userSelect, setUserSelect] = useState(null);
    const [userFilter, setUserFilter] = useState(filterDefault);
    
    const tokenCookie = Cookies.get('tokenEstoque');



    useEffect(()=> {
        async function getAllUsers() 
        {
            console.log('Effect Component PainelUsers');
            
            try {
                setLoading(true);
                setHasError(true);
                setUsers([]);

                const response = await USER_GET_ALL(JSON.parse(tokenCookie), userFilter);
                console.log(response);

                if(response.success) {
                    setUsers(response.data);
                    setHasError(false);
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
                }
            }
            catch(error) {
                console.error('DEU ERRO:', error);

                if(error?.response?.data?.message == 'Unauthenticated.') {
                    console.error('Requisição não autenticada.');
                }
                else {
                    toast.error('Houve algum erro.');
                }
            }
            finally {
                setLoading(false);
            }
        }
        getAllUsers();
    }, [tokenCookie, reflashState, userFilter]);



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

                    <p>Buscando usuários...</p>

                ) : (
                    hasError ? (

                    <p>Erro ao carregar usuários!</p>

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
                        <table className=''>
                            <thead>
                                <tr>
                                    <th scope="col">Nome</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Reservas</th>
                                    <th scope="col">Nível</th>
                                    <th scope="col">Ações</th>
                                </tr>
                            </thead>

                            <tbody>
                            {users.map((user)=> (
                                <tr key={user.id} className="item-user" title={user.id}>
                                    <td data-label="nome">{user.name}</td>
                                    <td data-label="email">{user.email}</td>
                                    <td data-label="reservas">
                                        {user.level == 'admin' ? 'Acesso total' : (user.reservation_enabled ? 'Autorizado' : 'Bloqueado')}
                                    </td>
                                    <td data-label="nível">
                                        {user.level == 'user' ? (
                                            <span><i className="bi bi-person-circle"></i> comum</span>
                                        ) : (user.level == 'admin' ? (
                                            <span><i className="bi bi-shield-fill-check"></i> admin</span>
                                        ) : (
                                            <span><i className="bi bi-shield-shaded"></i> gerente</span>
                                        )
                                        )}
                                    </td>
                                    <td data-label="ações">
                                        {/* <DropdownMenuUser 
                                        dataUser={user} 
                                        setUserSelect={setUserSelect} 
                                        setOptionModal={setOptionModal}
                                        setOptionUpdate={setOptionUpdate}
                                        setShowModal={setShowModal}
                                        /> */}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ))
                )}
            </div>


            {showModal && (
                renderModal()
            )}
        </div>
    )        
}