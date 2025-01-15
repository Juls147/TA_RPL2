import React from "react";

const AddCategoryOverlay = ({
  isVisible,
  onClose,
  onSave,
  category,
  setCategory,
}) => {
  if (!isVisible) return null;

  return (
    <div className="overlay">
      <div className="popup">
        <h3>Tambah Kategori Baru</h3>
        <div className="form-groups">
          <label>Kategori</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Nama Kategori"
          />
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

const EditCategoryOverlay = ({
  isVisible,
  onClose,
  onSave,
  category,
  setEditCategory,
}) => {
  if (!isVisible) return null;

  return (
    <div className="overlay">
      <div className="popup">
        <h3>Edit Kategori</h3>
        <div className="form-groups">
          <label>Kategori</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setEditCategory(e.target.value)}
            placeholder="Nama Kategori"
          />
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

export { AddCategoryOverlay, EditCategoryOverlay };
