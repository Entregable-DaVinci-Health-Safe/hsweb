import React from 'react';
import { ClipLoader } from 'react-spinners';
import '../css/components/Loading.css';

const Loading = ({ message, isLoading }) => {
  return (
    <>

        <div className="loading-overlay">
          <div className="loading-container">
            <div className="loading-wrapper">
              {message && <h1 className="loading-message">{message}</h1>}
              <ClipLoader color="#36d7b7" size={150} />
            </div>
          </div>
        </div>

    </>
  );
};

export default Loading;
