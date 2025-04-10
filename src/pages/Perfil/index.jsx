// Hooks / Libs:
import Cookies from "js-cookie";
import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

// API:
import { PROFILE_UPDATE_PASSWORD } from "../../API/profileApi";

// Contexts:
import UserContext from "../../contexts/userContext";

// Components:
import { toast } from "react-toastify";
import { NavMenu } from "../../components/NavMenu/NavMenu";


// Utils:

// Assets:
// import { BiSolidSpreadsheet, BiBlock } from 'react-icons/bi';

// Estilo:
import './style.css';


export default function Profile() {    
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const {
        profileDetails,
        // setReflashStateContext
    } = useContext(UserContext);

    
    // Dados para submiter:
    const [senha, setSenha] = useState('');
    const [senhaConfirm, setSenhaConfirm] = useState('');

    const tokenCookie = Cookies.get('tokenEstoque') || null;


    useEffect(()=> {
        async function initializePage() {
            console.log('Effect /Profile');
            
            
        }
        initializePage()
    }, []);



    async function handleSubmitResetSenha(e) 
    {
        e.preventDefault();
        setLoading(true);
        

        if(senha !== senhaConfirm) {
            toast.error('Confirme a nova senha corretamente.');
        }
        else {
            try {
                const response = await PROFILE_UPDATE_PASSWORD(JSON.parse(tokenCookie), senha, senhaConfirm);
                console.log(response);  
    
                if(response.success) {
                    // setReflashStateContext(prev => !prev);
                    toast.success('Senha alterada!');
                    // setSenha('');
                    // setSenhaConfirm('');
                }
                else if(response.success == false) {
                    toast.error(response.message);
                }
                else {
                    toast.error('Erro inesperado.');
                }
            }
            catch(error) {
                console.error('Deu erro: ', error);

                if(error?.response?.data?.message == 'Unauthenticated.') {
                    toast.error('Requisição não autenticada.');
                }
                else {
                    toast.error('Houve algum erro.');
                }
            }
        }

        setLoading(false);
    }


    return (
        <div className="Page Profile">

            <NavMenu />

            <main className='main ProfileContent grid'>
                
                <div className="atalhos-topo">                
                    <Link className='link-back' onClick={()=> navigate(-1)}>
                        <i className="bi bi-chevron-left"></i>
                        Voltar
                    </Link>
                </div>
                
                <div className="container">
                    <div className='title'>
                        <h1>Configurações do Usuário</h1>
                    </div>

                    <div className="form profile">
                        <h3>Dados do usuário</h3>
                        <div className="container-inputs">
                            <div className="label--input">
                                <label htmlFor="nome-user">Nome</label>
                                <input type="text" id="nome-user" value={profileDetails.name} disabled />
                            </div>

                            <div className="label--input">
                                <label>Nível de acesso</label>
                                <input type="text" value={profileDetails.level_name == 'admin' ? 'Administrador' : profileDetails.level_name == 'manager' ? 'Gerente' : 'Usuário comum'} disabled />
                            </div>

                            <div className="label--input">
                                <label htmlFor="nome-projeto">Email</label>
                                <input type="email" id="nome-projeto" value={profileDetails.email} disabled />
                            </div>

                            {/* {profileDetails.level_name !== 'admin' && (
                            <div className="label--input">
                                <label htmlFor="nome-projeto">Seus setores</label>
                                
                                <div className="sectors">
                                    {profileDetails.categories.map((item, idx)=> (
                                    <span key={idx}>{item}</span>
                                    ))}
                                    {profileDetails.categories.map((item, idx)=> (
                                    <span key={idx}>{item}</span>
                                    ))}
                                </div>
                            </div>
                            )} */}
                        </div>
                        {/* <div className="btns">
                            <button className="btn-add" disabled={loadingInterative || (!inputNome || !inputEmail) || (inputNome == userDetails.name && inputEmail == userDetails.email)}>
                                {loadingInterative ? 'Salvando...' : 'Salvar'}
                            </button>
                        </div> */}

                        <div className="btns hidden">
                            <button className="btn primary" disabled={true}>
                                {loading ? 'Salvando...' : 'Trocar'}
                            </button>
                        </div>
                    </div>
                    
                    <form className="form password" onSubmit={handleSubmitResetSenha}>
                        <h3>Trocar Senha</h3>
                        <div className="container-inputs">
                            <div className="label--input">
                                <label htmlFor="newSenha">Nova senha</label>
                                <input
                                    id='newSenha'
                                    // className={showError ? 'input-erro' : ''}
                                    type='password'
                                    placeholder='Senha'
                                    value={senha}
                                    onChange={(e)=> setSenha(e.target.value)}
                                    minLength={8}
                                    required
                                />
                            </div>

                            <div className="label--input">
                                <label htmlFor="newSenhaConfirm">Confirmar senha</label>
                                <input
                                    id='newSenhaConfirm'
                                    // className={showError ? 'input-erro' : ''}
                                    type='password'
                                    placeholder='Repita senha'
                                    value={senhaConfirm}
                                    onChange={(e)=> setSenhaConfirm(e.target.value)}
                                    minLength={8}
                                    required
                                />
                            </div>
                        </div>
                    
                        <div className="btns">
                            <button className="btn primary" disabled={loading || !senha || !senhaConfirm}>
                                {loading ? 'Salvando...' : 'Trocar'}
                            </button>
                        </div>
                    </form>
                </div>
 
            </main>

        </div>
    )
}