"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";
import { toast } from "react-toastify";
import DashboardLayout from "../dashbaord";

export default function Countries() {
  const [countries, setCountries] = useState([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchCountries = async () => {
    try {
      const { data } = await API.get("/country");
      console.log(data, "dat");
      setCountries(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch countries");
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleAdd = async () => {
    try {
      if (!name) return toast.error("Name required");

      await API.post("/country", { name, code });

      toast.success("Country added");

      resetForm();
      fetchCountries();
    } catch (error) {
      console.log(error);
      toast.error("Failed to add country");
    }
  };

  const handleEdit = (country) => {
    setName(country.name);
    setCode(country.code);
    setEditId(country._id);
    setIsEdit(true);
  };

  const handleUpdate = async () => {
    try {
      if (!name) return toast.error("Name required");

      await API.put(`/country/${editId}`, { name, code });

      toast.success("Country updated");

      resetForm();
      fetchCountries();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update country");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/country/${id}`);
      toast.success("Country deleted");
      fetchCountries();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete country");
    }
  };

  const resetForm = () => {
    setName("");
    setCode("");
    setIsEdit(false);
    setEditId(null);
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Countries</h1>

      <div className="flex gap-3 mb-4">
        <input
          className="border px-3 py-2 rounded"
          placeholder="Country Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border px-3 py-2 rounded"
          placeholder="Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button
          onClick={isEdit ? handleUpdate : handleAdd}
          className={`${
            isEdit ? "bg-yellow-500" : "bg-green-600"
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
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Code</th>
            <th className="p-2 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {countries.length > 0 ? (
            countries.map((c) => (
              <tr key={c._id} className="border-b">
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.code}</td>
                <td className="p-2 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(c)}
                    className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(c._id)}
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
                No countries found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </DashboardLayout>
  );
}
