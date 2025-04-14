// Hooks / Libs:
import Cookies from "js-cookie";
import { useEffect } from "react";

// Contexts:
// import UserContext from "../../contexts/userContext";

// Components:
import { NavMenu } from "../../components/NavMenu/NavMenu";
import { PainelMinhasSolicitacoes } from "../../components/Painels/PainelMinhasSolicitacoes/PainelMinhasSolicitacoes";

// Assets:
// import imgLogo from '../../assets/LOGO-BIZSYS_preto.png';

// Estilo:
import './style.css';


export default function MinhasSolicitacoes() {

    const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        function verificaCookieToken() {
            console.log('Effect /Minhas-Solicitacoes');
            
            if(!tokenCookie) {
                console.error('tokenCookie sem VALUE ou REMOVIDO');
            }
        } 
        verificaCookieToken();
    }, [tokenCookie]);
    

    
  
    return (
        <div className="Page MinhasSolicitacoes">
            
            <NavMenu />

            <main className='main MinhasSolicitacoes grid'>
                <div className="title--subtitle">
                    <h1 className="title">
                        <i className="bi bi-receipt"></i>
                        Minhas Solicitações
                    </h1>

                    <p className="subtitle">
                        Acompanhe o status das suas solicitações.
                    </p>
                </div>

                <PainelMinhasSolicitacoes />
            </main>

        </div>
    );
}