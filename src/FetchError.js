import React, { useEffect, useState } from "react";
import { Snackbar } from "@material-ui/core";
import { Alert } from '@material-ui/lab';

  

function FetchError({ errorMessage }) {
  if (!errorMessage) return null;
  return (
    <Snackbar open={true} autoHideDuration={6000}>
      <Alert  elevation={6} variant="filled" severity="error">
      Chyba při stahování dat ze stránek <a href="https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19">Ministerstva zdravotnictví ČR</a>. Data se aktualizují kolem 18. hodiny a po půlnoci. Vyčkejte cca 15 minut a obnovte stránku.
      </Alert>
    </Snackbar>
  );
}

export default FetchError;
