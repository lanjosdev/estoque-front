// Funcionalidades / Libs:
import { Routes, Route } from "react-router-dom";

// Pages:
import Login from "../pages/Login";

// import Home from "../pages/Home";
import Users from "../pages/Usuarios";
import Sectors from "../pages/Setores";
import Products from "../pages/Produtos";
import Armazens from "../pages/Armazens";
// import Inputs from "../pages/Entradas";
// import Exits from "../pages/Saidas";
// import Reservations from "../pages/Reservas";
// import Profile from "../pages/Perfil";
// import Alerts from "../pages/Alertas";

import Solicitacoes from "../pages/Solicitacoes";
import NovaSolicitacao from "../pages/NovaSolicitacao";

// Components:
import ControllerRouter from "./ControllerRouter";


export default function AppRoutes() {
    return (
        <Routes>

            <Route path="/" element={ <Login/> } />


            {/* <Route path="/home" element={ 
                <ControllerRouter> <Home/> </ControllerRouter>
            } /> */}

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

            {/* <Route path="/inputs" element={ 
                <ControllerRouter> <Inputs/> </ControllerRouter>
            } /> */}

            {/* <Route path="/exits" element={ 
                <ControllerRouter> <Exits/> </ControllerRouter>
            } /> */}

            {/* <Route path="/reservations" element={ 
                <ControllerRouter> <Reservations/> </ControllerRouter>
            } /> */}

            {/* <Route path="/profile" element={ 
                <ControllerRouter> <Profile/> </ControllerRouter>
            } /> */}

            {/* <Route path="/alerts" element={ 
                <ControllerRouter> <Alerts/> </ControllerRouter>
            } /> */}

            <Route path="/solicitacoes" element={ 
                <ControllerRouter> <Solicitacoes /> </ControllerRouter>
            } />

            <Route path="/nova-solicitacao" element={ 
                <ControllerRouter> 
                    <NovaSolicitacao /> 
                </ControllerRouter>
            } />

        </Routes>
    )
}