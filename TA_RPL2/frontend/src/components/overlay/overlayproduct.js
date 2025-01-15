import React from "react";

const AddOverlayProduct = ({
  isVisible,
  onClose,
  onSave,
  newProduct,
  setNewProduct,
  categories,
}) => {
  if (!isVisible) return null;

  const handleFileChange = (e) => {
    setNewProduct({ ...newProduct, image: e.target.files[0] });
  };

  return (
    <div className="overlay">
      <div className="popup">
        <h3>Tambah Produk Baru</h3>
        <div className="form-groups">
          <label>Nama Produk</label>
          <input
            type="text"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            placeholder="Nama Produk"
          />
        </div>
        <div className="form-groups">
          <label>Deskripsi</label>
          <input
            type="text"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            placeholder="Deskripsi Produk"
          />
        </div>
        <div className="form-groups">
          <label>Harga</label>
          <input
            type="number"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            placeholder="Harga"
          />
        </div>
        <div className="form-groups">
          <label>Gambar</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <div className="form-groups">
          <label>Stok</label>
          <input
            type="number"
            value={newProduct.stock}
            onChange={(e) =>
              setNewProduct({ ...newProduct, stock: e.target.value })
            }
            placeholder="Stok"
          />
        </div>
        <div className="form-groups">
          <label>Kategori</label>
          <select
            value={newProduct.categoryId}
            onChange={(e) =>
              setNewProduct({ ...newProduct, categoryId: e.target.value })
            }
          >
            <option value="">Pilih Kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
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

const EditOverlayProduct = ({
  isVisible,
  onClose,
  onSave,
  editedProduct,
  setEditedProduct,
  categories,
}) => {
  if (!isVisible) return null;

  const handleFileChange = (e) => {
    setEditedProduct({ ...editedProduct, image: e.target.files[0] });
  };

  return (
    <div className="overlay">
      <div className="popup">
        <h3>Edit Produk</h3>
        <div className="form-groups">
          <label>Nama Produk</label>
          <input
            type="text"
            value={editedProduct.name}
            onChange={(e) =>
              setEditedProduct({ ...editedProduct, name: e.target.value })
            }
            placeholder="Nama Produk"
          />
        </div>
        <div className="form-groups">
          <label>Deskripsi</label>
          <input
            type="text"
            value={editedProduct.description}
            onChange={(e) =>
              setEditedProduct({
                ...editedProduct,
                description: e.target.value,
              })
            }
            placeholder="Deskripsi Produk"
          />
        </div>
        <div className="form-groups">
          <label>Harga</label>
          <input
            type="number"
            value={editedProduct.price}
            onChange={(e) =>
              setEditedProduct({ ...editedProduct, price: e.target.value })
            }
            placeholder="Harga"
          />
        </div>
        <div className="form-groups">
          <label>Gambar</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <div className="form-groups">
          <label>Stok</label>
          <input
            type="number"
            value={editedProduct.stock}
            onChange={(e) =>
              setEditedProduct({ ...editedProduct, stock: e.target.value })
            }
            placeholder="Stok"
          />
        </div>
        <div className="form-groups">
          <label>Kategori</label>
          <select
            value={editedProduct.categoryId}
            onChange={(e) =>
              setEditedProduct({
                ...editedProduct,
                categoryId: e.target.value,
              })
            }
          >
            <option value="">Pilih Kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
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

export { AddOverlayProduct, EditOverlayProduct };
