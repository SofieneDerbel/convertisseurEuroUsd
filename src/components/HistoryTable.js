export default function HistoryTable({ data }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Taux reel</th>
          <th>Taux saisie</th>
          <th>Valeur initiale</th>
          <th>Valeur calculée</th>
        </tr>
      </thead>
      <tbody>
        {data &&
          data
            .slice(-5)
            .reverse()
            .map((row, index) => (
              <tr key={index}>
                <td>{row.tauxR}</td>
                <td>{row.tauxS}</td>
                <td>{row.valeurI}</td>
                <td>{row.valeurC}</td>
              </tr>
            ))}
      </tbody>
    </table>
  );
}
