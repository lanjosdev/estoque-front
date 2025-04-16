// Hooks / Libs:
import PropTypes from "prop-types";
import { useEffect } from 'react';
// import Cookies from "js-cookie";

// Components:
import { CreateArmazem } from "./CreateArmazem/CreateArmazem";
import { UpdateArmazem } from "./UpdateArmazem/UpdateArmazem";
import { DeleteArmazem } from "./DeleteArmazem/DeleteArmazem";
import { ViewArmazem } from "./ViewArmazem/ViewArmazem";
import { FilterArmazem } from "./FilterArmazem/FilterArmazem";
import { BuscaProduct } from "../ModalProduct/BuscaProduct/BuscaProduct";
// import { SearchProduct } from "./SearchProduct/SearchProduct";
// import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
// import './modalarmazem.css';


ModalArmazem.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func,
    optionModal: PropTypes.any,
    armazemSelect: PropTypes.object,
    storageSearchState: PropTypes.any,
    setStorageSearchState: PropTypes.func,
    idsSectorsFilter: PropTypes.any,
    setIdsSectorsFilter: PropTypes.func
}
export function ModalArmazem({ 
    close, 
    setReflashState, 
    optionModal, 
    armazemSelect,
    storageSearchState,
    setStorageSearchState,
    idsSectorsFilter,
    setIdsSectorsFilter
}) {
    // const [loading, setLoading] = useState(false);

    // const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        // function initialComponent() {

            const handleKeyDown = (event)=> {
                if(event.key === 'Escape') {
                  close();
                }
            };
          
            document.addEventListener('keydown', handleKeyDown);
          
            // Remove o event listener ao desmontar o componente ou fechar o modal
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        // }
        // initialComponent();
    }, [close]);



    // Função que retorna JSX baseado no switch
    const renderWindowModal = ()=> {
        switch(optionModal) {
            case 'view':
                return <ViewArmazem close={close} armazemSelect={armazemSelect} />;
            case 'create':
                return <CreateArmazem close={close} setReflashState={setReflashState} />;
            case 'update':
                return <UpdateArmazem close={close} setReflashState={setReflashState} armazemSelect={armazemSelect} />;
            case 'delete':
                return <DeleteArmazem close={close} setReflashState={setReflashState} armazemSelect={armazemSelect} />;
            case 'filter':
                return <FilterArmazem close={close} idsSectorsFilter={idsSectorsFilter} setIdsSectorsFilter={setIdsSectorsFilter} />;
            case 'search':
                return <BuscaProduct close={close} searchState={storageSearchState} setSearchState={setStorageSearchState} titleTop="Busca por Endereçamento" />;
            default:
                return <div style={{color: 'red'}}>Modal indefinido</div>;
        }
    };


    return (
        <div className="Modal ModalProduct">
            <div className='bg-modal' onClick={close}></div>

            {renderWindowModal()}
        </div>
    )        
}