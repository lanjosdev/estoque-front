// Hooks / Libs:
import PropTypes from "prop-types";
import { useEffect } from 'react';
// import Cookies from "js-cookie";

// Components:
import { DetailsSolicitacoes } from "./DetailsSolicitacoes/DetailsSolicitacoes";
// import { CreateExit } from "./CreateExit/CreateExit";
// import { UpdateExit } from "./UpdateExit/UpdateExit";
// import { DeleteExit } from "./DeleteExit/DeleteExit";

// Utils:

// Assets:

// Estilo:
// import './modalexit.css';


ModalSolicitacoes.propTypes = {
    close: PropTypes.func,
    setRefreshState: PropTypes.func,
    optionModal: PropTypes.any,
    requestTarget: PropTypes.object
}
export function ModalSolicitacoes({ close, setRefreshState, optionModal, requestTarget }) {
    // const [loading, setLoading] = useState(false);

    // const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        // function initialComponent() {
            console.log('Effect Modal Solicitacoes');

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
            case 'details':
                return <DetailsSolicitacoes close={close} requestTarget={requestTarget} />;
            default:
                return <div style={{color: 'red'}}>Opção de modal desconhecida</div>;
        }
    };


    return (
        <div className="Modal ModalExit">
            <div className='bg-modal' onClick={close}></div>

            {renderWindowModal()}
        </div>
    )        
}