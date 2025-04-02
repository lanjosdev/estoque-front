// Hooks / Libs:
import Cookies from "js-cookie";
import { useEffect } from "react";

// Contexts:
// import UserContext from "../../contexts/userContext";

// Components:
import { NavMenu } from "../../components/NavMenu/NavMenu";
import { PainelMovimentacoes } from "../../components/Painels/PainelMovimentacoes/PainelMovimentacoes";
// import { PainelInputs } from "../../components/Painels/PainelInputs/PainelInputs";
// import { toast } from "react-toastify";

// Assets:
// import imgLogo from '../../assets/LOGO-BIZSYS_preto.png';

// Estilo:
// import './style.css';


export default function Movimentacoes() {

    const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        function verificaCookieToken() {
            console.log('Effect /Movimentacoes');
            
            if(!tokenCookie) {
                console.error('tokenCookie sem VALUE ou REMOVIDO');
            }
        } 
        verificaCookieToken();
    }, [tokenCookie]);
    

    
  
    return (
        <div className="Page Movimentacoes">
            
            <NavMenu />

            <main className='PageContentMain UsersConten Movimentacoes grid'>
                <div className="title--subtitle">
                    <h1 className="title-page">
                        <i className="bi bi-arrow-down-up"></i>
                        Movimentações
                    </h1>

                    <p>
                        Abaixo você visualiza as entradas e saídas do estoque. Também é possível registrar entradas e saída/descarte.
                    </p>
                </div>

                <PainelMovimentacoes />
                
            </main>

        </div>
    );
}