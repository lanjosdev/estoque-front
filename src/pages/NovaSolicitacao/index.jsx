// Hooks / Libs:
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

// Contexts:
// import UserContext from "../../contexts/userContext";

// Components:
import { NavMenu } from "../../components/NavMenu/NavMenu";
import { PainelSolicitacoes } from "../../components/Painels/PainelSolicitacoes/PainelSolicitacoes";

// Assets:
// import imgLogo from '../../assets/LOGO-BIZSYS_preto.png';

// Estilo:
import './style.css';


export default function NovaSolicitacao() {
    const [typeRequest, setTypeRequest] = useState('Saída');

    const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        function verificaCookieToken() {
            console.log('Effect /NovaSolicitacao');
            
            if(!tokenCookie) {
                console.error('tokenCookie sem VALUE ou REMOVIDO');
            }
        } 
        verificaCookieToken();
    }, [tokenCookie]);
    

    
  
    return (
        <div className="Page NovaSolicitacao">
            
            <NavMenu />

            <main className='main NovaSolicitacao grid'>
                <div className="title--subtitle">
                    <h1 className="title">
                        {typeRequest == 'Saída' ? (
                        <i className="bi bi-box-arrow-left"></i>
                        ) : (
                        <i className="bi bi-calendar-event"></i>
                        )}
                        
                        Solicitação de {typeRequest}
                    </h1>

                    <p className="subtitle">
                        Abaixo você pode selecione os produtos que deseja adicionar na sua solicitação.
                    </p>
                </div>

                <div>###TABS + BTN-CARRINHO###</div>

                <div className="Painel">CATALAGO</div>
                {/* <PainelSolicitacoes /> */}
            </main>

        </div>
    );
}