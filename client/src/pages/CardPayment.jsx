import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateOrderPaymentStatus } from "../apis/order";

const CardPayment = ({
  setPaymentTrigger,
  setPaymentSuccess,
  orderId,
}) => {
  const [selectedCard, setSelectedCard] = useState("credit");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiration, setExpiration] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(false);

  const navigate = useNavigate();

  const handlePaymentTrigger = async (e) => {
    e.preventDefault();

    try {
      // ✅ Only update payment status
      await updateOrderPaymentStatus(orderId, "Paid");

      setPaymentSuccess(true);
      setPaymentTrigger(false);

      alert("✅ Payment completed successfully.");
      navigate("/myOrders", { replace: true });
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert("⚠️ Could not update payment. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="container p-4 shadow rounded bg-white" style={{ maxWidth: "550px" }}>
        <h5 className="mb-3">Pay with</h5>
        <div className="btn-group mb-3 w-100">
          <button
            type="button"
            className={`btn ${selectedCard === "credit" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setSelectedCard("credit")}
          >
            Credit Card
          </button>
          <button
            type="button"
            className={`btn ${selectedCard === "debit" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setSelectedCard("debit")}
          >
            Debit Card
          </button>
        </div>

        <form onSubmit={handlePaymentTrigger}>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Card number"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Card holder name"
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value)}
          />
          <div className="row">
            <div className="col">
              <input
                type="text"
                className="form-control mb-3"
                placeholder="MM/YY"
                value={expiration}
                onChange={(e) => setExpiration(e.target.value)}
              />
            </div>
            <div className="col">
              <input
                type="text"
                className="form-control mb-3"
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
              />
            </div>
          </div>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="saveCard"
              checked={saveCard}
              onChange={(e) => setSaveCard(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="saveCard">
              Save card for future orders
            </label>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Confirm and Pay
          </button>
          <button
            type="button"
            className="btn btn-secondary w-100 mt-2"
            onClick={() => {
              setPaymentTrigger(false);
              setPaymentSuccess(false);
            }}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CardPayment;
