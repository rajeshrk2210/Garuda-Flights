import { useEffect, useState } from "react";
import StripeCheckout from "../components/payments/StripeCheckout";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";

const PaymentPage = () => {
    const [amount, setAmount] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
        const flightData = localStorage.getItem("selectedFlight");
        const passengerData = localStorage.getItem("passengerDetails");

        if (!flightData || !passengerData) {
            navigate("/flights");
            return;
        }

        const { selectedOutbound, selectedInbound } = JSON.parse(flightData);
        const { passengers } = JSON.parse(passengerData); // ✅ Corrected here

        const pricePerPassenger =
            (selectedOutbound?.price || 0) +
            (selectedInbound?.price || 0);

        const total = pricePerPassenger * passengers.length;

        setAmount(total);
    }, [navigate]);


    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <StripeCheckout amount={amount} />            
        </div>
    );
};

export default PaymentPage;
