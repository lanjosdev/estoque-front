// Funcionalidades / Libs:
import { Routes, Route } from "react-router-dom";

// Pages:
import Login from "../pages/Login";

import Home from "../pages/Home";
import Users from "../pages/Usuarios";
import Sectors from "../pages/Setores";
import Products from "../pages/Produtos";
import Armazens from "../pages/Armazens";
import Movimentacoes from "../pages/Movimentacoes";
import Profile from "../pages/Perfil";
import Solicitacoes from "../pages/Solicitacoes";
import Estoque from "../pages/Estoque";

import NovaSolicitacao from "../pages/NovaSolicitacao";
import MinhasSolicitacoes from "../pages/MinhasSolicitacoes";

// Components:
import ControllerRouter from "./ControllerRouter";



export default function AppRoutes() {
    return (
        <Routes>

            <Route path="/" element={ <Login/> } />
            


            <Route path="/home" element={ 
                <ControllerRouter> 
                    <Home/> 
                </ControllerRouter>
            } />

            <Route path="/users" element={ 
                <ControllerRouter> 
                    <Users/> 
                </ControllerRouter>
            } />

            <Route path="/sectors" element={ 
                <ControllerRouter> 
                    <Sectors/> 
                </ControllerRouter>
            } />

            <Route path="/products" element={ 
                <ControllerRouter> 
                    <Products/> 
                </ControllerRouter>
            } />

            <Route path="/armazens" element={ 
                <ControllerRouter> 
                    <Armazens/> 
                </ControllerRouter>
            } />

            <Route path="/movimentacoes" element={ 
                <ControllerRouter> 
                    <Movimentacoes/> 
                </ControllerRouter>
            } />

            <Route path="/profile" element={ 
                <ControllerRouter> 
                    <Profile/> 
                </ControllerRouter>
            } />

            <Route path="/estoque" element={ 
                <ControllerRouter> <Estoque/> </ControllerRouter>
            } />

            <Route path="/solicitacoes" element={ 
                <ControllerRouter> <Solicitacoes /> </ControllerRouter>
            } />

            <Route path="/nova-solicitacao" element={ 
                <ControllerRouter> 
                    <NovaSolicitacao /> 
                </ControllerRouter>
            } />

            <Route path="/minhas-solicitacoes" element={ 
                <ControllerRouter> 
                    <MinhasSolicitacoes /> 
                </ControllerRouter>
            } />

        </Routes>
    )
}