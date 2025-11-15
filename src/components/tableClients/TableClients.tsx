

export const TableClients = () => {
  return (
    <table className="border-collapse border border-gray-400 w-full">
      <thead>
        <tr>
          <th className="border border-gray-300">Client</th>
          <th className="border border-gray-300">Amount x Type</th>

        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border border-gray-300">Indiana</td>
          <td className="border border-gray-300">Indianapolis</td>
        </tr>
        <tr>
          <td className="border border-gray-300">Ohio</td>
          <td className="border border-gray-300">Columbus</td>
        </tr>
        <tr>
          <td className="border border-gray-300">Michigan</td>
          <td className="border border-gray-300">Detroit</td>
        </tr>
      </tbody>
    </table>
  );
};
