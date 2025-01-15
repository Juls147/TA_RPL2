import React from "react";

const OverlayUser = ({
  isVisibleUser,
  onCloseUser,
  onSaveUser,
  newUser,
  setNewUser,
}) => {
  if (!isVisibleUser) return null;

  return (
    <div className="overlay">
      <div className="popup">
        <h3>Tambah User Baru</h3>
        <div className="form-groups">
          <label>Username</label>
          <input
            type="text"
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value })
            }
            placeholder="Username"
          />
        </div>
        <div className="form-groups">
          <label>Email</label>
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            placeholder="Email"
          />
        </div>
        <div className="form-groups">
          <label>no_hp</label>
          <input
            type="telp"
            value={newUser.no_hp}
            onChange={(e) => setNewUser({ ...newUser, no_hp: e.target.value })}
            placeholder="No. Hp"
          />
        </div>
        <div className="form-groups">
          <label>Lokasi</label>
          <input
            type="text"
            value={newUser.location}
            onChange={(e) =>
              setNewUser({ ...newUser, location: e.target.value })
            }
            placeholder="Lokasi"
          />
        </div>
        <div className="form-groups">
          <label>Password</label>
          <input
            type="password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            placeholder="Password"
          />
        </div>
        <div className="form-groups">
          <label>Tipe User</label>
          <select
            value={newUser.userType}
            onChange={(e) =>
              setNewUser({ ...newUser, userType: e.target.value })
            }
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
        <div className="action-buttons">
          <button className="cancel-button" onClick={onCloseUser}>
            Tutup
          </button>
          <button className="save-button" onClick={onSaveUser}>
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverlayUser;
