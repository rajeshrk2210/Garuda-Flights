import { useEffect, useState } from "react";
import StripeCheckout from "../components/payments/StripeCheckout";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const [amount, setAmount] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const flightData = localStorage.getItem("selectedFlight");
    if (!flightData) {
      navigate("/flights");
      return;
    }

    const { selectedOutbound, selectedInbound, passengers } = JSON.parse(flightData);
    const price = (selectedOutbound?.price || 0) + (selectedInbound?.price || 0);
    setAmount(price * passengers);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <StripeCheckout amount={amount} />
    </div>
  );
};

export default PaymentPage;
