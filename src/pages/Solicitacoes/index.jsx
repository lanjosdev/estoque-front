// Hooks / Libs:
import Cookies from "js-cookie";
import { useEffect } from "react";

// Contexts:
// import UserContext from "../../contexts/userContext";

// Components:
import { NavMenu } from "../../components/NavMenu/NavMenu";
import { PainelSolicitacoes } from "../../components/Painels/PainelSolicitacoes/PainelSolicitacoes";
// import { PainelMinhasSolicitacoes } from "../../components/Painels/PainelMinhasSolicitacoes/PainelMinhasSolicitacoes";

// Assets:
// import imgLogo from '../../assets/LOGO-BIZSYS_preto.png';

// Estilo:
import './style.css';


export default function Solicitacoes() {

    const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        function verificaCookieToken() {
            console.log('Effect /Solicitacoes');
            
            if(!tokenCookie) {
                console.error('tokenCookie sem VALUE ou REMOVIDO');
            }
        } 
        verificaCookieToken();
    }, [tokenCookie]);
    

    
  
    return (
        <div className="Page Solicitacoes">
            
            <NavMenu />

            <main className='main Solicitacoes grid'>
                <div className="title--subtitle">
                    <h1 className="title">
                        <i className="bi bi-list-ul"></i>
                        Solicitações
                    </h1>

                    <p className="subtitle">
                        Abaixo estão todas as solicitações do ambiente a serem atendidas. 
                    </p>
                </div>

                <PainelSolicitacoes />
            </main>

        </div>
    );
}