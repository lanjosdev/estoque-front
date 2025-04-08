// Hooks / Libs:
import PropTypes from "prop-types";
import { useEffect } from 'react';
// import Cookies from "js-cookie";

// Components:
import { CreateArmazem } from "./CreateArmazem/CreateArmazem";
import { UpdateArmazem } from "./UpdateArmazem/UpdateArmazem";
import { DeleteArmazem } from "./DeleteArmazem/DeleteArmazem";
import { ViewArmazem } from "./ViewArmazem/ViewArmazem";
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
    armazemSelect: PropTypes.object
    // storageSearchState: PropTypes.any,
    // setStorageSearchState: PropTypes.func,
    // setStorageFilterState: PropTypes.func
}
export function ModalArmazem({ 
    close, 
    setReflashState, 
    optionModal, 
    armazemSelect, 
    // storageSearchState, 
    // setStorageSearchState, 
    // setStorageFilterState 
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
            // case 'search':
            //     return <SearchProduct close={close} searchState={storageSearchState} setSearchState={setStorageSearchState} setFilterState={setStorageFilterState} />;
            default:
                return <div style={{color: 'red'}}>Modal indefinido</div>;
        }
    };


    return (
        <div className="Modal">
            <div className='bg-modal' onClick={close}></div>

            {renderWindowModal()}
        </div>
    )        
}