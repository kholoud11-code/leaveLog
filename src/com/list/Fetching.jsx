import React from 'react'
import { FaSpinner} from 'react-icons/fa'
import '../css/list.css'

const Fetching = () => {
    return(
        <div className="fetching">
            <FaSpinner className="spinner" />
        </div>
    )
}

export default Fetching