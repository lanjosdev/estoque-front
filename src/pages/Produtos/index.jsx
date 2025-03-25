// Funcionalidades / Libs:
import { useEffect } from "react";
import Cookies from "js-cookie";

// Contexts:
// import UserContext from "../../contexts/userContext";

// Components:
import { NavMenu } from "../../components/NavMenu/NavMenu";
import { PainelProducts } from "../../components/Painels/PainelProducts/PainelProducts";
// import { toast } from "react-toastify";

// Assets:
// import imgLogo from '../../assets/LOGO-BIZSYS_preto.png';

// Estilo:
import './style.css';


export default function Products() {

    const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        function verificaCookieToken() {
            console.log('Effect /Products');
            
            if(!tokenCookie) {
                console.error('tokenCookie sem VALUE ou REMOVIDO');
            }
        } 
        verificaCookieToken();
    }, [tokenCookie]);
    

    
  
    return (
        <div className="Page Products">
            
            <NavMenu />

            <main className='ProductsContent UsersContent grid'>
                <div className="title--subtitle">
                    <h1 className="title-page">
                        <i className="bi bi-box-seam-fill"></i>
                        Cadastro de Produtos
                    </h1>

                    <p>
                        Abaixo estão os produtos cadastrados. Você pode cadastrar, editar e deletar produtos.
                    </p>
                </div>

                <PainelProducts />
                
            </main>

        </div>
    );
}