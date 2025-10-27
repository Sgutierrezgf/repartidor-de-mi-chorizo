import { useState } from "react";
import { ingredientesBase } from "../../utilities";

const Recipes = () => {
  const [cantidad, setCantidad] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setCantidad(value > 0 ? value : 1);
  };

  const ingredientes = ingredientesBase({ quantity: cantidad });

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2>🧂 Calculadora de ingredientes</h2>

      <label htmlFor="cantidad">Cantidad de producto final:</label>
      <input
        id="cantidad"
        type="number"
        min="1"
        value={cantidad}
        onChange={handleChange}
        style={{
          width: "100%",
          padding: "8px",
          marginTop: "5px",
          marginBottom: "15px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      <div style={{ borderTop: "1px solid #eee", paddingTop: "10px" }}>
        <h3>Ingredientes necesarios:</h3>
        <ul>
          {Object.entries(ingredientes).map(([key, { value, unit }]) => (
            <li key={key}>
              <strong>{key.replace("_", " ")}:</strong> {value.toFixed()} {unit}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Recipes;
