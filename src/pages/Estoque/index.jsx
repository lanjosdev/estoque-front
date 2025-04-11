// Hooks / Libs:
import Cookies from "js-cookie";
import { useEffect } from "react";

// Contexts:
// import UserContext from "../../contexts/userContext";

// Components:
import { NavMenu } from "../../components/NavMenu/NavMenu";
import { PainelStock } from "../../components/Painels/PainelStock/PainelStock";

// Assets:
// import imgLogo from '../../assets/LOGO-BIZSYS_preto.png';

// Estilo:
import './style.css';


export default function Estoque() {

    const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        function verificaCookieToken() {
            console.log('Effect /Estoque');
            
            if(!tokenCookie) {
                console.error('tokenCookie sem VALUE ou REMOVIDO');
            }
        } 
        verificaCookieToken();
    }, [tokenCookie]);
    

    
  
    return (
        <div className="Page Estoque">
            
            <NavMenu />

            <main className='main Estoque grid'>
                <div className="title--subtitle">
                    <h1 className="title">
                        <i className="bi bi-boxes"></i>
                        Estoque
                    </h1>

                    <p className="subtitle">
                        Abaixo estão as infromações gerais de cada produto em estoque. 
                    </p>
                </div>

                <PainelStock />
            </main>

        </div>
    );
}