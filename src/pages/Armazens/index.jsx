// Funcionalidades / Libs:
import Cookies from "js-cookie";
import { useEffect } from "react";

// Contexts:
// import UserContext from "../../contexts/userContext";

// Components:
import { NavMenu } from "../../components/NavMenu/NavMenu";
import { PainelArmazens } from "../../components/Painels/PainelArmazens/PainelArmazens";
// import { toast } from "react-toastify";

// Assets:
// import imgLogo from '../../assets/LOGO-BIZSYS_preto.png';

// Estilo:
// import './style.css';


export default function Armazens() {

    const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        function verificaCookieToken() {
            console.log('Effect /Armazens');
            
            if(!tokenCookie) {
                console.error('tokenCookie sem VALUE ou REMOVIDO');
            }
        } 
        verificaCookieToken();
    }, [tokenCookie]);
    

    
  
    return (
        <div className="Page Armazens">
            
            <NavMenu />

            <main className='UsersContent ArmazensContent grid'>
                <div className="title--subtitle">
                    <h1 className="title-page">
                        <i className="bi bi-inboxes-fill"></i>
                        Cadastro de Armazéns
                    </h1>

                    <p>
                        Abaixo estão os armazéns cadastrados. Armazéns são locais/móveis onde os produtos serão armazenados em estoque.
                    </p>
                </div>

                <PainelArmazens />
            </main>

        </div>
    );
}