import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Protected = (props) => {
  const { Component } = props;
  const navigate = useNavigate();
  useEffect(() => {
    let login = localStorage.getItem("userData");
    const userData = JSON.parse(login);
    if (!userData) {
      return navigate("/connect");
    }
  }, []);
  return (
    <div>
      <Component />
    </div>
  );
};

export default Protected;
