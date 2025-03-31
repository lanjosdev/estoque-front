// Funcionalidades / Libs:
import PropTypes from "prop-types";
// import { useState, useEffect } from 'react';

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:


// Estilo:
import './pagination.css';


Pagination.propTypes = {
    setLoading: PropTypes.func,
    setHasError: PropTypes.func,
    currentPage: PropTypes.number,
    setCurrentPage: PropTypes.func,
    pages: PropTypes.array,
    totalPages: PropTypes.number
}
export function Pagination({ setLoading, setHasError, currentPage, setCurrentPage, pages, totalPages }) {

    const handleSelectChange = (event)=> { 
        setLoading(true);
        setHasError(true);
        
        setCurrentPage(parseInt(event.target.value)); 
    };
    function handleNextPage() {
        setLoading(true);
        setHasError(true);
        
        setCurrentPage(currentPage + 1);
    }
    function handlePreviousPage() {
        setLoading(true);
        setHasError(true);
        
        setCurrentPage(currentPage - 1);
    }
    

    return (
        <div className="Pagination">
            <button 
            className="btn secundary"
            onClick={handlePreviousPage}
            disabled={currentPage == 1}
            >
                <i className="bi bi-caret-left-fill"></i>
            </button>

            <div className='select--span'>
                <select value={currentPage} onChange={handleSelectChange}>
                    {totalPages ? (
                        Array(totalPages).fill(null).map((_, idx)=> (
                            <option key={idx} value={idx+1} >
                                {idx+1}
                            </option>
                        ))
                    ) : (
                        pages.map(item=> (
                            <option value={item} key={item} >
                                {item}
                            </option>
                        ))
                    )}
                </select>
                
                
                <span> de {totalPages || pages?.length}</span>
            </div>


            <button 
            className="btn secundary"
            onClick={handleNextPage}
            // disabled={currentPage == pages.length}
            disabled={totalPages ? (currentPage == totalPages) : (currentPage == pages?.length)}
            >
                <i className="bi bi-caret-right-fill"></i>
            </button>
        </div>        
    )        
}