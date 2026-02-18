"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";
import { toast } from "react-toastify";
import DashboardLayout from "../dashbaord";

export default function Districts() {
  const [districts, setDistricts] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);

  const [name, setName] = useState("");
  const [countryId, setCountryId] = useState("");
  const [stateId, setStateId] = useState("");

  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    try {
      const { data: countryData } = await API.get("/country");
      const { data: stateData } = await API.get("/state");
      const { data: districtData } = await API.get("/district");

      setCountries(countryData);
      setStates(stateData);
      setDistricts(districtData);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredStates = states.filter(
    (state) => state.countryId?._id === countryId,
  );

  const handleAdd = async () => {
    if (!name || !stateId) return toast.error("All fields required");

    try {
      await API.post("/district", { name, stateId });

      toast.success("District added");
      resetForm();
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error("Failed to add district");
    }
  };

  const handleEdit = (district) => {
    setName(district.name);

    const selectedCountryId = district.stateId?.countryId?._id;

    setCountryId(selectedCountryId);
    setStateId(district.stateId?._id);

    setEditId(district._id);
    setIsEdit(true);
  };

  const handleUpdate = async () => {
    if (!name || !stateId) return toast.error("All fields required");

    try {
      await API.put(`/district/${editId}`, {
        name,
        stateId,
      });

      toast.success("District updated");
      resetForm();
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update district");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/district/${id}`);
      toast.success("District deleted");
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete district");
    }
  };

  const resetForm = () => {
    setName("");
    setCountryId("");
    setStateId("");
    setIsEdit(false);
    setEditId(null);
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Districts</h1>

      <div className="flex gap-3 mb-6">
        <input
          className="border px-3 py-2 rounded"
          placeholder="District Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded"
          value={countryId}
          onChange={(e) => {
            setCountryId(e.target.value);
            setStateId("");
          }}
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          className="border px-3 py-2 rounded"
          value={stateId}
          onChange={(e) => setStateId(e.target.value)}
        >
          <option value="">Select State</option>
          {filteredStates.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <button
          onClick={isEdit ? handleUpdate : handleAdd}
          className={`${
            isEdit ? "bg-yellow-500" : "bg-purple-600"
          } cursor-pointer text-white px-4 py-2 rounded`}
        >
          {isEdit ? "Update" : "Add"}
        </button>

        {isEdit && (
          <button
            onClick={resetForm}
            className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">District</th>
            <th className="p-2 text-left">State</th>
            <th className="p-2 text-left">Country</th>
            <th className="p-2 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {districts.length > 0 ? (
            districts.map((d) => (
              <tr key={d._id} className="border-b">
                <td className="p-2">{d.name}</td>
                <td className="p-2">{d.stateId?.name}</td>
                <td className="p-2">{d.stateId?.countryId?.name}</td>
                <td className="p-2 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(d)}
                    className="bg-green-500 text-white px-3 py-1 rounded cursor-pointer"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(d._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center p-4">
                No districts found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </DashboardLayout>
  );
}
