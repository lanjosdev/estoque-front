// Funcionalidades / Libs:
import { useEffect } from "react";
import Cookies from "js-cookie";

// Contexts:
// import UserContext from "../../contexts/userContext";

// Components:
// import { NavBar } from "../../components/NavBar/NavBar";
import { NavMenu } from "../../components/NavMenu/NavMenu";
import { PainelUsers } from "../../components/Painels/PainelUsers/PainelUsers";

// Assets:
// import imgLogo from '../../assets/LOGO-BIZSYS_preto.png';

// Estilo:
import './style.css';


export default function Users() {
    

    const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        function initializePage() {
            console.log('Effect /Usuarios');
            
            if(!tokenCookie) {
                console.error('tokenCookie sem VALUE ou REMOVIDO');
            }
        } 
        initializePage();
    }, [tokenCookie]);
    

    
  
    return (
        <div className="Page Users">
            
            <NavMenu />

            <main className='UsersContent grid'>
                <div className="title--subtitle">
                    <h1 className="title-page">
                        <i className="bi bi-people-fill"></i>
                        Cadastro de Usuários
                    </h1>

                    <p>
                        Abaixo estão os usuários cadastrados. Você pode cadastrar, editar e deletar usuários.
                    </p>
                </div>

                <PainelUsers />
                
            </main>

        </div>
    );
}