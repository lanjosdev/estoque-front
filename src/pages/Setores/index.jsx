// Funcionalidades / Libs:
import { useEffect } from "react";
import Cookies from "js-cookie";

// Contexts:
// import UserContext from "../../contexts/userContext";

// Components:
import { NavMenu } from "../../components/NavMenu/NavMenu";
import { PainelSectors } from "../../components/Painels/PainelSectors/PainelSectors";
// import { toast } from "react-toastify";

// Assets:
// import imgLogo from '../../assets/LOGO-BIZSYS_preto.png';

// Estilo:
import './style.css';


export default function Sectors() {

    const tokenCookie = Cookies.get('tokenEstoque');
    // console.log(tokenCookie);



    useEffect(()=> {
        function initializePage() {
            console.log('Effect /Setores');
            
            if(!tokenCookie) {
                console.error('tokenCookie sem VALUE ou REMOVIDO');
            }
        } 
        initializePage();
    }, [tokenCookie]);
    

    
  
    return (
        <div className="Page Sectors">
            
            <NavMenu />

            <main className='SectorsContent UsersContent grid'>
                <div className="title--subtitle">
                    <h1 className="title-page">
                        <i className="bi bi-grid-1x2-fill"></i>
                        Cadastro de Setores
                    </h1>

                    <p>
                        Abaixo estão os setores cadastrados. Você pode cadastrar, editar e deletar setores.
                    </p>
                </div>

                <PainelSectors />
                
            </main>

        </div>
    );
}