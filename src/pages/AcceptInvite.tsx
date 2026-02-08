import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const AcceptInvite = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Accepting invite...");

  const inviteToken = searchParams.get("token");
  const authToken = localStorage.getItem("token");

  useEffect(() => {
    // ❌ No invite token in URL
    if (!inviteToken) {
      setMessage("Invalid invite link");
      return;
    }

    // 🔐 User not logged in → redirect to login
    if (!authToken) {
      navigate(`/login?redirect=/accept-invite?token=${inviteToken}`);
      return;
    }

    const acceptInvite = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/invites/accept",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ token: inviteToken }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setMessage(data.message || "Invite failed");
          return;
        }

        setMessage("🎉 You have successfully joined the project!");
        setTimeout(() => navigate("/dashboard"), 2000);
      } catch (error) {
        setMessage("Something went wrong");
      }
    };

    acceptInvite();
  }, [inviteToken, authToken, navigate]);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>{message}</h2>
    </div>
  );
};

export default AcceptInvite;
