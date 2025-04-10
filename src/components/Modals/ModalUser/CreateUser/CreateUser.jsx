// Hooks / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect, useRef } from 'react';

// API:
import { USER_CREATE } from "../../../../API/userApi";

// Components:
import { InputPassword } from "../../../InputPassword/InputPassword";
import { toast } from "react-toastify";
// import { UserCreate } from './UserCreate/UserCreate';

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
import './createuser.css';


CreateUser.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func
}
export function CreateUser({ close, setReflashState }) {
    const [loading, setLoading] = useState(false);

    const nameRef = useRef('');
    const emailRef = useRef('');
    const passwordRef = useRef('');

    const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        // function initialComponent() {
            console.log('Effect Modal CreateUser');

            const handleKeyDown = (event)=> {
                if(event.key === 'Escape') {
                  close();
                }
            };
          
            document.addEventListener('keydown', handleKeyDown);
          
            // Remove o event listener ao desmontar o componente ou fechar o modal
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        // }
        // initialComponent();
    }, [close]);


    // CREATE:
    async function handleSubmitCreteUser(e) {
        e.preventDefault();
        setLoading(true);

        const name = nameRef.current?.value;
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;

        // Validação:
        const validadeName = name.replace(/\s/g, '').length > 0;
        const validadePassword = password.length >= 8;

        if(!validadeName) {
            setLoading(false);
            toast.warn('Preencha o campo de nome corretamente.');
            return;
        }
        if(!validadePassword) {
            setLoading(false);
            toast.warn('O campo de senha precisa ter no mínino 8 caracteres.');
            return;
        }

        // Submit API:
        try {
            const response = await USER_CREATE(JSON.parse(tokenCookie), email, password, name);
            console.log(response);  

            if(response.success) {
                close();
                setReflashState(prev => !prev);
                toast.success('Usuário criado!');
            }
            else if(response.success == false) {
                if(response.message == 'Error: validation.min.string') {
                    toast.error('A senha precisa ter no mínino 8 caracteres.');
                }
                else {
                    console.error(response.message);
                    toast.error(response.message);
                }
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
                toast.error('Houve algum erro.');
            }

            console.error('DETALHES DO ERRO: ', error);
        }

        setLoading(false);
    }


    return (
        <div className="Modal CreateUser">
            <div className='bg-modal' onClick={close}></div>

            <div className='WindowCreateUser grid'>
                    <h3>Cadastrar novo usuário</h3>

                    <form className="content-window" onSubmit={handleSubmitCreteUser} autoComplete="off">
                        <div className="label--input">
                            <label htmlFor="nome">Nome</label>
                            <input ref={nameRef} className="input" id='nome' type="text" required />
                        </div>

                        <div className="label--input">
                            <label htmlFor="email">E-mail</label>
                            <input ref={emailRef} className="input" id='email' type="email" required />
                        </div>

                        <div className="label--input">
                            <label htmlFor="senha">Senha</label>
                            <InputPassword passwordRef={passwordRef} />
                        </div>


                        <div className="btns">
                            <button className="btn primary" disabled={loading}>
                                {loading ? <span className="loader"></span> : 'Criar usuário'}
                            </button>

                            <button className="btn cancel" type="button" onClick={close} disabled={loading}>
                                Cancelar
                            </button>
                        </div>
                    </form>
            </div>
        </div>
    )        
}