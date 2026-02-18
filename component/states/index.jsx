"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";
import { toast } from "react-toastify";
import DashboardLayout from "../dashbaord";

export default function States() {
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);

  const [name, setName] = useState("");
  const [countryId, setCountryId] = useState("");

  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    try {
      const { data: countryData } = await API.get("/country");
      const { data: stateData } = await API.get("/state");

      setCountries(countryData);
      setStates(stateData);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    if (!name || !countryId) return toast.error("All fields required");

    try {
      await API.post("/state", { name, countryId });
      toast.success("State added");

      resetForm();
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error("Failed to add state");
    }
  };

  const handleEdit = (state) => {
    setName(state.name);
    setCountryId(state.countryId?._id);
    setEditId(state._id);
    setIsEdit(true);
  };

  const handleUpdate = async () => {
    if (!name || !countryId) return toast.error("All fields required");

    try {
      await API.put(`/state/${editId}`, { name, countryId });
      toast.success("State updated");

      resetForm();
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update state");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/state/${id}`);
      toast.success("State deleted");
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete state");
    }
  };

  const resetForm = () => {
    setName("");
    setCountryId("");
    setEditId(null);
    setIsEdit(false);
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">States</h1>

      <div className="flex gap-3 mb-4">
        <input
          className="border px-3 py-2 rounded"
          placeholder="State Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded"
          value={countryId}
          onChange={(e) => setCountryId(e.target.value)}
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          onClick={isEdit ? handleUpdate : handleAdd}
          className={`${
            isEdit ? "bg-yellow-500" : "bg-blue-600"
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
            <th className="p-2 text-left">State Name</th>
            <th className="p-2 text-left">Country</th>
            <th className="p-2 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {states.length > 0 ? (
            states.map((s) => (
              <tr key={s._id} className="border-b">
                <td className="p-2">{s.name}</td>
                <td className="p-2">{s.countryId?.name}</td>
                <td className="p-2 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(s)}
                    className="bg-green-500 text-white px-3 py-1 rounded cursor-pointer"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(s._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center p-4">
                No states found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </DashboardLayout>
  );
}
