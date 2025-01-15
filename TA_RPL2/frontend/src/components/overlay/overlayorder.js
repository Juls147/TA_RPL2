import React from "react";

const EditOrderOverlay = ({ isVisible, onClose, onSave, order, setOrder }) => {
  if (!isVisible) return null;

  const statusOptions = ["PAID", "PENDING", "FAILED", "ARRIVED"];

  return (
    <div className="overlay">
      <div className="popup">
        <h3>Edit Status Pesanan</h3>
        <div className="form-groups">
          <label>Status</label>
          <select
            value={order.status}
            onChange={(e) =>
              setOrder({
                ...order,
                status: e.target.value,
              })
            }
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="action-buttons">
          <button className="cancel-button" onClick={onClose}>
            Tutup
          </button>
          <button className="save-button" onClick={onSave}>
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOrderOverlay;
