import React from "react";
import { IoWarningOutline } from "react-icons/io5";

const Auth = () => {
  return <div className="new-loader-wrapper-admin">
    <div className="modal--auto">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal__content">
          <h4 className="modal__title"><IoWarningOutline /></h4>
          <p className="modal__text"> Sorry you are  <span>not autorized to</span> access Afya admin panel</p>

          <div className="modal__form">
            <a href="/" className="form__btn" type="button" > Go home</a>
          </div>



        </div>


      </div>
      </div>

    

  </div>
};

export default Auth;
