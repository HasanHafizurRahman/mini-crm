import { useState } from "react";
import { useNavigate } from "react-router-dom";
import db from "../../db/db";

const CreateQuote = () => {
  const [form, setForm] = useState({
    quoteOwner: "",
    subject: "",
    quoteStage: "Draft",
    carrier: "",
    dealName: "",
    validUntil: "",
    contactName: "",
    accountName: "",
    billingAddress: {
      street: "",
      city: "",
      state: "",
      code: "",
      country: "",
    },
    shippingAddress: {
      street: "",
      city: "",
      state: "",
      code: "",
      country: "",
    },
    quotedItems: [],
    termsAndConditions: "",
    description: "",
    adjustments: 0,
    tax: 0,
    discount: 0,
    grandTotal: 0,
  });

  const [newItem, setNewItem] = useState({
    productName: "",
    quantity: 0,
    listPrice: 0,
    amount: 0,
    discount: 0,
    tax: 0,
  });

  const navigate = useNavigate();

  const handleAddressChange = (e, type) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [`${type}Address`]: {
        ...form[`${type}Address`],
        [name]: value,
      },
    });
  };

  const copyAddress = () => {
    setForm({
      ...form,
      shippingAddress: { ...form.billingAddress },
    });
  };
  

  const addItem = () => {
    const sanitizedItem = {
      productName: newItem.productName || "",
      quantity: Number(newItem.quantity) || 0,
      listPrice: Number(newItem.listPrice) || 0,
      amount: Number(newItem.amount) || 0,
      discount: Number(newItem.discount) || 0,
      tax: Number(newItem.tax) || 0,
    };
  
    setForm({
      ...form,
      quotedItems: [...form.quotedItems, sanitizedItem],
    });
  
    setNewItem({
      productName: "",
      quantity: 0,
      listPrice: 0,
      amount: 0,
      discount: 0,
      tax: 0,
    });
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  
  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Sanitize data before adding it to IndexedDB
    const sanitizedForm = {
      ...form,
      grandTotal: Number(form.grandTotal) || 0, // Ensure it's a number
      quotedItems: form.quotedItems.map((item) => ({
        productName: item.productName || "",
        quantity: Number(item.quantity) || 0,
        listPrice: Number(item.listPrice) || 0,
        amount: Number(item.amount) || 0,
        discount: Number(item.discount) || 0,
        tax: Number(item.tax) || 0,
      })),
    };
  
    console.log("Sanitized Form:", sanitizedForm);
  
    try {
      await db.quotes.add(sanitizedForm);
      navigate("/");
    } catch (error) {
      console.error("Error adding quote to IndexedDB:", error);
    }
  };
   

  return (
    <div className="py-16 container mx-auto ">
      <h1 className="text-xl font-bold mb-8">Create Quote</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Quote Information */}
        <section>
          <h2 className="font-bold">Quote Information</h2>
          <div className="ml-16 mt-4 grid grid-cols-2 gap-4">
            {[
              { label: "Quote Owner", name: "quoteOwner" },
              { label: "Subject", name: "subject" },
              { label: "Quote Stage", name: "quoteStage" },
              { label: "Carrier", name: "carrier" },
              { label: "Deal Name", name: "dealName" },
              { label: "Valid Until", name: "validUntil" },
              { label: "Contact Name", name: "contactName" },
              { label: "Account Name", name: "accountName" },
            ].map((field) => (
              <div key={field.name} className="flex flex-col">
                <label className="mb-2">{field.label}</label>
                <input
                  type="text"
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="p-2 border rounded w-2/3"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Address Information */}
        <section>
          <h2 className="font-bold">Address Information</h2>
          <div className="ml-16 mt-4 grid grid-cols-2 gap-4">
            {["Billing", "Shipping"].map((type) => (
              <div key={type}>
                <h3 className="font-bold">{type} Address</h3>
                {[
                  { label: "Street", name: "street" },
                  { label: "City", name: "city" },
                  { label: "State", name: "state" },
                  { label: "Code", name: "code" },
                  { label: "Country", name: "country" },
                ].map((field) => (
                  <div key={field.name} className="flex flex-col">
                    <label className="mb-2">{field.label}</label>
                    <input
                      type="text"
                      name={field.name}
                      value={form[`${type.toLowerCase()}Address`][field.name]}
                      onChange={(e) => handleAddressChange(e, type.toLowerCase())}
                      className="p-2 border rounded w-2/3"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={copyAddress}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Copy Address
          </button>
        </section>

        {/* Quoted Items */}
        <section>
          <h2 className="font-bold">Quoted Items</h2>
          <div className="space-y-4">
            <table className="w-full border">
              <thead>
                <tr>
                  {[
                    "Product Name",
                    "Quantity",
                    "List Price",
                    "Amount",
                    "Discount",
                    "Tax",
                  ].map((header) => (
                    <th key={header} className="border p-2 text-left">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {form.quotedItems.map((item, index) => (
                  <tr key={index}>
                    {Object.values(item).map((value, i) => (
                      <td key={i} className="border p-2">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="grid grid-cols-6 gap-2">
              {[
                { label: "Product Name", name: "productName" },
                { label: "Quantity", name: "quantity" },
                { label: "List Price", name: "listPrice" },
                { label: "Amount", name: "amount" },
                { label: "Discount", name: "discount" },
                { label: "Tax", name: "tax" },
              ].map((field) => (
                <input
                  key={field.name}
                  type="text"
                  name={field.name}
                  value={newItem[field.name]}
                  onChange={handleItemChange}
                  placeholder={field.label}
                  className="p-2 border rounded"
                />
              ))}
            </div>
            <button
              type="button"
              onClick={addItem}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add Item
            </button>
          </div>
        </section>

        {/* Terms and Conditions */}
        <section>
          <h2 className="font-bold">Terms and Conditions</h2>
          <textarea
            name="termsAndConditions"
            value={form.termsAndConditions}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          ></textarea>
        </section>

        {/* Description */}
        <section>
          <h2 className="font-bold">Description</h2>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          ></textarea>
        </section>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuote;
