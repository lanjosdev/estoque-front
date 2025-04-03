// Hooks / Libs:
import PropTypes from "prop-types";
import { useState, useEffect } from 'react';

// API:

// Components:

// Utils:
// import { formatarCasasNumero } from '../../utils/formatNumbers'

// Assets:
// import { FiX, FiCheckCircle } from 'react-icons/fi';

// Estilo:
import './modaltypemovimentation.css';


ModalTypeMovimentation.propTypes = {
    close: PropTypes.func,
    handleOpenModalInput: PropTypes.func
}
export function ModalTypeMovimentation({ close, handleOpenModalInput }) {


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

   

    return (
        <div className='Modal ModalTypeMovimentation'>
            <div className="bg-modal" onClick={close}></div>

            <div className="window grid">
                <div className="window_top">
                    <h3>Escolha o tipo de movimentação</h3>
                </div>

                <div className="window_content">
                    <button onClick={()=> handleOpenModalInput('create')}>
                        <i className="bi bi-arrow-down-circle-fill"></i>
                        <span>Entrada</span>
                    </button>

                    <button>
                        <i className="bi bi-arrow-up-circle-fill"></i>
                        <span>Saída</span>
                    </button>
                </div>
            </div>
        </div>
    )
}