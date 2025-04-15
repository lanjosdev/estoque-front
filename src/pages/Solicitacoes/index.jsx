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


export default function Solicitacoes() {
    // Logica UI:
    const [filterFinalized, setFilterFinalized] = useState(false);

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
                        <i className="bi bi-receipt"></i>
                        Solicitações
                    </h1>

                    <p className="subtitle">
                        Acompanhe e visualize todas as solicitações, ativas e finalizadas
                    </p>
                </div>

                <div className="container tabs">
                    <div className="tabs">
                        <button 
                        className={`tab ${!filterFinalized ? 'active' : ''}`}
                        onClick={()=> setFilterFinalized(false)}
                        // disabled={loadingSubmit}
                        >
                            Ativas
                        </button>

                        <button 
                        className={`tab ${filterFinalized ? 'active' : ''}`}
                        onClick={()=> setFilterFinalized(true)}
                        // disabled={loadingSubmit}
                        >
                            Finalizadas
                        </button>
                    </div>
                </div>

                <PainelSolicitacoes filterFinalized={filterFinalized} />
            </main>

        </div>
    );
}