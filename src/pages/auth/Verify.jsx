import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
const Verify = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const verifyUser = async () => {
      const token = searchParams.get("token");

      if (!token) {
        navigate("/auth");
        return;
      }

      try {
        const res = await api.get(`/auth/verify?token=${token}`);
        console.log("Verification response:", res.data);
        const { token: jwt, user } = res.data;
        login(user, jwt);
        navigate("/chat"); // your chat page
      } catch (err) {
        console.error(err);
        navigate("/auth");
      }
    };

    verifyUser();
  }, [navigate, searchParams]);

  return (
    <div style={{
      height: "100dvh",
      background: "#050505",
      color: "#16c784",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "600"
    }}>
      Verifying your account...
    </div>
  );
};

export default Verify;
